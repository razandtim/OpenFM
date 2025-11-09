import { useEffect, useRef } from 'react';
import type { Track, PlaybackState } from '@openfm/core';

const API_BASE = 'http://127.0.0.1:6767/api';

/**
 * Hook to handle audio playback in the browser
 * Listens to state changes and plays audio via HTMLAudioElement
 */
export function useAudioPlayer(
  state: PlaybackState, 
  onNext: () => void,
  onProgressUpdate?: (elapsed: number, duration: number, progress: number) => void
) {
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
      
      // Wait for audio to be ready, then auto-play if state says we should be playing
      const playWhenReady = () => {
        console.log('Audio can play, clearing loading and checking if we should auto-play');
        // Clear loading state immediately when audio can play
        const duration = audioRef.current?.duration || 0;
        fetch(`${API_BASE}/playback/progress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            elapsed: 0, 
            duration,
            clearLoading: true 
          }),
        }).catch(() => {});
        
        // Check current playback state - only auto-play if state.isPlaying is true
        fetch(`${API_BASE}/state`)
          .then(res => res.json())
          .then(stateData => {
            if (audioRef.current && stateData.isPlaying) {
              console.log('State says we should be playing, attempting auto-play');
              audioRef.current.play()
                .then(() => {
                  console.log('Auto-play successful');
                })
                .catch((err) => {
                  // Autoplay was blocked - this is expected and OK
                  // The user can click play manually
                  console.log('Autoplay blocked (expected):', err.message);
                  // Update state to reflect we're not playing
                  fetch(`${API_BASE}/playback/pause`, { method: 'POST' }).catch(() => {});
                });
            } else {
              console.log('State says we should not be playing, skipping auto-play');
            }
          })
          .catch(err => {
            console.error('Error fetching state for auto-play check:', err);
          });
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
        const duration = audioRef.current?.duration || 0;
        fetch(`${API_BASE}/playback/progress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            elapsed: 0, 
            duration,
            clearLoading: true 
          }),
        }).catch(() => {});
        // Try to play even if timeout, but only if state says we should be playing
        if (audioRef.current && audioRef.current.readyState >= 2) {
          fetch(`${API_BASE}/state`)
            .then(res => res.json())
            .then(stateData => {
              if (audioRef.current && stateData.isPlaying) {
                audioRef.current.play()
                  .then(() => {
                    console.log('Fallback timeout play successful');
                  })
                  .catch(() => {});
              }
            })
            .catch(() => {});
        }
      }, 3000);
      
      // Cleanup timeouts if component unmounts or track changes
      return () => {
        clearTimeout(loadTimeoutId);
        clearTimeout(fallbackTimeoutId);
      };
    }
  }, [state.currentTrack?.id]);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;
    
    // Only handle play/pause if we have a track loaded AND the audio src is set
    if (state.currentTrack && currentTrackIdRef.current === state.currentTrack.id && audioRef.current.src) {
      if (state.isPlaying && !audioRef.current.paused) {
        // Already playing, do nothing
        return;
      }
      
      if (state.isPlaying && audioRef.current.paused) {
        console.log('Playing audio:', state.currentTrack.title);
        // Only try to play if the audio is ready
        if (audioRef.current.readyState >= 2) {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log('Audio playback started');
              })
              .catch((err) => {
                console.error('Error playing audio:', err);
                // If play fails, update state to reflect that
                fetch(`${API_BASE}/playback/pause`, { method: 'POST' }).catch(() => {});
              });
          }
        } else {
          console.log('Audio not ready yet, waiting for canplay event');
        }
      } else if (!state.isPlaying && !audioRef.current.paused) {
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
  // Note: Progress updates are kept local for smooth UI, not sent to API every 500ms
  // Only send duration updates when metadata loads
  useEffect(() => {
    if (!audioRef.current) return;

    // Send duration update when metadata loads
    const handleMetadata = () => {
      if (audioRef.current) {
        const duration = audioRef.current.duration || 0;
        // Only send duration to API, not elapsed time
        fetch(`${API_BASE}/playback/progress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            elapsed: 0, 
            duration,
          }),
        }).catch(() => {});
      }
    };
    
    audioRef.current.addEventListener('loadedmetadata', handleMetadata);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('loadedmetadata', handleMetadata);
      }
    };
  }, [state.currentTrack?.id]);

  // Track progress and send updates to parent via callback
  useEffect(() => {
    if (!onProgressUpdate) return;

    let lastUpdateTime = 0;
    let lastElapsed = 0;
    const updateThrottleMs = 100; // Update UI every 100ms
    let animationFrameId: number;
    
    const updateProgress = () => {
      const audio = audioRef.current;
      if (audio && !audio.paused && audio.duration > 0) {
        const now = Date.now();
        
        // Throttle updates
        if (now - lastUpdateTime >= updateThrottleMs) {
          lastUpdateTime = now;
          
          const elapsed = audio.currentTime || 0;
          const duration = audio.duration || 0;
          const progress = duration > 0 ? elapsed / duration : 0;
          
          // Only update if elapsed changed
          if (Math.abs(elapsed - lastElapsed) > 0.01) {
            lastElapsed = elapsed;
            onProgressUpdate(elapsed, duration, progress);
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
  }, [onProgressUpdate]);
}

