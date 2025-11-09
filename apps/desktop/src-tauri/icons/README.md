# Icon Assets

This directory contains the application icons for the OpenFM desktop app.

## Required Icons

For a production build, you need:

- `icon.ico` - Windows icon (256x256)
- `icon.icns` - macOS icon bundle
- `icon.png` - Base PNG icon (512x512 or 1024x1024)
- Various sizes: 32x32, 128x128, 256x256, etc.

## Temporary Development Icons

During development, we're using placeholder icons. These should be replaced with proper OpenFM branding before release.

## Generating Icons

You can use the Tauri CLI to generate all icon sizes from a single source:

```bash
pnpm tauri icon path/to/your-icon.png
```

This will generate all required icon sizes and formats automatically.

