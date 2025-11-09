#!/usr/bin/env node

/**
 * OpenFM Service
 * Local server providing API, WebSocket, and desktop playback
 * Runs on http://127.0.0.1:6767
 */

import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import fs from 'fs';
import { setupRoutes } from './routes/index.js';
import { setupWebSocket } from './websocket.js';
import { PlaybackManager } from './playback/manager.js';
import { StateManager } from './state/manager.js';
import { scanLibrary } from '@openfm/core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.OPENFM_PORT || '6767', 10);
const HOST = '127.0.0.1';

async function main() {
  console.log('OpenFM Service starting...');

  // Create Express app
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server, path: '/ws' });

  // Create managers
  const stateManager = new StateManager();
  const playbackManager = new PlaybackManager(stateManager);

  // Load default library on startup
  const DEFAULT_LIBRARY_ROOT = 'D:\\stuff\\INFO\\OpenFM\\sample-mood-packs';
  try {
    if (fs.existsSync(DEFAULT_LIBRARY_ROOT)) {
      console.log(`Loading default library from: ${DEFAULT_LIBRARY_ROOT}`);
      const moods = await scanLibrary(DEFAULT_LIBRARY_ROOT);
      console.log(`Found ${moods.length} moods:`, moods.map((m: any) => m.id));
      stateManager.setLibrary(moods);
      // Set as default library root in preferences
      const prefs = stateManager.savePreferencesSync();
      stateManager.loadPreferences({ ...prefs, libraryRoot: DEFAULT_LIBRARY_ROOT });
      stateManager.savePreferencesSync(); // Persist the default library root
    }
  } catch (error) {
    console.error('Error loading default library:', error);
  }

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Health check
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'OpenFM',
      version: '0.1.0',
      uptime: process.uptime(),
    });
  });

  // API routes
  setupRoutes(app, stateManager, playbackManager);

  // Serve UI static files
  // Vite builds to dist/public, so check both locations
  const publicPath = path.resolve(__dirname, '../dist/public');
  const fallbackPath = path.resolve(__dirname, '../public');
  
  // Try dist/public first (production build), then fallback to public (dev)
  const reactAppPath = existsSync(publicPath) ? publicPath : fallbackPath;
  const statusPagePath = path.resolve(__dirname, '../public');
  
  console.log(`Serving React app from: ${reactAppPath}`);
  console.log(`Serving status page from: ${statusPagePath}`);
  
  // Serve React app static assets (CSS, JS, etc.) with correct paths
  app.use('/assets', express.static(path.join(reactAppPath, 'assets')));
  
  // Serve React app at root (/)
  app.use('/', express.static(reactAppPath));
  
  // Serve index.html at root and all sub-routes (SPA fallback for React app)
  app.get('/', (req, res) => {
    const indexPath = path.join(reactAppPath, 'index.html');
    if (existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send(`
        <html>
          <head><title>OpenFM App Not Found</title></head>
          <body style="font-family: sans-serif; padding: 40px; text-align: center;">
            <h1>App Not Found</h1>
            <p>The React app has not been built yet.</p>
            <p>Run: <code>pnpm run build --filter @openfm/service</code></p>
            <p>Or in development: <code>pnpm run dev</code></p>
          </body>
        </html>
      `);
    }
  });
  
  // SPA fallback - serve index.html for all root routes (except /api, /ws, /ui, /health)
  app.get('/*', (req, res, next) => {
    // Skip API routes, WebSocket, status page, and health check
    if (req.path.startsWith('/api') || 
        req.path.startsWith('/ws') || 
        req.path.startsWith('/ui') || 
        req.path === '/health') {
      return next();
    }
    
    const indexPath = path.join(reactAppPath, 'index.html');
    if (existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      next();
    }
  });
  
  // Serve status page at /ui
  app.use('/ui', express.static(statusPagePath));
  
  // Serve status page index.html at /ui
  app.get('/ui', (req, res) => {
    const indexPath = path.join(statusPagePath, 'index.html');
    if (existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Status page not found');
    }
  });
  
  // SPA fallback for status page - serve index.html for all /ui/* routes
  app.get('/ui/*', (req, res) => {
    const indexPath = path.join(statusPagePath, 'index.html');
    if (existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Status page not found');
    }
  });

  // WebSocket
  setupWebSocket(wss, stateManager);

  // Start server
  server.listen(PORT, HOST, () => {
    console.log(`\n✓ OpenFM Service running on http://${HOST}:${PORT}`);
    console.log(`✓ WebSocket available at ws://${HOST}:${PORT}/ws`);
    console.log(`✓ React App available at http://${HOST}:${PORT}/`);
    console.log(`✓ Status Page available at http://${HOST}:${PORT}/ui\n`);
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nShutting down OpenFM Service...');
    playbackManager.stop();
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  });
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

