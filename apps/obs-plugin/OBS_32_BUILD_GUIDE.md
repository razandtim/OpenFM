# Building OBS Plugin for OBS Studio 32.0.2

This guide covers building the OpenFM plugin specifically for OBS Studio 32.0.2.

## OBS Studio 32.0.2 Requirements

- **OBS Studio Version**: 32.0.2
- **Qt Version**: 6.8.3 (runtime and compiled)
- **Architecture**: 64-bit (x64)
- **Compiler**: MSVC 2019/2022 (Visual Studio 2019/2022)

## Critical Issue: Qt Version Mismatch

**Problem**: OBS Studio 32.0.2 uses Qt 6.8.3, but the plugin was built with Qt 6.7.0. This causes:
- Plugin DLL fails to load silently
- No error messages in OBS logs
- Plugin doesn't appear in OBS

**Solution**: Build the plugin with Qt 6.8.3 to match OBS.

## Prerequisites

1. **Visual Studio 2022** (or 2019) with C++ workload
2. **CMake 3.20+**
3. **Qt 6.8.3** for MSVC 2019/2022 64-bit
   - Download from: https://www.qt.io/download-qt-installer
   - Required components:
     - Qt 6.8.3 for MSVC 2019 64-bit (or MSVC 2022 64-bit)
     - Qt WebEngine
     - Qt WebChannel
4. **OBS Studio 32.0.2 Source Code**
   - Clone: `git clone --recursive https://github.com/obsproject/obs-studio.git`
   - Checkout tag: `git checkout 32.0.2` (or use latest)

## Build Steps

### 1. Install Qt 6.8.3

```powershell
# Download and install Qt 6.8.3 from qt.io
# Install to: C:\Qt\6.8.3\msvc2019_64 (or msvc2022_64)
```

### 2. Set Environment Variables

```powershell
# Set Qt path
$env:Qt6_DIR = "C:\Qt\6.8.3\msvc2019_64\lib\cmake\Qt6"
# Or for MSVC 2022:
# $env:Qt6_DIR = "C:\Qt\6.8.3\msvc2022_64\lib\cmake\Qt6"

# Set OBS source path (if not already set)
$env:OBS_SOURCE_DIR = "D:\deps\obs-studio"
```

### 3. Update Build Script

The build script should detect Qt 6.8.3. Update `build-windows.ps1` to prioritize Qt 6.8.3:

```powershell
# In build-windows.ps1, update Qt path detection:
$candidateQtPaths = @(
    "C:\Qt\6.8.3\msvc2019_64",  # Add this first
    "C:\Qt\6.8.3\msvc2022_64",  # Or this for VS 2022
    "D:\Qt\6.8.3\msvc2019_64",
    "D:\Qt\6.8.3\msvc2022_64",
    "C:\Qt\6.7.0\msvc2019_64",  # Fallback
    "D:\Qt\6.7.0\msvc2019_64"
)
```

### 4. Build Plugin

```powershell
cd apps\obs-plugin
.\build-windows.ps1
```

### 5. Install Plugin

```powershell
# Install with Qt 6.8.3 path
.\install-plugin.ps1 -QtPath "C:\Qt\6.8.3\msvc2019_64"
```

## Alternative: Use OBS's Qt Installation

If you can't install Qt 6.8.3, you can try to use OBS's Qt DLLs, but this requires:

1. **Copy all Qt DLLs from OBS**:
   ```powershell
   $obsBin = "C:\Program Files\obs-studio\bin\64bit"
   $pluginDir = "$env:APPDATA\obs-studio\obs-plugins\64bit"
   Copy-Item "$obsBin\Qt6*.dll" -Destination $pluginDir -Force
   ```

2. **Copy Qt WebEngine DLLs from your Qt 6.7.0 installation** (OBS doesn't include these):
   ```powershell
   $qtBin = "D:\Qt\6.7.0\msvc2019_64\bin"
   Copy-Item "$qtBin\Qt6WebEngine*.dll" -Destination $pluginDir -Force
   Copy-Item "$qtBin\Qt6WebChannel.dll" -Destination $pluginDir -Force
   ```

**Warning**: This approach may still have compatibility issues due to Qt version mismatch.

## Plugin Loading Requirements

For OBS Studio 32.0.2, the plugin must:

1. **Export required symbols**:
   - `obs_module_load()` - Returns `true` on success
   - `obs_module_unload()` - Cleanup function
   - `obs_module_description()` - Plugin description

2. **Link against OBS libraries**:
   - `obs.lib` - Core OBS library
   - `obs-frontend-api.lib` - Frontend API for docks

3. **Use compatible Qt version**: Qt 6.8.3 (same as OBS)

4. **Handle DLL dependencies**: All Qt DLLs must be available

## Troubleshooting

### Plugin Doesn't Load

1. **Check OBS log**: `Help → Log Files → View Current Log`
   - Look for `[OpenFM]` messages
   - Look for DLL loading errors

2. **Verify DLL dependencies**:
   ```powershell
   # Use Dependency Walker or dumpbin to check dependencies
   dumpbin /DEPENDENTS openfm.dll
   ```

3. **Check Qt version compatibility**:
   ```powershell
   # Check OBS Qt version
   [System.Diagnostics.FileVersionInfo]::GetVersionInfo("C:\Program Files\obs-studio\bin\64bit\Qt6Core.dll").ProductVersion
   
   # Should show: 6.8.3.x
   ```

### Qt Version Mismatch Errors

If you see errors about Qt version:
- Rebuild with Qt 6.8.3
- Ensure all Qt DLLs match the version OBS uses
- Don't mix Qt 6.7.0 and Qt 6.8.3 DLLs

### Missing WebEngine DLLs

OBS doesn't include Qt WebEngine. You must:
1. Copy WebEngine DLLs from your Qt installation
2. Copy WebEngine resources
3. Ensure WebEngine version matches your build Qt version

## Recommended Approach

**Best Practice**: Build with Qt 6.8.3 to match OBS exactly.

1. Install Qt 6.8.3
2. Build plugin with Qt 6.8.3
3. Install plugin - it will use OBS's Qt 6.8.3 DLLs for most components
4. Copy only WebEngine DLLs from Qt 6.8.3 installation (OBS doesn't have these)

This ensures maximum compatibility and avoids version conflicts.

## References

- OBS Studio Source: https://github.com/obsproject/obs-studio
- OBS Plugin Template: https://github.com/obsproject/obs-plugintemplate
- OBS API Documentation: https://docs.obsproject.com/
- Qt 6.8.3 Download: https://www.qt.io/download-qt-installer

