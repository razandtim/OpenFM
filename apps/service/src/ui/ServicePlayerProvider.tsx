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
  const lastStateUpdateRef = useRef<string>('');

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
              // Throttle state update logs to avoid console spam
              const stateKey = `${data.state.currentMood}-${data.state.currentTrack?.id}-${data.state.isPlaying}-${data.state.isLoading}`;
              if (stateKey !== lastStateUpdateRef.current) {
                console.log('WebSocket state update:', {
                  currentMood: data.state.currentMood,
                  currentTrack: data.state.currentTrack?.title,
                  isLoading: data.state.isLoading,
                  isPlaying: data.state.isPlaying,
                  hasTrack: !!data.state.currentTrack,
                });
                lastStateUpdateRef.current = stateKey;
              }
              
              // Always update state from WebSocket - it's the source of truth
              const newState = { ...data.state };
              setState(newState);
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
      <APIConnectedWrapper apiCall={apiCall} state={state}>
        {children}
      </APIConnectedWrapper>
    </PlayerProvider>
  );
}

// Wrapper component that intercepts PlayerContext actions and calls API
function APIConnectedWrapper({ 
  children, 
  apiCall,
  state
}: { 
  children: React.ReactNode;
  apiCall: (endpoint: string, options?: RequestInit) => Promise<any>;
  state: PlaybackState | null;
}) {
  const player = usePlayer();
  
  // Track progress locally from audio element for smooth UI updates
  // Store the last known state from WebSocket to avoid conflicts
  const lastWebSocketStateRef = React.useRef<PlaybackState | null>(null);
  
  // Sync WebSocket state to player context
  React.useEffect(() => {
    if (player.onStateChange && state) {
      // Always store the latest WebSocket state for progress tracking to use
      const prevState = lastWebSocketStateRef.current;
      lastWebSocketStateRef.current = state;
      
      // Only sync if something meaningful changed (not just progress updates)
      if (!prevState ||
          state.currentMood !== prevState.currentMood ||
          state.currentTrack?.id !== prevState.currentTrack?.id ||
          state.isPlaying !== prevState.isPlaying ||
          state.isLoading !== prevState.isLoading ||
          state.isMuted !== prevState.isMuted ||
          Math.abs(state.volume - prevState.volume) > 0.01) {
        
        console.log('Syncing WebSocket state to player context');
        player.onStateChange(state);
      }
      // If only progress changed, skip the update - let local tracking handle it
    }
  }, [state, player.onStateChange]);
  
  React.useEffect(() => {
    // Find the audio element and track its progress
    const audioElements = document.getElementsByTagName('audio');
    if (audioElements.length === 0) return;
    
    const audio = audioElements[0];
    let lastUpdateTime = 0;
    let lastElapsed = 0;
    const updateThrottleMs = 100; // Update UI every 100ms (10 times per second)
    let animationFrameId: number;
    
    const updateProgress = () => {
      if (audio && !audio.paused && audio.duration > 0) {
        const now = Date.now();
        
        // Throttle updates to avoid too many state changes
        if (now - lastUpdateTime >= updateThrottleMs) {
          lastUpdateTime = now;
          
          const elapsed = audio.currentTime || 0;
          const duration = audio.duration || 0;
          const progress = duration > 0 ? elapsed / duration : 0;
          
          // Only update if elapsed actually changed
          if (Math.abs(elapsed - lastElapsed) > 0.01) {
            lastElapsed = elapsed;
            
            // Use the last WebSocket state as base to avoid overwriting backend changes
            const baseState = lastWebSocketStateRef.current;
            if (baseState && player.onStateChange) {
              player.onStateChange({ 
                ...baseState, 
                elapsed, 
                duration, 
                progress 
              });
            }
          }
        }
      }
      animationFrameId = requestAnimationFrame(updateProgress);
    };
    
    animationFrameId = requestAnimationFrame(updateProgress);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [player.state?.currentTrack?.id, player.onStateChange]);
  
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
    // IMPORTANT: Only call the API, don't call original functions
    // Let WebSocket sync the state back to avoid race conditions
    (player as any).setMood = async (mood: MoodId) => {
      console.log('Mood selected:', mood);
      await apiCall('/playback/mood', {
        method: 'POST',
        body: JSON.stringify({ mood }),
      });
      // Don't call originalSetMood - let WebSocket update state
    };

    (player as any).togglePlay = async () => {
      console.log('Toggle play clicked');
      await apiCall('/playback/toggle', { method: 'POST' });
      // Don't call originalTogglePlay - let WebSocket update state
    };

    (player as any).next = async () => {
      console.log('Next track clicked');
      await apiCall('/playback/next', { method: 'POST' });
      // Don't call originalNext - let WebSocket update state
    };

    (player as any).previous = async () => {
      console.log('Previous track clicked');
      await apiCall('/playback/previous', { method: 'POST' });
      // Don't call originalPrevious - let WebSocket update state
    };

    (player as any).setMode = async (mode: 'local' | 'suno') => {
      console.log('Mode changed to:', mode);
      await apiCall('/playback/mode', {
        method: 'POST',
        body: JSON.stringify({ mode }),
      });
      // Don't call originalSetMode - let WebSocket update state
    };

    (player as any).toggleMute = async () => {
      console.log('Toggle mute clicked');
      await apiCall('/playback/mute', { method: 'POST' });
      // Don't call originalToggleMute - let WebSocket update state
    };

    (player as any).setCrossfade = async (duration: number) => {
      console.log('Crossfade changed to:', duration);
      await apiCall('/settings', {
        method: 'POST',
        body: JSON.stringify({ crossfadeDuration: duration }),
      });
      // Don't call originalSetCrossfade - let WebSocket update state
    };

    (player as any).setVolume = async (volume: number) => {
      // Volume can be updated locally for instant feedback
      originalSetVolume(volume);
      await apiCall('/playback/volume', {
        method: 'POST',
        body: JSON.stringify({ volume }),
      });
    };

    (player as any).updateSettings = async (newSettings: Partial<PlayerSettings>) => {
      console.log('Settings updated:', newSettings);
      await apiCall('/settings', {
        method: 'POST',
        body: JSON.stringify(newSettings),
      });
      // Don't call originalUpdateSettings - let WebSocket update state
    };
  }, [player, apiCall, originalSetVolume]);

  return <>{children}</>;
}

