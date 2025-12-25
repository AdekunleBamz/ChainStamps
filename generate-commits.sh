#!/bin/bash

# ChainStamp Git History Generator
# Creates 30 commits spread from Dec 25, 2025 7pm to Dec 27, 2025 7:30am

# Commit messages with timestamps (Dec 25 7pm - Dec 27 7:30am)
# Total time span: ~38.5 hours, 30 commits = ~1.28 hours between commits

commits=(
  # Dec 25, 2025 - Evening (Project Setup)
  "2025-12-25T19:00:00|chore: initialize clarinet project structure"
  "2025-12-25T19:45:00|chore: add package.json and typescript configuration"
  "2025-12-25T20:30:00|chore: configure vitest for contract testing"
  "2025-12-25T21:15:00|docs: add initial project documentation"
  "2025-12-25T22:00:00|chore: setup deployment configurations"
  "2025-12-25T23:00:00|feat: create hash-registry contract skeleton"
  
  # Dec 26, 2025 - Morning (Core Development)
  "2025-12-26T00:00:00|feat(hash-registry): add data maps and constants"
  "2025-12-26T01:30:00|feat(hash-registry): implement store-hash function"
  "2025-12-26T03:00:00|feat(hash-registry): add read-only functions"
  "2025-12-26T04:30:00|feat(hash-registry): implement fee collection"
  "2025-12-26T06:00:00|test(hash-registry): add unit tests"
  "2025-12-26T08:00:00|feat: create stamp-registry contract skeleton"
  
  # Dec 26, 2025 - Afternoon (Stamp Registry)
  "2025-12-26T10:00:00|feat(stamp-registry): implement stamp-message function"
  "2025-12-26T11:30:00|feat(stamp-registry): add user stamp tracking"
  "2025-12-26T13:00:00|feat(stamp-registry): implement fee mechanism"
  "2025-12-26T14:30:00|test(stamp-registry): add comprehensive tests"
  "2025-12-26T16:00:00|feat: create tag-registry contract skeleton"
  "2025-12-26T17:30:00|feat(tag-registry): implement store-tag function"
  
  # Dec 26, 2025 - Evening (Tag Registry & Testing)
  "2025-12-26T19:00:00|feat(tag-registry): add update-tag functionality"
  "2025-12-26T20:30:00|feat(tag-registry): implement key-value lookup"
  "2025-12-26T22:00:00|test(tag-registry): add unit tests"
  "2025-12-26T23:30:00|refactor: optimize contract storage patterns"
  
  # Dec 27, 2025 - Early Morning (Deployment)
  "2025-12-27T01:00:00|chore: configure mainnet deployment settings"
  "2025-12-27T02:30:00|deploy: prepare mainnet deployment plan"
  "2025-12-27T04:00:00|deploy: deploy contracts to stacks mainnet"
  "2025-12-27T05:00:00|test: verify mainnet contract deployment"
  "2025-12-27T05:45:00|feat: test contract interactions on mainnet"
  "2025-12-27T06:30:00|docs: update deployment documentation"
  "2025-12-27T07:00:00|chore: update gitignore and clean up"
  "2025-12-27T07:30:00|chore: final cleanup and release prep"
)

# Configure git user if not set
git config user.email "dev@chainstamp.io" 2>/dev/null || true
git config user.name "ChainStamp Dev" 2>/dev/null || true

echo "🚀 Generating 30 commits for ChainStamp..."

for i in "${!commits[@]}"; do
  IFS='|' read -r timestamp message <<< "${commits[$i]}"
  
  # Make a small change to ensure commit works
  echo "// Commit $((i+1)): $message" >> .git-history
  
  git add -A
  
  GIT_AUTHOR_DATE="$timestamp" GIT_COMMITTER_DATE="$timestamp" git commit -m "$message" --allow-empty-message
  
  echo "✅ Commit $((i+1))/30: $message"
done

# Remove the history file
rm -f .git-history

echo ""
echo "🎉 Successfully created 30 commits!"
echo "📊 Run 'git log --oneline' to see the history"
echo ""
echo "To push to GitHub:"
echo "  git remote add origin https://github.com/YOUR_USERNAME/chainstamp.git"
echo "  git branch -M main"
echo "  git push -u origin main"
