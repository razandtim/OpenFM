# OpenFM OBS Plugin

Integrates OpenFM mood-based music directly into OBS Studio with automatic audio ducking and crossfading.

---

## ✨ Features

- **Integrated Dock**: Web UI embedded directly in OBS
- **Automatic Audio Ducking**: Music automatically lowers when you speak
- **Seamless Crossfades**: Smooth transitions between tracks
- **Hidden Audio Sources**: Music sources are managed automatically (no clutter in your mixer)
- **Token Overlays**: Display current mood, track, and status in your stream
- **Zero Latency**: All processing happens in OBS with no external routing

---

## 🚀 Quick Start

### Windows

```powershell
# 1. Set up environment variables (one-time setup)
$env:Qt6_DIR = "C:\Qt\6.5.3\msvc2022_64"
$env:OBS_SOURCE_DIR = "C:\path\to\obs-studio"

# 2. Build and install
cd apps\obs-plugin
.\build-windows.ps1 -Install

# 3. Launch OBS and enable the OpenFM dock
```

### macOS

```bash
# 1. Set up environment (one-time setup)
export Qt6_DIR="/opt/homebrew/opt/qt@6"
export OBS_SOURCE_DIR="$HOME/obs-studio"

# 2. Build and install
cd apps/obs-plugin
chmod +x build-macos.sh
./build-macos.sh Release --install

# 3. Launch OBS and enable the OpenFM dock
```

### Linux

```bash
# 1. Install dependencies
sudo apt-get install build-essential cmake qt6-base-dev qt6-webengine-dev libobs-dev

# 2. Build
mkdir build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
make -j$(nproc)

# 3. Install
sudo make install
```

---

## 📖 Detailed Build Instructions

See **[BUILD_GUIDE.md](BUILD_GUIDE.md)** for comprehensive build instructions, including:
- Prerequisites and dependencies
- Step-by-step build process
- Troubleshooting common issues
- Development workflow
- Creating installers

---

## 🎮 Usage in OBS

### 1. Enable the Dock

1. Launch OBS Studio
2. Go to **View** → **Docks** → **OpenFM**
3. The OpenFM UI will appear as a dockable panel

### 2. Start Playback

1. Make sure the OpenFM service is running: `pnpm run dev:web`
2. Select a mood from the dock
3. Music will start playing automatically

### 3. Audio Ducking

By default, OpenFM music will duck (lower volume) when:
- You speak into your microphone
- Desktop audio is playing
- Any audio source with higher priority is active

Configure ducking in **Settings** → **Audio**.

### 4. Overlay Tokens

Add text sources to your scene and use these tokens:

- `{openfm.mode}` - Current playback mode (Shuffle/Random)
- `{openfm.mood}` - Current mood (Epic, Romantic, etc.)
- `{openfm.song}` - Currently playing track
- `{openfm.status}` - Playback status (Playing, Paused, etc.)
- `{openfm.crossfade}` - Crossfade duration

**Example:**
```
Now Playing: {openfm.song}
Mood: {openfm.mood}
```

---

## 🔧 Architecture

### Audio Flow

```
OpenFM Service (port 6767)
    ↓
OBS Plugin (C++ Qt)
    ↓
Hidden Media Sources (OpenFM_A / OpenFM_B)
    ↓
Crossfade Controller (gain ramps)
    ↓
Audio Ducking (sidechain compressor)
    ↓
OBS Master Output
```

### Components

- **`plugin.cpp`**: Main plugin entry, registers dock and callbacks
- **`dock.cpp`**: Qt widget with embedded QWebEngineView
- **`audio_manager.cpp`**: Manages hidden media sources and crossfades
- **`ducking.cpp`**: Implements audio ducking with sidechain compression

---

## 🐛 Troubleshooting

### Plugin doesn't appear in OBS

1. Check OBS log file:
   - **Windows**: `%APPDATA%\obs-studio\logs\`
   - **macOS**: `~/Library/Application Support/obs-studio/logs/`
   
2. Verify plugin DLL/SO is in the correct location:
   ```powershell
   # Windows
   dir "$env:ProgramFiles\obs-studio\obs-plugins\64bit\openfm-obs.dll"
   
   # macOS
   ls /Applications/OBS.app/Contents/PlugIns/openfm-obs.so
   ```

### Dock shows blank screen

1. Ensure OpenFM service is running:
   ```bash
   pnpm run dev:web
   ```

2. Verify the service is accessible:
   ```bash
   curl http://127.0.0.1:6767/health
   ```

3. Check OBS log for WebEngine errors

### No audio output

1. Check that hidden sources are created:
   - Open **Audio Mixer**
   - Look for `OpenFM_A` and `OpenFM_B` (they may be hidden)

2. Verify audio files are valid:
   - Check `sample-mood-packs/` directory
   - Ensure files are readable MP3 format

### Build errors

See [BUILD_GUIDE.md](BUILD_GUIDE.md) → Troubleshooting section

---

## 🤝 Contributing

Contributions are welcome! To contribute to the OBS plugin:

1. Fork the repository
2. Make your changes in `apps/obs-plugin/`
3. Test thoroughly in OBS Studio
4. Submit a pull request

### Development Tips

- Use Debug builds for development: `.\build-windows.ps1 -BuildType Debug`
- Attach Visual Studio debugger to `obs64.exe` for debugging
- Check OBS logs for plugin errors
- Test with different OBS scenes and audio configurations

---

## 📄 License

MIT License - see [LICENSE](../../LICENSE) for details

---

## 🔗 Links

- **Main Project**: [OpenFM](../../README.md)
- **Build Guide**: [BUILD_GUIDE.md](BUILD_GUIDE.md)
- **Service API**: [docs/API.md](../../docs/API.md)
- **OBS Documentation**: https://obsproject.com/docs/plugins.html

---

**Need Help?** Open an issue or check the [BUILD_GUIDE.md](BUILD_GUIDE.md) troubleshooting section.

