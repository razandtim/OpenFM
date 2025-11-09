import { useEffect, useCallback } from 'react';
import type { PlaybackState, PlayerSettings, MoodId } from '@openfm/core';

const API_BASE = 'http://127.0.0.1:6767/api';
const WS_URL = 'ws://127.0.0.1:6767/ws';

export function useServiceAPI(
  onStateUpdate: (state: PlaybackState) => void,
  onSettingsUpdate: (settings: PlayerSettings) => void
) {
  // Connect to WebSocket for real-time updates
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      try {
        ws = new WebSocket(WS_URL);

        ws.onopen = () => {
          console.log('WebSocket connected');
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'state') {
              onStateUpdate(data.state);
            } else if (data.type === 'settings') {
              onSettingsUpdate(data.settings);
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
          console.log('WebSocket disconnected, reconnecting...');
          reconnectTimeout = setTimeout(connect, 3000);
        };
      } catch (error) {
        console.error('WebSocket connection error:', error);
      }
    };

    connect();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (ws) ws.close();
    };
  }, [onStateUpdate, onSettingsUpdate]);

  // API call functions
  const apiCall = useCallback(async (endpoint: string, options?: RequestInit) => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`API call failed ${endpoint}:`, error);
      throw error;
    }
  }, []);

  const setMood = useCallback(async (mood: MoodId) => {
    await apiCall('/playback/mood', {
      method: 'POST',
      body: JSON.stringify({ mood }),
    });
  }, [apiCall]);

  const togglePlay = useCallback(async () => {
    await apiCall('/playback/toggle', { method: 'POST' });
  }, [apiCall]);

  const next = useCallback(async () => {
    await apiCall('/playback/next', { method: 'POST' });
  }, [apiCall]);

  const previous = useCallback(async () => {
    await apiCall('/playback/previous', { method: 'POST' });
  }, [apiCall]);

  const setMode = useCallback(async (mode: 'local' | 'suno') => {
    await apiCall('/playback/mode', {
      method: 'POST',
      body: JSON.stringify({ mode }),
    });
  }, [apiCall]);

  const toggleMute = useCallback(async () => {
    await apiCall('/playback/mute', { method: 'POST' });
  }, [apiCall]);

  const setCrossfade = useCallback(async (duration: number) => {
    await apiCall('/settings/crossfade', {
      method: 'POST',
      body: JSON.stringify({ duration }),
    });
  }, [apiCall]);

  const setVolume = useCallback(async (volume: number) => {
    await apiCall('/playback/volume', {
      method: 'POST',
      body: JSON.stringify({ volume }),
    });
  }, [apiCall]);

  const updateSettings = useCallback(async (settings: Partial<PlayerSettings>) => {
    await apiCall('/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  }, [apiCall]);

  // Fetch initial state
  useEffect(() => {
    const fetchInitialState = async () => {
      try {
        const [state, settings] = await Promise.all([
          apiCall('/state'),
          apiCall('/settings'),
        ]);
        if (state) onStateUpdate(state);
        if (settings) onSettingsUpdate(settings);
      } catch (error) {
        console.error('Failed to fetch initial state:', error);
      }
    };

    fetchInitialState();
  }, [apiCall, onStateUpdate, onSettingsUpdate]);

  return {
    setMood,
    togglePlay,
    next,
    previous,
    setMode,
    toggleMute,
    setCrossfade,
    setVolume,
    updateSettings,
  };
}

