# OpenFM Architecture

## System Overview

OpenFM is a distributed system consisting of a local service, desktop application, and OBS Studio plugin that work together to provide mood-based music streaming.

```
┌─────────────────────┐
│   Desktop App       │
│   (Tauri)           │
└──────────┬──────────┘
           │
           │ HTTP/WS
           ▼
┌──────────────────────────────────┐
│   OpenFM Service                 │
│   http://127.0.0.1:6767          │
│                                  │
│   ┌──────────────────────────┐  │
│   │  Express REST API        │  │
│   │  - /api/state            │  │
│   │  - /api/settings         │  │
│   │  - /api/library          │  │
│   │  - /api/playback/*       │  │
│   └──────────────────────────┘  │
│                                  │
│   ┌──────────────────────────┐  │
│   │  WebSocket Server        │  │
│   │  ws://127.0.0.1:6767/ws  │  │
│   └──────────────────────────┘  │
│                                  │
│   ┌──────────────────────────┐  │
│   │  State Manager           │  │
│   │  - Playback state        │  │
│   │  - Settings              │  │
│   │  - Library cache         │  │
│   └──────────────────────────┘  │
│                                  │
│   ┌──────────────────────────┐  │
│   │  Playback Manager        │  │
│   │  - Desktop audio         │  │
│   │  - Queue management      │  │
│   │  - Crossfade scheduler   │  │
│   └──────────────────────────┘  │
└──────────┬───────────────────────┘
           │
           │ HTTP/WS
           ▼
┌─────────────────────┐
│   OBS Plugin        │
│   (C++ with Qt)     │
│                     │
│   ┌──────────────┐  │
│   │  Qt Dock     │  │
│   │  WebView     │  │
│   └──────────────┘  │
│                     │
│   ┌──────────────┐  │
│   │  Audio Mgr   │  │
│   │  5 Sources   │  │
│   └──────────────┘  │
│                     │
│   ┌──────────────┐  │
│   │  Ducking Mgr │  │
│   │  Sidechain   │  │
│   └──────────────┘  │
└─────────────────────┘
```

## Component Details

### Service (Node.js)
- **Port**: 6767
- **Purpose**: Central state management and API
- **Tech**: Express, WebSocket (ws), TypeScript
- **Key Files**:
  - `apps/service/src/index.ts` - Entry point
  - `apps/service/src/state/manager.ts` - State management
  - `apps/service/src/routes/index.ts` - REST API
  - `apps/service/src/websocket.ts` - WebSocket handler

### Desktop App (Tauri)
- **Purpose**: Standalone music player
- **Tech**: Rust, Tauri 2.0
- **Key Files**:
  - `apps/desktop/src-tauri/src/main.rs` - Entry point
  - `apps/desktop/src-tauri/tauri.conf.json` - Configuration

### OBS Plugin (C++)
- **Purpose**: OBS Studio integration
- **Tech**: C++17, Qt 6, OBS SDK
- **Key Files**:
  - `apps/obs-plugin/src/plugin.cpp` - Plugin core
  - `apps/obs-plugin/src/dock.cpp` - Qt Dock with WebView
  - `apps/obs-plugin/src/audio_manager.cpp` - Audio sources
  - `apps/obs-plugin/src/ducking.cpp` - Sidechain ducking

### Core Package (TypeScript)
- **Purpose**: Shared business logic
- **Tech**: TypeScript
- **Exports**:
  - Types and interfaces
  - Mood configuration
  - Library scanner
  - Shuffle algorithms
  - Crossfade scheduler
  - Auth client
  - Token renderer
  - Suno adapter

### UI Package (React)
- **Purpose**: Shared React components
- **Tech**: React 19, Tailwind CSS
- **Components**:
  - Header (with "OpenFM • " prefix)
  - MoodSelector (5 mood cards)
  - NowPlaying (with queue)
  - Controls (crossfade, mute, volume)
  - SunoGrid (AI track browser)
  - Auth (sign in/up/out)
  - Settings (4 tabs)

## Data Flow

### User Selects Mood
```
User clicks mood card
    ↓
React UI (OpenFMApp)
    ↓
PlayerContext.setMood()
    ↓
Service API: POST /api/playback/mood
    ↓
StateManager.setMood()
    ↓
WebSocket broadcast
    ↓
All clients receive update
    ↓
PlaybackManager starts crossfade
```

### Audio Ducking (OBS)
```
Microphone active
    ↓
DuckingManager detects activity
    ↓
Apply sidechain compressor
    ↓
OpenFM music ducks to -20dB
    ↓
Microphone stops
    ↓
Music returns to normal (250ms)
```

## State Management

### Central State (StateManager)
```typescript
{
  mode: 'local' | 'suno',
  currentMood: MoodId,
  currentTrack: Track,
  isPlaying: boolean,
  isLoading: boolean,
  isMuted: boolean,
  elapsed: number,
  duration: number,
  progress: number,
  volume: number,
  crossfadeDuration: number,
  queue: Track[]
}
```

### Settings (Persisted)
```typescript
{
  crossfadeDuration: 250,
  targetVolume: -10,
  duckLevel: -20,
  duckAttack: 10,
  duckRelease: 250,
  autoRescan: true,
  showOverlay: false,
  playbackMode: 'shuffle',
  loop: true
}
```

## API Endpoints

### State
- `GET /api/state` - Get current state
- `GET /api/settings` - Get settings
- `POST /api/settings` - Update settings

### Library
- `GET /api/library` - Get library
- `POST /api/library/scan` - Scan directory
- `POST /api/library/download` - Download mood pack
- `GET /api/library/updates` - Check for updates

### Playback
- `POST /api/playback/mood` - Set mood
- `POST /api/playback/play` - Play
- `POST /api/playback/pause` - Pause
- `POST /api/playback/toggle` - Toggle play/pause
- `POST /api/playback/next` - Next track
- `POST /api/playback/previous` - Previous track
- `POST /api/playback/mute` - Toggle mute
- `POST /api/playback/volume` - Set volume
- `POST /api/playback/mode` - Set mode (local/suno)

### OBS Integration
- `POST /api/obs/active` - Signal OBS is active
- `GET /api/obs/active` - Check if OBS is active

## WebSocket Messages

### Client → Server
```json
{
  "type": "setMood",
  "mood": "epic"
}
```

### Server → Client
```json
{
  "type": "state",
  "state": { /* PlaybackState */ },
  "tokens": { /* OpenFMTokens */ }
}
```

## Build Process

```
pnpm install
    ↓
Build packages/core
    ↓
Build packages/ui
    ↓
Build apps/service
    ↓
Build apps/desktop
    ↓
Build apps/obs-plugin (CMake)
    ↓
Create installers
```

## Security

### API Key Storage
- **Windows**: DPAPI (Data Protection API)
- **macOS**: Keychain Access
- **Never** stored in plain text

### Auth Tokens
- Supabase JWT tokens
- Stored in secure storage
- Never logged or exposed

### Network
- Service only listens on localhost (127.0.0.1)
- No external network access required
- WebSocket on same origin

## Performance Targets

- **Service startup**: < 2s
- **UI load**: < 1s
- **Mood switch**: < 500ms
- **Crossfade**: Smooth (no clicks/pops)
- **CPU usage**: < 3% idle, < 5% playing
- **Memory**: < 150MB service, < 100MB plugin

## Scalability

- Service can handle multiple clients
- WebSocket scales to ~100 concurrent connections
- Library scanner handles 10,000+ tracks
- Queue system supports unlimited tracks

---

For implementation details, see:
- `GETTING_STARTED.md` - Setup instructions
- `PROJECT_STRUCTURE.md` - File organization
- `IMPLEMENTATION_SUMMARY.md` - Component status

