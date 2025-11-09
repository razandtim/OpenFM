# OpenFM Installation Guide

## Prerequisites Installation

Before you can build or run OpenFM, you need to install the required tools.

### 1. Install Node.js

Download and install Node.js (version 18 or higher) from [nodejs.org](https://nodejs.org/)

Verify installation:

```powershell
node --version
# Should show v18.x.x or higher
```

### 2. Install pnpm

pnpm is the package manager used by OpenFM. Install it globally:

#### On Windows (PowerShell)

```powershell
npm install -g pnpm
```

#### On macOS/Linux

```bash
npm install -g pnpm
# or
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

Verify installation:

```powershell
pnpm --version
# Should show 9.x.x or higher
```

### 3. Install Rust (for Desktop App)

Download and install Rust from [rustup.rs](https://rustup.rs/)

#### On Windows

```powershell
# Download and run rustup-init.exe from rustup.rs
```

#### On macOS/Linux

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Verify installation:

```powershell
rustc --version
cargo --version
```

### 4. Install Build Tools (for OBS Plugin)

#### On Windows

1. Install [Visual Studio 2019 or later](https://visualstudio.microsoft.com/) with C++ tools
2. Install [CMake](https://cmake.org/download/) (3.16 or higher)
3. Install [Qt 6](https://www.qt.io/download-qt-installer) (6.5 or higher)
4. Install [OBS Studio](https://obsproject.com/) and development files

#### On macOS

```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install CMake
brew install cmake

# Install Qt 6
brew install qt@6

# Add Qt to PATH
echo 'export PATH="/opt/homebrew/opt/qt@6/bin:$PATH"' >> ~/.zshrc
```

---

## Quick Start

Once all prerequisites are installed:

### 1. Clone the Repository

```powershell
git clone https://github.com/openfm/openfm.git
cd openfm
```

### 2. Install Dependencies

```powershell
pnpm install
```

This will install all dependencies for all packages and apps in the monorepo.

### 3. Build All Packages

```powershell
pnpm run build
```

This builds:

- `packages/core` - TypeScript library
- `packages/ui` - React components
- `apps/service` - Node.js service

### 4. Start Development

#### Run the Service (Terminal 1)

```powershell
pnpm run service
```

Service will start at `http://127.0.0.1:6767`

#### Run the Desktop App (Terminal 2)

```powershell
pnpm run desktop
```

---

## Alternative: Use npm Instead of pnpm

If you prefer to use npm (comes with Node.js), you can:

### 1. Remove pnpm Workspace Config

```powershell
Remove-Item pnpm-workspace.yaml
```

### 2. Install with npm

```powershell
npm install
```

### 3. Update Scripts

Replace `pnpm` with `npm` in `package.json` scripts.

---

## Troubleshooting

### pnpm not found after installation

1. Close and reopen PowerShell/Terminal
2. Check if npm global bin is in PATH:
   ```powershell
   npm config get prefix
   ```
3. Add npm global bin to PATH if needed

### Permission errors on Windows

Run PowerShell as Administrator:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port 6767 already in use

Change the port in `.env`:

```
OPENFM_PORT=6768
```

### Build errors

Clean and reinstall:

```powershell
pnpm run clean
Remove-Item -Recurse -Force node_modules
pnpm install
```

---

## Next Steps

After installation:

- Read `docs/GETTING_STARTED.md` for development guide
- Read `docs/ARCHITECTURE.md` for system overview
- Read `CONTRIBUTING.md` to start contributing

---

## Platform-Specific Notes

### Windows

- Use PowerShell (not Command Prompt)
- Visual Studio required for OBS plugin
- May need to run as Administrator for some operations

### macOS

- Xcode Command Line Tools required
- Use Homebrew for dependencies
- May need to grant Terminal permissions

### Linux

- Install build-essential package
- Install Qt6 development libraries
- May need to install additional dependencies

---

## Quick Reference

```powershell
# Check versions
node --version
pnpm --version
rustc --version

# Install dependencies
pnpm install

# Development
pnpm run dev           # Start all
pnpm run service       # Service only
pnpm run desktop       # Desktop only

# Build
pnpm run build         # Build all
pnpm run lint          # Check code
pnpm run typecheck     # Type check

# Clean
pnpm run clean         # Clean builds
```

---

For more detailed information, see `docs/GETTING_STARTED.md`
