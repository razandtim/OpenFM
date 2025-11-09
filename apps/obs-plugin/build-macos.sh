#!/bin/bash
# OpenFM OBS Plugin - macOS Build Script

set -e

BUILD_TYPE="${1:-Release}"
INSTALL_FLAG="${2:-}"

echo "========================================"
echo "OpenFM OBS Plugin - Build Script (macOS)"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

# Check CMake
if ! command -v cmake &> /dev/null; then
    echo -e "${RED}❌ CMake not found! Install with: brew install cmake${NC}"
    exit 1
fi
CMAKE_VERSION=$(cmake --version | head -n1 | awk '{print $3}')
echo -e "${GREEN}✅ CMake $CMAKE_VERSION found${NC}"

# Check Qt6
if [ -z "$Qt6_DIR" ]; then
    # Try default Homebrew location
    if [ -d "/opt/homebrew/opt/qt@6" ]; then
        export Qt6_DIR="/opt/homebrew/opt/qt@6"
    elif [ -d "/usr/local/opt/qt@6" ]; then
        export Qt6_DIR="/usr/local/opt/qt@6"
    else
        echo -e "${RED}❌ Qt6 not found! Install with: brew install qt@6${NC}"
        echo -e "${YELLOW}Or set Qt6_DIR environment variable${NC}"
        exit 1
    fi
fi

if [ ! -d "$Qt6_DIR" ]; then
    echo -e "${RED}❌ Qt6 directory not found: $Qt6_DIR${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Qt6 found at: $Qt6_DIR${NC}"

# Check OBS Source
if [ -z "$OBS_SOURCE_DIR" ]; then
    # Try default location
    if [ -d "$HOME/obs-studio" ]; then
        export OBS_SOURCE_DIR="$HOME/obs-studio"
    else
        echo -e "${RED}❌ OBS_SOURCE_DIR not set!${NC}"
        echo -e "${YELLOW}Clone OBS: git clone --recursive https://github.com/obsproject/obs-studio.git ~/obs-studio${NC}"
        echo -e "${YELLOW}Or set: export OBS_SOURCE_DIR=~/obs-studio${NC}"
        exit 1
    fi
fi

if [ ! -d "$OBS_SOURCE_DIR" ]; then
    echo -e "${RED}❌ OBS source directory not found: $OBS_SOURCE_DIR${NC}"
    exit 1
fi
echo -e "${GREEN}✅ OBS source found at: $OBS_SOURCE_DIR${NC}"

echo ""

# Create build directory
echo -e "${YELLOW}Configuring CMake...${NC}"
mkdir -p build
cd build

# Configure
cmake .. \
    -DQt6_DIR="$Qt6_DIR/lib/cmake/Qt6" \
    -DCMAKE_PREFIX_PATH="$Qt6_DIR" \
    -DOBS_SOURCE_DIR="$OBS_SOURCE_DIR" \
    -DCMAKE_BUILD_TYPE="$BUILD_TYPE"

echo -e "${GREEN}✅ CMake configured successfully${NC}"
echo ""

# Build
echo -e "${YELLOW}Building plugin ($BUILD_TYPE)...${NC}"
cmake --build . --config "$BUILD_TYPE"

echo -e "${GREEN}✅ Build completed successfully${NC}"
echo ""

# Install if requested
if [ "$INSTALL_FLAG" = "--install" ]; then
    echo -e "${YELLOW}Installing plugin to OBS...${NC}"
    
    OBS_PLUGIN_DIR="/Applications/OBS.app/Contents/PlugIns"
    PLUGIN_SO="openfm-obs.so"
    
    if [ ! -f "$PLUGIN_SO" ]; then
        echo -e "${RED}❌ Plugin not found: $PLUGIN_SO${NC}"
        exit 1
    fi
    
    if [ ! -d "$OBS_PLUGIN_DIR" ]; then
        echo -e "${RED}❌ OBS not found at: $OBS_PLUGIN_DIR${NC}"
        echo -e "${YELLOW}Is OBS Studio installed?${NC}"
        exit 1
    fi
    
    sudo cp "$PLUGIN_SO" "$OBS_PLUGIN_DIR/"
    echo -e "${GREEN}✅ Plugin installed to: $OBS_PLUGIN_DIR${NC}"
    echo ""
fi

# Summary
echo "========================================"
echo "Build Summary"
echo "========================================"
echo "Build Type: $BUILD_TYPE"
echo "Plugin: build/openfm-obs.so"

if [ "$INSTALL_FLAG" = "--install" ]; then
    echo -e "${GREEN}Status: Installed to OBS${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Launch OBS Studio"
    echo "2. Go to View → Docks → OpenFM"
    echo "3. Make sure OpenFM service is running on port 6767"
else
    echo -e "${YELLOW}Status: Built (not installed)${NC}"
    echo ""
    echo "To install, run:"
    echo "  ./build-macos.sh Release --install"
fi

echo ""
echo "========================================"

