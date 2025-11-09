#!/bin/bash
# OpenFM macOS Installer Build Script

set -e

VERSION="0.1.0"
PRODUCT_NAME="OpenFM"
OUTPUT_DIR="$(pwd)/dist"
BUILD_DIR="$(pwd)/build"

echo "Building OpenFM macOS installer v${VERSION}..."

# Clean
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"
mkdir -p "$OUTPUT_DIR"

# Create directory structure
mkdir -p "$BUILD_DIR/Applications/$PRODUCT_NAME.app"
mkdir -p "$BUILD_DIR/Library/Application Support/obs-studio/plugins"

# Copy desktop app
cp -r ../../apps/desktop/src-tauri/target/release/bundle/macos/*.app/* "$BUILD_DIR/Applications/$PRODUCT_NAME.app/"

# Copy OBS plugin
cp -r ../../apps/obs-plugin/build/openfm.so "$BUILD_DIR/Library/Application Support/obs-studio/plugins/"

# Copy service
mkdir -p "$BUILD_DIR/Applications/$PRODUCT_NAME.app/Contents/Resources/service"
cp -r ../../apps/service/dist/* "$BUILD_DIR/Applications/$PRODUCT_NAME.app/Contents/Resources/service/"

# Build pkg
pkgbuild \
  --root "$BUILD_DIR" \
  --identifier "com.openfm.desktop" \
  --version "$VERSION" \
  --install-location "/" \
  "$OUTPUT_DIR/OpenFM-macOS.pkg"

echo "✓ Installer created: $OUTPUT_DIR/OpenFM-macOS.pkg"

# Sign (if certificate available)
if [ -n "$SIGNING_IDENTITY" ]; then
  echo "Signing installer..."
  productsign \
    --sign "$SIGNING_IDENTITY" \
    "$OUTPUT_DIR/OpenFM-macOS.pkg" \
    "$OUTPUT_DIR/OpenFM-macOS-signed.pkg"
  mv "$OUTPUT_DIR/OpenFM-macOS-signed.pkg" "$OUTPUT_DIR/OpenFM-macOS.pkg"
  echo "✓ Installer signed"
fi

echo "✓ Build complete!"

