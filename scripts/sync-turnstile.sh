#!/bin/bash
# Syncs the Turnstile client library from the local sibling project to the vendor directory.
# Usage: ./scripts/sync-turnstile.sh

SOURCE_DIR="../turnstile/packages/client/src"
TARGET_DIR="vendor/turnstile/client"

if [ ! -d "$SOURCE_DIR" ]; then
  echo "Notice: Source directory $SOURCE_DIR not found. Skipping sync (this is expected in CI/CD)."
  exit 0
fi

echo "Syncing Turnstile client from $SOURCE_DIR to $TARGET_DIR..."

# Ensure target directory exists
mkdir -p "$TARGET_DIR"

# Use rsync for idempotent sync:
# -a: archive mode (preserves permissions, times, etc.)
# -v: verbose
# --delete: remove files in target that are not in source
# --exclude: exclude unwanted files (optional, but good practice)
rsync -av --delete "$SOURCE_DIR/" "$TARGET_DIR/"

echo "Sync completed. Running formatter on vendored files..."
bun biome check --write "$TARGET_DIR"

echo "Done."
