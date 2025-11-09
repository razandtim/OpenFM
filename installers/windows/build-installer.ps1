#!/usr/bin/env pwsh
# Build script for OpenFM Windows Installer (Desktop App + OBS Plugin)

$ErrorActionPreference = "Stop"

Write-Host "[*] OpenFM Windows Installer Build Script" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Locate Inno Setup compiler
$innoSetupPath = $null

if ($env:INNO_SETUP_EXE -and (Test-Path $env:INNO_SETUP_EXE)) {
    $innoSetupPath = $env:INNO_SETUP_EXE
}

$possiblePaths = @(
    "${env:ProgramFiles(x86)}\Inno Setup 6\ISCC.exe",
    "${env:ProgramFiles}\Inno Setup 6\ISCC.exe",
    "${env:ProgramFiles(x86)}\Inno Setup 5\ISCC.exe",
    "${env:ProgramFiles}\Inno Setup 5\ISCC.exe",
    "D:\tools\InnoSetup\ISCC.exe"
)

if (-not $innoSetupPath) {
    foreach ($path in $possiblePaths) {
        if (Test-Path $path) {
            $innoSetupPath = $path
            break
        }
    }
}

if (-not $innoSetupPath) {
    Write-Host "[err] Inno Setup not found." -ForegroundColor Red
    Write-Host "      Install from https://jrsoftware.org/isdl.php" -ForegroundColor Yellow
    exit 1
}

# Resolve project root (installers/windows -> project root)
$projectRoot = Split-Path (Split-Path $PSScriptRoot)
Push-Location $projectRoot

try {
    Write-Host "`n[1/4] Building service..." -ForegroundColor Cyan
    pnpm --filter @openfm/service run build
    if ($LASTEXITCODE -ne 0) {
        throw "Service build failed."
    }
    Write-Host "[ok] Service built successfully" -ForegroundColor Green

    Write-Host "`n[2/4] Building desktop app..." -ForegroundColor Cyan
    Push-Location "apps/desktop"
    try {
        pnpm exec tauri build
        if ($LASTEXITCODE -ne 0) {
            throw "Desktop app build failed."
        }
    } finally {
        Pop-Location
    }
    Write-Host "[ok] Desktop app built successfully" -ForegroundColor Green

    Write-Host "`n[3/4] Building OBS plugin..." -ForegroundColor Cyan
    Push-Location "apps/obs-plugin"
    try {
        .\build-windows.ps1
        if ($LASTEXITCODE -ne 0) {
            throw "OBS plugin build failed."
        }
    } finally {
        Pop-Location
    }
    Write-Host "[ok] OBS plugin built successfully" -ForegroundColor Green

    Write-Host "`n[4/4] Creating installer..." -ForegroundColor Cyan

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
        Write-Host "[err] Missing required files:" -ForegroundColor Red
        foreach ($file in $missingFiles) {
            Write-Host "  - $file" -ForegroundColor Red
        }
        exit 1
    }

    $distDir = "dist"
    if (-not (Test-Path $distDir)) {
        New-Item -ItemType Directory -Path $distDir | Out-Null
    }

    $issFile = "installers\windows\setup.iss"
    Write-Host "  Compiling installer: $issFile" -ForegroundColor Yellow
    Write-Host "  Using ISCC: $innoSetupPath" -ForegroundColor Yellow
    & $innoSetupPath $issFile

    if ($LASTEXITCODE -ne 0) {
        throw "Installer compilation failed."
    }

    Write-Host "`n[ok] Installer created successfully" -ForegroundColor Green
    Write-Host "`nOutput: dist\OpenFM-Setup-x64.exe" -ForegroundColor Cyan
} finally {
    Pop-Location
    Write-Host "`nDone." -ForegroundColor Green
}
