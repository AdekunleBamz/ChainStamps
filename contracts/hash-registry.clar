;; title: hash-registry
;; version: 1.0.0
;; summary: Store document hashes on-chain for verification
;; description: ChainStamp - Pay 0.03 STX to permanently store a hash for document verification

;; Constants
(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-HASH-ALREADY-EXISTS (err u101))
(define-constant ERR-HASH-NOT-FOUND (err u102))

;; Fee in microSTX (0.03 STX = 30000 microSTX)
(define-constant HASH-FEE u30000)

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
    hash-id: uint
})

;; Track hashes by user
(define-map user-hashes principal (list 100 (buff 32)))

;; Track hash by ID for enumeration
(define-map hash-by-id uint (buff 32))

;; Read-only functions

(define-read-only (get-hash-info (hash (buff 32)))
    (map-get? hashes hash)
)

(define-read-only (verify-hash (hash (buff 32)))
    (is-some (map-get? hashes hash))
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

(define-read-only (get-user-hashes (user principal))
    (default-to (list) (map-get? user-hashes user))
)

(define-read-only (get-hash-by-id (id uint))
    (map-get? hash-by-id id)
)

(define-read-only (get-contract-owner)
    CONTRACT-OWNER
)

;; Public functions

;; Store a hash on-chain
(define-public (store-hash (hash (buff 32)) (description (string-utf8 128)))
    (let
        (
            (new-hash-id (+ (var-get hash-counter) u1))
            (current-user-hashes (default-to (list) (map-get? user-hashes tx-sender)))
        )
        ;; Check if hash already exists
        (asserts! (is-none (map-get? hashes hash)) ERR-HASH-ALREADY-EXISTS)
        
        ;; Transfer fee to contract owner
        (try! (stx-transfer? HASH-FEE tx-sender CONTRACT-OWNER))
        
        ;; Store the hash
        (map-set hashes hash {
            owner: tx-sender,
            description: description,
            timestamp: (unwrap-panic (get-stacks-block-info? time (- stacks-block-height u1))),
            block-height: stacks-block-height,
            hash-id: new-hash-id
        })
        
        ;; Store reverse lookup
        (map-set hash-by-id new-hash-id hash)
        
        ;; Update user hashes list
        (map-set user-hashes tx-sender 
            (unwrap-panic (as-max-len? (append current-user-hashes hash) u100)))
        
        ;; Increment counter and fees
        (var-set hash-counter new-hash-id)
        (var-set total-fees-collected (+ (var-get total-fees-collected) HASH-FEE))
        
        ;; Return the hash ID
        (ok new-hash-id)
    )
)

;; Admin function (owner only)
(define-public (verify-owner)
    (begin
        (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
        (ok true)
    )
)
