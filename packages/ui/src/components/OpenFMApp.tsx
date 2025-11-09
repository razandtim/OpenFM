import React, { useState } from 'react';
import clsx from 'clsx';
import { Header } from './Header';
import { MoodSelector } from './MoodSelector';
import { NowPlaying } from './NowPlaying';
import { Controls } from './Controls';
import { SunoGrid } from './SunoGrid';
import { Auth } from './Auth';
import { Settings } from './Settings';
import { usePlayer } from '../context/PlayerContext';
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
  const { state, settings, setMood, togglePlay, next, previous, setMode, toggleMute, setCrossfade, setVolume, updateSettings } = player;
  
  const [showAuth, setShowAuth] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [authError, setAuthError] = useState<string>();

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

  return (
    <div
      className={clsx(
        'relative flex min-h-screen flex-col text-white',
        isDockMode ? 'h-full' : 'min-h-screen',
        className
      )}
    >
      {/* Background */}
      <div className="bg-grid absolute inset-0" aria-hidden />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col">
        <Header
          status={getHeaderStatus()}
          onAuthClick={() => setShowAuth(!showAuth)}
          onSettingsClick={() => setShowSettings(!showSettings)}
          isAuthenticated={isAuthenticated}
          userEmail={userEmail}
        />

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
                onSettingsChange={updateSettings}
                onClose={() => setShowSettings(false)}
                libraryRoot={libraryRoot}
                onLibraryRootChange={onLibraryRootChange}
                onLibraryRescan={onLibraryRescan}
                sunoApiKey={sunoApiKey}
                onSunoApiKeyChange={onSunoApiKeyChange}
                audioPriorityOverrides={audioPriorityOverrides}
                onAudioPriorityChange={onAudioPriorityChange}
                availableOBSSources={availableOBSSources}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 space-y-6 p-6">
          {/* Tab Switcher */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode('local')}
              className={clsx(
                'rounded-lg px-4 py-2 text-sm font-medium transition',
                state.mode === 'local'
                  ? 'bg-accent text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              )}
            >
              Local Moods
            </button>
            <button
              type="button"
              onClick={() => setMode('suno')}
              className={clsx(
                'rounded-lg px-4 py-2 text-sm font-medium transition',
                state.mode === 'suno'
                  ? 'bg-accent text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              )}
            >
              Suno Library
            </button>
          </div>

          {/* Now Playing */}
          <NowPlaying
            currentTrack={state.currentTrack}
            currentMood={state.currentMood || 'epic'}
            isPlaying={state.isPlaying}
            isLoading={state.isLoading}
            elapsed={state.elapsed}
            duration={state.duration}
            progress={state.progress}
            onTogglePlay={togglePlay}
            onNext={next}
          />

          {/* Content based on mode */}
          {state.mode === 'local' ? (
            <MoodSelector
              currentMood={state.currentMood || 'epic'}
              onMoodSelect={setMood}
              enabledMoods={enabledMoods}
              isLoading={state.isLoading}
              isPlaying={state.isPlaying}
            />
          ) : (
            <SunoGrid
              tracks={sunoTracks}
              currentTrackId={state.currentTrack?.id}
              onTrackSelect={onSunoTrackSelect || (() => {})}
              playbackMode={settings.playbackMode}
              onPlaybackModeChange={(mode) => updateSettings({ playbackMode: mode })}
              loop={settings.loop}
              onLoopToggle={() => updateSettings({ loop: !settings.loop })}
              isLoading={isSunoLoading}
            />
          )}

          {/* Controls */}
          <Controls
            crossfadeDuration={state.crossfadeDuration}
            onCrossfadeChange={setCrossfade}
            isMuted={state.isMuted}
            onMuteToggle={toggleMute}
            showOverlay={settings.showOverlay}
            onOverlayToggle={() => updateSettings({ showOverlay: !settings.showOverlay })}
            volume={state.volume}
            onVolumeChange={setVolume}
          />
        </div>
      </div>
    </div>
  );
}

