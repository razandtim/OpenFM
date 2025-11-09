#!/usr/bin/env pwsh
# Build script for OpenFM OBS Plugin on Windows

param(
    [string]$ObsPath = $null,
    [string]$QtPath = $null,
    [switch]$Install = $false,
    [switch]$Clean = $false
)

$ErrorActionPreference = "Stop"

Write-Host "🎬 OpenFM OBS Plugin Build Script (Windows)" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

# Detect OBS installation
if (-not $ObsPath) {
    $possiblePaths = @(
        "$env:ProgramFiles\obs-studio",
        "$env:ProgramFiles (x86)\obs-studio",
        "$env:LOCALAPPDATA\obs-studio"
    )
    
    foreach ($path in $possiblePaths) {
        if (Test-Path $path) {
            $ObsPath = $path
            Write-Host "✓ Found OBS Studio at: $ObsPath" -ForegroundColor Green
            break
        }
    }
    
    if (-not $ObsPath) {
        Write-Host "✗ OBS Studio not found. Please install OBS or specify path with -ObsPath" -ForegroundColor Red
        exit 1
    }
}

# Detect Qt installation
if (-not $QtPath) {
    $qtPaths = @(
        "C:\Qt\6.7.0\msvc2019_64",
        "C:\Qt\6.6.0\msvc2019_64",
        "C:\Qt\6.5.0\msvc2019_64"
    )
    
    foreach ($path in $qtPaths) {
        if (Test-Path $path) {
            $QtPath = $path
            Write-Host "✓ Found Qt at: $QtPath" -ForegroundColor Green
            break
        }
    }
    
    if (-not $QtPath) {
        Write-Host "⚠ Qt not found. Looking in PATH..." -ForegroundColor Yellow
        $qmake = Get-Command qmake -ErrorAction SilentlyContinue
        if ($qmake) {
            $QtPath = Split-Path (Split-Path $qmake.Path)
            Write-Host "✓ Found Qt at: $QtPath" -ForegroundColor Green
        } else {
            Write-Host "✗ Qt not found. Please install Qt 6.x or specify path with -QtPath" -ForegroundColor Red
            Write-Host "  Download from: https://www.qt.io/download-qt-installer" -ForegroundColor Yellow
            exit 1
        }
    }
}

# Clean build directory
if ($Clean -and (Test-Path "build")) {
    Write-Host "`n🧹 Cleaning build directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force build
}

# Create build directory
Write-Host "`n📁 Creating build directory..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path build | Out-Null
Set-Location build

# Configure with CMake
Write-Host "`n⚙️  Configuring with CMake..." -ForegroundColor Cyan
cmake -G "Visual Studio 17 2022" -A x64 `
    -DCMAKE_BUILD_TYPE=Release `
    -DOBS_DIR="$ObsPath" `
    -DQt6_DIR="$QtPath\lib\cmake\Qt6" `
    ..

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n✗ CMake configuration failed!" -ForegroundColor Red
    exit 1
}

# Build
Write-Host "`n🔨 Building plugin..." -ForegroundColor Cyan
cmake --build . --config Release

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n✗ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n✓ Build completed successfully!" -ForegroundColor Green

# Install
if ($Install) {
    Write-Host "`n📦 Installing plugin..." -ForegroundColor Cyan
    
    $pluginDest = "$env:APPDATA\obs-studio\obs-plugins\64bit"
    $dataDest = "$env:APPDATA\obs-studio\data\obs-plugins\openfm"
    
    # Create directories
    New-Item -ItemType Directory -Force -Path $pluginDest | Out-Null
    New-Item -ItemType Directory -Force -Path $dataDest | Out-Null
    
    # Copy plugin DLL
    Copy-Item "Release\openfm.dll" -Destination $pluginDest -Force
    Write-Host "  ✓ Copied openfm.dll to $pluginDest" -ForegroundColor Green
    
    # Copy data files if they exist
    if (Test-Path "..\data") {
        Copy-Item -Recurse "..\data\*" -Destination $dataDest -Force
        Write-Host "  ✓ Copied data files to $dataDest" -ForegroundColor Green
    }
    
    Write-Host "`n✓ Plugin installed successfully!" -ForegroundColor Green
    Write-Host "  Restart OBS Studio to load the plugin" -ForegroundColor Yellow
}

# Return to original directory
Set-Location ..

Write-Host "`n🎉 All done!" -ForegroundColor Green
Write-Host "`nBuild location: $(Get-Location)\build\Release\openfm.dll" -ForegroundColor Cyan

if (-not $Install) {
    Write-Host "`nTo install the plugin, run:" -ForegroundColor Yellow
    Write-Host "  .\build-windows.ps1 -Install" -ForegroundColor White
}
