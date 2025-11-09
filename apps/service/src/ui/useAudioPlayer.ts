import { useEffect, useRef } from 'react';
import type { Track, PlaybackState } from '@openfm/core';

const API_BASE = 'http://127.0.0.1:6767/api';

/**
 * Hook to handle audio playback in the browser
 * Listens to state changes and plays audio via HTMLAudioElement
 */
export function useAudioPlayer(state: PlaybackState, onNext: () => void) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrackIdRef = useRef<string | undefined>(undefined);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      audioRef.current.onloadedmetadata = () => {
        // Duration will be updated via progress updates
      };
      
      audioRef.current.onplay = () => {
        // Don't call API here - it creates a feedback loop
        // The state is already managed by the backend via WebSocket
        // Only update progress, not play state
        fetch(`${API_BASE}/playback/progress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            elapsed: audioRef.current?.currentTime || 0, 
            duration: audioRef.current?.duration || 0,
            clearLoading: true 
          }),
        }).catch(() => {});
      };
      
      audioRef.current.onpause = () => {
        // Don't call API here - it creates a feedback loop
        // The state is already managed by the backend via WebSocket
      };
      
      audioRef.current.onended = () => {
        onNext();
      };
      
      audioRef.current.onerror = (err) => {
        console.error('Audio playback error:', err);
        // Clear loading state on error
        fetch(`${API_BASE}/playback/progress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            elapsed: 0, 
            duration: 0,
            clearLoading: true 
          }),
        }).catch(() => {});
      };
      
      audioRef.current.oncanplay = () => {
        // Clear loading state when audio is ready
        fetch(`${API_BASE}/playback/progress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            elapsed: 0, 
            duration: audioRef.current?.duration || 0,
            clearLoading: true 
          }),
        }).catch(() => {});
      };
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [onNext]);

  // Handle track changes
  useEffect(() => {
    if (!audioRef.current) return;
    
    // If no track, stop playback
    if (!state.currentTrack) {
      audioRef.current.pause();
      audioRef.current.src = '';
      currentTrackIdRef.current = undefined;
      return;
    }

    const track = state.currentTrack;
    
    // Always change audio source if track changed (check by ID)
    // Only reload if the track ID actually changed
    if (currentTrackIdRef.current !== track.id && track.filePath) {
      console.log('Loading new track:', track.title, track.filePath, 'Previous ID:', currentTrackIdRef.current);
      
      // Stop current playback first
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = ''; // Clear src first
      currentTrackIdRef.current = undefined; // Reset track ID
      
      // Wait for audio to be ready, then auto-play
      const playWhenReady = () => {
        console.log('Audio can play, clearing loading and starting playback');
        // Clear loading state immediately when audio can play
        fetch(`${API_BASE}/playback/progress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            elapsed: 0, 
            duration: audioRef.current?.duration || 0,
            clearLoading: true 
          }),
        }).catch(() => {});
        
        // Auto-play when ready (mood changes should auto-play)
        // But only if user has interacted (to avoid autoplay restrictions)
        if (audioRef.current) {
          // Try to play, but don't fail if autoplay is blocked
          audioRef.current.play().catch((err) => {
            // Autoplay was blocked - this is expected and OK
            // The user can click play manually
            console.log('Autoplay blocked (expected):', err.message);
          });
        }
      };
      
      // Small delay to ensure audio element is ready, then set src and add listeners
      const loadTimeoutId = setTimeout(() => {
        if (!audioRef.current || !state.currentTrack || state.currentTrack.id !== track.id || !track.filePath) {
          return;
        }
        
        // Load new track
        // Convert Windows backslashes to forward slashes for URL encoding
        // Then encode the path properly
        const normalizedPath = track.filePath.replace(/\\/g, '/');
        const audioUrl = `${API_BASE}/audio/${encodeURIComponent(normalizedPath)}`;
        console.log('Setting audio src to:', audioUrl);
        
        // Add event listeners before setting src
        audioRef.current.addEventListener('canplay', playWhenReady, { once: true });
        audioRef.current.addEventListener('loadeddata', playWhenReady, { once: true });
        audioRef.current.addEventListener('error', (err) => {
          console.error('[Audio] Error loading audio:', err, 'URL:', audioUrl);
        }, { once: true });
        
        audioRef.current.src = audioUrl;
        audioRef.current.load();
        currentTrackIdRef.current = track.id;
      }, 100);
      
      // Also clear loading after a timeout as fallback (3 seconds)
      const fallbackTimeoutId = setTimeout(() => {
        console.log('Timeout: clearing loading state');
        fetch(`${API_BASE}/playback/progress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            elapsed: 0, 
            duration: audioRef.current?.duration || 0,
            clearLoading: true 
          }),
        }).catch(() => {});
        // Try to play even if timeout
        if (audioRef.current && audioRef.current.readyState >= 2) {
          audioRef.current.play().catch(() => {});
        }
      }, 3000);
      
      // Cleanup timeouts if component unmounts or track changes
      return () => {
        clearTimeout(loadTimeoutId);
        clearTimeout(fallbackTimeoutId);
      };
    }
  }, [state.currentTrack?.id, state.isPlaying]);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current || !state.currentTrack) return;
    
    // Only handle play/pause if we're on the correct track
    if (currentTrackIdRef.current === state.currentTrack.id) {
      if (state.isPlaying) {
        console.log('Playing audio:', state.currentTrack.title);
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.error('Error playing audio:', err);
            // If play fails, update state to reflect that
            fetch(`${API_BASE}/playback/pause`, { method: 'POST' }).catch(() => {});
          });
        }
      } else {
        console.log('Pausing audio');
        audioRef.current.pause();
      }
    }
  }, [state.isPlaying, state.currentTrack?.id]);

  // Handle volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume;
    }
  }, [state.volume]);

  // Handle mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = state.isMuted;
    }
  }, [state.isMuted]);

  // Update progress from audio element
  useEffect(() => {
    if (!audioRef.current || !state.isPlaying) return;

    const interval = setInterval(() => {
      if (audioRef.current) {
        const elapsed = audioRef.current.currentTime || 0;
        const duration = audioRef.current.duration || state.duration;
        
        // Progress is updated via WebSocket/API, but we can sync here if needed
        if (Math.abs(elapsed - state.elapsed) > 0.5) {
          // Significant drift - could sync, but let service handle it
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [state.isPlaying, state.duration, state.elapsed]);
}

