# Desktop App Icons Required

The Tauri desktop app requires icon files to build. Currently, placeholder icons are missing.

## 🎨 Required Icons

### For Windows
- `icons/icon.ico` - 256x256 Windows icon

### For macOS
- `icons/icon.icns` - macOS icon bundle

### For All Platforms (Optional but Recommended)
- `icons/32x32.png`
- `icons/128x128.png`
- `icons/128x128@2x.png` (256x256)
- `icons/icon.png` (512x512 or 1024x1024 base image)

## 🚀 Quick Solution

### Option 1: Generate Icons with Tauri CLI

If you have a source icon image:

```bash
# Install Tauri CLI if not already installed
cargo install tauri-cli

# Generate all icons from a single source image
pnpm tauri icon path/to/your-icon.png
```

This will automatically generate all required icon sizes.

### Option 2: Create Placeholder Icons (For Development)

For development/testing, you can use simple placeholder icons:

```bash
# Windows: Use any 256x256 PNG and convert to ICO
# (Requires ImageMagick or similar tool)
convert placeholder-256.png -define icon:auto-resize=256,128,64,48,32,16 icons/icon.ico

# macOS: Create icns (requires iconutil)
mkdir icon.iconset
cp placeholder-512.png icon.iconset/icon_256x256@2x.png
# ... add other sizes
iconutil -c icns icon.iconset -o icons/icon.icns
```

### Option 3: Download OpenFM Logo (When Available)

Once the official OpenFM logo is available:

1. Download the SVG/PNG logo
2. Scale to 1024x1024
3. Run `pnpm tauri icon icons/openfm-logo.png`

## 📝 Icon Specifications

### Recommended Source Image
- **Format**: PNG or SVG
- **Size**: 1024x1024 px minimum
- **Background**: Transparent
- **Colors**: Compatible with dark/light themes
- **Design**: Simple, recognizable at small sizes

### What Makes a Good App Icon
✅ Simple and bold  
✅ Works at 16x16 (taskbar/system tray)  
✅ Recognizable shape/symbol  
✅ Limited color palette  
✅ No fine details  
✅ Transparent or solid background  

❌ Avoid complex gradients  
❌ Avoid thin lines  
❌ Avoid text (except single letter)  
❌ Avoid multiple elements  

## 🎯 OpenFM Icon Suggestions

Consider these themes:
- **Music Note**: Simple 🎵 symbol
- **Waveform**: Audio wave pattern
- **Mood Symbol**: Combined mood indicators
- **FM Radio**: Vintage radio dial
- **Play Button**: Stylized ▶️ with "FM"

## 🔧 Current Workaround

For now, the desktop app build is **optional**. You can:

1. **Skip desktop app**: Use `pnpm run dev:web` (service only)
2. **Use OBS plugin**: Full functionality without desktop app
3. **Build later**: Add icons when ready for production

## 📦 When Icons Are Ready

1. Place icons in `apps/desktop/src-tauri/icons/`
2. Update `tauri.conf.json` if needed
3. Build normally: `pnpm run desktop`

---

**Status**: ⚠️ Icons pending - Desktop app build currently disabled  
**Priority**: Low (optional feature)  
**Blocking**: No - Core service works without desktop app

