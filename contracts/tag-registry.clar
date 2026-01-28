;; title: tag-registry
;; version: 1.2.0
;; summary: Store key-value tags on-chain with namespace support
;; description: ChainStamp - Pay 0.04 STX to store a namespaced key-value pair permanently on the blockchain

;; Constants
(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-KEY-TOO-LONG (err u101))
(define-constant ERR-VALUE-TOO-LONG (err u102))
(define-constant ERR-TAG-NOT-FOUND (err u103))
(define-constant ERR-TAG-ALREADY-DELETED (err u104))
(define-constant ERR-NAMESPACE-TOO-LONG (err u105))

;; Fee in microSTX (0.04 STX = 40000 microSTX)
(define-constant TAG-FEE u40000)
(define-constant MAX-KEY-LENGTH u64)
(define-constant MAX-VALUE-LENGTH u256)
(define-constant MAX-NAMESPACE-LENGTH u32)
(define-constant DEFAULT-NAMESPACE u"default")

;; Data Variables
(define-data-var tag-counter uint u0)
(define-data-var total-fees-collected uint u0)

;; Data Maps
;; Store tags by ID
(define-map tags uint {
    owner: principal,
    namespace: (string-utf8 32),
    key: (string-utf8 64),
    value: (string-utf8 256),
    timestamp: uint,
    block-height: uint,
    deleted: bool
})

;; Store user's tag IDs
(define-map user-tags principal (list 100 uint))

;; Store user's tags by namespace
(define-map namespace-tags { owner: principal, namespace: (string-utf8 32) } (list 100 uint))

;; Store tag ID by owner+namespace+key for lookup
(define-map tag-lookup { owner: principal, namespace: (string-utf8 32), key: (string-utf8 64) } uint)

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

;; Check if a principal is the owner of a tag
(define-read-only (is-tag-owner (tag-id uint) (user principal))
    (match (map-get? tags tag-id)
        tag-data (is-eq (get owner tag-data) user)
        false
    )
)

;; Get value of a tag if it exists
(define-read-only (get-tag-value (tag-id uint))
    (match (map-get? tags tag-id)
        tag-data (some (get value tag-data))
        none
    )
)

;; Get key of a tag if it exists
(define-read-only (get-tag-key (tag-id uint))
    (match (map-get? tags tag-id)
        tag-data (some (get key tag-data))
        none
    )
)

;; Get block height for a tag if it exists
(define-read-only (get-tag-block-height (tag-id uint))
    (match (map-get? tags tag-id)
        tag-data (some (get block-height tag-data))
        none
    )
)

(define-read-only (get-tag-by-key (owner principal) (key (string-utf8 64)))
    (get-tag-by-ns-key owner DEFAULT-NAMESPACE key)
)

(define-read-only (get-tag-by-ns-key (owner principal) (namespace (string-utf8 32)) (key (string-utf8 64)))
    (match (map-get? tag-lookup { owner: owner, namespace: namespace, key: key })
        tag-id (match (map-get? tags tag-id)
            tag-data (if (get deleted tag-data) none (some tag-data))
            none
        )
        none
    )
)

(define-read-only (is-tag-deleted (tag-id uint))
    (match (map-get? tags tag-id)
        tag-data (get deleted tag-data)
        false
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

;; Get total tags stored by a user
(define-read-only (get-user-tag-count (user principal))
    (len (default-to (list) (map-get? user-tags user)))
)

(define-read-only (get-user-namespace-tags (user principal) (namespace (string-utf8 32)))
    (default-to (list) (map-get? namespace-tags { owner: user, namespace: namespace }))
)

(define-read-only (get-contract-owner)
    CONTRACT-OWNER
)

;; Get contract stats summary
(define-read-only (get-stats)
    {
        total-tags: (var-get tag-counter),
        total-fees: (var-get total-fees-collected),
        fee-per-tag: TAG-FEE
    }
)

;; Public functions

;; Store a key-value tag on-chain (default namespace)
(define-public (store-tag (key (string-utf8 64)) (value (string-utf8 256)))
    (store-tag-with-namespace DEFAULT-NAMESPACE key value)
)

;; Store a key-value tag with custom namespace
(define-public (store-tag-with-namespace (namespace (string-utf8 32)) (key (string-utf8 64)) (value (string-utf8 256)))
    (let
        (
            (new-tag-id (+ (var-get tag-counter) u1))
            (current-user-tags (default-to (list) (map-get? user-tags tx-sender)))
            (current-ns-tags (default-to (list) (map-get? namespace-tags { owner: tx-sender, namespace: namespace })))
        )
        ;; Check lengths
        (asserts! (<= (len namespace) MAX-NAMESPACE-LENGTH) ERR-NAMESPACE-TOO-LONG)
        (asserts! (<= (len key) MAX-KEY-LENGTH) ERR-KEY-TOO-LONG)
        (asserts! (<= (len value) MAX-VALUE-LENGTH) ERR-VALUE-TOO-LONG)
        
        ;; Transfer fee to contract owner
        (try! (stx-transfer? TAG-FEE tx-sender CONTRACT-OWNER))
        
        ;; Store the tag
        (map-set tags new-tag-id {
            owner: tx-sender,
            namespace: namespace,
            key: key,
            value: value,
            timestamp: (unwrap-panic (get-stacks-block-info? time (- stacks-block-height u1))),
            block-height: stacks-block-height,
            deleted: false
        })
        
        ;; Store lookup
        (map-set tag-lookup { owner: tx-sender, namespace: namespace, key: key } new-tag-id)
        
        ;; Update user tags list
        (map-set user-tags tx-sender 
            (unwrap-panic (as-max-len? (append current-user-tags new-tag-id) u100)))
        
        ;; Update namespace tags list
        (map-set namespace-tags { owner: tx-sender, namespace: namespace }
            (unwrap-panic (as-max-len? (append current-ns-tags new-tag-id) u100)))
        
        ;; Increment counter and fees
        (var-set tag-counter new-tag-id)
        (var-set total-fees-collected (+ (var-get total-fees-collected) TAG-FEE))
        
        ;; Return the tag ID
        (ok new-tag-id)
    )
)

;; Update an existing tag value (same fee applies)
(define-public (update-tag (key (string-utf8 64)) (new-value (string-utf8 256)))
    (update-tag-with-namespace DEFAULT-NAMESPACE key new-value)
)

;; Update an existing tag with namespace
(define-public (update-tag-with-namespace (namespace (string-utf8 32)) (key (string-utf8 64)) (new-value (string-utf8 256)))
    (let
        (
            (existing-tag-id (unwrap! (map-get? tag-lookup { owner: tx-sender, namespace: namespace, key: key }) ERR-TAG-NOT-FOUND))
            (existing-tag (unwrap! (map-get? tags existing-tag-id) ERR-TAG-NOT-FOUND))
        )
        ;; Check if tag is deleted
        (asserts! (not (get deleted existing-tag)) ERR-TAG-ALREADY-DELETED)
        ;; Check value length
        (asserts! (<= (len new-value) MAX-VALUE-LENGTH) ERR-VALUE-TOO-LONG)
        
        ;; Transfer fee to contract owner
        (try! (stx-transfer? TAG-FEE tx-sender CONTRACT-OWNER))
        
        ;; Update the tag
        (map-set tags existing-tag-id {
            owner: tx-sender,
            namespace: namespace,
            key: key,
            value: new-value,
            timestamp: (unwrap-panic (get-stacks-block-info? time (- stacks-block-height u1))),
            block-height: stacks-block-height,
            deleted: false
        })
        
        ;; Update fees collected
        (var-set total-fees-collected (+ (var-get total-fees-collected) TAG-FEE))
        
        (ok existing-tag-id)
    )
)

;; Delete a tag (owner only) - marks the tag as deleted
(define-public (delete-tag (tag-id uint))
    (let
        (
            (tag-data (unwrap! (map-get? tags tag-id) ERR-TAG-NOT-FOUND))
        )
        ;; Only the owner can delete
        (asserts! (is-eq tx-sender (get owner tag-data)) ERR-NOT-AUTHORIZED)
        ;; Cannot delete if already deleted
        (asserts! (not (get deleted tag-data)) ERR-TAG-ALREADY-DELETED)
        
        ;; Update the tag to deleted state
        (map-set tags tag-id (merge tag-data { deleted: true }))
        
        ;; Remove from lookup
        (map-delete tag-lookup { owner: tx-sender, namespace: (get namespace tag-data), key: (get key tag-data) })
        
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

;; Get multiple tags by IDs
(define-read-only (batch-get-tags (tag-ids (list 10 uint)))
    (map get-tag tag-ids)
)
