# Getting Started with OpenFM

## For Users

### Installation

#### Windows
1. Download `OpenFM-Setup-x64.exe` from [GitHub Releases](https://github.com/openfm/openfm/releases)
2. Run the installer
3. Choose whether to install Starter Mood Packs
4. Launch OpenFM from the Start Menu or Desktop

#### macOS
1. Download `OpenFM-macOS.pkg` from [GitHub Releases](https://github.com/openfm/openfm/releases)
2. Open the package and follow the installer
3. Launch OpenFM from Applications

### First Run

1. **Desktop App**: OpenFM will start automatically and show the music UI
2. **OBS Plugin**: Open OBS Studio → View → Docks → OpenFM

### Using OpenFM

#### In the Desktop App
1. Click on a mood (Epic, Romantic, Funny, Scary, Sad)
2. Music starts playing automatically
3. Use controls to adjust crossfade, volume, or mute
4. Click "Suno Library" to use AI-generated tracks (requires API key)

#### In OBS Studio
1. Open the OpenFM dock
2. Select a mood to start playing background music
3. Your mic/desktop audio will automatically duck the music when active
4. Enable "Show Overlay" to display now playing info on stream

## For Developers

### Prerequisites

```bash
# Required
node >= 18.0.0
pnpm >= 9.0.0

# For desktop app
rustc >= 1.70.0
cargo

# For OBS plugin
cmake >= 3.16
Qt6
OBS Studio dev files
```

### Quick Setup

```bash
# Clone the repo
git clone https://github.com/openfm/openfm.git
cd openfm

# Install dependencies
pnpm install

# Build all packages
pnpm run build
```

### Running Locally

#### Service
```bash
pnpm run service

# Service runs on http://127.0.0.1:6767
# UI available at http://127.0.0.1:6767/ui
```

#### Desktop App
```bash
# In a separate terminal
pnpm run desktop

# This launches Tauri which connects to the service
```

#### OBS Plugin
```bash
# Build the plugin
cd apps/obs-plugin
mkdir build && cd build
cmake ..
cmake --build . --config Release

# Copy to OBS plugins folder:
# Windows: C:\Program Files\obs-studio\obs-plugins\64bit\
# macOS: /Library/Application Support/obs-studio/plugins/

# Restart OBS and enable OpenFM dock
```

### Development Workflow

1. **Start the service** in one terminal:
   ```bash
   pnpm run service
   ```

2. **Start the desktop app** in another terminal:
   ```bash
   pnpm run desktop
   ```

3. **Make changes** to packages/core or packages/ui:
   ```bash
   # Changes are hot-reloaded in the service UI
   cd packages/ui
   # Edit src/components/*.tsx
   ```

4. **Auto-commit** changes (optional):
   ```bash
   pnpm run autopush
   # Commits and pushes every 10 file changes
   ```

### Project Structure

```
openfm/
├── packages/          # Shared libraries
│   ├── core/         # TypeScript logic
│   └── ui/           # React components
├── apps/
│   ├── service/      # Local server (Node.js)
│   ├── desktop/      # Desktop app (Tauri)
│   └── obs-plugin/   # OBS plugin (C++)
└── tools/
    └── autopush/     # Auto-commit tool
```

### Building for Production

#### All Platforms
```bash
pnpm run build
```

#### Windows Installer
```bash
# Requires Inno Setup installed
cd installers/windows
iscc setup.iss
# Output: ../../dist/OpenFM-Setup-x64.exe
```

#### macOS Installer
```bash
cd installers/macos
./build-pkg.sh
# Output: dist/OpenFM-macOS.pkg
```

### Testing

```bash
# Lint
pnpm run lint

# Type check
pnpm run typecheck

# Run tests
pnpm run test
```

## Configuration

### Environment Variables

```bash
# Service port (default: 6767)
OPENFM_PORT=6767

# Mood pack catalog URL
OPENFM_CATALOG_URL=https://example.com/catalog.json

# Auto-push settings
OPENFM_AUTOPUSH=1                    # Enable (1) or disable (0)
OPENFM_AUTOPUSH_THRESHOLD=10         # Files per commit
```

### Local Library

Place your music files in:
```
/path/to/library/
  Epic/
    song1.mp3
    song2.mp3
    artwork.png
  Romantic/
    song1.mp3
    artwork.png
  ...
```

Set library path in Settings → Library → Library Root Path

### Suno API

1. Get API key from [sunoapi.org/api-key](https://sunoapi.org/api-key)
2. Open Settings → Suno
3. Paste your API key
4. Click "Save API Key"

## Troubleshooting

### Service Won't Start
```bash
# Check if port 6767 is available
netstat -an | grep 6767

# Try a different port
OPENFM_PORT=6768 pnpm run service
```

### OBS Plugin Not Showing
- Ensure OpenFM service is running
- Check View → Docks → OpenFM is checked
- Restart OBS if you just installed the plugin

### Desktop App Can't Connect
- Ensure service is running on port 6767
- Check firewall isn't blocking localhost connections
- Try restarting the service

### Build Errors

#### Node modules
```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### OBS plugin
```bash
# Ensure Qt6 is installed
# Windows: Download from qt.io
# macOS: brew install qt@6

# Clean build
cd apps/obs-plugin
rm -rf build
mkdir build && cd build
cmake ..
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run tests: `pnpm run lint && pnpm run typecheck`
5. Commit: `git commit -m "Add my feature"`
6. Push: `git push origin feature/my-feature`
7. Open a Pull Request

## Support

- **Issues**: [GitHub Issues](https://github.com/openfm/openfm/issues)
- **Discussions**: [GitHub Discussions](https://github.com/openfm/openfm/discussions)
- **Documentation**: [docs/](./docs/)

## License

MIT License - see [LICENSE](./LICENSE) for details

---

**Need help?** Open an issue on GitHub or join our community discussions!

