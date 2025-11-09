#!/usr/bin/env pwsh
# Build script for OpenFM Windows Installer (Desktop App + OBS Plugin)

$ErrorActionPreference = "Stop"

Write-Host "🎬 OpenFM Windows Installer Build Script" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if Inno Setup is installed
$innoSetupPath = $null
$possiblePaths = @(
    "${env:ProgramFiles(x86)}\Inno Setup 6\ISCC.exe",
    "${env:ProgramFiles}\Inno Setup 6\ISCC.exe",
    "${env:ProgramFiles(x86)}\Inno Setup 5\ISCC.exe",
    "${env:ProgramFiles}\Inno Setup 5\ISCC.exe"
)

foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        $innoSetupPath = $path
        Write-Host "✓ Found Inno Setup at: $path" -ForegroundColor Green
        break
    }
}

if (-not $innoSetupPath) {
    Write-Host "✗ Inno Setup not found!" -ForegroundColor Red
    Write-Host "  Please install Inno Setup from: https://jrsoftware.org/isdl.php" -ForegroundColor Yellow
    exit 1
}

# Get project root
$projectRoot = Split-Path (Split-Path $PSScriptRoot)
Set-Location $projectRoot

Write-Host "`n📦 Step 1: Building Service..." -ForegroundColor Cyan
pnpm --filter @openfm/service run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Service build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Service built successfully" -ForegroundColor Green

Write-Host "`n🖥️  Step 2: Building Desktop App..." -ForegroundColor Cyan
Set-Location apps/desktop
pnpm exec tauri build
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Desktop app build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Desktop app built successfully" -ForegroundColor Green
Set-Location $projectRoot

Write-Host "`n🎬 Step 3: Building OBS Plugin..." -ForegroundColor Cyan
Set-Location apps/obs-plugin
.\build-windows.ps1
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ OBS plugin build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ OBS plugin built successfully" -ForegroundColor Green
Set-Location $projectRoot

Write-Host "`n📦 Step 4: Creating Installer..." -ForegroundColor Cyan

# Verify all required files exist
$serviceDist = "apps\service\dist"
$desktopExe = "apps\desktop\src-tauri\target\release\OpenFM.exe"
$obsPlugin = "apps\obs-plugin\build\Release\openfm.dll"

$missingFiles = @()

if (-not (Test-Path $serviceDist)) {
    $missingFiles += "Service dist: $serviceDist"
}
if (-not (Test-Path $desktopExe)) {
    $missingFiles += "Desktop app: $desktopExe"
}
if (-not (Test-Path $obsPlugin)) {
    $missingFiles += "OBS plugin: $obsPlugin"
}

if ($missingFiles.Count -gt 0) {
    Write-Host "✗ Missing required files:" -ForegroundColor Red
    foreach ($file in $missingFiles) {
        Write-Host "  - $file" -ForegroundColor Red
    }
    exit 1
}

# Create dist directory if it doesn't exist
$distDir = "dist"
if (-not (Test-Path $distDir)) {
    New-Item -ItemType Directory -Path $distDir | Out-Null
}

# Build installer
$issFile = "installers\windows\setup.iss"
Write-Host "  Compiling installer: $issFile" -ForegroundColor Yellow
& $innoSetupPath $issFile

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Installer compilation failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n✓ Installer created successfully!" -ForegroundColor Green
Write-Host "`n📦 Installer location: dist\OpenFM-Setup-x64.exe" -ForegroundColor Cyan
Write-Host "`n🎉 All done!" -ForegroundColor Green

