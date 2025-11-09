import { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Search } from 'lucide-react';
import './App.css';

interface Track {
  title: string;
  artist: string;
  mood: string;
  duration: number;
  elapsed: number;
  artwork?: string;
}

type MoodId = 'epic' | 'romantic' | 'funny' | 'scary' | 'sad';

const MOODS: Array<{ id: MoodId; label: string; color: string; icon: string }> = [
  { id: 'epic', label: 'epic', color: '#FFB3BA', icon: '⚡' },
  { id: 'romantic', label: 'yee', color: '#FFDAB3', icon: '💖' },
  { id: 'funny', label: 'waa', color: '#B3F5F5', icon: '😂' },
  { id: 'scary', label: 'iubi', color: '#C5F5C5', icon: '👻' },
  { id: 'sad', label: 'ha', color: '#D4C5F9', icon: '😢' },
];

function App() {
  const [currentMood, setCurrentMood] = useState<MoodId>('epic');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack] = useState<Track>({
    title: 'Carolina Jambala',
    artist: 'Romeo Fantastik',
    mood: 'EPIC',
    duration: 410, // 6:50 in seconds
    elapsed: 0,
    artwork: undefined,
  });
  const [volume, setVolume] = useState(0.7);
  const [showSidebar] = useState(true);

  // Connect to service WebSocket
  useEffect(() => {
    // TODO: Connect to ws://127.0.0.1:6767/ws
    // For now, using mock data
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // TODO: Call API to toggle playback
  };

  const selectMood = (moodId: MoodId) => {
    setCurrentMood(moodId);
    // TODO: Call API to change mood
  };

  const moodColor = MOODS.find(m => m.id === currentMood)?.color || '#FFB3BA';

  return (
    <div className="app" style={{ backgroundColor: moodColor }}>
      {/* Sidebar */}
      {showSidebar && (
        <div className="sidebar">
          <div className="logo">OpenFM</div>
          <nav className="nav">
            <button className="nav-item active">home</button>
            <button className="nav-item">music</button>
            <button className="nav-item">library</button>
            <button className="nav-item">What's your mood</button>
          </nav>
          <div className="auth-buttons">
            <button className="btn-secondary">LOG IN</button>
            <button className="btn-secondary">REGISTER</button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input type="text" placeholder="SEARCH" className="search-input" />
          </div>
        </header>

        {/* Mood Selector */}
        <section className="mood-section">
          <h2 className="section-title">CHOOSE YOUR MOOD</h2>
          <div className="mood-grid">
            {MOODS.map((mood) => (
              <button
                key={mood.id}
                className={`mood-card ${currentMood === mood.id ? 'active' : ''}`}
                style={{ backgroundColor: mood.color }}
                onClick={() => selectMood(mood.id)}
              >
                <span className="mood-icon">{mood.icon}</span>
                <span className="mood-label">{mood.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Now Playing */}
        <section className="now-playing-section">
          <div className="now-playing-header">
            <span className="now-playing-badge">NOW PLAYING • {currentTrack.mood}</span>
          </div>
          
          <div className="now-playing-content">
            <div className="track-info">
              <h1 className="track-title">{currentTrack.title}</h1>
              <p className="track-artist">{currentTrack.artist} • {currentTrack.mood}</p>

              {/* Progress Bar */}
              <div className="progress-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(currentTrack.elapsed / currentTrack.duration) * 100}%` }}
                  />
                </div>
                <div className="progress-time">
                  <span>{formatTime(currentTrack.elapsed)}</span>
                  <span>{formatTime(currentTrack.duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="controls">
                <div className="volume-control">
                  <Volume2 size={20} />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="volume-slider"
                  />
                </div>

                <div className="playback-controls">
                  <button className="control-btn">
                    <SkipBack size={20} />
                  </button>
                  <button className="control-btn play-btn" onClick={togglePlay}>
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    <span className="play-label">plei</span>
                  </button>
                  <button className="control-btn">
                    <SkipForward size={20} />
                  </button>
                </div>

                <button className="next-btn">
                  niext
                </button>
              </div>
            </div>

            {/* Album Art */}
            <div className="album-art" style={{ backgroundColor: '#B3F5F5' }}>
              {currentTrack.artwork ? (
                <img src={currentTrack.artwork} alt="Album art" />
              ) : (
                <div className="album-art-placeholder" />
              )}
            </div>
          </div>
        </section>

        {/* Featured Stations */}
        <section className="featured-section">
          <h2 className="section-title">FEATURED STATIONS</h2>
          <div className="stations-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="station-card">
                <div className="station-placeholder" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;

