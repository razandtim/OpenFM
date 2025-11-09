# OpenFM Deployment Guide

This guide covers building and deploying OpenFM for production.

## Prerequisites

### All Platforms
- Node.js >= 18.0.0
- pnpm >= 9.0.0
- Git

### Windows
- Visual Studio 2019+ with C++ tools
- CMake >= 3.16
- Qt 6.5+
- OBS Studio dev files
- Inno Setup (for installer)
- Rust (for Tauri)

### macOS
- Xcode Command Line Tools
- CMake >= 3.16
- Qt 6 (`brew install qt@6`)
- OBS Studio dev files
- Rust (for Tauri)
- pkgbuild (comes with Xcode)

## Building from Source

### 1. Clone Repository

```bash
git clone https://github.com/openfm/openfm.git
cd openfm
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Build Packages

```bash
# Build core and UI packages
pnpm run build
```

This builds:
- `packages/core/dist` - Core TypeScript library
- `packages/ui/dist` - React components

### 4. Build Service

```bash
cd apps/service
pnpm run build
```

Output: `apps/service/dist/` with:
- `index.js` - Server bundle
- `public/` - UI static files

### 5. Build Desktop App

#### Windows
```bash
cd apps/desktop
pnpm run build
```

Output: `apps/desktop/src-tauri/target/release/bundle/msi/OpenFM.msi`

#### macOS
```bash
cd apps/desktop
pnpm run build
```

Output: `apps/desktop/src-tauri/target/release/bundle/dmg/OpenFM.dmg`

### 6. Build OBS Plugin

#### Windows
```bash
cd apps/obs-plugin
mkdir build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
cmake --build . --config Release
```

Output: `apps/obs-plugin/build/Release/openfm.dll`

#### macOS
```bash
cd apps/obs-plugin
mkdir build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
make
```

Output: `apps/obs-plugin/build/openfm.so`

## Creating Installers

### Windows Installer (Inno Setup)

1. Ensure all components are built
2. Open `installers/windows/setup.iss` in Inno Setup
3. Click "Compile"

Output: `dist/OpenFM-Setup-x64.exe`

**Manual via command line:**
```bash
iscc installers/windows/setup.iss
```

### macOS Installer (pkg)

```bash
cd installers/macos
./build-pkg.sh
```

Output: `dist/OpenFM-macOS.pkg`

## Code Signing

### Windows

1. Get code signing certificate
2. Sign the installer:
   ```bash
   signtool sign /f certificate.pfx /p password /t http://timestamp.digicert.com dist/OpenFM-Setup-x64.exe
   ```

### macOS

1. Get Apple Developer certificate
2. Sign the app:
   ```bash
   codesign --deep --force --verify --verbose --sign "Developer ID Application: Your Name" OpenFM.app
   ```
3. Notarize:
   ```bash
   xcrun notarytool submit OpenFM-macOS.pkg --apple-id your@email.com --team-id TEAMID --password app-specific-password
   ```

## CI/CD (GitHub Actions)

The project includes GitHub Actions workflows:

### Build Workflow

`.github/workflows/build.yml` runs on:
- Push to `main` or `develop`
- Pull requests to `main`
- Release creation

Jobs:
1. **lint-test** - Lint and test code
2. **build-service** - Build Node.js service
3. **build-desktop-windows** - Build Windows desktop app
4. **build-desktop-macos** - Build macOS desktop app
5. **build-obs-plugin-windows** - Build Windows OBS plugin
6. **build-obs-plugin-macos** - Build macOS OBS plugin
7. **release** - Create installers and upload to GitHub Releases

### Triggering a Release

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Commit changes
4. Create and push tag:
   ```bash
   git tag -a v0.1.0 -m "Release v0.1.0"
   git push origin v0.1.0
   ```
5. Create GitHub Release from tag
6. CI will build and attach installers

## Environment Variables

Production environment variables:

```bash
# Service
OPENFM_PORT=6767
NODE_ENV=production
LOG_LEVEL=info

# Catalog
OPENFM_CATALOG_URL=https://openfm.example.com/catalog.json

# Optional: Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-key
```

## Hosting the Service

### Option 1: Bundled with Installers (Recommended)

The service is bundled with both desktop and OBS installers and runs locally.

### Option 2: Separate Service Deployment

If deploying service separately:

```bash
# Install PM2
npm install -g pm2

# Start service
cd apps/service/dist
pm2 start index.js --name openfm-service

# Configure to start on boot
pm2 startup
pm2 save
```

## Mood Pack Catalog

Create a catalog server:

1. Host `catalog.json`:
   ```json
   {
     "packs": [
       {
         "id": "epic",
         "name": "Epic Mood Pack",
         "version": "1.0.0",
         "downloadUrl": "https://cdn.example.com/epic.zip",
         "size": 52428800
       }
     ]
   }
   ```

2. Set `OPENFM_CATALOG_URL` in service

3. Host ZIP files on CDN

## Database Setup (Supabase)

1. Create Supabase project
2. Run SQL:
   ```sql
   CREATE TABLE user_preferences (
     user_id UUID PRIMARY KEY REFERENCES auth.users(id),
     preferences JSONB NOT NULL,
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Users can manage own preferences"
     ON user_preferences
     FOR ALL
     USING (auth.uid() = user_id);
   ```

3. Set environment variables in service

## Monitoring

### Service Health

Monitor service health endpoint:
```bash
curl http://127.0.0.1:6767/health
```

### Logs

Service logs location:
- **Windows**: `%APPDATA%\OpenFM\logs\`
- **macOS**: `~/Library/Logs/OpenFM/`

### Crash Reports

Configure crash reporting:
- Use Sentry or similar service
- Set `SENTRY_DSN` environment variable

## Troubleshooting

### Build Fails

1. Clean build directories:
   ```bash
   pnpm run clean
   rm -rf node_modules
   pnpm install
   ```

2. Check Node/pnpm versions
3. Ensure all dev dependencies installed

### Plugin Won't Load in OBS

1. Check OBS plugin directory is correct
2. Verify Qt 6 is installed
3. Check OBS version compatibility
4. Review OBS logs

### Service Won't Start

1. Check port 6767 is available
2. Review service logs
3. Ensure proper permissions
4. Check Node.js version

## Security Checklist

Before release:
- [ ] All dependencies updated
- [ ] Security audit passed (`pnpm audit`)
- [ ] Code signed (Windows & macOS)
- [ ] Installers tested on clean VMs
- [ ] API keys not committed
- [ ] HTTPS for external services
- [ ] Input validation in place

## Performance Optimization

### Service
- Enable production mode: `NODE_ENV=production`
- Minimize logging in production
- Use caching where appropriate

### Desktop App
- Minimize bundle size
- Lazy load components
- Optimize images/assets

### OBS Plugin
- Minimize memory usage
- Optimize audio processing
- Cache UI resources

---

For more information, see:
- `docs/GETTING_STARTED.md` - Development setup
- `docs/ARCHITECTURE.md` - System architecture
- `CONTRIBUTING.md` - Contribution guidelines

