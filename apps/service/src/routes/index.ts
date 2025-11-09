/**
 * API Routes for OpenFM Service
 */

import type { Express } from 'express';
import type { StateManager } from '../state/manager.js';
import type { PlaybackManager } from '../playback/manager.js';
import { scanLibrary } from '@openfm/core';
import { downloadMoodPack, checkForUpdates } from '../library/downloader.js';
import { OpenFMAuth } from '@openfm/core';
import fs from 'fs';
import path from 'path';

export function setupRoutes(
  app: Express,
  stateManager: StateManager,
  playbackManager: PlaybackManager
) {
  // State endpoints
  app.get('/api/state', (req, res) => {
    res.json(stateManager.getState());
  });

  app.get('/api/settings', (req, res) => {
    res.json(stateManager.getSettings());
  });

  app.post('/api/settings', (req, res) => {
    stateManager.updateSettings(req.body);
    res.json({ success: true });
  });

  app.put('/api/settings', (req, res) => {
    stateManager.updateSettings(req.body);
    res.json({ success: true });
  });

  // Library endpoints
  app.get('/api/library', (req, res) => {
    res.json(stateManager.getLibrary());
  });

  app.get('/api/library/root', (req, res) => {
    const prefs = stateManager.savePreferencesSync();
    const rootPath = (prefs as any)?.libraryRoot || 'D:\\stuff\\INFO\\OpenFM\\sample-mood-packs';
    res.json({ rootPath });
  });

  app.post('/api/library/root', async (req, res) => {
    const { rootPath } = req.body;
    // TODO: Store in config/preferences
    const prefs = stateManager.savePreferencesSync();
    stateManager.loadPreferences({ ...prefs, libraryRoot: rootPath });
    stateManager.savePreferencesSync(); // Save updated preferences
    
    // Auto-scan if a root path is provided
    if (rootPath) {
      try {
        console.log(`Auto-scanning library at: ${rootPath}`);
        const moods = await scanLibrary(rootPath);
        console.log(`Found ${moods.length} moods:`, moods.map(m => m.id));
        stateManager.setLibrary(moods);
      } catch (error) {
        console.error('Auto-scan error:', error);
      }
    }
    
    res.json({ success: true });
  });

  app.post('/api/library/scan', async (req, res) => {
    try {
      const { rootPath } = req.body;
      if (!rootPath) {
        return res.status(400).json({ error: 'rootPath required' });
      }

      console.log(`Scanning library at: ${rootPath}`);
      const moods = await scanLibrary(rootPath);
      console.log(`Found ${moods.length} moods:`, moods.map(m => m.id));
      
      stateManager.setLibrary(moods);
      
      res.json({ success: true, moods });
    } catch (error) {
      console.error('Library scan error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({ error: errorMessage, details: String(error) });
    }
  });

  app.post('/api/library/download', async (req, res) => {
    try {
      const { moodId, url } = req.body;
      if (!moodId || !url) {
        return res.status(400).json({ error: 'moodId and url required' });
      }

      await downloadMoodPack(moodId, url);
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  app.get('/api/library/updates', async (req, res) => {
    try {
      const updates = await checkForUpdates();
      res.json(updates);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  // Playback control endpoints
  app.post('/api/playback/mood', (req, res) => {
    const { mood } = req.body;
    if (!mood) {
      return res.status(400).json({ error: 'mood required' });
    }

    stateManager.setMood(mood);
    res.json({ success: true });
  });

  app.post('/api/playback/play', (req, res) => {
    stateManager.play();
    res.json({ success: true });
  });

  app.post('/api/playback/pause', (req, res) => {
    stateManager.pause();
    res.json({ success: true });
  });

  app.post('/api/playback/toggle', (req, res) => {
    stateManager.togglePlay();
    res.json({ success: true });
  });

  app.post('/api/playback/next', (req, res) => {
    stateManager.next();
    res.json({ success: true });
  });

  app.post('/api/playback/previous', (req, res) => {
    stateManager.previous();
    res.json({ success: true });
  });

  app.post('/api/playback/mute', (req, res) => {
    stateManager.toggleMute();
    res.json({ success: true });
  });

  app.post('/api/playback/volume', (req, res) => {
    const { volume } = req.body;
    if (typeof volume !== 'number') {
      return res.status(400).json({ error: 'volume required' });
    }

    stateManager.setVolume(volume);
    res.json({ success: true });
  });

  app.post('/api/playback/progress', (req, res) => {
    const { elapsed, duration, clearLoading } = req.body;
    if (typeof elapsed !== 'number' || typeof duration !== 'number') {
      return res.status(400).json({ error: 'elapsed and duration required' });
    }

    const updates: any = { elapsed, duration, progress: duration > 0 ? elapsed / duration : 0 };
    if (clearLoading) {
      updates.isLoading = false;
    }
    stateManager.updateState(updates);
    res.json({ success: true });
  });

  app.post('/api/playback/mode', (req, res) => {
    const { mode } = req.body;
    if (!mode || !['local', 'suno'].includes(mode)) {
      return res.status(400).json({ error: 'valid mode required' });
    }

    stateManager.setMode(mode);
    res.json({ success: true });
  });

  // OBS integration
  app.post('/api/obs/active', (req, res) => {
    const { active } = req.body;
    stateManager.setOBSActive(!!active);
    res.json({ success: true });
  });

  app.get('/api/obs/active', (req, res) => {
    res.json({ active: stateManager.isOBSControlActive() });
  });

  // Suno endpoints
  app.get('/api/suno/api-key', (req, res) => {
    // TODO: Retrieve from secure storage (DPAPI/Keychain)
    // For now, return empty or from preferences
    const prefs = stateManager.savePreferencesSync();
    res.json({ apiKey: (prefs as any)?.sunoApiKey || '' });
  });

  app.post('/api/suno/api-key', (req, res) => {
    const { apiKey } = req.body;
    // TODO: Store in secure storage (DPAPI/Keychain)
    // For now, save to preferences
    const prefs = stateManager.savePreferencesSync();
    stateManager.loadPreferences({ ...prefs, sunoApiKey: apiKey });
    stateManager.savePreferencesSync(); // Persist updated preferences
    res.json({ success: true });
  });

  app.post('/api/suno/library', async (req, res) => {
    // TODO: Implement Suno library fetching
    res.json({ tracks: [] });
  });

  // Auth endpoints
  app.post('/api/auth/signin', async (req, res) => {
    // TODO: Implement auth
    res.json({ success: false, error: 'Not implemented' });
  });

  app.post('/api/auth/signup', async (req, res) => {
    // TODO: Implement auth
    res.json({ success: false, error: 'Not implemented' });
  });

  app.post('/api/auth/signout', async (req, res) => {
    // TODO: Implement auth
    res.json({ success: true });
  });

  // Preferences
  app.get('/api/preferences', (req, res) => {
    res.json(stateManager.savePreferencesSync());
  });

  app.post('/api/preferences', (req, res) => {
    stateManager.loadPreferences(req.body);
    stateManager.savePreferencesSync(); // Persist loaded preferences
    res.json({ success: true });
  });

}

