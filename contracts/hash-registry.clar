;; title: hash-registry
;; version: 1.3.0
;; summary: Store document hashes on-chain for verification
;; description: ChainStamp - Pay 0.03 STX to permanently store a hash for document verification
;; author: Adekunle Bamz (@AdekunleBamz)
;; license: MIT

;; ============================================================
;; CONSTANTS - Error Codes
;; ============================================================
;; Contract owner principal for fee collection
(define-constant CONTRACT-OWNER tx-sender)

;; Error: Caller is not authorized to perform this action (u100)
(define-constant ERR-NOT-AUTHORIZED (err u100))
;; Error: Hash already exists in the registry (u101)
(define-constant ERR-HASH-ALREADY-EXISTS (err u101))
;; Error: Hash not found in the registry (u102)
(define-constant ERR-HASH-NOT-FOUND (err u102))
;; Error: Hash has already been revoked (u103)
(define-constant ERR-HASH-ALREADY-REVOKED (err u103))
;; Error: Description exceeds maximum allowed length (u104)
(define-constant ERR-DESCRIPTION-TOO-LONG (err u104))
;; Error: Batch size exceeds maximum allowed (u105)
(define-constant ERR-BATCH-TOO-LARGE (err u105))
;; Error: Batch contains no hashes (u106)
(define-constant ERR-EMPTY-BATCH (err u106))
;; Error: Cannot transfer hash ownership to self (u107)
(define-constant ERR-TRANSFER-TO-SELF (err u107))
;; Error: Caller is not the owner of the hash (u108)
(define-constant ERR-NOT-HASH-OWNER (err u108))
;; Error: Insufficient fee provided for operation (u109)
(define-constant ERR-INSUFFICIENT-FEE (err u109))
;; Error: Description is empty or invalid (u110)
(define-constant ERR-INVALID-DESCRIPTION (err u110))

;; ============================================================
;; CONSTANTS - Fee Structure
;; ============================================================
;; Standard fee for storing a single hash (0.03 STX = 30000 microSTX)
(define-constant HASH-FEE u30000)
;; Discounted fee for batch operations (0.025 STX = 25000 microSTX per hash)
(define-constant BATCH-HASH-FEE u25000)
;; Maximum number of hashes allowed in a single batch operation
(define-constant MAX-BATCH-SIZE u10)
;; Reduced fee for description updates only (0.01 STX = 10000 microSTX)
(define-constant UPDATE-FEE u10000)
;; Maximum number of hashes a single user can store (prevents state bloat)
(define-constant MAX-USER-HASHES u100)

;; ============================================================
;; DATA VARIABLES
;; ============================================================
;; Counter for total hashes stored (used for ID generation)
(define-data-var hash-counter uint u0)
;; Accumulated total of all fees collected by the contract
(define-data-var total-fees-collected uint u0)

;; ============================================================
;; DATA MAPS
;; ============================================================
;; Primary storage: Maps hash (32-byte buffer) to metadata
;; - owner: Principal who stored the hash
;; - description: Human-readable description (max 128 UTF-8 bytes)
;; - timestamp: Block timestamp when hash was stored
;; - block-height: Block height when hash was stored
;; - hash-id: Unique sequential ID for this hash
;; - last-updated: Block height of last metadata update
;; - revoked: Whether this hash has been revoked by owner
(define-map hashes (buff 32) {
    owner: principal,
    description: (string-utf8 128),
    timestamp: uint,
    block-height: uint,
    hash-id: uint,
    last-updated: uint,
    revoked: bool
})

;; Index: Maps user principal to list of their hash buffers
;; Enables efficient lookup of all hashes owned by a user
(define-map user-hashes principal (list 100 (buff 32)))

;; Index: Maps sequential hash ID to hash buffer
;; Enables lookup of hashes by their sequential ID
(define-map hash-by-id uint (buff 32))

;; ============================================================
;; READ-ONLY FUNCTIONS - Hash Lookup
;; ============================================================

;; Retrieve complete metadata for a hash by its buffer
;; Returns: (some {owner, description, timestamp, block-height, hash-id, last-updated, revoked}) or none
(define-read-only (get-hash-info (hash (buff 32)))
    (map-get? hashes hash)
)

;; Get the owner principal of a hash if it exists
;; Returns: (some principal) or none
(define-read-only (get-hash-owner (hash (buff 32)))
    (match (map-get? hashes hash)
        hash-data (some (get owner hash-data))
        none
    )
)

;; Get the description string of a hash if it exists
;; Returns: (some string-utf8) or none
(define-read-only (get-hash-description (hash (buff 32)))
    (match (map-get? hashes hash)
        hash-data (some (get description hash-data))
        none
    )
)

;; Get the block height when a hash was stored
;; Returns: (some uint) or none
(define-read-only (get-hash-block-height (hash (buff 32)))
    (match (map-get? hashes hash)
        hash-data (some (get block-height hash-data))
        none
    )
)

;; Verify if a hash exists and has not been revoked
;; Returns: true if hash exists and is valid, false otherwise
(define-read-only (verify-hash (hash (buff 32)))
    (match (map-get? hashes hash)
        hash-data (not (get revoked hash-data))
        false
    )
)

;; Check if a hash has been explicitly revoked by its owner
;; Returns: true if revoked, false if valid or non-existent
(define-read-only (is-hash-revoked (hash (buff 32)))
    (match (map-get? hashes hash)
        hash-data (get revoked hash-data)
        false
    )
)

;; Verify if a principal is the owner of a specific hash
;; Returns: true if user is the owner, false otherwise
(define-read-only (is-hash-owner (hash (buff 32)) (user principal))
    (match (map-get? hashes hash)
        hash-data (is-eq (get owner hash-data) user)
        false
    )
)

;; ============================================================
;; READ-ONLY FUNCTIONS - Contract State
;; ============================================================

;; Get total number of hashes stored in the registry
(define-read-only (get-hash-count)
    (var-get hash-counter)
)

;; Get total fees collected by the contract since deployment
(define-read-only (get-total-fees)
    (var-get total-fees-collected)
)

;; Get current fee for storing a single hash
(define-read-only (get-hash-fee)
    HASH-FEE
)

;; Get discounted fee per hash for batch operations
(define-read-only (get-batch-hash-fee)
    BATCH-HASH-FEE
)

;; Get maximum allowed batch size for batch store operations
(define-read-only (get-max-batch-size)
    MAX-BATCH-SIZE
)

;; Get fee for updating a hash description
(define-read-only (get-update-fee)
    UPDATE-FEE
)

;; ============================================================
;; READ-ONLY FUNCTIONS - User Queries
;; ============================================================

;; Get list of all hash buffers owned by a user
;; Returns: (list 100 (buff 32)) or empty list if none
(define-read-only (get-user-hashes (user principal))
    (default-to (list) (map-get? user-hashes user))
)

;; Get count of hashes stored by a specific user
;; Returns: uint representing number of hashes
(define-read-only (get-user-hash-count (user principal))
    (len (default-to (list) (map-get? user-hashes user)))
)

;; Get hash buffer by its sequential ID
;; Returns: (some (buff 32)) or none if ID doesn't exist
(define-read-only (get-hash-by-id (id uint))
    (map-get? hash-by-id id)
)

;; Get complete hash metadata by sequential ID
;; Returns: (some {owner, description, ...}) or none
(define-read-only (get-hash-info-by-id (id uint))
    (match (map-get? hash-by-id id)
        hash (map-get? hashes hash)
        none
    )
)

;; ============================================================
;; READ-ONLY FUNCTIONS - Contract Info
;; ============================================================

;; Get the contract owner principal (fee recipient)
(define-read-only (get-contract-owner)
    CONTRACT-OWNER
)

;; Check if a principal is the contract owner
;; Returns: true if user is contract deployer, false otherwise
(define-read-only (is-contract-owner (user principal))
    (is-eq user CONTRACT-OWNER)
)

;; Get summary statistics for the contract
;; Returns: {total-hashes, total-fees, fee-per-hash}
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
            (unwrap-panic (as-max-len? (append current-user-hashes hash) MAX-USER-HASHES)))
        
        ;; Increment counter
        (var-set hash-counter new-hash-id)
        
        new-hash-id
    )
)

;; Public functions

;; @desc Store a SHA-256 hash on-chain with a custom description
;; @param hash 32-byte buffer representing the document fingerprint
;; @param description human-readable title for the hash
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

;; @desc Store multiple hashes in one transaction with a discounted fee
;; @param hash-list list of up to 10 hash/description tuples
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

;; @desc Revoke an existing hash, marking it as invalid for verification
;; @param hash the 32-byte buffer to revoke
(define-public (revoke-hash (hash (buff 32)))
    (let
        (
            (hash-data (unwrap! (map-get? hashes hash) ERR-HASH-NOT-FOUND))
        )
        ;; Only the owner can revoke
        (asserts! (is-eq tx-sender (get owner hash-data)) ERR-NOT-HASH-OWNER)
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
        (asserts! (is-eq tx-sender (get owner hash-data)) ERR-NOT-HASH-OWNER)
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
        (asserts! (is-eq tx-sender (get owner hash-data)) ERR-NOT-HASH-OWNER)
        ;; Cannot transfer to self
        (asserts! (not (is-eq tx-sender new-owner)) ERR-TRANSFER-TO-SELF)
        
        ;; Update ownership
        (map-set hashes hash (merge hash-data { owner: new-owner }))
        (ok true)
    )
)
