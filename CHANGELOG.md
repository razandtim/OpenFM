# Changelog

All notable changes to OpenFM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial monorepo structure with pnpm workspaces
- Core package with mood configuration, library scanning, shuffle algorithms
- UI package with React components (MoodSelector, NowPlaying, Controls, etc.)
- Service app with Express API and WebSocket support
- Desktop app with Tauri
- OBS plugin with Qt Dock, audio management, and ducking
- Auto-push tool for development (commits every 10 files)
- GitHub Actions CI/CD for multi-platform builds
- Windows installer (Inno Setup)
- macOS installer (pkgbuild)
- Comprehensive documentation

### Features
- 5 mood-based music categories (Epic, Romantic, Funny, Scary, Sad)
- Local music library with auto-scan
- Suno AI music integration (API adapter)
- Crossfade between tracks (250ms default, 0-1000ms configurable)
- Audio priority system with sidechain ducking for OBS
- Overlay tokens for "now playing" display
- Supabase authentication integration
- WebSocket real-time state synchronization
- Mood pack download and update system

## [0.1.0] - 2024-11-09

### Added
- Initial project setup
- Core architecture implementation
- All main components (service, desktop, OBS plugin)
- Documentation suite
- Build and deployment infrastructure

---

**Note**: This is the initial release. All features are in beta and require integration testing.

