# Hash transfer duplicate check note

When ownership transfer code is edited, confirm `transfer-hash` has a single public entry point.

Keep the owner check, self-transfer guard, and metadata update together in that one function.

This reduces the chance of duplicate definitions drifting during contract documentation edits.
