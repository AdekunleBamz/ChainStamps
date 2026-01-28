;; title: tag-registry
;; version: 1.0.0
;; summary: Store key-value tags on-chain
;; description: ChainStamp - Pay 0.04 STX to store a key-value pair permanently on the blockchain

;; Constants
(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-KEY-TOO-LONG (err u101))
(define-constant ERR-VALUE-TOO-LONG (err u102))
(define-constant ERR-TAG-NOT-FOUND (err u103))

;; Fee in microSTX (0.04 STX = 40000 microSTX)
(define-constant TAG-FEE u40000)
(define-constant MAX-KEY-LENGTH u64)
(define-constant MAX-VALUE-LENGTH u256)

;; Data Variables
(define-data-var tag-counter uint u0)
(define-data-var total-fees-collected uint u0)

;; Data Maps
;; Store tags by ID
(define-map tags uint {
    owner: principal,
    key: (string-utf8 64),
    value: (string-utf8 256),
    timestamp: uint,
    block-height: uint
})

;; Store user's tag IDs
(define-map user-tags principal (list 100 uint))

;; Store tag ID by owner+key for lookup
(define-map tag-lookup { owner: principal, key: (string-utf8 64) } uint)

;; Read-only functions

(define-read-only (get-tag (tag-id uint))
    (map-get? tags tag-id)
)
;; Get owner of a tag if it exists
(define-read-only (get-tag-owner (tag-id uint))
    (match (map-get? tags tag-id)
        tag-data (some (get owner tag-data))
        none
    )
)

(define-read-only (get-tag-by-key (owner principal) (key (string-utf8 64)))
    (match (map-get? tag-lookup { owner: owner, key: key })
        tag-id (map-get? tags tag-id)
        none
    )
)

(define-read-only (get-tag-count)
    (var-get tag-counter)
)

(define-read-only (get-total-fees)
    (var-get total-fees-collected)
)

(define-read-only (get-tag-fee)
    TAG-FEE
)

(define-read-only (get-user-tags (user principal))
    (default-to (list) (map-get? user-tags user))
)

(define-read-only (get-contract-owner)
    CONTRACT-OWNER
)

;; Public functions

;; Store a key-value tag on-chain
(define-public (store-tag (key (string-utf8 64)) (value (string-utf8 256)))
    (let
        (
            (new-tag-id (+ (var-get tag-counter) u1))
            (current-user-tags (default-to (list) (map-get? user-tags tx-sender)))
        )
        ;; Check lengths
        (asserts! (<= (len key) MAX-KEY-LENGTH) ERR-KEY-TOO-LONG)
        (asserts! (<= (len value) MAX-VALUE-LENGTH) ERR-VALUE-TOO-LONG)
        
        ;; Transfer fee to contract owner
        (try! (stx-transfer? TAG-FEE tx-sender CONTRACT-OWNER))
        
        ;; Store the tag
        (map-set tags new-tag-id {
            owner: tx-sender,
            key: key,
            value: value,
            timestamp: (unwrap-panic (get-stacks-block-info? time (- stacks-block-height u1))),
            block-height: stacks-block-height
        })
        
        ;; Store lookup
        (map-set tag-lookup { owner: tx-sender, key: key } new-tag-id)
        
        ;; Update user tags list
        (map-set user-tags tx-sender 
            (unwrap-panic (as-max-len? (append current-user-tags new-tag-id) u100)))
        
        ;; Increment counter and fees
        (var-set tag-counter new-tag-id)
        (var-set total-fees-collected (+ (var-get total-fees-collected) TAG-FEE))
        
        ;; Return the tag ID
        (ok new-tag-id)
    )
)

;; Update an existing tag value (same fee applies)
(define-public (update-tag (key (string-utf8 64)) (new-value (string-utf8 256)))
    (let
        (
            (existing-tag-id (unwrap! (map-get? tag-lookup { owner: tx-sender, key: key }) ERR-TAG-NOT-FOUND))
            (existing-tag (unwrap! (map-get? tags existing-tag-id) ERR-TAG-NOT-FOUND))
        )
        ;; Check value length
        (asserts! (<= (len new-value) MAX-VALUE-LENGTH) ERR-VALUE-TOO-LONG)
        
        ;; Transfer fee to contract owner
        (try! (stx-transfer? TAG-FEE tx-sender CONTRACT-OWNER))
        
        ;; Update the tag
        (map-set tags existing-tag-id {
            owner: tx-sender,
            key: key,
            value: new-value,
            timestamp: (unwrap-panic (get-stacks-block-info? time (- stacks-block-height u1))),
            block-height: stacks-block-height
        })
        
        ;; Update fees collected
        (var-set total-fees-collected (+ (var-get total-fees-collected) TAG-FEE))
        
        (ok existing-tag-id)
    )
)

;; Admin function (owner only)
(define-public (verify-owner)
    (begin
        (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
        (ok true)
    )
)
