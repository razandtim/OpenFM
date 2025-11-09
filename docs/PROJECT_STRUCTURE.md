# OpenFM Project Structure

## Overview

OpenFM is a monorepo containing packages and applications for mood-based music streaming for OBS and desktop.

```
openfm/
├── .github/
│   └── workflows/
│       └── build.yml                    # CI/CD pipeline
│
├── apps/
│   ├── obs-plugin/                      # C++ OBS Studio plugin
│   │   ├── src/
│   │   │   ├── plugin.hpp/cpp           # Main plugin entry
│   │   │   ├── dock.hpp/cpp             # Qt Dock with WebView
│   │   │   ├── audio_manager.hpp/cpp    # Audio source management
│   │   │   └── ducking.hpp/cpp          # Sidechain ducking
│   │   └── CMakeLists.txt               # Build configuration
│   │
│   ├── service/                         # Node.js local server
│   │   ├── src/
│   │   │   ├── index.ts                 # Express server entry
│   │   │   ├── routes/
│   │   │   │   └── index.ts             # API routes
│   │   │   ├── state/
│   │   │   │   └── manager.ts           # State management
│   │   │   ├── playback/
│   │   │   │   └── manager.ts           # Desktop playback
│   │   │   ├── library/
│   │   │   │   └── downloader.ts        # Mood pack downloader
│   │   │   ├── websocket.ts             # WebSocket handler
│   │   │   └── ui/
│   │   │       ├── index.html           # UI entry
│   │   │       └── main.tsx             # React app
│   │   ├── package.json
│   │   ├── vite.config.ts               # UI build config
│   │   └── tsconfig.json
│   │
│   └── desktop/                         # Tauri desktop app
│       ├── src-tauri/
│       │   ├── src/
│       │   │   └── main.rs              # Rust entry point
│       │   ├── Cargo.toml               # Rust dependencies
│       │   └── tauri.conf.json          # Tauri config
│       └── package.json
│
├── packages/
│   ├── core/                            # Shared TypeScript logic
│   │   ├── src/
│   │   │   ├── index.ts                 # Main export
│   │   │   ├── types.ts                 # Type definitions
│   │   │   ├── moods.ts                 # Mood configuration
│   │   │   ├── library.ts               # Library scanner
│   │   │   ├── shuffle.ts               # Queue algorithms
│   │   │   ├── crossfade.ts             # Crossfade scheduler
│   │   │   ├── auth.ts                  # Supabase auth
│   │   │   ├── tokens.ts                # Token renderer
│   │   │   └── suno.ts                  # Suno API adapter
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── ui/                              # React UI components
│       ├── src/
│       │   ├── index.ts                 # Main export
│       │   ├── styles.css               # Tailwind entry
│       │   ├── components/
│       │   │   ├── OpenFMApp.tsx        # Main app component
│       │   │   ├── Header.tsx           # Header (OpenFM • ...)
│       │   │   ├── MoodSelector.tsx     # 5 mood cards
│       │   │   ├── NowPlaying.tsx       # Now playing card
│       │   │   ├── Controls.tsx         # Crossfade, mute, etc.
│       │   │   ├── SunoGrid.tsx         # Suno track grid
│       │   │   ├── Auth.tsx             # Auth dialog
│       │   │   └── Settings.tsx         # Settings dialog
│       │   └── context/
│       │       └── PlayerContext.tsx    # State context
│       ├── package.json
│       ├── tsconfig.json
│       └── tailwind.config.js
│
├── tools/
│   └── autopush/
│       └── auto-push.js                 # Auto-commit watcher
│
├── installers/
│   ├── windows/
│   │   └── setup.iss                    # Inno Setup script
│   └── macos/
│       └── build-pkg.sh                 # pkgbuild script
│
├── guidance/                            # Original project docs
│   ├── 01_project_overview.md
│   └── 02_implementation_checklist.md
│
├── public/
│   └── songs/                           # Local mood pack samples
│       ├── Epic/
│       ├── Romantic/
│       ├── Funny/
│       ├── Scary/
│       └── Sad/
│
├── .gitignore
├── .autopushignore
├── pnpm-workspace.yaml                  # Workspace config
├── turbo.json                           # Build orchestration
├── package.json                         # Root package
├── README.md                            # Main documentation
├── IMPLEMENTATION_SUMMARY.md            # Implementation status
└── PROJECT_STRUCTURE.md                 # This file
```

## Package Dependencies

```
apps/service
  ├─ @openfm/core
  └─ @openfm/ui

apps/desktop
  └─ (connects to service via HTTP)

apps/obs-plugin
  └─ (connects to service via HTTP)

packages/ui
  └─ @openfm/core

packages/core
  └─ (no internal deps)
```

## Data Flow

```
┌─────────────────┐
│   Desktop App   │
│    (Tauri)      │
└────────┬────────┘
         │
         │ HTTP/WS
         ▼
┌─────────────────────────────┐
│    OpenFM Service           │
│  (Node.js on port 6767)     │
│                             │
│  ├─ Express API             │
│  ├─ WebSocket               │
│  ├─ State Manager           │
│  ├─ Playback Manager        │
│  └─ Library Downloader      │
└──────────┬──────────────────┘
           │
           │ HTTP/WS
           ▼
┌─────────────────────────────┐
│    OBS Plugin               │
│  (C++ with Qt Dock)         │
│                             │
│  ├─ Qt WebEngineView        │
│  ├─ Audio Manager           │
│  └─ Ducking Manager         │
└─────────────────────────────┘
```

## Build Outputs

After `pnpm build`:

```
dist/
├── packages/
│   ├── core/                # Compiled TypeScript
│   └── ui/                  # Compiled TypeScript + CSS
│
├── apps/
│   ├── service/
│   │   ├── index.js         # Server bundle
│   │   └── public/          # UI static files
│   │
│   ├── desktop/
│   │   └── src-tauri/
│   │       └── target/
│   │           └── release/
│   │               ├── OpenFM.exe      (Windows)
│   │               └── OpenFM.app      (macOS)
│   │
│   └── obs-plugin/
│       └── build/
│           ├── openfm.dll   (Windows)
│           └── openfm.so    (macOS)
│
└── installers/
    ├── OpenFM-Setup-x64.exe (Windows)
    └── OpenFM-macOS.pkg     (macOS)
```

## Key Files

### Configuration
- `pnpm-workspace.yaml` - Workspace packages
- `turbo.json` - Build pipeline
- `.autopushignore` - Auto-push exclusions
- `.github/workflows/build.yml` - CI/CD

### Source Entry Points
- `apps/service/src/index.ts` - Service main
- `apps/desktop/src-tauri/src/main.rs` - Desktop main
- `apps/obs-plugin/src/plugin.cpp` - OBS plugin main
- `packages/core/src/index.ts` - Core exports
- `packages/ui/src/index.ts` - UI exports

### Build Scripts
- `apps/service/vite.config.ts` - UI build
- `apps/obs-plugin/CMakeLists.txt` - C++ build
- `apps/desktop/src-tauri/Cargo.toml` - Rust build

## Development Workflow

1. **Start service**: `pnpm run service` (port 6767)
2. **Start desktop**: `pnpm run desktop` (connects to service)
3. **Build OBS plugin**: `cd apps/obs-plugin && mkdir build && cmake ..`
4. **Auto-push**: `pnpm run autopush` (commits every 10 files)

## Production Build

```bash
# Build all packages and apps
pnpm run build

# Create installers
cd installers/windows && iscc setup.iss           # Windows
cd installers/macos && ./build-pkg.sh            # macOS
```

## Testing

```bash
# Lint all packages
pnpm run lint

# Type check
pnpm run typecheck

# Run tests (if implemented)
pnpm run test
```

---

**Last Updated**: 2024-11-09  
**Project Status**: Core implementation complete, needs integration testing

