/**
 * WebSocket handler for real-time state updates
 */

import type { WebSocketServer, WebSocket } from 'ws';
import type { StateManager } from './state/manager.js';
import { generateTokens } from '@openfm/core';

export function setupWebSocket(wss: WebSocketServer, stateManager: StateManager) {
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    clients.add(ws);

    // Send current state immediately
    const state = stateManager.getState();
    const settings = stateManager.getSettings();
    const tokens = generateTokens(state);

    ws.send(
      JSON.stringify({
        type: 'state',
        state,
        settings,
        tokens,
      })
    );

    // Handle incoming messages
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        handleMessage(message, stateManager);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      clients.delete(ws);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });

  // Broadcast state changes to all clients
  stateManager.on('state:changed', (state) => {
    const tokens = generateTokens(state);
    const message = JSON.stringify({
      type: 'state',
      state,
      tokens,
    });

    broadcast(clients, message);
  });

  stateManager.on('settings:changed', (settings) => {
    const message = JSON.stringify({
      type: 'settings',
      settings,
    });

    broadcast(clients, message);
  });

  stateManager.on('library:changed', (library) => {
    const message = JSON.stringify({
      type: 'library',
      library,
    });

    broadcast(clients, message);
  });
}

function broadcast(clients: Set<WebSocket>, message: string) {
  clients.forEach((client) => {
    if (client.readyState === 1) {
      // OPEN
      client.send(message);
    }
  });
}

function handleMessage(message: any, stateManager: StateManager) {
  switch (message.type) {
    case 'ping':
      // Respond to ping
      break;

    case 'setMood':
      stateManager.setMood(message.mood);
      break;

    case 'togglePlay':
      stateManager.togglePlay();
      break;

    case 'next':
      stateManager.next();
      break;

    case 'previous':
      stateManager.previous();
      break;

    case 'toggleMute':
      stateManager.toggleMute();
      break;

    case 'setVolume':
      stateManager.setVolume(message.volume);
      break;

    default:
      console.warn('Unknown WebSocket message type:', message.type);
  }
}

