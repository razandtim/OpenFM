# Desktop App Icons

This directory contains the application icons for the OpenFM desktop app.

## 📁 Current Status

- ✅ **icon.svg** - Source SVG icon (Lucide-inspired design)
- ⚠️ **Other formats needed** - See generation instructions below

## 🎨 Icon Design

The OpenFM icon features:
- **Gradient background** (purple/indigo)
- **Audio wave** in Lucide style
- **"FM" text** for brand recognition
- **Simple & modern** design

## 🚀 Generate Icons (3 Methods)

### Method 1: Tauri CLI (Easiest ✅)

```powershell
# Install Tauri CLI if needed
cargo install tauri-cli

# Navigate to desktop app
cd apps/desktop

# Generate all icons automatically
pnpm tauri icon src-tauri/icons/icon.svg
```

This will create:
- `icon.ico` (Windows)
- `icon.icns` (macOS)
- `32x32.png`
- `128x128.png`
- `128x128@2x.png`
- `icon.png`

### Method 2: ImageMagick (Advanced)

```powershell
# Run the generation script
cd apps/desktop/src-tauri/icons
.\generate-icons.ps1
```

Requirements:
- ImageMagick installed: https://imagemagick.org/script/download.php
- Make sure "Add to PATH" is checked during install

### Method 3: Online Converter (Quick)

1. Go to https://cloudconvert.com/svg-to-ico
2. Upload `icon.svg`
3. Convert to:
   - `icon.ico` for Windows
   - Various PNG sizes (32x32, 128x128, 256x256)
4. Save files to this directory

## 📦 Required Files

For the desktop app to build, you need at minimum:

```
icons/
├── icon.ico          # Required for Windows
├── icon.icns         # Required for macOS (optional on Windows)
├── 32x32.png         # Optional but recommended
├── 128x128.png       # Optional but recommended
├── 128x128@2x.png    # Optional but recommended
└── icon.png          # Base image (512x512 or 1024x1024)
```

## 🎯 Quick Fix (Minimal)

If you just want to **build right now**, create a simple `icon.ico`:

### Using PowerShell + ImageMagick:
```powershell
# Create a simple 256x256 PNG from SVG
magick convert -background none icon.svg -resize 256x256 temp.png

# Convert to ICO
magick convert temp.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico

# Clean up
Remove-Item temp.png
```

### Or download a placeholder:
1. Download any 256x256 PNG icon
2. Rename it to `icon.ico`
3. Place in `apps/desktop/src-tauri/icons/`

## 🎨 Customizing the Icon

To modify the icon design:

1. Edit `icon.svg` in any vector editor:
   - Inkscape (free): https://inkscape.org
   - Adobe Illustrator
   - Figma
   - VS Code with SVG extension

2. Keep these guidelines:
   - Size: 512x512 or 1024x1024
   - Format: SVG with transparent background
   - Simple design (works at 16x16)
   - No thin lines (minimum 2px stroke)
   - Limited colors (2-4 colors max)

3. Regenerate icons using Method 1 or 2 above

## 🔍 Verify Icons

After generation, check:

```powershell
# List all icon files
Get-ChildItem -Path . -Filter *.png, *.ico, *.icns

# Check file sizes
Get-ChildItem *.ico, *.png | Select-Object Name, Length
```

Expected output:
```
icon.ico          # ~100-500 KB
icon.icns         # ~200-800 KB (macOS)
32x32.png         # ~2-5 KB
128x128.png       # ~10-30 KB
128x128@2x.png    # ~30-80 KB
icon.png          # ~100-300 KB
```

## 🐛 Troubleshooting

### "icon.ico not found"

Run one of the generation methods above. The simplest is Method 1 (Tauri CLI).

### "Icons look blurry"

Make sure you're generating from the SVG (vector) source, not from a raster PNG.

### "Build still fails"

Check that `icon.ico` exists and is not corrupted:
```powershell
Test-Path icon.ico
Get-Item icon.ico | Select-Object Length
```

Should be at least 10 KB.

## 📚 Resources

- **Tauri Icon Guide**: https://tauri.app/v1/guides/features/icons/
- **ImageMagick**: https://imagemagick.org
- **Lucide Icons**: https://lucide.dev (for design inspiration)
- **SVG Editors**: https://inkscape.org

## ✨ Next Steps

1. Choose a generation method
2. Generate the icons
3. Verify files exist
4. Run `pnpm run dev` or `pnpm run dev:all`
5. Desktop app should build successfully!

---

**Need help?** See `ICONS_NEEDED.md` in the desktop app root for more details.
