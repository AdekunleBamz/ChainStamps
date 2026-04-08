;; title: tag-registry
;; version: 1.2.1
;; summary: Store key-value tags on-chain with namespace support
;; description: ChainStamp - Pay 0.04 STX to store a namespaced key-value pair permanently on the blockchain
;; author: Adekunle Bamz (@AdekunleBamz)
;; license: MIT

;; ============================================================
;; CONSTANTS - Error Codes
;; ============================================================
;; Contract owner principal for fee collection
(define-constant CONTRACT-OWNER tx-sender)

;; Error: Caller is not authorized to perform this action (u100)
(define-constant ERR-NOT-AUTHORIZED (err u100))
;; Error: Tag key exceeds maximum allowed length of 64 UTF-8 bytes (u101)
(define-constant ERR-KEY-TOO-LONG (err u101))
;; Error: Tag value exceeds maximum allowed length of 256 UTF-8 bytes (u102)
(define-constant ERR-VALUE-TOO-LONG (err u102))
;; Error: Tag not found in the registry (u103)
(define-constant ERR-TAG-NOT-FOUND (err u103))
;; Error: Tag has already been deleted (u104)
(define-constant ERR-TAG-ALREADY-DELETED (err u104))
;; Error: Namespace exceeds maximum allowed length of 32 UTF-8 bytes (u105)
(define-constant ERR-NAMESPACE-TOO-LONG (err u105))

;; ============================================================
;; CONSTANTS - Fee Structure and Limits
;; ============================================================
;; Fee for storing or updating a tag (0.04 STX = 40000 microSTX)
(define-constant TAG-FEE u40000)
;; Maximum length for tag keys in UTF-8 bytes
(define-constant MAX-KEY-LENGTH u64)
;; Maximum length for tag values in UTF-8 bytes
(define-constant MAX-VALUE-LENGTH u256)
;; Maximum length for namespace names in UTF-8 bytes
(define-constant MAX-NAMESPACE-LENGTH u32)
;; Maximum tags a single user can store (prevents state bloat)
(define-constant MAX-USER-TAGS u100)
;; Default namespace used when no namespace is specified
(define-constant DEFAULT-NAMESPACE u"default")

;; ============================================================
;; DATA VARIABLES
;; ============================================================
;; Counter for total tags stored (used for ID generation)
(define-data-var tag-counter uint u0)
;; Accumulated total of all fees collected by the contract
(define-data-var total-fees-collected uint u0)

;; ============================================================
;; DATA MAPS
;; ============================================================
;; Primary storage: Maps tag ID to tag metadata
;; - owner: Principal who stored the tag
;; - namespace: Namespace for grouping related tags
;; - key: The tag key (unique within owner+namespace)
;; - value: The tag value
;; - timestamp: Block timestamp when tag was stored
;; - block-height: Block height when tag was stored
;; - deleted: Whether this tag has been deleted by owner
(define-map tags uint {
    owner: principal,
    namespace: (string-utf8 32),
    key: (string-utf8 64),
    value: (string-utf8 256),
    timestamp: uint,
    block-height: uint,
    deleted: bool
})

;; Index: Maps user principal to list of their tag IDs
;; Enables efficient lookup of all tags owned by a user
(define-map user-tags principal (list 100 uint))

;; Index: Maps owner+namespace to list of tag IDs in that namespace
;; Enables browsing tags by namespace grouping
(define-map namespace-tags { owner: principal, namespace: (string-utf8 32) } (list 100 uint))

;; Lookup: Maps owner+namespace+key to tag ID for O(1) key-based retrieval
;; Enables efficient lookup of tags by their key within a namespace
(define-map tag-lookup { owner: principal, namespace: (string-utf8 32), key: (string-utf8 64) } uint)

;; ============================================================
;; READ-ONLY FUNCTIONS - Tag Lookup
;; ============================================================

;; Retrieve complete metadata for a tag by its ID
;; Returns: (some {owner, namespace, key, value, timestamp, block-height, deleted}) or none
(define-read-only (get-tag (tag-id uint))
    (map-get? tags tag-id)
)

;; Get the owner principal of a tag if it exists
;; Returns: (some principal) or none
(define-read-only (get-tag-owner (tag-id uint))
    (match (map-get? tags tag-id)
        tag-data (some (get owner tag-data))
        none
    )
)

;; Verify if a principal is the owner of a specific tag
;; Returns: true if user is the owner, false otherwise
(define-read-only (is-tag-owner (tag-id uint) (user principal))
    (match (map-get? tags tag-id)
        tag-data (is-eq (get owner tag-data) user)
        false
    )
)

;; Get the value of a tag if it exists
;; Returns: (some string-utf8) or none
(define-read-only (get-tag-value (tag-id uint))
    (match (map-get? tags tag-id)
        tag-data (some (get value tag-data))
        none
    )
)

;; Get the key of a tag if it exists
;; Returns: (some string-utf8) or none
(define-read-only (get-tag-key (tag-id uint))
    (match (map-get? tags tag-id)
        tag-data (some (get key tag-data))
        none
    )
)

;; Get the block height when a tag was stored
;; Returns: (some uint) or none
(define-read-only (get-tag-block-height (tag-id uint))
    (match (map-get? tags tag-id)
        tag-data (some (get block-height tag-data))
        none
    )
)

;; Get a tag by key in the default namespace
;; Convenience function that delegates to get-tag-by-ns-key
(define-read-only (get-tag-by-key (owner principal) (key (string-utf8 64)))
    (get-tag-by-ns-key owner DEFAULT-NAMESPACE key)
)

;; Get a tag by owner, namespace, and key with O(1) lookup
;; Returns the full tag metadata if found and not deleted, none otherwise
(define-read-only (get-tag-by-ns-key (owner principal) (namespace (string-utf8 32)) (key (string-utf8 64)))
    (match (map-get? tag-lookup { owner: owner, namespace: namespace, key: key })
        tag-id (match (map-get? tags tag-id)
            tag-data (if (get deleted tag-data) none (some tag-data))
            none
        )
        none
    )
)

;; Check if a tag has been explicitly deleted by its owner
;; Returns: true if deleted, false if active or non-existent
(define-read-only (is-tag-deleted (tag-id uint))
    (match (map-get? tags tag-id)
        tag-data (get deleted tag-data)
        false
    )
)

;; ============================================================
;; READ-ONLY FUNCTIONS - Contract State
;; ============================================================

;; Get total number of tags stored in the registry
(define-read-only (get-tag-count)
    (var-get tag-counter)
)

;; Get total fees collected by the contract since deployment
(define-read-only (get-total-fees)
    (var-get total-fees-collected)
)

;; Get current fee for storing or updating a tag
(define-read-only (get-tag-fee)
    TAG-FEE
)

;; ============================================================
;; READ-ONLY FUNCTIONS - User Queries
;; ============================================================

;; Get list of all tag IDs owned by a user
;; Returns: (list 100 uint) or empty list if none
(define-read-only (get-user-tags (user principal))
    (default-to (list) (map-get? user-tags user))
)

;; Get count of tags stored by a specific user
;; Returns: uint representing number of tags
(define-read-only (get-user-tag-count (user principal))
    (len (default-to (list) (map-get? user-tags user)))
)

;; Get list of tag IDs in a specific namespace for a user
;; Returns: (list 100 uint) or empty list if none
(define-read-only (get-user-namespace-tags (user principal) (namespace (string-utf8 32)))
    (default-to (list) (map-get? namespace-tags { owner: user, namespace: namespace }))
)

;; ============================================================
;; READ-ONLY FUNCTIONS - Contract Info
;; ============================================================

;; Get the contract owner principal (fee recipient)
(define-read-only (get-contract-owner)
    CONTRACT-OWNER
)

;; Get summary statistics for the contract
;; Returns: {total-tags, total-fees, fee-per-tag}
(define-read-only (get-stats)
    {
        total-tags: (var-get tag-counter),
        total-fees: (var-get total-fees-collected),
        fee-per-tag: TAG-FEE
    }
)

;; ============================================================
;; PUBLIC FUNCTIONS - Tag Operations
;; ============================================================

;; Store a key-value tag on-chain in the default namespace
;; @param key the tag key (max 64 UTF-8 bytes)
;; @param value the tag value (max 256 UTF-8 bytes)
(define-public (store-tag (key (string-utf8 64)) (value (string-utf8 256)))
    (store-tag-with-namespace DEFAULT-NAMESPACE key value)
)

;; Store a key-value tag on-chain with a custom namespace
;; Creates a new tag with the given namespace, key, and value
;; @param namespace namespace for grouping related tags (max 32 UTF-8 bytes)
;; @param key the tag key (max 64 UTF-8 bytes)
;; @param value the tag value (max 256 UTF-8 bytes)
(define-public (store-tag-with-namespace (namespace (string-utf8 32)) (key (string-utf8 64)) (value (string-utf8 256)))
    (let
        (
            (new-tag-id (+ (var-get tag-counter) u1))
            (current-user-tags (default-to (list) (map-get? user-tags tx-sender)))
            (current-ns-tags (default-to (list) (map-get? namespace-tags { owner: tx-sender, namespace: namespace })))
        )
        ;; Validate namespace length
        (asserts! (<= (len namespace) MAX-NAMESPACE-LENGTH) ERR-NAMESPACE-TOO-LONG)
        ;; Validate key length
        (asserts! (<= (len key) MAX-KEY-LENGTH) ERR-KEY-TOO-LONG)
        ;; Validate value length
        (asserts! (<= (len value) MAX-VALUE-LENGTH) ERR-VALUE-TOO-LONG)
        
        ;; Transfer fee to contract owner
        (try! (stx-transfer? TAG-FEE tx-sender CONTRACT-OWNER))
        
        ;; Store the tag metadata
        (map-set tags new-tag-id {
            owner: tx-sender,
            namespace: namespace,
            key: key,
            value: value,
            timestamp: (unwrap-panic (get-stacks-block-info? time (- stacks-block-height u1))),
            block-height: stacks-block-height,
            deleted: false
        })
        
        ;; Store lookup for O(1) key-based retrieval
        (map-set tag-lookup { owner: tx-sender, namespace: namespace, key: key } new-tag-id)
        
        ;; Update user's tag list
        (map-set user-tags tx-sender 
            (unwrap-panic (as-max-len? (append current-user-tags new-tag-id) u100)))
        
        ;; Update namespace's tag list
        (map-set namespace-tags { owner: tx-sender, namespace: namespace }
            (unwrap-panic (as-max-len? (append current-ns-tags new-tag-id) u100)))
        
        ;; Increment counter and update fees
        (var-set tag-counter new-tag-id)
        (var-set total-fees-collected (+ (var-get total-fees-collected) TAG-FEE))
        
        ;; Return the new tag ID
        (ok new-tag-id)
    )
)

;; Update an existing tag value in the default namespace
;; Same fee applies as storing a new tag
;; @param key the tag key to update (max 64 UTF-8 bytes)
;; @param new-value the new tag value (max 256 UTF-8 bytes)
(define-public (update-tag (key (string-utf8 64)) (new-value (string-utf8 256)))
    (update-tag-with-namespace DEFAULT-NAMESPACE key new-value)
)

;; Update an existing tag value with namespace
;; Only the tag owner can update their tag's value
;; @param namespace the namespace containing the tag (max 32 UTF-8 bytes)
;; @param key the tag key to update (max 64 UTF-8 bytes)
;; @param new-value the new tag value (max 256 UTF-8 bytes)
(define-public (update-tag-with-namespace (namespace (string-utf8 32)) (key (string-utf8 64)) (new-value (string-utf8 256)))
    (let
        (
            (existing-tag-id (unwrap! (map-get? tag-lookup { owner: tx-sender, namespace: namespace, key: key }) ERR-TAG-NOT-FOUND))
            (existing-tag (unwrap! (map-get? tags existing-tag-id) ERR-TAG-NOT-FOUND))
        )
        ;; Ensure tag hasn't been deleted
        (asserts! (not (get deleted existing-tag)) ERR-TAG-ALREADY-DELETED)
        ;; Validate new value length
        (asserts! (<= (len new-value) MAX-VALUE-LENGTH) ERR-VALUE-TOO-LONG)
        
        ;; Transfer fee to contract owner
        (try! (stx-transfer? TAG-FEE tx-sender CONTRACT-OWNER))
        
        ;; Update the tag value and timestamp
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

;; ============================================================
;; PUBLIC FUNCTIONS - Tag Deletion
;; ============================================================

;; Delete a tag (owner only) - marks the tag as deleted
;; Deleted tags are not returned by lookup functions but remain in storage
;; @param tag-id the numeric ID of the tag to delete
(define-public (delete-tag (tag-id uint))
    (let
        (
            (tag-data (unwrap! (map-get? tags tag-id) ERR-TAG-NOT-FOUND))
        )
        ;; Verify caller is the owner
        (asserts! (is-eq tx-sender (get owner tag-data)) ERR-NOT-AUTHORIZED)
        ;; Ensure tag hasn't been deleted already
        (asserts! (not (get deleted tag-data)) ERR-TAG-ALREADY-DELETED)
        
        ;; Mark tag as deleted
        (map-set tags tag-id (merge tag-data { deleted: true }))
        
        ;; Remove from key-based lookup
        (map-delete tag-lookup { owner: tx-sender, namespace: (get namespace tag-data), key: (get key tag-data) })
        
        (ok true)
    )
)

;; ============================================================
;; PUBLIC FUNCTIONS - Admin
;; ============================================================

;; Verify the caller is the contract owner
;; Used for administrative access control
(define-public (verify-owner)
    (begin
        (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
        (ok true)
    )
)

;; ============================================================
;; READ-ONLY FUNCTIONS - Batch Operations
;; ============================================================

;; Get multiple tags by their IDs in a single call
;; Returns: list of tag metadata (some may be none if ID doesn't exist)
(define-read-only (batch-get-tags (tag-ids (list 10 uint)))
    (map get-tag tag-ids)
)
