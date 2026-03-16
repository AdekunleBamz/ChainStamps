;; title: stamp-registry
;; version: 1.2.1
;; summary: Store short messages on-chain for a small fee
;; description: ChainStamp - Pay 0.05 STX to permanently stamp a message on the Stacks blockchain
;; author: Adekunle Bamz (@AdekunleBamz)
;; license: MIT

;; ============================================================
;; CONSTANTS - Error Codes
;; ============================================================
;; Contract owner principal for fee collection
(define-constant CONTRACT-OWNER tx-sender)

;; Error: Caller is not authorized to perform this action (u100)
(define-constant ERR-NOT-AUTHORIZED (err u100))
;; Error: Message exceeds maximum allowed length of 256 UTF-8 bytes (u101)
(define-constant ERR-MESSAGE-TOO-LONG (err u101))
;; Error: Insufficient STX payment provided for stamping (u102)
(define-constant ERR-INSUFFICIENT-PAYMENT (err u102))
;; Error: Stamp ID not found in the registry (u103)
(define-constant ERR-STAMP-NOT-FOUND (err u103))
;; Error: Stamp has already been revoked by sender (u104)
(define-constant ERR-STAMP-ALREADY-REVOKED (err u104))
;; Error: Invalid category code provided (u105)
(define-constant ERR-INVALID-CATEGORY (err u105))

;; ============================================================
;; CONSTANTS - Fee Structure and Limits
;; ============================================================
;; Fee for stamping a message (0.05 STX = 50000 microSTX)
(define-constant STAMP-FEE u50000)
;; Maximum message length in UTF-8 bytes
(define-constant MAX-MESSAGE-LENGTH u256)
;; Maximum length for category names (reserved for future use)
(define-constant MAX-CATEGORY-LENGTH u32)
(define-constant MAX-USER-STAMPS u100)

;; ============================================================
;; CONSTANTS - Message Categories
;; ============================================================
;; General messages - default category for uncategorized stamps
(define-constant CATEGORY-GENERAL u0)
;; Announcements - official project or product announcements
(define-constant CATEGORY-ANNOUNCEMENT u1)
;; Milestones - significant achievements or version releases
(define-constant CATEGORY-MILESTONE u2)
;; Legal - legal notices, disclaimers, or terms
(define-constant CATEGORY-LEGAL u3)
;; Personal - personal messages or notes
(define-constant CATEGORY-PERSONAL u4)

;; ============================================================
;; DATA VARIABLES
;; ============================================================
;; Counter for total stamps created (used for ID generation)
(define-data-var stamp-counter uint u0)
;; Accumulated total of all fees collected by the contract
(define-data-var total-fees-collected uint u0)

;; ============================================================
;; DATA MAPS
;; ============================================================
;; Primary storage: Maps stamp ID to message metadata
;; - sender: Principal who created the stamp
;; - message: The stamped message content (max 256 UTF-8 bytes)
;; - category: Numeric category code for classification
;; - timestamp: Block timestamp when stamp was created
;; - block-height: Block height when stamp was created
;; - revoked: Whether this stamp has been revoked by sender
(define-map stamps uint {
    sender: principal,
    message: (string-utf8 256),
    category: uint,
    timestamp: uint,
    block-height: uint,
    revoked: bool
})

;; Index: Maps user principal to list of their stamp IDs
;; Enables efficient lookup of all stamps created by a user
(define-map user-stamps principal (list 100 uint))

;; Index: Maps category code to list of stamp IDs in that category
;; Enables browsing stamps by category classification
(define-map category-stamps uint (list 100 uint))

;; ============================================================
;; READ-ONLY FUNCTIONS - Stamp Lookup
;; ============================================================

;; Retrieve complete metadata for a stamp by its ID
;; Returns: (some {sender, message, category, timestamp, block-height, revoked}) or none
(define-read-only (get-stamp (stamp-id uint))
    (map-get? stamps stamp-id)
)

;; Get the message content of a stamp if it exists
;; Returns: (some string-utf8) or none
(define-read-only (get-stamp-message (stamp-id uint))
    (match (map-get? stamps stamp-id)
        stamp-data (some (get message stamp-data))
        none
    )
)

;; Get the block timestamp when a stamp was created
;; Returns: (some uint) or none
(define-read-only (get-stamp-timestamp (stamp-id uint))
    (match (map-get? stamps stamp-id)
        stamp-data (some (get timestamp stamp-data))
        none
    )
)

;; Get the block height when a stamp was created
;; Returns: (some uint) or none
(define-read-only (get-stamp-block-height (stamp-id uint))
    (match (map-get? stamps stamp-id)
        stamp-data (some (get block-height stamp-data))
        none
    )
)

;; Get the sender principal of a stamp if it exists
;; Returns: (some principal) or none
(define-read-only (get-stamp-sender (stamp-id uint))
    (match (map-get? stamps stamp-id)
        stamp-data (some (get sender stamp-data))
        none
    )
)

;; Verify if a principal is the sender of a specific stamp
;; Returns: true if user is the sender, false otherwise
(define-read-only (is-stamp-sender (stamp-id uint) (user principal))
    (match (map-get? stamps stamp-id)
        stamp-data (is-eq (get sender stamp-data) user)
        false
    )
)

;; Get sender of a stamp if it exists
(define-read-only (get-stamp-sender (stamp-id uint))
    (match (map-get? stamps stamp-id)
        stamp-data (some (get sender stamp-data))
        none
    )
)

(define-read-only (is-stamp-valid (stamp-id uint))
    (match (map-get? stamps stamp-id)
        stamp-data (not (get revoked stamp-data))
        false
    )
)

;; Check if a stamp has been explicitly revoked by its sender
;; Returns: true if revoked, false if valid or non-existent
(define-read-only (is-stamp-revoked (stamp-id uint))
    (match (map-get? stamps stamp-id)
        stamp-data (get revoked stamp-data)
        false
    )
)

;; ============================================================
;; READ-ONLY FUNCTIONS - Contract State
;; ============================================================

;; Get total number of stamps created in the registry
(define-read-only (get-stamp-count)
    (var-get stamp-counter)
)

;; Get total fees collected by the contract since deployment
(define-read-only (get-total-fees)
    (var-get total-fees-collected)
)

;; Get current fee for stamping a message
(define-read-only (get-stamp-fee)
    STAMP-FEE
)

;; ============================================================
;; READ-ONLY FUNCTIONS - User Queries
;; ============================================================

;; Get list of all stamp IDs created by a user
;; Returns: (list 100 uint) or empty list if none
(define-read-only (get-user-stamps (user principal))
    (default-to (list) (map-get? user-stamps user))
)

;; Get count of stamps created by a specific user
;; Returns: uint representing number of stamps
(define-read-only (get-user-stamp-count (user principal))
    (len (default-to (list) (map-get? user-stamps user)))
)

;; Get list of stamp IDs in a specific category
;; Returns: (list 100 uint) or empty list if none
(define-read-only (get-stamps-by-category (category uint))
    (default-to (list) (map-get? category-stamps category))
)

;; Check if a category code is valid (0-4)
;; Returns: true if category is between 0 and CATEGORY-PERSONAL
(define-read-only (is-valid-category (category uint))
    (<= category CATEGORY-PERSONAL)
)

;; ============================================================
;; READ-ONLY FUNCTIONS - Contract Info
;; ============================================================

;; Get the contract owner principal (fee recipient)
(define-read-only (get-contract-owner)
    CONTRACT-OWNER
)

;; Get summary statistics for the contract
;; Returns: {total-stamps, total-fees, fee-per-stamp}
(define-read-only (get-stats)
    {
        total-stamps: (var-get stamp-counter),
        total-fees: (var-get total-fees-collected),
        fee-per-stamp: STAMP-FEE
    }
)

;; ============================================================
;; READ-ONLY FUNCTIONS - Batch Operations
;; ============================================================

;; Get multiple stamps by their IDs in a single call
;; Returns: list of stamp metadata (some may be none if ID doesn't exist)
(define-read-only (batch-get-stamps (stamp-ids (list 10 uint)))
    (map get-stamp stamp-ids)
)

;; ============================================================
;; PUBLIC FUNCTIONS - Stamp Operations
;; ============================================================

;; @desc Stamp a message on-chain with the default category
;; @param message the UTF-8 string to record on the blockchain
(define-public (stamp-message (message (string-utf8 256)))
    (stamp-message-with-category message CATEGORY-GENERAL)
)

;; @desc Stamp a message on-chain with a specified category code
;; @param message the UTF-8 string to record
;; @param category numeric code for the message classification
(define-public (stamp-message-with-category (message (string-utf8 256)) (category uint))
    (let
        (
            (new-stamp-id (+ (var-get stamp-counter) u1))
            (current-user-stamps (default-to (list) (map-get? user-stamps tx-sender)))
            (current-category-stamps (default-to (list) (map-get? category-stamps category)))
        )
        ;; Validate message length
        (asserts! (<= (len message) MAX-MESSAGE-LENGTH) ERR-MESSAGE-TOO-LONG)
        ;; Validate category is within allowed range
        (asserts! (is-valid-category category) ERR-INVALID-CATEGORY)
        
        ;; Transfer fee to contract owner
        (try! (stx-transfer? STAMP-FEE tx-sender CONTRACT-OWNER))
        
        ;; Store the stamp metadata
        (map-set stamps new-stamp-id {
            sender: tx-sender,
            message: message,
            category: category,
            timestamp: (unwrap-panic (get-stacks-block-info? time (- stacks-block-height u1))),
            block-height: stacks-block-height,
            revoked: false
        })
        
        ;; Update user's stamp list
        (map-set user-stamps tx-sender 
            (unwrap-panic (as-max-len? (append current-user-stamps new-stamp-id) MAX-USER-STAMPS)))
        
        ;; Update category's stamp list
        (map-set category-stamps category
            (unwrap-panic (as-max-len? (append current-category-stamps new-stamp-id) MAX-USER-STAMPS)))
        
        ;; Increment counter and update fees
        (var-set stamp-counter new-stamp-id)
        (var-set total-fees-collected (+ (var-get total-fees-collected) STAMP-FEE))
        
        ;; Return the new stamp ID
        (ok new-stamp-id)
    )
)

;; @desc Revoke a previously created stamp (sender only)
;; @param stamp-id the unique numeric ID of the stamp to revoke
(define-public (revoke-stamp (stamp-id uint))
    (let
        (
            (stamp-data (unwrap! (map-get? stamps stamp-id) ERR-STAMP-NOT-FOUND))
        )
        ;; Verify caller is the sender
        (asserts! (is-eq tx-sender (get sender stamp-data)) ERR-NOT-AUTHORIZED)
        ;; Ensure stamp hasn't been revoked already
        (asserts! (not (get revoked stamp-data)) ERR-STAMP-ALREADY-REVOKED)
        
        ;; Mark stamp as revoked
        (map-set stamps stamp-id (merge stamp-data { revoked: true }))
        
        (ok true)
    )
)

;; ============================================================
;; PUBLIC FUNCTIONS - Admin
;; ============================================================

;; Verify the caller is the contract owner
;; Used for administrative access control
;; Note: Fees go directly to owner, no withdrawal needed
(define-public (verify-owner)
    (begin
        (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
        (ok true)
    )
)

;; ============================================================
;; PUBLIC FUNCTIONS - Batch Operations
;; ============================================================

;; Stamp multiple messages at once in a single transaction
;; Each message is stamped with the default GENERAL category
;; Returns: list of stamp IDs for all successfully stamped messages
;; @param messages list of up to 5 UTF-8 strings to record
(define-public (batch-stamp-messages (messages (list 5 (string-utf8 256))))
    (let
        (
            (results (map stamp-message messages))
        )
        (ok results)
    )
)
