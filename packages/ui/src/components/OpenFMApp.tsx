import React, { useState } from 'react';
import clsx from 'clsx';
import { Settings as SettingsIcon } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { MoodSelector } from './MoodSelector';
import { NowPlaying } from './NowPlaying';
import { SunoGrid } from './SunoGrid';
import { SearchBar } from './SearchBar';
import { Auth } from './Auth';
import { Settings } from './Settings';
import { usePlayer } from '../context/PlayerContext';
import { MOOD_BACKGROUNDS, getMoodConfig } from '@openfm/core';
import type { MoodId, SunoTrack } from '@openfm/core';

export interface OpenFMAppProps {
  // Auth
  isAuthenticated?: boolean;
  userEmail?: string;
  onSignIn?: (email: string, password: string) => Promise<void>;
  onSignUp?: (email: string, password: string) => Promise<void>;
  onSignOut?: () => Promise<void>;
  
  // Library
  enabledMoods?: Set<MoodId>;
  libraryRoot?: string;
  onLibraryRootChange?: (path: string) => void;
  onLibraryRescan?: () => void;
  
  // Suno
  sunoTracks?: SunoTrack[];
  sunoApiKey?: string;
  onSunoApiKeyChange?: (key: string) => void;
  onSunoTrackSelect?: (track: SunoTrack) => void;
  isSunoLoading?: boolean;
  
  // OBS
  availableOBSSources?: string[];
  audioPriorityOverrides?: string[];
  onAudioPriorityChange?: (sources: string[]) => void;
  
  // UI Mode
  mode?: 'dock' | 'desktop';
  className?: string;
}

export function OpenFMApp({
  isAuthenticated,
  userEmail,
  onSignIn,
  onSignUp,
  onSignOut,
  enabledMoods,
  libraryRoot,
  onLibraryRootChange,
  onLibraryRescan,
  sunoTracks = [],
  sunoApiKey,
  onSunoApiKeyChange,
  onSunoTrackSelect,
  isSunoLoading,
  availableOBSSources,
  audioPriorityOverrides,
  onAudioPriorityChange,
  mode = 'desktop',
  className,
}: OpenFMAppProps) {
  const player = usePlayer();
  // Don't destructure functions - use player.function() to ensure we always call the latest version
  // This allows service wrappers to override these functions dynamically
  const { state, settings } = player;
  
  const [showAuth, setShowAuth] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [authError, setAuthError] = useState<string>();
  const [searchResults, setSearchResults] = useState<{
    sunoTracks?: SunoTrack[];
    moodTracks?: Array<{ id: string; title: string; mood: MoodId }>;
  }>();
  const [isSearching, setIsSearching] = useState(false);

  const handleSignIn = async (email: string, password: string) => {
    try {
      await onSignIn?.(email, password);
      setShowAuth(false);
      setAuthError(undefined);
    } catch (error) {
      setAuthError(String(error));
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    try {
      await onSignUp?.(email, password);
      setShowAuth(false);
      setAuthError(undefined);
    } catch (error) {
      setAuthError(String(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await onSignOut?.();
      setShowAuth(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getHeaderStatus = (): string => {
    if (state.isMuted) return 'All muted';
    if (state.isLoading) return 'Loading...';
    if (state.isPlaying && state.currentTrack) {
      return `Playing: ${state.currentMood}`;
    }
    return 'Ready';
  };

  const isDockMode = mode === 'dock';
  
  // Get background based on current mood
  const currentMood = state.currentMood || 'epic';
  const moodConfig = getMoodConfig(currentMood);
  const backgroundStyle = {
    background: MOOD_BACKGROUNDS[currentMood],
  };

  return (
    <div
      className={clsx(
        'relative flex h-screen flex-col text-white transition-colors duration-500 overflow-hidden',
        className
      )}
      style={backgroundStyle}
    >
      {/* Background Grid Overlay */}
      <div className="bg-grid absolute inset-0 opacity-30" aria-hidden />
      
      {/* Content */}
      <div className="relative z-10 flex h-full overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          onAuthClick={() => setShowAuth(!showAuth)}
          onSignIn={() => setShowAuth(true)}
          onSignUp={() => setShowAuth(true)}
          isAuthenticated={isAuthenticated}
        />
        
        {/* Main Content Area */}
        <div className="flex flex-1 flex-col h-screen">
          {/* Top Bar with Search and Player Controls */}
          <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-6 py-4">
            <SearchBar
              onSearch={async (query) => {
                setIsSearching(true);
                try {
                  const response = await fetch(`http://127.0.0.1:6767/api/search?q=${encodeURIComponent(query)}`);
                  if (response.ok) {
                    const data = await response.json();
                    setSearchResults({
                      sunoTracks: data.sunoTracks || [],
                      moodTracks: data.moodTracks || [],
                    });
                  }
                } catch (error) {
                  console.error('Search error:', error);
                } finally {
                  setIsSearching(false);
                }
              }}
              searchResults={searchResults}
              isLoading={isSearching}
              className="flex-1 max-w-md"
            />
            
            {/* Settings Button */}
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="ml-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition hover:border-white/30 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Settings"
            >
              <SettingsIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Modals */}
          {showAuth && onSignIn && onSignUp && onSignOut && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm">
              <div className="w-full max-w-md">
                <Auth
                  isSignedIn={!!isAuthenticated}
                  userEmail={userEmail}
                  onSignIn={handleSignIn}
                  onSignUp={handleSignUp}
                  onSignOut={handleSignOut}
                  onClose={() => setShowAuth(false)}
                  error={authError}
                />
              </div>
            </div>
          )}

          {showSettings && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm">
              <div className="h-full w-full max-w-2xl">
              <Settings
                settings={settings}
                onSettingsChange={(s) => player.updateSettings(s)}
                onClose={() => setShowSettings(false)}
                libraryRoot={libraryRoot}
                onLibraryRootChange={onLibraryRootChange}
                onLibraryRescan={onLibraryRescan}
                sunoApiKey={sunoApiKey}
                onSunoApiKeyChange={onSunoApiKeyChange}
                audioPriorityOverrides={audioPriorityOverrides}
                onAudioPriorityChange={onAudioPriorityChange}
                availableOBSSources={availableOBSSources}
                volume={state.volume}
                onVolumeChange={(v) => player.setVolume(v)}
                crossfadeDuration={state.crossfadeDuration}
                onCrossfadeChange={(d) => player.setCrossfade(d)}
              />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 space-y-6 p-6 overflow-y-auto">
          {/* Now Playing */}
          <NowPlaying
            currentTrack={state.currentTrack}
            currentMood={state.currentMood || 'epic'}
            isPlaying={state.isPlaying}
            isLoading={state.isLoading}
            elapsed={state.elapsed}
            duration={state.duration}
            progress={state.progress}
            onTogglePlay={() => player.togglePlay()}
            onNext={() => player.next()}
          />

          {/* Mood Selector - Always show for local mode */}
          <MoodSelector
            currentMood={state.currentMood || 'epic'}
            onMoodSelect={(mood) => {
              console.log('Mood selected:', mood);
              player.setMood(mood);
            }}
            enabledMoods={enabledMoods}
            isLoading={state.isLoading}
            isPlaying={state.isPlaying}
          />
        </div>
        </div>
      </div>
    </div>
  );
}

