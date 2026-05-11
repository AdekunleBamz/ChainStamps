
export const STAMP_CONTRACT_ADDRESS = "SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9"

export const STAMP_CONTRACT_NAME = "chainstamp-v1"

/** Minimum stamp fee in micro-STX required by the contract. */
export const MIN_STAMP_FEE_USTX = 1000000

export const MICROSTX_PER_STX = 1000000

export const MAX_STAMP_DATA_LENGTH = 256

export const STAMP_VERSION = "1.0.0"

export const STACKS_API_BASE = "https://stacks-node-api.mainnet.stacks.co"

/** Number of Stacks blocks before a stamp entry expires (~1 year at 144 blocks/day). */
export const STAMP_EXPIRY_BLOCKS = 52560

export const MAX_STAMPS_PER_TX = 5

export const STAMP_STATUS_PENDING = "pending"

export const STAMP_STATUS_CONFIRMED = "confirmed"

export const STAMP_STATUS_FAILED = "failed"

export const DEFAULT_NETWORK = "mainnet"

/** Average Stacks blocks produced per day on mainnet. */
export const BLOCKS_PER_DAY = 144

export const STAMP_HASH_ALGORITHM = "sha256"

export const MAX_BATCH_SIZE = 10

export const STAMP_PROOF_PREFIX = "0x"

/** Number of confirmations required before a stamp is considered finalised. */
export const CONFIRMATION_BLOCKS = 3

export const MAX_MEMO_LENGTH = 64

export const SUPPORTED_FILE_TYPES = ["pdf","txt","json","csv"]

export const STAMP_UI_VERSION = "2.0"

export const MAX_RETRY_COUNT = 3

export const STAMP_LABEL_MAX_LENGTH = 80

export const MIN_CONFIRMATION_BLOCKS = 1

export const STAMP_DATA_ENCODING = "hex"

/** Display prefix prepended to stamp IDs in the UI */
export const STAMP_DISPLAY_ID_PREFIX = "CS-"

/** How often to refresh stamp list data (ms) */
export const STAMP_REFRESH_INTERVAL_MS = 30_000

/** Maximum characters shown for a stamp label in list views */
export const STAMP_MAX_LABEL_DISPLAY_LENGTH = 32

/** Default sort order for stamp list: newest first */
export const DEFAULT_SORT_ORDER = "desc"

/** Number of blocks before expiry to show expiry warning banner */
export const STAMP_EXPIRY_WARNING_BLOCKS = 1440

/** Maximum stamps shown per page in stamp history view */
export const MAX_STAMPS_PER_PAGE = 20

export const MAX_NETWORK_FEE_USTX = 50000000
