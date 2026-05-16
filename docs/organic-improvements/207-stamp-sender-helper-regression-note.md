# Stamp sender helper regression note

Contract review should verify each read-only helper is defined exactly once.

Duplicate helper names can pass code review visually but fail during Clarinet interpretation.

Include `get-stamp-sender` in focused regression checks when stamp lookup helpers change.
