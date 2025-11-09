import { useCallback, useEffect, useState } from 'react';
import './App.css';

const SERVICE_ORIGIN = 'http://127.0.0.1:6767';
const UI_URL = `${SERVICE_ORIGIN}/player`;
const HEALTH_URL = `${SERVICE_ORIGIN}/health`;

type ServiceStatus = 'checking' | 'ready' | 'error';

export default function App() {
  const [status, setStatus] = useState<ServiceStatus>('checking');
  const [lastError, setLastError] = useState<string | null>(null);

  const checkService = useCallback(async () => {
    try {
      setLastError(null);
      const response = await fetch(HEALTH_URL, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Health check failed with ${response.status}`);
      }
      setStatus('ready');
    } catch (error) {
      setStatus('error');
      setLastError(error instanceof Error ? error.message : 'Unknown error');
    }
  }, []);

  useEffect(() => {
    checkService();
    const interval = setInterval(checkService, 5000);
    return () => clearInterval(interval);
  }, [checkService]);

  if (status !== 'ready') {
    return (
      <div className="app-shell">
        <div className="status-card">
          <h1>Connecting to OpenFM</h1>
          {status === 'checking' && <p>Waiting for the local service on {SERVICE_ORIGIN}...</p>}
          {status === 'error' && (
            <>
              <p>We couldn&apos;t reach the local OpenFM service.</p>
              <ol>
                <li>Make sure `pnpm service` (or the background service) is running.</li>
                <li>Verify nothing else is using port 6767.</li>
                <li>Click retry once the service is up.</li>
              </ol>
              {lastError && <code className="status-error">{lastError}</code>}
              <button className="primary-btn" onClick={checkService}>
                Retry
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <iframe
        className="app-frame"
        src={UI_URL}
        title="OpenFM UI"
        allow="autoplay; clipboard-read; clipboard-write"
      />
    </div>
  );
}
