# 🔧 Port 6767 Fix

## Problem: "Address Already in Use"

```
Error: listen EADDRINUSE: address already in use 127.0.0.1:6767
```

---

## ✅ Quick Fix

```powershell
# Kill all Node processes
Get-Process -Name node | Stop-Process -Force

# Restart
pnpm run dev
```

---

## 🔍 Why This Happens

Multiple instances of the service tried to start on the same port.

### Common Causes:
1. Previous service didn't shut down cleanly
2. Multiple terminals running `pnpm run dev`
3. Background process still running

---

## 🛠️ Prevention

### 1. Always Stop Properly
Press `Ctrl+C` to stop the service before restarting.

### 2. Check Before Starting
```powershell
# See what's using port 6767
netstat -ano | findstr :6767

# If something is running, kill it
Get-Process -Name node | Stop-Process -Force
```

### 3. Use One Terminal
Only run `pnpm run dev` in one terminal at a time.

---

## 🚀 Correct Workflow

### Start Services
```powershell
# Terminal 1: Service only
pnpm run dev

# Terminal 2: Desktop app (separate port)
cd apps/desktop
pnpm run tauri dev
```

### Stop Services
```powershell
# Press Ctrl+C in each terminal
# Or kill all node processes:
Get-Process -Name node | Stop-Process -Force
```

---

## 📋 Service Ports Reference

| Service | Port | Command |
|---------|------|---------|
| OpenFM Service | 6767 | `pnpm run dev` |
| Desktop (dev) | 1420 | `pnpm run tauri dev` |

**These run independently** - no port conflict!

---

## ✅ Fixed!

Service should now be running on port 6767.

**Verify**: http://127.0.0.1:6767/health

