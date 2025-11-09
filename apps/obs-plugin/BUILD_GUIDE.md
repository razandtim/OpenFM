# OBS Plugin - Local Build Guide

This guide will help you build the OpenFM OBS Plugin locally on your machine.

---

## 📋 Prerequisites

### Windows Requirements

1. **Visual Studio 2022** (Community Edition is fine)
   - Download: https://visualstudio.microsoft.com/downloads/
   - Required workloads:
     - "Desktop development with C++"
     - "C++ CMake tools for Windows"

2. **CMake 3.20+**
   - Download: https://cmake.org/download/
   - Or install via Visual Studio Installer
   - Add to PATH during installation

3. **Qt 6.5+**
   - Download: https://www.qt.io/download-qt-installer
   - Required components:
     - Qt 6.5.x for MSVC 2022 64-bit
     - Qt WebEngine
     - Qt WebChannel
   - Set environment variable: `Qt6_DIR=C:\Qt\6.5.x\msvc2022_64`

4. **OBS Studio 30.0+ Development Files**
   - Download OBS source: https://github.com/obsproject/obs-studio/releases
   - OR clone: `git clone --recursive https://github.com/obsproject/obs-studio.git`
   - Set environment variable: `OBS_SOURCE_DIR=path\to\obs-studio`

---

## 🔧 Build Steps (Windows)

### 1. Set Up Environment Variables

Open PowerShell as Administrator and run:

```powershell
# Set Qt path (adjust version as needed)
[System.Environment]::SetEnvironmentVariable('Qt6_DIR', 'C:\Qt\6.5.3\msvc2022_64', 'User')

# Set OBS source path
[System.Environment]::SetEnvironmentVariable('OBS_SOURCE_DIR', 'C:\path\to\obs-studio', 'User')

# Reload environment
$env:Qt6_DIR = [System.Environment]::GetEnvironmentVariable('Qt6_DIR', 'User')
$env:OBS_SOURCE_DIR = [System.Environment]::GetEnvironmentVariable('OBS_SOURCE_DIR', 'User')
```

### 2. Configure CMake

Navigate to the plugin directory:

```powershell
cd D:\stuff\INFO\OpenFM\apps\obs-plugin
```

Create build directory and configure:

```powershell
# Create build directory
mkdir build
cd build

# Configure (Release build)
cmake .. -G "Visual Studio 17 2022" -A x64 `
  -DQt6_DIR="$env:Qt6_DIR\lib\cmake\Qt6" `
  -DCMAKE_PREFIX_PATH="$env:Qt6_DIR" `
  -DOBS_SOURCE_DIR="$env:OBS_SOURCE_DIR"
```

### 3. Build the Plugin

```powershell
# Build Release
cmake --build . --config Release

# Or build Debug for testing
cmake --build . --config Debug
```

### 4. Install to OBS

```powershell
# Copy plugin DLL to OBS
$OBS_PLUGINS = "$env:ProgramFiles\obs-studio\obs-plugins\64bit"
Copy-Item "Release\openfm-obs.dll" -Destination $OBS_PLUGINS -Force

# Copy data files (if any)
$OBS_DATA = "$env:ProgramFiles\obs-studio\data\obs-plugins\openfm-obs"
mkdir $OBS_DATA -Force
# Copy-Item "data\*" -Destination $OBS_DATA -Recurse -Force
```

---

## 🍎 macOS Build Steps

### 1. Install Prerequisites

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install dependencies
brew install cmake qt@6

# Download OBS Studio source
git clone --recursive https://github.com/obsproject/obs-studio.git ~/obs-studio
```

### 2. Set Environment Variables

```bash
# Add to ~/.zshrc or ~/.bash_profile
export Qt6_DIR="/opt/homebrew/opt/qt@6"
export OBS_SOURCE_DIR="$HOME/obs-studio"
export PATH="/opt/homebrew/opt/qt@6/bin:$PATH"

# Reload shell
source ~/.zshrc
```

### 3. Build

```bash
cd apps/obs-plugin
mkdir build && cd build

# Configure
cmake .. \
  -DQt6_DIR="$Qt6_DIR/lib/cmake/Qt6" \
  -DCMAKE_PREFIX_PATH="$Qt6_DIR" \
  -DOBS_SOURCE_DIR="$OBS_SOURCE_DIR" \
  -DCMAKE_BUILD_TYPE=Release

# Build
cmake --build . --config Release

# Install
sudo cmake --install . --config Release
```

---

## 🐧 Linux Build Steps

### 1. Install Dependencies (Ubuntu/Debian)

```bash
# Build essentials
sudo apt-get update
sudo apt-get install -y \
  build-essential \
  cmake \
  git \
  qt6-base-dev \
  qt6-webengine-dev \
  libobs-dev \
  obs-studio

# Or build OBS from source
git clone --recursive https://github.com/obsproject/obs-studio.git ~/obs-studio
```

### 2. Build

```bash
cd apps/obs-plugin
mkdir build && cd build

cmake .. \
  -DCMAKE_BUILD_TYPE=Release \
  -DOBS_SOURCE_DIR=~/obs-studio

make -j$(nproc)

# Install
sudo make install
```

---

## 🧪 Testing the Plugin

### 1. Launch OBS Studio

```powershell
# Windows
Start-Process "C:\Program Files\obs-studio\bin\64bit\obs64.exe"

# macOS
open /Applications/OBS.app

# Linux
obs
```

### 2. Check Plugin Loaded

1. Open OBS Studio
2. Go to **View** → **Docks** → **OpenFM**
3. The OpenFM dock should appear
4. It should load the UI from `http://127.0.0.1:6767/ui`

### 3. Test Audio Sources

1. Check **Audio Mixer**
2. Look for hidden sources: `OpenFM_A` and `OpenFM_B`
3. These are created automatically by the plugin for crossfading

---

## 🛠️ Development Workflow

### Hot Reload

For rapid development:

```powershell
# Terminal 1: Keep service running
pnpm run dev:web

# Terminal 2: Rebuild and copy plugin
cd apps\obs-plugin\build
cmake --build . --config Release
Copy-Item "Release\openfm-obs.dll" -Destination "$env:ProgramFiles\obs-studio\obs-plugins\64bit" -Force

# Restart OBS to reload plugin
```

### Debug Build

```powershell
# Configure for Debug
cmake .. -G "Visual Studio 17 2022" -A x64 -DCMAKE_BUILD_TYPE=Debug

# Build
cmake --build . --config Debug

# Attach Visual Studio debugger to obs64.exe
```

---

## 📦 Creating Installer

### Windows (Inno Setup)

```powershell
# Build plugin
cd apps\obs-plugin\build
cmake --build . --config Release

# Copy to installer directory
Copy-Item "Release\openfm-obs.dll" -Destination "..\..\installers\windows\obs-plugin\" -Force

# Build installer
cd ..\..\installers\windows
iscc setup.iss
```

### macOS (pkg)

```bash
# Build plugin
cd apps/obs-plugin/build
cmake --build . --config Release

# Copy to installer directory
cp openfm-obs.so ../../installers/macos/obs-plugin/

# Create package
cd ../../installers/macos
./build-pkg.sh
```

---

## 🐛 Troubleshooting

### "Cannot find Qt6"

**Fix**: Set `Qt6_DIR` environment variable:
```powershell
$env:Qt6_DIR = "C:\Qt\6.5.3\msvc2022_64"
```

### "Cannot find OBS headers"

**Fix**: Set `OBS_SOURCE_DIR`:
```powershell
$env:OBS_SOURCE_DIR = "C:\path\to\obs-studio"
```

### "Plugin doesn't load in OBS"

1. Check OBS log file:
   - Windows: `%APPDATA%\obs-studio\logs\`
   - macOS: `~/Library/Application Support/obs-studio/logs/`
   - Linux: `~/.config/obs-studio/logs/`

2. Verify Qt DLLs are available:
   ```powershell
   # Windows: Copy Qt DLLs if needed
   Copy-Item "$env:Qt6_DIR\bin\Qt6*.dll" -Destination "$env:ProgramFiles\obs-studio\bin\64bit\"
   ```

### "QWebEngine doesn't work"

Install Qt WebEngine separately:
```bash
# macOS
brew install qt-webengine

# Linux
sudo apt-get install qt6-webengine-dev
```

---

## 📚 Additional Resources

- **OBS Plugin Documentation**: https://obsproject.com/docs/plugins.html
- **Qt Documentation**: https://doc.qt.io/qt-6/
- **CMake Guide**: https://cmake.org/cmake/help/latest/
- **OpenFM Service**: Must be running on port 6767

---

## ✅ Build Checklist

- [ ] Visual Studio 2022 installed (Windows)
- [ ] CMake 3.20+ installed
- [ ] Qt 6.5+ installed
- [ ] OBS Studio source downloaded
- [ ] Environment variables set
- [ ] CMake configuration successful
- [ ] Build completed without errors
- [ ] Plugin DLL copied to OBS directory
- [ ] OBS Studio launches without errors
- [ ] OpenFM dock appears in OBS
- [ ] UI loads from local service
- [ ] Audio sources created successfully

---

**Need help?** Check the troubleshooting section or open an issue on GitHub.

