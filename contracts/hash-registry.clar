;; title: hash-registry
;; version: 1.3.0
;; summary: Store document hashes on-chain for verification
;; description: ChainStamp - Pay 0.03 STX to permanently store a hash for document verification

;; Constants
(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-HASH-ALREADY-EXISTS (err u101))
(define-constant ERR-HASH-NOT-FOUND (err u102))
(define-constant ERR-HASH-ALREADY-REVOKED (err u103))
(define-constant ERR-DESCRIPTION-TOO-LONG (err u104))
(define-constant ERR-BATCH-TOO-LARGE (err u105))
(define-constant ERR-EMPTY-BATCH (err u106))
(define-constant ERR-TRANSFER-TO-SELF (err u107))

;; Fee in microSTX (0.03 STX = 30000 microSTX)
(define-constant HASH-FEE u30000)
;; Discounted fee for batch operations (0.025 STX = 25000 microSTX per hash)
(define-constant BATCH-HASH-FEE u25000)
(define-constant MAX-BATCH-SIZE u10)
;; Smaller fee for description update only
(define-constant UPDATE-FEE u10000)

;; Data Variables
(define-data-var hash-counter uint u0)
(define-data-var total-fees-collected uint u0)

;; Data Maps
;; Store hash with metadata
(define-map hashes (buff 32) {
    owner: principal,
    description: (string-utf8 128),
    timestamp: uint,
    block-height: uint,
    hash-id: uint,
    last-updated: uint,
    revoked: bool
})

;; Track hashes by user
(define-map user-hashes principal (list 100 (buff 32)))

;; Track hash by ID for enumeration
(define-map hash-by-id uint (buff 32))

;; Read-only functions

(define-read-only (get-hash-info (hash (buff 32)))
    (map-get? hashes hash)
)

;; Get owner of a hash if it exists
(define-read-only (get-hash-owner (hash (buff 32)))
    (match (map-get? hashes hash)
        hash-data (some (get owner hash-data))
        none
    )
)

;; Get description for a hash if it exists
(define-read-only (get-hash-description (hash (buff 32)))
    (match (map-get? hashes hash)
        hash-data (some (get description hash-data))
        none
    )
)

(define-read-only (verify-hash (hash (buff 32)))
    (match (map-get? hashes hash)
        hash-data (not (get revoked hash-data))
        false
    )
)

(define-read-only (is-hash-revoked (hash (buff 32)))
    (match (map-get? hashes hash)
        hash-data (get revoked hash-data)
        false
    )
)

;; Check if a principal is the owner of a hash
(define-read-only (is-hash-owner (hash (buff 32)) (user principal))
    (match (map-get? hashes hash)
        hash-data (is-eq (get owner hash-data) user)
        false
    )
)

(define-read-only (get-hash-count)
    (var-get hash-counter)
)

(define-read-only (get-total-fees)
    (var-get total-fees-collected)
)

(define-read-only (get-hash-fee)
    HASH-FEE
)

(define-read-only (get-batch-hash-fee)
    BATCH-HASH-FEE
)

(define-read-only (get-max-batch-size)
    MAX-BATCH-SIZE
)

(define-read-only (get-update-fee)
    UPDATE-FEE
)

(define-read-only (get-user-hashes (user principal))
    (default-to (list) (map-get? user-hashes user))
)

;; Get total hashes stored by a user
(define-read-only (get-user-hash-count (user principal))
    (len (default-to (list) (map-get? user-hashes user)))
)

(define-read-only (get-hash-by-id (id uint))
    (map-get? hash-by-id id)
)

;; Get hash info by ID
(define-read-only (get-hash-info-by-id (id uint))
    (match (map-get? hash-by-id id)
        hash (map-get? hashes hash)
        none
    )
)

(define-read-only (get-contract-owner)
    CONTRACT-OWNER
)

;; Get contract stats summary
(define-read-only (get-stats)
    {
        total-hashes: (var-get hash-counter),
        total-fees: (var-get total-fees-collected),
        fee-per-hash: HASH-FEE
    }
)

;; Private helper for storing a single hash (used in batch)
(define-private (store-hash-internal (hash (buff 32)) (description (string-utf8 128)))
    (let
        (
            (new-hash-id (+ (var-get hash-counter) u1))
            (current-user-hashes (default-to (list) (map-get? user-hashes tx-sender)))
        )
        ;; Store the hash
        (map-set hashes hash {
            owner: tx-sender,
            description: description,
            timestamp: (unwrap-panic (get-stacks-block-info? time (- stacks-block-height u1))),
            block-height: stacks-block-height,
                hash-id: new-hash-id,
                last-updated: stacks-block-height,
                revoked: false
        })
        
        ;; Store reverse lookup
        (map-set hash-by-id new-hash-id hash)
        
        ;; Update user hashes list
        (map-set user-hashes tx-sender 
            (unwrap-panic (as-max-len? (append current-user-hashes hash) u100)))
        
        ;; Increment counter
        (var-set hash-counter new-hash-id)
        
        new-hash-id
    )
)

;; Public functions

;; Store a hash on-chain
(define-public (store-hash (hash (buff 32)) (description (string-utf8 128)))
    (begin
        ;; Check if hash already exists
        (asserts! (is-none (map-get? hashes hash)) ERR-HASH-ALREADY-EXISTS)
        
        ;; Transfer fee to contract owner
        (try! (stx-transfer? HASH-FEE tx-sender CONTRACT-OWNER))
        
        ;; Store and update fees
        (let ((new-hash-id (store-hash-internal hash description)))
            (var-set total-fees-collected (+ (var-get total-fees-collected) HASH-FEE))
            (ok new-hash-id)
        )
    )
)

;; Store multiple hashes in a single transaction (discounted fee)
(define-public (store-hashes-batch (hash-list (list 10 { hash: (buff 32), description: (string-utf8 128) })))
    (let
        (
            (batch-size (len hash-list))
            (total-fee (* BATCH-HASH-FEE batch-size))
        )
        ;; Validate batch size
        (asserts! (> batch-size u0) ERR-EMPTY-BATCH)
        (asserts! (<= batch-size MAX-BATCH-SIZE) ERR-BATCH-TOO-LARGE)
        
        ;; Transfer total fee
        (try! (stx-transfer? total-fee tx-sender CONTRACT-OWNER))
        
        ;; Store each hash (fold to collect IDs)
        (let
            (
                (result (fold store-hash-fold hash-list (ok (list))))
            )
            ;; Update total fees
            (var-set total-fees-collected (+ (var-get total-fees-collected) total-fee))
            result
        )
    )
)

;; Fold helper for batch storage
(define-private (store-hash-fold 
    (entry { hash: (buff 32), description: (string-utf8 128) })
    (acc (response (list 10 uint) uint)))
    (match acc
        success-list
            (if (is-none (map-get? hashes (get hash entry)))
                (let ((new-id (store-hash-internal (get hash entry) (get description entry))))
                    (ok (unwrap-panic (as-max-len? (append success-list new-id) u10)))
                )
                acc ;; Skip existing hashes
            )
        err-val (err err-val)
    )
)

;; Revoke a hash (owner only) - marks the hash as no longer valid
(define-public (revoke-hash (hash (buff 32)))
    (let
        (
            (hash-data (unwrap! (map-get? hashes hash) ERR-HASH-NOT-FOUND))
        )
        ;; Only the owner can revoke
        (asserts! (is-eq tx-sender (get owner hash-data)) ERR-NOT-AUTHORIZED)
        ;; Cannot revoke if already revoked
        (asserts! (not (get revoked hash-data)) ERR-HASH-ALREADY-REVOKED)
        
        ;; Update the hash to revoked state
        (map-set hashes hash (merge hash-data { revoked: true }))
        
        (ok true)
    )
)

;; Update the description of an existing hash (owner only, smaller fee)
(define-public (update-description (hash (buff 32)) (new-description (string-utf8 128)))
    (let
        (
            (hash-data (unwrap! (map-get? hashes hash) ERR-HASH-NOT-FOUND))
        )
        ;; Only owner can update
        (asserts! (is-eq tx-sender (get owner hash-data)) ERR-NOT-AUTHORIZED)
        ;; Check description length
        (asserts! (<= (len new-description) u128) ERR-DESCRIPTION-TOO-LONG)
        
        ;; Transfer update fee
        (try! (stx-transfer? UPDATE-FEE tx-sender CONTRACT-OWNER))
        
        ;; Update the hash description
        (map-set hashes hash (merge hash-data {
            description: new-description,
            last-updated: stacks-block-height
        }))
        
        ;; Update fees
        (var-set total-fees-collected (+ (var-get total-fees-collected) UPDATE-FEE))
        
        (ok true)
    )
)

;; Admin function (owner only)
(define-public (verify-owner)
    (begin
        (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
        (ok true)
    )
)

;; Batch verify multiple hashes at once
;; Returns a list of booleans indicating which hashes exist
(define-read-only (batch-verify-hashes (hash-list (list 10 (buff 32))))
    (map verify-hash hash-list)
)

;; Transfer hash ownership to another user
(define-public (transfer-hash (hash (buff 32)) (new-owner principal))
    (let
        (
            (hash-data (unwrap! (map-get? hashes hash) ERR-HASH-NOT-FOUND))
        )
        ;; Only current owner can transfer
        (asserts! (is-eq tx-sender (get owner hash-data)) ERR-NOT-AUTHORIZED)
        ;; Cannot transfer to self
        (asserts! (not (is-eq tx-sender new-owner)) ERR-TRANSFER-TO-SELF)
        
        ;; Update ownership
        (map-set hashes hash (merge hash-data { owner: new-owner }))
        (ok true)
    )
)
