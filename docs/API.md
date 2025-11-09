# OpenFM API Documentation

Base URL: `http://127.0.0.1:6767`

## Authentication

The local API does not require authentication as it only listens on localhost.

## REST API Endpoints

### Health Check

**GET** `/health`

Returns service health status.

**Response:**
```json
{
  "status": "ok",
  "service": "OpenFM",
  "version": "0.1.0",
  "uptime": 1234.56
}
```

---

### State Management

**GET** `/api/state`

Get current playback state.

**Response:**
```json
{
  "mode": "local",
  "currentMood": "epic",
  "currentTrack": {
    "id": "epic-track-1",
    "title": "Heroic Journey",
    "artist": "OpenFM",
    "mood": "epic",
    "duration": 180
  },
  "isPlaying": true,
  "isLoading": false,
  "isMuted": false,
  "elapsed": 45.2,
  "duration": 180,
  "progress": 0.251,
  "volume": 0.7,
  "crossfadeDuration": 250,
  "queue": [...]
}
```

---

**GET** `/api/settings`

Get current settings.

**Response:**
```json
{
  "crossfadeDuration": 250,
  "targetVolume": -10,
  "duckLevel": -20,
  "duckAttack": 10,
  "duckRelease": 250,
  "autoRescan": true,
  "showOverlay": false,
  "playbackMode": "shuffle",
  "loop": true
}
```

---

**POST** `/api/settings`

Update settings.

**Request Body:**
```json
{
  "crossfadeDuration": 500,
  "showOverlay": true
}
```

**Response:**
```json
{
  "success": true
}
```

---

### Library Management

**GET** `/api/library`

Get current music library.

**Response:**
```json
[
  {
    "id": "epic",
    "name": "Epic",
    "path": "/path/to/library/Epic",
    "artwork": "/path/to/library/Epic/artwork.png",
    "tracks": [...],
    "enabled": true
  }
]
```

---

**POST** `/api/library/scan`

Scan a directory for music.

**Request Body:**
```json
{
  "rootPath": "/path/to/music/library"
}
```

**Response:**
```json
{
  "success": true,
  "moods": [...]
}
```

---

**POST** `/api/library/download`

Download a mood pack.

**Request Body:**
```json
{
  "moodId": "epic",
  "url": "https://example.com/mood-packs/epic.zip"
}
```

**Response:**
```json
{
  "success": true
}
```

---

**GET** `/api/library/updates`

Check for mood pack updates.

**Response:**
```json
{
  "packs": [
    {
      "id": "epic",
      "name": "Epic Mood Pack",
      "version": "1.0.0",
      "downloadUrl": "https://example.com/epic.zip",
      "size": 52428800
    }
  ]
}
```

---

### Playback Control

**POST** `/api/playback/mood`

Set active mood.

**Request Body:**
```json
{
  "mood": "epic"
}
```

**Response:**
```json
{
  "success": true
}
```

---

**POST** `/api/playback/play`

Start playback.

**Response:**
```json
{
  "success": true
}
```

---

**POST** `/api/playback/pause`

Pause playback.

**Response:**
```json
{
  "success": true
}
```

---

**POST** `/api/playback/toggle`

Toggle play/pause.

**Response:**
```json
{
  "success": true
}
```

---

**POST** `/api/playback/next`

Skip to next track.

**Response:**
```json
{
  "success": true
}
```

---

**POST** `/api/playback/previous`

Go to previous track.

**Response:**
```json
{
  "success": true
}
```

---

**POST** `/api/playback/mute`

Toggle mute.

**Response:**
```json
{
  "success": true
}
```

---

**POST** `/api/playback/volume`

Set volume.

**Request Body:**
```json
{
  "volume": 0.7
}
```

**Response:**
```json
{
  "success": true
}
```

---

**POST** `/api/playback/mode`

Set playback mode.

**Request Body:**
```json
{
  "mode": "local"
}
```

**Values:** `local` | `suno`

**Response:**
```json
{
  "success": true
}
```

---

### OBS Integration

**POST** `/api/obs/active`

Signal that OBS is controlling playback.

**Request Body:**
```json
{
  "active": true
}
```

**Response:**
```json
{
  "success": true
}
```

---

**GET** `/api/obs/active`

Check if OBS is active.

**Response:**
```json
{
  "active": true
}
```

---

## WebSocket API

**Endpoint:** `ws://127.0.0.1:6767/ws`

### Client → Server Messages

**Set Mood:**
```json
{
  "type": "setMood",
  "mood": "epic"
}
```

**Toggle Play:**
```json
{
  "type": "togglePlay"
}
```

**Next Track:**
```json
{
  "type": "next"
}
```

**Previous Track:**
```json
{
  "type": "previous"
}
```

**Toggle Mute:**
```json
{
  "type": "toggleMute"
}
```

**Set Volume:**
```json
{
  "type": "setVolume",
  "volume": 0.7
}
```

### Server → Client Messages

**State Update:**
```json
{
  "type": "state",
  "state": { /* PlaybackState */ },
  "tokens": {
    "mode": "local",
    "mood": "Epic",
    "song": "Heroic Journey",
    "status": "playing",
    "crossfade": "250ms"
  }
}
```

**Settings Update:**
```json
{
  "type": "settings",
  "settings": { /* PlayerSettings */ }
}
```

**Library Update:**
```json
{
  "type": "library",
  "library": [ /* LocalMood[] */ ]
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message here"
}
```

HTTP status codes:
- `200` - Success
- `400` - Bad request (invalid parameters)
- `500` - Server error

---

## Rate Limiting

No rate limiting on localhost API.

## CORS

CORS is enabled for all origins since the service only runs locally.

---

For more details, see `docs/ARCHITECTURE.md`.

