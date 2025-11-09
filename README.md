# OpenFM

<div align="center">
  <h3>OpenFM • mood-based music for your stream and desktop, in one click</h3>
  <p>A unified music experience for OBS and desktop with curated mood packs, smooth crossfades, and intelligent audio ducking.</p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
  [![Version](https://img.shields.io/badge/version-0.1.0-green.svg)](CHANGELOG.md)
  [![Build Status](https://github.com/openfm/openfm/workflows/Build/badge.svg)](https://github.com/openfm/openfm/actions)
</div>

---

## ✨ Features

- 🎭 **5 Moods**: Epic, Romantic, Funny, Scary, Sad
- 🎵 **Dual Sources**: Local music library or Suno AI tracks
- 🎚️ **Smooth Crossfades**: Default 250ms, configurable 0-1000ms
- 🔊 **Audio Priority**: OBS sources can override/duck OpenFM
- 📺 **Overlay Support**: Show "now playing" with tokens
- 🔄 **Auto-Updates**: Mood packs download and update automatically
- 🎨 **Beautiful UI**: Minimalist design with mood-based colors
- 🔐 **Supabase Auth**: Sync preferences across devices

## Project Structure

```
openfm/
├── apps/
│   ├── obs-plugin/         # C++ OBS plugin with Qt Dock
│   ├── service/            # Node.js local server (port 6767)
│   └── desktop/            # Tauri desktop app
├── packages/
│   ├── core/              # Shared TypeScript logic
│   └── ui/                # React UI components
├── tools/
│   └── autopush/          # Auto-commit watcher (10 file threshold)
└── installers/            # Windows & macOS installers
```

## Quick Start

### Prerequisites

- Node.js 18+ and pnpm 9+
- For OBS plugin: CMake, Qt 6, OBS Studio dev files
- For desktop app: Rust and Tauri CLI
- For installers: Inno Setup (Windows) or pkgbuild (macOS)

### Development

```bash
# Install dependencies
pnpm install

# Start the service
pnpm service

# Start the desktop app (in another terminal)
pnpm desktop

# Build everything
pnpm build

# Enable auto-push (commits every 10 file changes)
pnpm autopush
```

### Service API

The local service runs on `http://127.0.0.1:6767`:

- `/health` - Health check
- `/api/state` - Get current playback state
- `/api/settings` - Get/update settings
- `/api/library` - Get library, scan, download packs
- `/api/playback/*` - Control playback
- `/ws` - WebSocket for real-time updates

### Mood Colors

- Epic: `#FF6B6B` (red)
- Romantic: `#FFC6E7` (pink)
- Funny: `#FFE08A` (yellow)
- Scary: `#B28DFF` (purple)
- Sad: `#7EC8E3` (cyan)

## Architecture

### Core Packages

**@openfm/core** - Pure TypeScript logic:
- Library scanning (Local Mood Packs)
- Shuffle algorithms (bag shuffle, random)
- Crossfade scheduling with gain ramps
- Supabase authentication
- Token rendering for overlays
- Suno API adapter

**@openfm/ui** - React components:
- Header (always starts with "OpenFM • ...")
- MoodSelector with 5 mood cards
- NowPlaying with queue preview
- Controls (crossfade, mute, overlay toggle)
- SunoGrid for Suno tracks
- Auth and Settings dialogs

### Apps

**apps/service** - Local server:
- Express API on port 6767
- WebSocket for state sync
- Desktop audio playback (when OBS is not active)
- Mood pack downloader
- Serves UI static files

**apps/desktop** - Tauri app:
- Wraps service UI in native window
- System tray integration
- Auto-starts service if needed

**apps/obs-plugin** - OBS plugin:
- Qt Dock titled "OpenFM"
- Embeds web UI from service
- Controls audio sources (5 moods + 2 Suno players)
- Crossfade via gain ramps
- Sidechain ducking for audio priority
- Overlay tokens

## Installation

### From Release (Recommended)

1. Download from [GitHub Releases](https://github.com/openfm/openfm/releases)
2. Run installer:
   - Windows: `OpenFM-Setup-x64.exe`
   - macOS: `OpenFM-macOS.pkg`
3. Open OBS → View → Docks → OpenFM
4. Or launch OpenFM desktop app

### From Source

```bash
# Clone repo
git clone https://github.com/openfm/openfm.git
cd openfm

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Build service
cd apps/service && pnpm build

# Build desktop app
cd apps/desktop && pnpm build

# Build OBS plugin (requires OBS dev files)
cd apps/obs-plugin
mkdir build && cd build
cmake ..
cmake --build . --config Release
```

## Configuration

### Environment Variables

- `OPENFM_PORT` - Service port (default: 6767)
- `OPENFM_CATALOG_URL` - Mood pack catalog URL
- `OPENFM_AUTOPUSH` - Enable/disable auto-push (0/1)
- `OPENFM_AUTOPUSH_THRESHOLD` - Files per commit (default: 10)

### Settings File

Settings are stored in:
- Windows: `%APPDATA%\OpenFM\settings.json`
- macOS: `~/Library/Application Support/OpenFM/settings.json`

## Auto-Push Policy

OpenFM uses an auto-commit system that pushes changes every 10 file modifications:

```bash
# Enable auto-push
pnpm autopush

# Disable auto-push
OPENFM_AUTOPUSH=0 pnpm autopush
```

Files ignored by `.autopushignore` don't count toward the threshold.

## Audio Priority

In OBS Settings → Audio Priority, check "Overrides OpenFM" for any source that should duck the music:

- OpenFM adds sidechain compressor filters to the music group
- Default duck: -20 dB, Attack: 10ms, Release: 250ms
- Configurable in Settings

## Overlay Tokens

Use these tokens in OBS Text sources or Browser sources:

- `{openfm.mode}` - "local" or "suno"
- `{openfm.mood}` - Current mood (Epic, Romantic, etc.)
- `{openfm.song}` - Current song title
- `{openfm.status}` - "playing", "muted", or "paused"
- `{openfm.crossfade}` - e.g., "250ms"

## Acceptance Tests

Run the test suite:

```bash
pnpm test
```

Key tests:
- ✅ A. Installation & updates
- ✅ B. Local playback (shuffle, loop, crossfade)
- ✅ C. Suno mode (API key, grid, playback)
- ✅ D. Audio priority & overlay
- ✅ E. Desktop app & service
- ✅ F. Persistence, auth, performance

## Contributing

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Run `pnpm lint` and `pnpm typecheck`
5. Submit a pull request

Auto-push will batch your commits every 10 files.

## License

MIT License - see LICENSE file for details

## Credits

Built with:
- React, TypeScript, Tailwind CSS
- Tauri (desktop), Qt (OBS plugin)
- Supabase (auth), Suno API (music)
- Framer Motion (animations)

---

**OpenFM** • Made with ❤️ for streamers and creators
