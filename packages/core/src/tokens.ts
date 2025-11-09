// OpenFM token rendering for overlays and text sources

import type { OpenFMTokens, PlaybackState } from './types';
import { getMoodConfig } from './moods';

/**
 * Generate token values from current playback state
 */
export function generateTokens(state: PlaybackState): OpenFMTokens {
  const mood = state.currentMood ? getMoodConfig(state.currentMood).label : '';
  const song = state.currentTrack?.title || '';
  
  let status: 'playing' | 'muted' | 'paused' = 'paused';
  if (state.isMuted) {
    status = 'muted';
  } else if (state.isPlaying) {
    status = 'playing';
  }

  return {
    mode: state.mode,
    mood,
    song,
    status,
    crossfade: `${state.crossfadeDuration}ms`,
  };
}

/**
 * Replace tokens in a template string
 */
export function replaceTokens(template: string, tokens: OpenFMTokens): string {
  return template
    .replace(/\{openfm\.mode\}/g, tokens.mode)
    .replace(/\{openfm\.mood\}/g, tokens.mood)
    .replace(/\{openfm\.song\}/g, tokens.song)
    .replace(/\{openfm\.status\}/g, tokens.status)
    .replace(/\{openfm\.crossfade\}/g, tokens.crossfade);
}

/**
 * Get default overlay HTML template
 */
export function getDefaultOverlayTemplate(): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: transparent;
      color: white;
      padding: 20px;
    }
    
    .container {
      display: flex;
      align-items: center;
      gap: 16px;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(10px);
      padding: 16px;
      border-radius: 12px;
      max-width: 400px;
    }
    
    .artwork {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 8px;
      flex-shrink: 0;
    }
    
    .info {
      flex: 1;
      min-width: 0;
    }
    
    .status {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 4px;
    }
    
    .song {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .mood {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.8);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="artwork" id="artwork"></div>
    <div class="info">
      <div class="status">OpenFM • <span id="status">Playing</span></div>
      <div class="song" id="song">Loading...</div>
      <div class="mood" id="mood">-</div>
    </div>
  </div>
  
  <script>
    // Connect to OpenFM service via WebSocket
    const ws = new WebSocket('ws://127.0.0.1:6767/ws');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'state') {
        document.getElementById('song').textContent = data.tokens.song || 'No track';
        document.getElementById('mood').textContent = data.tokens.mood;
        document.getElementById('status').textContent = data.tokens.status;
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  </script>
</body>
</html>
  `.trim();
}

/**
 * Format duration in seconds to MM:SS
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

