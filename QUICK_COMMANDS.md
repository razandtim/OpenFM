# 🚀 Quick Commands Reference

## ✅ Most Common Commands

### Start Development (RECOMMENDED)
```powershell
pnpm run dev:web
```
**Starts**: Core + UI + Service (skips desktop app)  
**Use this**: For day-to-day development  
**URL**: http://127.0.0.1:6767

---

## 🔧 Other Commands

### Start Only Service
```powershell
pnpm run service
```

### Start Everything (Including Desktop - needs icons)
```powershell
pnpm run dev
```
⚠️ **Warning**: Desktop app requires icon files! Use `dev:web` instead.

### Check Service Health
```powershell
curl http://127.0.0.1:6767/health
```

### Kill Port 6767 (if stuck)
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 6767).OwningProcess | Stop-Process -Force
```

---

## 🐛 Common Issues

### Issue: "Port 6767 already in use"

**Quick Fix**:
```powershell
# Kill the process
Get-Process -Id (Get-NetTCPConnection -LocalPort 6767).OwningProcess | Stop-Process -Force

# Restart
pnpm run dev:web
```

### Issue: "Desktop app fails with icon error"

**Quick Fix**: Use `dev:web` instead:
```powershell
pnpm run dev:web
```

The desktop app is **optional** - the service works perfectly without it!

---

## 📦 Build Commands

### Build All Packages
```powershell
pnpm --filter @openfm/core run build
pnpm --filter @openfm/ui run build
```

### Build OBS Plugin (Windows)
```powershell
cd apps\obs-plugin
.\build-windows.ps1 -Install
```

---

## 🧪 Testing

### Test Service
```powershell
# Health check
curl http://127.0.0.1:6767/health

# API state
curl http://127.0.0.1:6767/api/state

# Settings
curl http://127.0.0.1:6767/api/settings
```

### Open UI in Browser
```
http://127.0.0.1:6767/ui
```

---

## 🎯 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Port already in use | Kill process: `Get-Process -Id (Get-NetTCPConnection -LocalPort 6767).OwningProcess \| Stop-Process -Force` |
| Desktop app won't build | Use `pnpm run dev:web` instead |
| Service won't start | Check if port 6767 is free |
| Changes not showing | Restart with `Ctrl+C` then `pnpm run dev:web` |

---

## 💡 Pro Tips

### 1. Always Use `dev:web` for Development
```powershell
pnpm run dev:web  # ✅ Recommended
```

### 2. Check Logs
The terminal shows real-time logs for:
- `@openfm/core` - Core package compilation
- `@openfm/ui` - UI package compilation
- `@openfm/service` - Service runtime logs

### 3. Hot Reload
- **Service**: Auto-reloads on file changes ✅
- **Core/UI**: Auto-compiles on save ✅
- **Desktop**: Requires manual restart (optional)

### 4. Stop Services
Press `Ctrl+C` in the terminal where `dev:web` is running

---

## 📁 File Structure Reference

```
D:\stuff\INFO\OpenFM\
├── apps/
│   ├── service/       ← Main service (port 6767)
│   ├── desktop/       ← Optional Tauri app
│   └── obs-plugin/    ← OBS integration
├── packages/
│   ├── core/          ← Shared logic
│   └── ui/            ← React components
└── sample-mood-packs/ ← Test music
```

---

## 🎵 Sample Music

Your test music is in:
```
D:\stuff\INFO\OpenFM\sample-mood-packs\
├── Epic/      ← 10 MP3 files
├── Funny/     ← 10 MP3 files
├── Romantic/  ← 10 MP3 files
├── Sad/       ← 10 MP3 files
└── Scary/     ← 10 MP3 files
```

---

## 🔗 Important URLs

| URL | Purpose |
|-----|---------|
| http://127.0.0.1:6767 | Main service |
| http://127.0.0.1:6767/health | Health check |
| http://127.0.0.1:6767/ui | Web UI |
| http://127.0.0.1:6767/api/state | API state |

---

## 📖 Documentation

- **Quick Start**: `READY.md`
- **Full Guide**: `INSTALLATION.md`
- **Icon Reference**: `docs/LUCIDE_ICONS.md`
- **OBS Build**: `apps/obs-plugin/BUILD_GUIDE.md`
- **API Docs**: `docs/API.md`

---

## ⚡ Copy-Paste Ready

### Standard Development Session
```powershell
# 1. Navigate to project
cd D:\stuff\INFO\OpenFM

# 2. Start development
pnpm run dev:web

# 3. Open browser
# Navigate to: http://127.0.0.1:6767/ui

# 4. When done, stop with Ctrl+C
```

### If Port is Stuck
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 6767).OwningProcess | Stop-Process -Force
pnpm run dev:web
```

### Quick Health Check
```powershell
curl http://127.0.0.1:6767/health
```

---

## 🎯 Remember

- ✅ **Always use `dev:web`** for development
- ✅ **Desktop app is optional** - service works standalone
- ✅ **Service auto-reloads** on file changes
- ✅ **Check health** at `/health` endpoint
- ✅ **Press Ctrl+C** to stop

---

**Bookmark this file for quick reference!** 📌

