# Generate Desktop App Icons
# This script creates all required icon formats from the SVG source

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "OpenFM Icon Generator" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we have the source SVG
if (-not (Test-Path "icon.svg")) {
    Write-Host "❌ icon.svg not found!" -ForegroundColor Red
    Write-Host "   Please ensure icon.svg exists in this directory." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Found icon.svg" -ForegroundColor Green
Write-Host ""

# Method 1: Using Tauri CLI (Recommended)
Write-Host "Method 1: Using Tauri CLI (Recommended)" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow
Write-Host ""
Write-Host "Run this command to generate all icons automatically:" -ForegroundColor White
Write-Host "  cd apps/desktop" -ForegroundColor Cyan
Write-Host "  pnpm tauri icon src-tauri/icons/icon.svg" -ForegroundColor Cyan
Write-Host ""

# Method 2: Manual conversion (if you have ImageMagick)
Write-Host "Method 2: Using ImageMagick" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow
Write-Host ""

if (Get-Command magick -ErrorAction SilentlyContinue) {
    Write-Host "✅ ImageMagick found!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Generating icons..." -ForegroundColor Yellow
    
    # Convert SVG to PNG at various sizes
    $sizes = @(32, 128, 256, 512, 1024)
    
    foreach ($size in $sizes) {
        $filename = "$size" + "x$size.png"
        Write-Host "  Creating $filename..." -ForegroundColor Gray
        & magick convert -background none -density 300 "icon.svg" -resize "$size" + "x$size" $filename
    }
    
    # Create 2x version
    Write-Host "  Creating 128x128@2x.png..." -ForegroundColor Gray
    Copy-Item "256x256.png" -Destination "128x128@2x.png"
    
    # Create icon.png (base image)
    Write-Host "  Creating icon.png..." -ForegroundColor Gray
    Copy-Item "1024x1024.png" -Destination "icon.png"
    
    # Create Windows ICO
    Write-Host "  Creating icon.ico..." -ForegroundColor Gray
    & magick convert "32x32.png" "128x128.png" "256x256.png" -colors 256 "icon.ico"
    
    Write-Host ""
    Write-Host "✅ Icons generated successfully!" -ForegroundColor Green
    
} else {
    Write-Host "⚠️  ImageMagick not found" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To use ImageMagick:" -ForegroundColor White
    Write-Host "1. Download from: https://imagemagick.org/script/download.php" -ForegroundColor White
    Write-Host "2. Install with 'Add to PATH' option" -ForegroundColor White
    Write-Host "3. Restart PowerShell" -ForegroundColor White
    Write-Host "4. Run this script again" -ForegroundColor White
}

Write-Host ""
Write-Host "Method 3: Online Converter" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow
Write-Host ""
Write-Host "You can also use online tools:" -ForegroundColor White
Write-Host "1. Go to: https://cloudconvert.com/svg-to-ico" -ForegroundColor White
Write-Host "2. Upload icon.svg" -ForegroundColor White
Write-Host "3. Download as icon.ico" -ForegroundColor White
Write-Host "4. Save to: apps/desktop/src-tauri/icons/icon.ico" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Choose one method above and follow the steps" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

