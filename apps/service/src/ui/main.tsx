import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage, OpenFMApp } from '@openfm/ui';
// Import styles - relative to Vite root (src/ui)
import '../../../../packages/ui/src/styles.css';
import { ServicePlayerProvider } from './ServicePlayerProvider';

const API_BASE = 'http://127.0.0.1:6767/api';

function PlayerPage() {
  const [sunoApiKey, setSunoApiKey] = useState<string>('');
  const [libraryRoot, setLibraryRoot] = useState<string>('');
  const [enabledMoods, setEnabledMoods] = useState<Set<string>>(new Set());

  // Fetch initial Suno API key
  React.useEffect(() => {
    fetch(`${API_BASE}/suno/api-key`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.apiKey) {
          setSunoApiKey(data.apiKey);
        }
      })
      .catch(() => {
        // Ignore errors if endpoint doesn't exist yet
      });
  }, []);

  // Fetch initial library root
  React.useEffect(() => {
    fetch(`${API_BASE}/library/root`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.rootPath) {
          setLibraryRoot(data.rootPath);
        }
      })
      .catch(() => {
        // Ignore errors if endpoint doesn't exist yet
      });
  }, []);

  // Fetch library and extract enabled moods
  React.useEffect(() => {
    fetch(`${API_BASE}/library`)
      .then((res) => (res.ok ? res.json() : null))
      .then((library) => {
        if (Array.isArray(library)) {
          const enabled = new Set<string>(
            library
              .filter((mood: any) => mood.enabled && mood.tracks?.length > 0)
              .map((mood: any) => mood.id)
          );
          setEnabledMoods(enabled);
        }
      })
      .catch(() => {
        // Ignore errors if endpoint doesn't exist yet
      });
  }, []);

  // Handle Suno API key change
  const handleSunoApiKeyChange = useCallback(async (key: string) => {
    try {
      const response = await fetch(`${API_BASE}/suno/api-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: key }),
      });
      if (response.ok) {
        setSunoApiKey(key);
      }
    } catch (error) {
      console.error('Failed to save Suno API key:', error);
    }
  }, []);

  // Handle library root change
  const handleLibraryRootChange = useCallback(async (path: string) => {
    try {
      const response = await fetch(`${API_BASE}/library/root`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rootPath: path }),
      });
      if (response.ok) {
        setLibraryRoot(path);
      }
    } catch (error) {
      console.error('Failed to save library root:', error);
    }
  }, []);

  // Handle library rescan
  const handleLibraryRescan = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/library/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rootPath: libraryRoot }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Library scan successful:', data);

      // Update enabled moods after scan
      if (data.moods && Array.isArray(data.moods)) {
        const enabled = new Set<string>(
          data.moods
            .filter((mood: any) => mood.enabled && mood.tracks?.length > 0)
            .map((mood: any) => mood.id)
        );
        setEnabledMoods(enabled);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Failed to rescan library:', errorMessage);
      alert(`Failed to rescan library: ${errorMessage}`);
    }
  }, [libraryRoot]);

  return (
    <ServicePlayerProvider>
      <OpenFMApp
        mode="desktop"
        sunoApiKey={sunoApiKey}
        onSunoApiKeyChange={handleSunoApiKeyChange}
        libraryRoot={libraryRoot}
        onLibraryRootChange={handleLibraryRootChange}
        onLibraryRescan={handleLibraryRescan}
        enabledMoods={enabledMoods as Set<'epic' | 'romantic' | 'funny' | 'scary' | 'sad'>}
      />
    </ServicePlayerProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/player" element={<PlayerPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
