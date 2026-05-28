# Readonly refresh throttle

Throttle readonly refresh controls enough to protect RPC limits while preserving
a manual retry path during indexer lag.

Follow-up note: Recheck throttle duration after changing RPC provider limits.
