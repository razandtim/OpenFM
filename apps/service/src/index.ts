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
import { setupRoutes } from './routes/index.js';
import { setupWebSocket } from './websocket.js';
import { PlaybackManager } from './playback/manager.js';
import { StateManager } from './state/manager.js';

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
  // __dirname in dist folder, so go up to service root, then to public
  const publicPath = path.resolve(__dirname, '../public');
  app.use('/ui', express.static(publicPath));
  
  // Serve index.html at /ui root
  app.get('/ui', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });

  // WebSocket
  setupWebSocket(wss, stateManager);

  // Start server
  server.listen(PORT, HOST, () => {
    console.log(`\n✓ OpenFM Service running on http://${HOST}:${PORT}`);
    console.log(`✓ WebSocket available at ws://${HOST}:${PORT}/ws`);
    console.log(`✓ UI available at http://${HOST}:${PORT}/ui\n`);
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

