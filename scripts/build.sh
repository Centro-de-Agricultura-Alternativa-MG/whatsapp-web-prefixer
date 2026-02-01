#!/usr/bin/env bash
set -e

TARGET="$1"

if [[ "$TARGET" != "chrome" && "$TARGET" != "firefox" ]]; then
  echo "Usage: ./build.sh [chrome|firefox]"
  exit 1
fi

ROOT_DIR="$(pwd)"
DIST_DIR="$ROOT_DIR/build/$TARGET"

# Clean output
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

echo "Building extension for: $TARGET"

# -----------------------------
# Manifest
# -----------------------------
cp "$ROOT_DIR/src/templates/manifest.$TARGET.json" "$DIST_DIR/manifest.json"

# -----------------------------
# content.js
# backend/classes/* + backend/*
# -----------------------------
cat \
  src/backend/classes/*.js \
  src/backend/*.js \
  > "$DIST_DIR/content.js"

echo "✔ content.js built"

# -----------------------------
# popup.js
# BrowserStorage + popup.js
# -----------------------------
cat \
  src/backend/classes/BrowserStorage.js \
  src/frontend/popup.js \
  > "$DIST_DIR/popup.js"

echo "✔ popup.js built"

# -----------------------------
# Frontend assets
# -----------------------------
cp src/frontend/popup.html "$DIST_DIR/popup.html"
cp src/frontend/popup.css "$DIST_DIR/popup.css"

echo "✔ popup assets copied"

echo "Build complete → $DIST_DIR"
