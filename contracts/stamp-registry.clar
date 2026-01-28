;; title: stamp-registry
;; version: 1.2.0
;; summary: Store short messages on-chain for a small fee
;; description: ChainStamp - Pay 0.05 STX to permanently stamp a message on the Stacks blockchain

;; Constants
(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-MESSAGE-TOO-LONG (err u101))
(define-constant ERR-INSUFFICIENT-PAYMENT (err u102))
(define-constant ERR-STAMP-NOT-FOUND (err u103))
(define-constant ERR-STAMP-ALREADY-REVOKED (err u104))
(define-constant ERR-INVALID-CATEGORY (err u105))

;; Fee in microSTX (0.05 STX = 50000 microSTX)
(define-constant STAMP-FEE u50000)
(define-constant MAX-MESSAGE-LENGTH u256)
(define-constant MAX-CATEGORY-LENGTH u32)

;; Valid categories
(define-constant CATEGORY-GENERAL u0)
(define-constant CATEGORY-ANNOUNCEMENT u1)
(define-constant CATEGORY-MILESTONE u2)
(define-constant CATEGORY-LEGAL u3)
(define-constant CATEGORY-PERSONAL u4)

;; Data Variables
(define-data-var stamp-counter uint u0)
(define-data-var total-fees-collected uint u0)

;; Data Maps
(define-map stamps uint {
    sender: principal,
    message: (string-utf8 256),
    category: uint,
    timestamp: uint,
    block-height: uint,
    revoked: bool
})

(define-map user-stamps principal (list 100 uint))

;; Category tracking
(define-map category-stamps uint (list 100 uint))

;; Read-only functions

(define-read-only (get-stamp (stamp-id uint))
    (map-get? stamps stamp-id)
)

;; Check if a principal is the sender of a stamp
(define-read-only (is-stamp-sender (stamp-id uint) (user principal))
    (match (map-get? stamps stamp-id)
        stamp-data (is-eq (get sender stamp-data) user)
        false
    )
)

(define-read-only (is-stamp-valid (stamp-id uint))
    (match (map-get? stamps stamp-id)
        stamp-data (not (get revoked stamp-data))
        false
    )
)

(define-read-only (is-stamp-revoked (stamp-id uint))
    (match (map-get? stamps stamp-id)
        stamp-data (get revoked stamp-data)
        false
    )
)

(define-read-only (get-stamp-count)
    (var-get stamp-counter)
)

(define-read-only (get-total-fees)
    (var-get total-fees-collected)
)

(define-read-only (get-stamp-fee)
    STAMP-FEE
)

(define-read-only (get-user-stamps (user principal))
    (default-to (list) (map-get? user-stamps user))
)

(define-read-only (get-stamps-by-category (category uint))
    (default-to (list) (map-get? category-stamps category))
)

(define-read-only (is-valid-category (category uint))
    (<= category CATEGORY-PERSONAL)
)

(define-read-only (get-contract-owner)
    CONTRACT-OWNER
)

;; Get contract stats summary
(define-read-only (get-stats)
    {
        total-stamps: (var-get stamp-counter),
        total-fees: (var-get total-fees-collected),
        fee-per-stamp: STAMP-FEE
    }
)

;; Get multiple stamps by IDs
(define-read-only (batch-get-stamps (stamp-ids (list 10 uint)))
    (map get-stamp stamp-ids)
)

;; Public functions

;; Stamp a message on-chain with default category
(define-public (stamp-message (message (string-utf8 256)))
    (stamp-message-with-category message CATEGORY-GENERAL)
)

;; Stamp a message on-chain with specific category
(define-public (stamp-message-with-category (message (string-utf8 256)) (category uint))
    (let
        (
            (new-stamp-id (+ (var-get stamp-counter) u1))
            (current-user-stamps (default-to (list) (map-get? user-stamps tx-sender)))
            (current-category-stamps (default-to (list) (map-get? category-stamps category)))
        )
        ;; Check message length
        (asserts! (<= (len message) MAX-MESSAGE-LENGTH) ERR-MESSAGE-TOO-LONG)
        ;; Check valid category
        (asserts! (is-valid-category category) ERR-INVALID-CATEGORY)
        
        ;; Transfer fee to contract owner
        (try! (stx-transfer? STAMP-FEE tx-sender CONTRACT-OWNER))
        
        ;; Store the stamp
        (map-set stamps new-stamp-id {
            sender: tx-sender,
            message: message,
            category: category,
            timestamp: (unwrap-panic (get-stacks-block-info? time (- stacks-block-height u1))),
            block-height: stacks-block-height,
            revoked: false
        })
        
        ;; Update user stamps list
        (map-set user-stamps tx-sender 
            (unwrap-panic (as-max-len? (append current-user-stamps new-stamp-id) u100)))
        
        ;; Update category stamps list
        (map-set category-stamps category
            (unwrap-panic (as-max-len? (append current-category-stamps new-stamp-id) u100)))
        
        ;; Increment counter and fees
        (var-set stamp-counter new-stamp-id)
        (var-set total-fees-collected (+ (var-get total-fees-collected) STAMP-FEE))
        
        ;; Return the stamp ID
        (ok new-stamp-id)
    )
)

;; Revoke a stamp (sender only) - marks the stamp as no longer valid
(define-public (revoke-stamp (stamp-id uint))
    (let
        (
            (stamp-data (unwrap! (map-get? stamps stamp-id) ERR-STAMP-NOT-FOUND))
        )
        ;; Only the sender can revoke
        (asserts! (is-eq tx-sender (get sender stamp-data)) ERR-NOT-AUTHORIZED)
        ;; Cannot revoke if already revoked
        (asserts! (not (get revoked stamp-data)) ERR-STAMP-ALREADY-REVOKED)
        
        ;; Update the stamp to revoked state
        (map-set stamps stamp-id (merge stamp-data { revoked: true }))
        
        (ok true)
    )
)

;; Admin function (owner only) - fees go directly to owner, no withdrawal needed
(define-public (verify-owner)
    (begin
        (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
        (ok true)
    )
)

;; Batch stamp multiple messages at once
;; Returns list of stamp IDs for all messages
(define-public (batch-stamp-messages (messages (list 5 (string-utf8 256))))
    (let
        (
            (results (map stamp-message messages))
        )
        (ok results)
    )
)
