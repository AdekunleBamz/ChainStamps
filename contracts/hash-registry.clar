;; title: hash-registry
;; version: 1.4.0
;; summary: Store document hashes on-chain for verification
;; description: ChainStamp - Pay 0.03 STX to permanently store a hash for document verification

;; =========================
;; Constants
;; =========================

(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-HASH-ALREADY-EXISTS (err u101))
(define-constant ERR-HASH-NOT-FOUND (err u102))
(define-constant ERR-HASH-ALREADY-REVOKED (err u103))
(define-constant ERR-DESCRIPTION-TOO-LONG (err u104))
(define-constant ERR-BATCH-TOO-LARGE (err u105))
(define-constant ERR-EMPTY-BATCH (err u106))
(define-constant ERR-TRANSFER-TO-SELF (err u107))
(define-constant ERR-HASH-IMMUTABLE (err u108))

;; Fees
(define-constant HASH-FEE u30000)
(define-constant BATCH-HASH-FEE u25000)
(define-constant MAX-BATCH-SIZE u10)
(define-constant UPDATE-FEE u10000)

;; =========================
;; Data Variables
;; =========================

(define-data-var hash-counter uint u0)
(define-data-var total-fees-collected uint u0)

;; =========================
;; Data Maps
;; =========================

(define-map hashes (buff 32) {
    owner: principal,
    description: (string-utf8 128),
    timestamp: uint,
    block-height: uint,
    hash-id: uint,
    last-updated: uint,
    revoked: bool,
    immutable: bool
})

(define-map user-hashes principal (list 100 (buff 32)))
(define-map hash-by-id uint (buff 32))

;; =========================
;; Read-only Functions
;; =========================

(define-read-only (get-hash-info (hash (buff 32)))
    (map-get? hashes hash)
)

(define-read-only (verify-hash (hash (buff 32)))
    (match (map-get? hashes hash)
        hash-data (not (get revoked hash-data))
        false
    )
)

(define-read-only (is-hash-immutable (hash (buff 32)))
    (match (map-get? hashes hash)
        hash-data (get immutable hash-data)
        false
    )
)

;; =========================
;; Private Storage Helper
;; =========================

(define-private (store-hash-internal 
    (hash (buff 32)) 
    (description (string-utf8 128))
    (immutable bool)
)
    (let
        (
            (new-hash-id (+ (var-get hash-counter) u1))
            (current-user-hashes (default-to (list) (map-get? user-hashes tx-sender)))
        )
        (map-set hashes hash {
            owner: tx-sender,
            description: description,
            timestamp: (unwrap-panic (get-stacks-block-info? time (- stacks-block-height u1))),
            block-height: stacks-block-height,
            hash-id: new-hash-id,
            last-updated: stacks-block-height,
            revoked: false,
            immutable: immutable
        })

        (map-set hash-by-id new-hash-id hash)

        (map-set user-hashes tx-sender 
            (unwrap-panic (as-max-len? (append current-user-hashes hash) u100)))

        (var-set hash-counter new-hash-id)

        new-hash-id
    )
)

;; =========================
;; Public Functions
;; =========================

(define-public (store-hash 
    (hash (buff 32)) 
    (description (string-utf8 128))
    (immutable bool)
)
    (begin
        (asserts! (is-none (map-get? hashes hash)) ERR-HASH-ALREADY-EXISTS)
        (try! (stx-transfer? HASH-FEE tx-sender CONTRACT-OWNER))

        (let ((new-id (store-hash-internal hash description immutable)))
            (var-set total-fees-collected (+ (var-get total-fees-collected) HASH-FEE))
            (ok new-id)
        )
    )
)

;; =========================
;; Revoke Hash
;; =========================

(define-public (revoke-hash (hash (buff 32)))
    (let
        (
            (hash-data (unwrap! (map-get? hashes hash) ERR-HASH-NOT-FOUND))
        )
        (asserts! (is-eq tx-sender (get owner hash-data)) ERR-NOT-AUTHORIZED)
        (asserts! (not (get immutable hash-data)) ERR-HASH-IMMUTABLE)
        (asserts! (not (get revoked hash-data)) ERR-HASH-ALREADY-REVOKED)

        (map-set hashes hash (merge hash-data { revoked: true }))

        (ok true)
    )
)

;; =========================
;; Update Description
;; =========================

(define-public (update-description 
    (hash (buff 32)) 
    (new-description (string-utf8 128))
)
    (let
        (
            (hash-data (unwrap! (map-get? hashes hash) ERR-HASH-NOT-FOUND))
        )
        (asserts! (is-eq tx-sender (get owner hash-data)) ERR-NOT-AUTHORIZED)
        (asserts! (not (get immutable hash-data)) ERR-HASH-IMMUTABLE)
        (asserts! (<= (len new-description) u128) ERR-DESCRIPTION-TOO-LONG)

        (try! (stx-transfer? UPDATE-FEE tx-sender CONTRACT-OWNER))

        (map-set hashes hash (merge hash-data {
            description: new-description,
            last-updated: stacks-block-height
        }))

        (var-set total-fees-collected (+ (var-get total-fees-collected) UPDATE-FEE))

        (ok true)
    )
)

;; =========================
;; Transfer Ownership
;; =========================

(define-public (transfer-hash 
    (hash (buff 32)) 
    (new-owner principal)
)
    (let
        (
            (hash-data (unwrap! (map-get? hashes hash) ERR-HASH-NOT-FOUND))
        )
        (asserts! (is-eq tx-sender (get owner hash-data)) ERR-NOT-AUTHORIZED)
        (asserts! (not (get immutable hash-data)) ERR-HASH-IMMUTABLE)
        (asserts! (not (is-eq tx-sender new-owner)) ERR-TRANSFER-TO-SELF)

        (map-set hashes hash (merge hash-data { owner: new-owner }))

        (ok true)
    )
)
