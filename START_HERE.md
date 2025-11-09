# 🚀 START HERE - OpenFM Quick Start

## ⚡ **ONE COMMAND TO START**

```powershell
pnpm run dev
```

That's it! 🎉

---

## ✅ What Just Changed?

**`pnpm run dev` now starts the service ONLY** (no desktop app)

- ✅ Starts: Core + UI + Service
- ⏭️ Skips: Desktop app (optional, needs icons)
- 🌐 Opens: http://127.0.0.1:6767

---

## 📝 All Available Commands

| Command | What It Does |
|---------|-------------|
| `pnpm run dev` | ✅ **Start development** (recommended) |
| `pnpm run dev:web` | Same as `dev` (service only) |
| `pnpm run dev:all` | Start EVERYTHING (including desktop) |
| `pnpm run service` | Start only the service |
| `pnpm run desktop` | Start only the desktop app |

---

## 🎯 First Time Setup

### 1. Press Ctrl+C
Stop any running processes first.

### 2. Start Development
```powershell
pnpm run dev
```

### 3. Check It's Working
```powershell
curl http://127.0.0.1:6767/health
```

### 4. Open in Browser
```
http://127.0.0.1:6767/ui
```

---

## 🔍 What You'll See

When you run `pnpm run dev`, you'll see:

```
turbo 2.6.0

• Packages in scope: @openfm/core, @openfm/service, @openfm/ui
• Running dev in 3 packages

@openfm/core:dev: ✓ Compiled successfully
@openfm/ui:dev: ✓ Compiled successfully  
@openfm/service:dev: OpenFM Service starting...
```

✅ **If you see this, you're good to go!**

---

## ❌ Troubleshooting

### Problem: "Port 6767 already in use"

**Solution**:
```powershell
# Press Ctrl+C first, then:
Get-Process -Name node | Stop-Process -Force
pnpm run dev
```

### Problem: "Desktop app fails"

**Solution**: You're probably using `pnpm run dev:all`. Use `pnpm run dev` instead!

```powershell
pnpm run dev  # ✅ This works
```

### Problem: "Changes not showing"

**Solution**: 
1. Press `Ctrl+C`
2. Run `pnpm run dev` again
3. Refresh browser (F5)

---

## 💡 Development Tips

### Hot Reload Works! ✅

Edit any file and it auto-reloads:
- `packages/core/src/` → Auto-compiles
- `packages/ui/src/` → Auto-compiles  
- `apps/service/src/` → Auto-restarts

### Check Service Status

```powershell
curl http://127.0.0.1:6767/health
```

Expected response:
```json
{"status":"ok","service":"OpenFM","version":"0.1.0"}
```

### View Logs

The terminal shows real-time logs. Look for:
- ✅ **Green checkmarks** = Success
- ❌ **Red errors** = Something's wrong
- 📝 **File paths** = What's being compiled

---

## 🎵 Test Music

Sample mood packs are in:
```
D:\stuff\INFO\OpenFM\sample-mood-packs\
├── Epic/      ← 10 MP3 files
├── Funny/     ← 10 MP3 files
├── Romantic/  ← 10 MP3 files
├── Sad/       ← 10 MP3 files
└── Scary/     ← 10 MP3 files
```

---

## 🏗️ Build OBS Plugin (Optional)

Only do this if you want to use OpenFM in OBS Studio:

```powershell
cd apps\obs-plugin
.\build-windows.ps1 -Install
```

See `apps/obs-plugin/BUILD_GUIDE.md` for details.

---

## 📚 Documentation

- **This file**: Quick start guide
- **QUICK_COMMANDS.md**: Command reference
- **READY.md**: Detailed setup guide
- **docs/LUCIDE_ICONS.md**: Icon usage
- **apps/obs-plugin/BUILD_GUIDE.md**: Build OBS plugin

---

## 🎯 **Remember These 3 Things**

1. **Start**: `pnpm run dev`
2. **Stop**: `Ctrl+C`
3. **Check**: `curl http://127.0.0.1:6767/health`

---

## ✨ You're Ready!

Run this command and start developing:

```powershell
pnpm run dev
```

**Questions?** Check `QUICK_COMMANDS.md` or `READY.md`

**Happy coding! 🚀**

