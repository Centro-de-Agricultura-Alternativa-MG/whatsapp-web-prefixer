#!/usr/bin/env bash
set -e

TARGET="$1"

if [[ "$TARGET" != "chrome" && "$TARGET" != "firefox" ]]; then
  echo "Usage: ./build.sh [chrome|firefox]"
  exit 1
fi

ROOT_DIR="$(pwd)"
BUILD_DIR="$ROOT_DIR/build/$TARGET"
UNPACKED_DIR="$BUILD_DIR/unpacked"
PACKED_DIR="$BUILD_DIR/packed"

EXT_NAME="my-extension-firefox.xpi"

# Clean output
rm -rf "$BUILD_DIR"
mkdir -p "$UNPACKED_DIR"

echo "Building extension for: $TARGET"

# -----------------------------
# Manifest
# -----------------------------
cp "$ROOT_DIR/src/templates/manifest.$TARGET.json" \
   "$UNPACKED_DIR/manifest.json"

# -----------------------------
# content.js
# backend/classes/* + backend/*
# (EXCLUDING background.js)
# -----------------------------
cat \
  src/backend/classes/*.js \
  $(ls src/backend/*.js | grep -v 'background.js') \
  > "$UNPACKED_DIR/content.js"

echo "✔ content.js built (background.js excluded)"

# -----------------------------
# background.js (separate)
# BrowserStorage + background.js
# -----------------------------
cat \
  src/backend/classes/BrowserStorage.js \
  src/backend/background.js \
  > "$UNPACKED_DIR/background.js"


echo "✔ background.js copied separately"

# -----------------------------
# popup.js
# BrowserStorage + popup.js
# -----------------------------
cat \
  src/backend/classes/BrowserStorage.js \
  src/frontend/popup.js \
  > "$UNPACKED_DIR/popup.js"

echo "✔ popup.js built"

# -----------------------------
# Frontend assets
# -----------------------------
cp src/frontend/popup.html "$UNPACKED_DIR/popup.html"
cp src/frontend/popup.css "$UNPACKED_DIR/popup.css"

echo "✔ popup assets copied"

# -----------------------------
# Firefox packed (.xpi)
# -----------------------------
if [[ "$TARGET" == "firefox" ]]; then
  mkdir -p "$PACKED_DIR"

  (
    cd "$UNPACKED_DIR"
    zip -r "$PACKED_DIR/$EXT_NAME" .
  )

  echo "✔ Firefox XPI built → $PACKED_DIR/$EXT_NAME"
fi

echo "Build complete → $BUILD_DIR"
