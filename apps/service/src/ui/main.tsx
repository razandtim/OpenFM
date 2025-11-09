import React from 'react';
import ReactDOM from 'react-dom/client';
import { OpenFMApp, PlayerProvider } from '@openfm/ui';
import '@openfm/ui/styles';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

// Connect to local service
const API_BASE = 'http://127.0.0.1:6767/api';
const WS_URL = 'ws://127.0.0.1:6767/ws';

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <PlayerProvider>
      <OpenFMApp mode="desktop" />
    </PlayerProvider>
  </React.StrictMode>
);

