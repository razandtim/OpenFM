import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PlayerProvider, usePlayer } from '@openfm/ui';
import type { PlaybackState, PlayerSettings, MoodId } from '@openfm/core';
import { useAudioPlayer } from './useAudioPlayer';

const API_BASE = 'http://127.0.0.1:6767/api';
const WS_URL = 'ws://127.0.0.1:6767/ws';

interface ServicePlayerProviderProps {
  children: React.ReactNode;
}

export function ServicePlayerProvider({ children }: ServicePlayerProviderProps) {
  const [state, setState] = useState<PlaybackState | null>(null);
  const [settings, setSettings] = useState<PlayerSettings | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Connect to WebSocket
  useEffect(() => {
    const connect = () => {
      try {
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('WebSocket connected');
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'state' && data.state) {
              // Log state updates for debugging
              console.log('WebSocket state update:', {
                currentTrack: data.state.currentTrack?.title,
                isLoading: data.state.isLoading,
                isPlaying: data.state.isPlaying,
                hasTrack: !!data.state.currentTrack,
              });
              
              // Always update state from WebSocket - it's the source of truth
              const newState = { ...data.state };
              setState(newState);
              
              // Also update the PlayerProvider if it exists
              // The PlayerProvider should sync with this state
            } else if (data.type === 'settings' && data.settings) {
              setSettings(data.settings);
            } else if (data.type === 'library' && data.library) {
              // Library updates are handled by the main app component
              console.log('Library updated via WebSocket:', data.library.length, 'moods');
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
          reconnectTimeoutRef.current = setTimeout(connect, 3000);
        };
      } catch (error) {
        console.error('WebSocket connection error:', error);
      }
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  // Fetch initial state and set up polling as fallback
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [stateRes, settingsRes] = await Promise.all([
          fetch(`${API_BASE}/state`),
          fetch(`${API_BASE}/settings`),
        ]);
        
        if (stateRes.ok) {
          const stateData = await stateRes.json();
          console.log('Initial state fetched:', {
            currentTrack: stateData.currentTrack?.title,
            isLoading: stateData.isLoading,
          });
          // Ensure isLoading is false on initial load
          setState({ ...stateData, isLoading: false });
        } else {
          // If API fails, set default state
          setState({
            mode: 'local',
            currentMood: 'epic',
            isPlaying: false,
            isLoading: false,
            isMuted: false,
            elapsed: 0,
            duration: 0,
            progress: 0,
            volume: 0.7,
            crossfadeDuration: 250,
            queue: [],
          });
        }
        
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setSettings(settingsData);
        }
      } catch (error) {
        console.error('Failed to fetch initial state:', error);
        // Set default state on error
        setState({
          mode: 'local',
          currentMood: 'epic',
          isPlaying: false,
          isLoading: false,
          isMuted: false,
          elapsed: 0,
          duration: 0,
          progress: 0,
          volume: 0.7,
          crossfadeDuration: 250,
          queue: [],
        });
      }
    };

    fetchInitial();
    
    // Poll state as fallback if WebSocket fails (every 2 seconds)
    const pollInterval = setInterval(async () => {
      try {
        const stateRes = await fetch(`${API_BASE}/state`);
        if (stateRes.ok) {
          const stateData = await stateRes.json();
          // Only update if we don't have a current track but the API does
          setState((prev) => {
            if (!prev?.currentTrack && stateData.currentTrack) {
              console.log('Polling: Found track, updating state');
              return { ...stateData, isLoading: false };
            }
            return prev;
          });
        }
      } catch (error) {
        // Ignore polling errors
      }
    }, 2000);
    
    return () => clearInterval(pollInterval);
  }, []);

  // API call helper
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

  // API-connected action handlers
  const handleStateChange = useCallback((newState: PlaybackState) => {
    setState(newState);
  }, []);

  const handleSettingsChange = useCallback((newSettings: PlayerSettings) => {
    setSettings(newSettings);
  }, []);

  // Wrap PlayerProvider with API-connected callbacks
  return (
    <PlayerProvider
      initialState={state || undefined}
      initialSettings={settings || undefined}
      onStateChange={handleStateChange}
      onSettingsChange={handleSettingsChange}
    >
      <APIConnectedWrapper apiCall={apiCall}>
        {children}
      </APIConnectedWrapper>
    </PlayerProvider>
  );
}

// Wrapper component that intercepts PlayerContext actions and calls API
function APIConnectedWrapper({ 
  children, 
  apiCall 
}: { 
  children: React.ReactNode;
  apiCall: (endpoint: string, options?: RequestInit) => Promise<any>;
}) {
  const player = usePlayer();
  
  // Handle audio playback in the browser
  useAudioPlayer(player.state, player.next);

  // Override actions to call API
  const originalSetMood = player.setMood;
  const originalTogglePlay = player.togglePlay;
  const originalNext = player.next;
  const originalPrevious = player.previous;
  const originalSetMode = player.setMode;
  const originalToggleMute = player.toggleMute;
  const originalSetCrossfade = player.setCrossfade;
  const originalSetVolume = player.setVolume;
  const originalUpdateSettings = player.updateSettings;

  // Create API-connected versions
  React.useEffect(() => {
    // Replace actions with API calls
    (player as any).setMood = async (mood: MoodId) => {
      await apiCall('/playback/mood', {
        method: 'POST',
        body: JSON.stringify({ mood }),
      });
      originalSetMood(mood);
    };

    (player as any).togglePlay = async () => {
      await apiCall('/playback/toggle', { method: 'POST' });
      originalTogglePlay();
    };

    (player as any).next = async () => {
      await apiCall('/playback/next', { method: 'POST' });
      originalNext();
    };

    (player as any).previous = async () => {
      await apiCall('/playback/previous', { method: 'POST' });
      originalPrevious();
    };

    (player as any).setMode = async (mode: 'local' | 'suno') => {
      await apiCall('/playback/mode', {
        method: 'POST',
        body: JSON.stringify({ mode }),
      });
      originalSetMode(mode);
    };

    (player as any).toggleMute = async () => {
      await apiCall('/playback/mute', { method: 'POST' });
      originalToggleMute();
    };

    (player as any).setCrossfade = async (duration: number) => {
      await apiCall('/settings/crossfade', {
        method: 'POST',
        body: JSON.stringify({ duration }),
      });
      originalSetCrossfade(duration);
    };

    (player as any).setVolume = async (volume: number) => {
      await apiCall('/playback/volume', {
        method: 'POST',
        body: JSON.stringify({ volume }),
      });
      originalSetVolume(volume);
    };

    (player as any).updateSettings = async (newSettings: Partial<PlayerSettings>) => {
      await apiCall('/settings', {
        method: 'POST',
        body: JSON.stringify(newSettings),
      });
      originalUpdateSettings(newSettings);
    };
  }, [player, apiCall, originalSetMood, originalTogglePlay, originalNext, originalPrevious, originalSetMode, originalToggleMute, originalSetCrossfade, originalSetVolume, originalUpdateSettings]);

  return <>{children}</>;
}

