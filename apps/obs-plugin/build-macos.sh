#!/bin/bash
# Build script for OpenFM OBS Plugin on macOS

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

OBS_PATH=""
QT_PATH=""
INSTALL=false
CLEAN=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --obs-path)
            OBS_PATH="$2"
            shift 2
            ;;
        --qt-path)
            QT_PATH="$2"
            shift 2
            ;;
        --install)
            INSTALL=true
            shift
            ;;
        --clean)
            CLEAN=true
            shift
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

echo -e "${CYAN}🎬 OpenFM OBS Plugin Build Script (macOS)${NC}"
echo -e "${CYAN}===========================================${NC}\n"

# Detect OBS installation
if [ -z "$OBS_PATH" ]; then
    POSSIBLE_PATHS=(
        "/Applications/OBS.app"
        "$HOME/Applications/OBS.app"
    )
    
    for path in "${POSSIBLE_PATHS[@]}"; do
        if [ -d "$path" ]; then
            OBS_PATH="$path"
            echo -e "${GREEN}✓ Found OBS Studio at: $OBS_PATH${NC}"
            break
        fi
    done
    
    if [ -z "$OBS_PATH" ]; then
        echo -e "${RED}✗ OBS Studio not found. Please install OBS or specify path with --obs-path${NC}"
        exit 1
    fi
fi

# Detect Qt installation
if [ -z "$QT_PATH" ]; then
    QT_PATHS=(
        "$HOME/Qt/6.7.0/macos"
        "$HOME/Qt/6.6.0/macos"
        "$HOME/Qt/6.5.0/macos"
        "/usr/local/opt/qt@6"
        "/opt/homebrew/opt/qt@6"
    )
    
    for path in "${QT_PATHS[@]}"; do
        if [ -d "$path" ]; then
            QT_PATH="$path"
            echo -e "${GREEN}✓ Found Qt at: $QT_PATH${NC}"
            break
        fi
    done
    
    if [ -z "$QT_PATH" ]; then
        echo -e "${YELLOW}⚠ Qt not found. Checking Homebrew...${NC}"
        if command -v brew &> /dev/null; then
            QT_PATH=$(brew --prefix qt@6 2>/dev/null || true)
            if [ -n "$QT_PATH" ]; then
                echo -e "${GREEN}✓ Found Qt via Homebrew at: $QT_PATH${NC}"
            else
                echo -e "${RED}✗ Qt not found. Install with: brew install qt@6${NC}"
                exit 1
            fi
        else
            echo -e "${RED}✗ Qt not found and Homebrew not available${NC}"
            echo -e "${YELLOW}  Install Qt from: https://www.qt.io/download-qt-installer${NC}"
            echo -e "${YELLOW}  Or install Homebrew and run: brew install qt@6${NC}"
            exit 1
        fi
    fi
fi

# Clean build directory
if [ "$CLEAN" = true ] && [ -d "build" ]; then
    echo -e "\n${YELLOW}🧹 Cleaning build directory...${NC}"
    rm -rf build
fi

# Create build directory
echo -e "\n${CYAN}📁 Creating build directory...${NC}"
mkdir -p build
cd build

# Configure with CMake
echo -e "\n${CYAN}⚙️  Configuring with CMake...${NC}"
cmake -G "Unix Makefiles" \
    -DCMAKE_BUILD_TYPE=Release \
    -DOBS_DIR="$OBS_PATH/Contents" \
    -DQt6_DIR="$QT_PATH/lib/cmake/Qt6" \
    -DCMAKE_OSX_ARCHITECTURES="x86_64;arm64" \
    ..

# Build
echo -e "\n${CYAN}🔨 Building plugin...${NC}"
cmake --build . --config Release

echo -e "\n${GREEN}✓ Build completed successfully!${NC}"

# Install
if [ "$INSTALL" = true ]; then
    echo -e "\n${CYAN}📦 Installing plugin...${NC}"
    
    PLUGIN_DEST="$HOME/Library/Application Support/obs-studio/obs-plugins"
    DATA_DEST="$HOME/Library/Application Support/obs-studio/data/obs-plugins/openfm"
    
    # Create directories
    mkdir -p "$PLUGIN_DEST"
    mkdir -p "$DATA_DEST"
    
    # Copy plugin bundle
    if [ -d "openfm.so" ]; then
        cp -r openfm.so "$PLUGIN_DEST/"
        echo -e "  ${GREEN}✓ Copied openfm.so to $PLUGIN_DEST${NC}"
    elif [ -f "libopenfm.dylib" ]; then
        cp libopenfm.dylib "$PLUGIN_DEST/openfm.so"
        echo -e "  ${GREEN}✓ Copied libopenfm.dylib to $PLUGIN_DEST/openfm.so${NC}"
    fi
    
    # Copy data files if they exist
    if [ -d "../data" ]; then
        cp -r ../data/* "$DATA_DEST/"
        echo -e "  ${GREEN}✓ Copied data files to $DATA_DEST${NC}"
    fi
    
    echo -e "\n${GREEN}✓ Plugin installed successfully!${NC}"
    echo -e "  ${YELLOW}Restart OBS Studio to load the plugin${NC}"
fi

# Return to original directory
cd ..

echo -e "\n${GREEN}🎉 All done!${NC}"
echo -e "\n${CYAN}Build location: $(pwd)/build/openfm.so${NC}"

if [ "$INSTALL" = false ]; then
    echo -e "\n${YELLOW}To install the plugin, run:${NC}"
    echo -e "  ${NC}./build-macos.sh --install${NC}"
fi
