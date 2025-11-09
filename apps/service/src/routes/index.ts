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
  // Audio file serving endpoint - register early to avoid SPA fallback
  // Use app.use with a path to catch all /api/audio/* requests
  app.use('/api/audio', (req, res, next) => {
    try {
      // Get the file path from the URL (everything after /api/audio/)
      // req.path will be like '/D%3A/stuff/...' (without /api/audio prefix)
      // req.originalUrl will be like '/api/audio/D%3A/stuff/...'
      let urlPath = req.path;
      
      // Remove leading slash if present
      if (urlPath.startsWith('/')) {
        urlPath = urlPath.substring(1);
      }
      
      // If path is empty, try to get from originalUrl
      if (!urlPath && req.originalUrl) {
        const match = req.originalUrl.match(/^\/api\/audio\/(.+)$/);
        urlPath = match ? match[1] : '';
      }
      
      if (!urlPath) {
        return res.status(400).json({ error: 'No file path provided' });
      }
      
      // Decode the URL-encoded path
      let filePath = decodeURIComponent(urlPath);
      
      console.log(`[Audio Route] Request URL: ${req.url}`);
      console.log(`[Audio Route] Request path: ${req.path}`);
      console.log(`[Audio Route] Original URL: ${req.originalUrl}`);
      console.log(`[Audio Route] Extracted path: ${urlPath}`);
      console.log(`[Audio Route] Decoded path: ${filePath}`);
      
      // Convert forward slashes back to backslashes on Windows
      if (process.platform === 'win32') {
        filePath = filePath.replace(/\//g, '\\');
      }
      
      console.log(`[Audio Route] Final file path: ${filePath}`);
      
      // Security: ensure file exists
      if (!fs.existsSync(filePath)) {
        console.error(`[Audio Route] Audio file not found: ${filePath}`);
        return res.status(404).json({ error: 'File not found', path: filePath });
      }
      
      console.log(`[Audio Route] Serving audio file: ${filePath}`);
      
      // Determine content type based on file extension
      const ext = path.extname(filePath).toLowerCase();
      const contentTypeMap: Record<string, string> = {
        '.mp3': 'audio/mpeg',
        '.wav': 'audio/wav',
        '.ogg': 'audio/ogg',
        '.m4a': 'audio/mp4',
        '.flac': 'audio/flac',
      };
      const contentType = contentTypeMap[ext] || 'audio/mpeg';
      
      // Set appropriate headers for audio streaming
      res.setHeader('Content-Type', contentType);
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Cache-Control', 'no-cache');
      
      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.on('error', (err: Error) => {
        console.error('Error streaming audio file:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Error streaming audio' });
        }
      });
      fileStream.pipe(res);
    } catch (error) {
      console.error('Error serving audio file:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error serving audio file' });
      }
    }
  });
  
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
    console.log('[Mood API] Request body:', req.body);
    const { mood } = req.body;
    console.log('[Mood API] Extracted mood:', mood);
    if (!mood) {
      console.log('[Mood API] ERROR: No mood provided');
      return res.status(400).json({ error: 'mood required' });
    }

    console.log('[Mood API] Calling stateManager.setMood with:', mood);
    stateManager.setMood(mood);
    console.log('[Mood API] Mood set successfully');
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
    
    // elapsed and duration are optional (can be 0 or undefined)
    const updates: any = {};
    if (typeof elapsed === 'number') {
      updates.elapsed = elapsed;
    }
    if (typeof duration === 'number') {
      updates.duration = duration;
      updates.progress = duration > 0 && typeof elapsed === 'number' ? elapsed / duration : 0;
    }
    
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

  // Search endpoint
  app.get('/api/search', async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
      }

      const query = q.toLowerCase();
      const library = stateManager.getLibrary();
      
      // Search local mood tracks
      const moodTracks: Array<{ id: string; title: string; mood: string }> = [];
      library.forEach((mood) => {
        mood.tracks.forEach((track) => {
          if (track.title.toLowerCase().includes(query) || 
              track.artist.toLowerCase().includes(query)) {
            moodTracks.push({
              id: track.id,
              title: track.title,
              mood: mood.id,
            });
          }
        });
      });

      // TODO: Search Suno tracks if API key is available
      const sunoTracks: any[] = [];

      res.json({
        sunoTracks,
        moodTracks,
      });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: String(error) });
    }
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

