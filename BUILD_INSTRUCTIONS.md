# 🏗️ Build Instructions

This guide explains how to build all components of OpenFM locally.

## 📋 Prerequisites

### All Platforms
- **Node.js** 20+ ([Download](https://nodejs.org/))
- **pnpm** 8+ (`npm install -g pnpm`)
- **Git** ([Download](https://git-scm.com/))

### Desktop App (Tauri)
- **Rust** 1.70+ ([Install](https://rustup.rs/))

#### Windows
- **Visual Studio 2022** with C++ Build Tools
- **WebView2** (usually pre-installed on Windows 10/11)

#### macOS
- **Xcode Command Line Tools**: `xcode-select --install`

#### Linux
```bash
sudo apt-get update
sudo apt-get install -y libgtk-3-dev libwebkit2gtk-4.0-dev \
    libappindicator3-dev librsvg2-dev patchelf libxdo-dev libssl-dev
```

### OBS Plugin (Optional)
- **CMake** 3.20+ ([Download](https://cmake.org/download/))
- **Qt 6.5+** ([Download](https://www.qt.io/download-qt-installer))
  - Required modules: `qtwebengine`, `qtwebchannel`, `qtpositioning`, `qtwebview`
- **OBS Studio** 31.0+ ([Download](https://obsproject.com/))

#### Windows
- **Visual Studio 2022** with C++ Build Tools

#### macOS
- **Homebrew**: `brew install cmake qt@6`

---

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/yourusername/openfm.git
cd openfm
pnpm install
```

### 2. Build All Packages

```bash
# Build shared packages (core + ui)
pnpm run build --filter @openfm/core --filter @openfm/ui

# Build service
pnpm run build --filter @openfm/service
```

### 3. Run Development Servers

```bash
# Start service only (recommended for most development)
pnpm run dev

# Or start all apps including desktop
pnpm run dev:all
```

---

## 🖥️ Building the Desktop App

### Development
```bash
pnpm run desktop
# OR
pnpm --filter @openfm/desktop run dev
```

### Production Build

#### Windows
```bash
pnpm --filter @openfm/desktop exec tauri build
```

Output:
- `apps/desktop/src-tauri/target/release/bundle/msi/*.msi`
- `apps/desktop/src-tauri/target/release/bundle/nsis/*.exe`

#### macOS
```bash
pnpm --filter @openfm/desktop exec tauri build
```

Output:
- `apps/desktop/src-tauri/target/release/bundle/dmg/*.dmg`
- `apps/desktop/src-tauri/target/release/bundle/macos/*.app`

#### Linux
```bash
pnpm --filter @openfm/desktop exec tauri build
```

Output:
- `apps/desktop/src-tauri/target/release/bundle/deb/*.deb`
- `apps/desktop/src-tauri/target/release/bundle/appimage/*.AppImage`

---

## 🎥 Building the OBS Plugin

### Windows

```powershell
cd apps/obs-plugin

# Build and install
.\build-windows.ps1 -Install

# Or just build
.\build-windows.ps1

# Custom paths
.\build-windows.ps1 -ObsPath "C:\Program Files\obs-studio" -QtPath "C:\Qt\6.7.0\msvc2019_64" -Install

# Clean build
.\build-windows.ps1 -Clean -Install
```

### macOS

```bash
cd apps/obs-plugin

# Build and install
./build-macos.sh --install

# Or just build
./build-macos.sh

# Custom paths
./build-macos.sh --obs-path "/Applications/OBS.app" --qt-path "$HOME/Qt/6.7.0/macos" --install

# Clean build
./build-macos.sh --clean --install
```

### Manual Installation

After building without `-Install` flag:

#### Windows
1. Copy `build/Release/openfm.dll` to:
   ```
   %APPDATA%\obs-studio\obs-plugins\64bit\
   ```
2. Copy `data/*` to:
   ```
   %APPDATA%\obs-studio\data\obs-plugins\openfm\
   ```

#### macOS
1. Copy `build/openfm.so` to:
   ```
   ~/Library/Application Support/obs-studio/obs-plugins/
   ```
2. Copy `data/*` to:
   ```
   ~/Library/Application Support/obs-studio/data/obs-plugins/openfm/
   ```

---

## 📦 Building the Node.js Service

### Development
```bash
pnpm run service
```

### Production
```bash
# Build
pnpm run build --filter @openfm/service

# Run
pnpm run service:prod
```

The service will be available at `http://127.0.0.1:6767`

---

## 🔍 Troubleshooting

### Desktop App

**Error: `tauri: command not found`**
```bash
cargo install tauri-cli
```

**Error: WebView2 not found (Windows)**
- Download from: https://developer.microsoft.com/en-us/microsoft-edge/webview2/

**Build fails on macOS with Xcode errors**
```bash
sudo xcode-select --reset
xcode-select --install
```

### OBS Plugin

**Error: Qt not found**
- Install Qt 6.x from https://www.qt.io/download-qt-installer
- Or on macOS: `brew install qt@6`

**Error: OBS headers not found**
- Install OBS Studio from https://obsproject.com/
- Or specify path: `-ObsPath "C:\path\to\obs"` (Windows) or `--obs-path "/path/to/OBS.app"` (macOS)

**Error: CMake configuration failed**
- Ensure CMake 3.20+ is installed
- Check that Qt6_DIR points to a valid Qt installation
- Verify OBS_DIR points to OBS Studio installation

### Service

**Error: `ERR_MODULE_NOT_FOUND`**
```bash
# Rebuild core package
pnpm run build --filter @openfm/core
```

**Port already in use**
```bash
# Windows
netstat -ano | findstr :6767
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:6767 | xargs kill -9
```

---

## 🎯 Build Tips

### Faster Builds

```bash
# Use Turbo cache
pnpm run build

# Build specific packages only
pnpm run build --filter @openfm/desktop

# Parallel builds
pnpm run build --parallel
```

### Clean Everything

```bash
# Clean all build artifacts
pnpm run clean

# Clean and reinstall
pnpm run clean && pnpm install
```

### Development Workflow

1. **Terminal 1**: Service
   ```bash
   pnpm run service
   ```

2. **Terminal 2**: Desktop App
   ```bash
   pnpm run desktop
   ```

3. Make changes and watch auto-rebuild

---

## 📊 Build Matrix

| Component | Windows | macOS | Linux |
|-----------|---------|-------|-------|
| Service | ✅ | ✅ | ✅ |
| Desktop | ✅ | ✅ | ✅ |
| OBS Plugin | ✅ | ✅ | ❌ |

---

## 🔄 GitHub Actions

All components build automatically on push:
- **Lint**: ESLint, TypeScript, Prettier
- **Service**: Built and tested
- **Desktop**: Built for Windows, macOS (x64 + ARM), Linux
- **OBS Plugin**: Built for Windows and macOS

Release artifacts are created on tags (`v*`).

---

## 📝 Notes

- Desktop app builds take 5-15 minutes (first build)
- Subsequent builds are faster with Rust cache
- OBS plugin requires OBS to be installed for runtime
- Service can run standalone without other components

---

## 🆘 Need Help?

- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Open an issue on GitHub
- Join our Discord community

