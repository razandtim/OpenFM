# OpenFM OBS Plugin Installer

This installer script (`install-plugin.ps1`) installs the OpenFM OBS plugin and all required dependencies to ensure it works correctly in OBS Studio.

## Features

- ✅ Automatically detects OBS Studio installation
- ✅ Detects OBS's Qt version for compatibility
- ✅ Copies plugin DLL to the correct location
- ✅ Copies all required Qt DLLs from OBS installation (ensures version compatibility)
- ✅ Copies Qt WebEngine resources
- ✅ Handles missing dependencies gracefully

## Usage

### After Building the Plugin

```powershell
# Build the plugin first
.\build-windows.ps1

# Then install with all dependencies
.\install-plugin.ps1
```

### Direct Installation

```powershell
# Install from a specific DLL location
.\install-plugin.ps1 -PluginDll "path\to\openfm.dll"

# Install to a specific OBS installation
.\install-plugin.ps1 -ObsPath "C:\Program Files\obs-studio"
```

## What It Does

1. **Installs Plugin DLL**: Copies `openfm.dll` to `%APPDATA%\obs-studio\obs-plugins\64bit\`

2. **Detects OBS Qt Version**: Checks OBS's Qt version (e.g., 6.8.3) to ensure compatibility

3. **Copies Qt DLLs**: 
   - **Preferred**: Copies Qt DLLs from OBS's installation (`C:\Program Files\obs-studio\bin\64bit\`)
   - **Fallback**: Uses Qt DLLs from build directory if OBS DLLs not found
   - Ensures version compatibility by using OBS's Qt installation

4. **Copies Qt WebEngine Resources**: 
   - Looks for WebEngine resources in OBS installation
   - Copies them to plugin directory if found

5. **Installs Data Files**: Copies any additional data files from `data/` directory

## Installation Locations

- **Plugin DLL**: `%APPDATA%\obs-studio\obs-plugins\64bit\openfm.dll`
- **Qt DLLs**: `%APPDATA%\obs-studio\obs-plugins\64bit\Qt6*.dll`
- **Resources**: `%APPDATA%\obs-studio\obs-plugins\64bit\resources\`
- **Data Files**: `%APPDATA%\obs-studio\data\obs-plugins\openfm\`

## After Installation

1. **Close OBS Studio** completely (if running)
2. **Restart OBS Studio**
3. **Open the OpenFM dock**: Go to `View → Docks → OpenFM`
4. **Ensure the OpenFM service is running** on `http://127.0.0.1:6767`

## Troubleshooting

### Plugin Doesn't Load

- Check OBS log file: `Help → Log Files → View Current Log`
- Look for `[OpenFM]` messages or error messages
- Verify the plugin DLL is in the correct location
- Ensure all Qt DLLs were copied successfully

### Missing Qt DLLs

The installer will warn if some Qt DLLs are missing. These may be loaded from OBS at runtime, but if the plugin still doesn't load, you may need to:

1. Rebuild the plugin with the same Qt version as OBS
2. Manually copy missing Qt DLLs from OBS's bin directory

### Qt Version Mismatch

If you see warnings about Qt version mismatches:
- The plugin was built with a different Qt version than OBS uses
- The installer tries to use OBS's Qt DLLs to avoid conflicts
- For best results, rebuild the plugin with Qt 6.8.3 (or whatever version OBS uses)

## Integration with Inno Setup

The Inno Setup installer (`installers/windows/setup.iss`) can also install the plugin. It:
- Detects OBS installation automatically
- Copies the plugin DLL
- Copies Qt DLLs from OBS installation (if available)

For a complete installation with all dependencies, the PowerShell installer (`install-plugin.ps1`) is recommended as it handles edge cases better.

