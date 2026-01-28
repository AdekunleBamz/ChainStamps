;; title: stamp-registry
;; version: 1.0.0
;; summary: Store short messages on-chain for a small fee
;; description: ChainStamp - Pay 0.05 STX to permanently stamp a message on the Stacks blockchain

;; Constants
(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-MESSAGE-TOO-LONG (err u101))
(define-constant ERR-INSUFFICIENT-PAYMENT (err u102))
(define-constant ERR-STAMP-NOT-FOUND (err u103))

;; Fee in microSTX (0.05 STX = 50000 microSTX)
(define-constant STAMP-FEE u50000)
(define-constant MAX-MESSAGE-LENGTH u256)

;; Data Variables
(define-data-var stamp-counter uint u0)
(define-data-var total-fees-collected uint u0)

;; Data Maps
(define-map stamps uint {
    sender: principal,
    message: (string-utf8 256),
    timestamp: uint,
    block-height: uint
})

(define-map user-stamps principal (list 100 uint))

;; Read-only functions

(define-read-only (get-stamp (stamp-id uint))
    (map-get? stamps stamp-id)
)

;; Get message from a stamp if it exists
(define-read-only (get-stamp-message (stamp-id uint))
    (match (map-get? stamps stamp-id)
        stamp-data (some (get message stamp-data))
        none
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

(define-read-only (get-contract-owner)
    CONTRACT-OWNER
)

;; Public functions

;; Stamp a message on-chain
(define-public (stamp-message (message (string-utf8 256)))
    (let
        (
            (new-stamp-id (+ (var-get stamp-counter) u1))
            (current-user-stamps (default-to (list) (map-get? user-stamps tx-sender)))
        )
        ;; Check message length
        (asserts! (<= (len message) MAX-MESSAGE-LENGTH) ERR-MESSAGE-TOO-LONG)
        
        ;; Transfer fee to contract owner
        (try! (stx-transfer? STAMP-FEE tx-sender CONTRACT-OWNER))
        
        ;; Store the stamp
        (map-set stamps new-stamp-id {
            sender: tx-sender,
            message: message,
            timestamp: (unwrap-panic (get-stacks-block-info? time (- stacks-block-height u1))),
            block-height: stacks-block-height
        })
        
        ;; Update user stamps list
        (map-set user-stamps tx-sender 
            (unwrap-panic (as-max-len? (append current-user-stamps new-stamp-id) u100)))
        
        ;; Increment counter and fees
        (var-set stamp-counter new-stamp-id)
        (var-set total-fees-collected (+ (var-get total-fees-collected) STAMP-FEE))
        
        ;; Return the stamp ID
        (ok new-stamp-id)
    )
)

;; Admin function (owner only) - fees go directly to owner, no withdrawal needed
(define-public (verify-owner)
    (begin
        (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
        (ok true)
    )
)
