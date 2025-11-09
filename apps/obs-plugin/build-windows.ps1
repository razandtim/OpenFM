# OpenFM OBS Plugin - Windows Build Script
# This script automates the build process for the OBS plugin

param(
    [string]$BuildType = "Release",
    [switch]$Install,
    [switch]$Clean
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "OpenFM OBS Plugin - Build Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
function Test-Prerequisites {
    Write-Host "Checking prerequisites..." -ForegroundColor Yellow
    
    # Check CMake
    if (-not (Get-Command cmake -ErrorAction SilentlyContinue)) {
        Write-Host "❌ CMake not found! Please install CMake 3.20+" -ForegroundColor Red
        exit 1
    }
    $cmakeVersion = (cmake --version | Select-String -Pattern '\d+\.\d+\.\d+').Matches.Value
    Write-Host "✅ CMake $cmakeVersion found" -ForegroundColor Green
    
    # Check Qt6
    if (-not $env:Qt6_DIR) {
        Write-Host "❌ Qt6_DIR environment variable not set!" -ForegroundColor Red
        Write-Host "   Set it to your Qt installation, e.g.:" -ForegroundColor Yellow
        Write-Host "   `$env:Qt6_DIR = 'C:\Qt\6.5.3\msvc2022_64'" -ForegroundColor Yellow
        exit 1
    }
    if (-not (Test-Path $env:Qt6_DIR)) {
        Write-Host "❌ Qt6 directory not found: $env:Qt6_DIR" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Qt6 found at: $env:Qt6_DIR" -ForegroundColor Green
    
    # Check OBS Source
    if (-not $env:OBS_SOURCE_DIR) {
        Write-Host "❌ OBS_SOURCE_DIR environment variable not set!" -ForegroundColor Red
        Write-Host "   Set it to your OBS Studio source directory, e.g.:" -ForegroundColor Yellow
        Write-Host "   `$env:OBS_SOURCE_DIR = 'C:\obs-studio'" -ForegroundColor Yellow
        exit 1
    }
    if (-not (Test-Path $env:OBS_SOURCE_DIR)) {
        Write-Host "❌ OBS source directory not found: $env:OBS_SOURCE_DIR" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ OBS source found at: $env:OBS_SOURCE_DIR" -ForegroundColor Green
    
    # Check Visual Studio
    $vsWhere = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"
    if (-not (Test-Path $vsWhere)) {
        Write-Host "⚠️  Visual Studio 2022 not found (vswhere.exe missing)" -ForegroundColor Yellow
    } else {
        $vsPath = & $vsWhere -latest -property installationPath
        Write-Host "✅ Visual Studio found at: $vsPath" -ForegroundColor Green
    }
    
    Write-Host ""
}

# Clean build directory
function Clean-Build {
    Write-Host "Cleaning build directory..." -ForegroundColor Yellow
    if (Test-Path "build") {
        Remove-Item -Recurse -Force "build"
        Write-Host "✅ Build directory cleaned" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  Build directory doesn't exist" -ForegroundColor Gray
    }
    Write-Host ""
}

# Configure CMake
function Invoke-Configure {
    Write-Host "Configuring CMake..." -ForegroundColor Yellow
    
    if (-not (Test-Path "build")) {
        New-Item -ItemType Directory -Path "build" | Out-Null
    }
    
    Push-Location "build"
    
    $cmakeArgs = @(
        "..",
        "-G", "Visual Studio 17 2022",
        "-A", "x64",
        "-DQt6_DIR=$env:Qt6_DIR\lib\cmake\Qt6",
        "-DCMAKE_PREFIX_PATH=$env:Qt6_DIR",
        "-DOBS_SOURCE_DIR=$env:OBS_SOURCE_DIR"
    )
    
    Write-Host "Running: cmake $($cmakeArgs -join ' ')" -ForegroundColor Gray
    & cmake $cmakeArgs
    
    if ($LASTEXITCODE -ne 0) {
        Pop-Location
        Write-Host "❌ CMake configuration failed!" -ForegroundColor Red
        exit 1
    }
    
    Pop-Location
    Write-Host "✅ CMake configured successfully" -ForegroundColor Green
    Write-Host ""
}

# Build plugin
function Invoke-Build {
    Write-Host "Building plugin ($BuildType)..." -ForegroundColor Yellow
    
    Push-Location "build"
    
    & cmake --build . --config $BuildType
    
    if ($LASTEXITCODE -ne 0) {
        Pop-Location
        Write-Host "❌ Build failed!" -ForegroundColor Red
        exit 1
    }
    
    Pop-Location
    Write-Host "✅ Build completed successfully" -ForegroundColor Green
    Write-Host ""
}

# Install plugin to OBS
function Install-Plugin {
    Write-Host "Installing plugin to OBS..." -ForegroundColor Yellow
    
    $pluginDll = "build\$BuildType\openfm-obs.dll"
    $obsPluginDir = "${env:ProgramFiles}\obs-studio\obs-plugins\64bit"
    
    if (-not (Test-Path $pluginDll)) {
        Write-Host "❌ Plugin DLL not found: $pluginDll" -ForegroundColor Red
        exit 1
    }
    
    if (-not (Test-Path $obsPluginDir)) {
        Write-Host "❌ OBS plugin directory not found: $obsPluginDir" -ForegroundColor Red
        Write-Host "   Is OBS Studio installed?" -ForegroundColor Yellow
        exit 1
    }
    
    try {
        Copy-Item $pluginDll -Destination $obsPluginDir -Force
        Write-Host "✅ Plugin installed to: $obsPluginDir" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to install plugin (try running as Administrator)" -ForegroundColor Red
        Write-Host "   Error: $_" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
}

# Main execution
Test-Prerequisites

if ($Clean) {
    Clean-Build
}

if (-not (Test-Path "build\CMakeCache.txt")) {
    Invoke-Configure
} else {
    Write-Host "ℹ️  Using existing CMake configuration (use -Clean to reconfigure)" -ForegroundColor Gray
    Write-Host ""
}

Invoke-Build

if ($Install) {
    Install-Plugin
}

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Build Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Build Type: $BuildType" -ForegroundColor White
Write-Host "Plugin DLL: build\$BuildType\openfm-obs.dll" -ForegroundColor White

if ($Install) {
    Write-Host "Status: Installed to OBS" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Start OBS Studio" -ForegroundColor White
    Write-Host "2. Go to View → Docks → OpenFM" -ForegroundColor White
    Write-Host "3. Make sure OpenFM service is running on port 6767" -ForegroundColor White
} else {
    Write-Host "Status: Built (not installed)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To install, run:" -ForegroundColor Yellow
    Write-Host "  .\build-windows.ps1 -Install" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

