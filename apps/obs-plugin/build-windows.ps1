#!/usr/bin/env pwsh
# Build script for OpenFM OBS plugin on Windows

param(
    [string]$ObsPath = $null,
    [string]$ObsSourcePath = $null,
    [string]$QtPath = $null,
    [switch]$Install = $false,
    [switch]$Clean = $false
)

$ErrorActionPreference = "Stop"

Write-Host "[*] OpenFM OBS Plugin Build Script (Windows)" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $scriptRoot

try {

# Locate CMake
$cmakeExe = $null
$cmakeCandidates = @()
$cmakeCmd = Get-Command cmake -ErrorAction SilentlyContinue
if ($cmakeCmd) {
    $cmakeCandidates += $cmakeCmd.Source
}
$cmakeCandidates += "D:\tools\cmake\cmake-3.29.6-windows-x86_64\bin\cmake.exe"

foreach ($candidate in $cmakeCandidates) {
    if ($candidate -and (Test-Path $candidate)) {
        $cmakeExe = $candidate
        break
    }
}

if (-not $cmakeExe) {
    Write-Host "[err] CMake not found. Install CMake or add it to PATH." -ForegroundColor Red
    exit 1
}

# Helper to run cmake with logging
function Invoke-CMake {
    param(
        [string[]]$Arguments
    )

    & $cmakeExe @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "CMake command failed: $($Arguments -join ' ')"
    }
}

    # Discover OBS installation
    if (-not $ObsPath) {
        $candidateObsPaths = @(
            "$env:ProgramFiles\obs-studio",
            "$env:ProgramFiles (x86)\obs-studio",
            "$env:LOCALAPPDATA\obs-studio"
        )

        foreach ($path in $candidateObsPaths) {
            if (Test-Path $path) {
                $ObsPath = $path
                break
            }
        }
    }

    if (-not $ObsPath) {
        Write-Host "[err] OBS Studio not found. Set -ObsPath to your OBS installation." -ForegroundColor Red
        exit 1
    }

    Write-Host "[ok] Using OBS Studio at: $ObsPath" -ForegroundColor Green

    if (-not $ObsSourcePath -and $env:OBS_SOURCE_DIR -and (Test-Path $env:OBS_SOURCE_DIR)) {
        $ObsSourcePath = $env:OBS_SOURCE_DIR
    }

    if (-not $ObsSourcePath) {
        $candidateObsSources = @(
            "D:\deps\obs-studio",
            "C:\deps\obs-studio",
            (Join-Path $env:USERPROFILE "source\obs-studio"),
            (Join-Path $env:USERPROFILE "obs-studio")
        )

        foreach ($path in $candidateObsSources) {
            if ($path -and (Test-Path $path)) {
                $ObsSourcePath = $path
                break
            }
        }
    }

    if (-not $ObsSourcePath) {
        Write-Host "[err] OBS source tree not found. Clone https://github.com/obsproject/obs-studio.git and pass -ObsSourcePath or set OBS_SOURCE_DIR." -ForegroundColor Red
        exit 1
    }

    Write-Host "[ok] Using OBS source at: $ObsSourcePath" -ForegroundColor Green

    # Discover Qt installation
    if (-not $QtPath) {
        $envCandidates = @()
        if ($env:QT_PATH -and (Test-Path $env:QT_PATH)) {
            $envCandidates += $env:QT_PATH
        }
        if ($env:Qt6_DIR -and (Test-Path $env:Qt6_DIR)) {
            $envCandidates += (Split-Path -Parent (Split-Path -Parent $env:Qt6_DIR))
        }
        $envCandidates = $envCandidates | Select-Object -Unique

        if ($envCandidates.Count -gt 0) {
            $QtPath = $envCandidates[0]
        }
    }

    if (-not $QtPath) {
        $candidateQtPaths = @(
            "C:\Qt\6.7.0\msvc2019_64",
            "C:\Qt\6.6.0\msvc2019_64",
            "C:\Qt\6.5.0\msvc2019_64",
            "D:\Qt\6.7.0\msvc2019_64"
        )

        foreach ($path in $candidateQtPaths) {
            if (Test-Path $path) {
                $QtPath = $path
                break
            }
        }
    }

    if (-not $QtPath) {
        $qmake = Get-Command qmake -ErrorAction SilentlyContinue
        if ($qmake) {
            $QtPath = Split-Path (Split-Path $qmake.Path)
        }
    }

    if (-not $QtPath) {
        Write-Host "[err] Qt 6 installation not found. Set -QtPath to your Qt root." -ForegroundColor Red
        exit 1
    }

    Write-Host "[ok] Using Qt at: $QtPath" -ForegroundColor Green

    $qtCmakeDir = Join-Path $QtPath "lib\cmake\Qt6"
    if (-not (Test-Path $qtCmakeDir)) {
        Write-Host "[err] Qt CMake directory not found at $qtCmakeDir" -ForegroundColor Red
        exit 1
    }

    # Clean build directory if requested
    if ($Clean -and (Test-Path "build")) {
        Write-Host "`n[info] Cleaning build directory..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force "build"
    }

    # Ensure build directory exists
    New-Item -ItemType Directory -Force -Path "build" | Out-Null

    Push-Location "build"

    try {
        Write-Host "`n[1/3] Configuring with CMake..." -ForegroundColor Cyan
        Invoke-CMake -Arguments @(
            "-G", "Visual Studio 17 2022",
            "-A", "x64",
            "-DCMAKE_BUILD_TYPE=Release",
            "-DOBS_DIR=$ObsPath",
            "-DOBS_SOURCE_DIR=$ObsSourcePath",
            "-DCMAKE_PREFIX_PATH=$QtPath",
            "-DQt6_DIR=$qtCmakeDir",
            ".."
        )

        Write-Host "[2/3] Building plugin..." -ForegroundColor Cyan
        Invoke-CMake -Arguments @("--build", ".", "--config", "Release")

        Write-Host "[ok] Build completed successfully" -ForegroundColor Green

        if ($Install) {
            Write-Host "`n[3/3] Installing plugin..." -ForegroundColor Cyan
            $pluginDest = Join-Path $env:APPDATA "obs-studio\obs-plugins\64bit"
            $dataDest = Join-Path $env:APPDATA "obs-studio\data\obs-plugins\openfm"

            New-Item -ItemType Directory -Force -Path $pluginDest | Out-Null
            New-Item -ItemType Directory -Force -Path $dataDest | Out-Null

            # Copy plugin DLL
            Copy-Item "Release\openfm.dll" -Destination $pluginDest -Force
            Write-Host "[ok] Copied openfm.dll" -ForegroundColor Green

            # Copy required Qt DLLs
            $qtDlls = @(
                "Qt6Core.dll",
                "Qt6Widgets.dll",
                "Qt6WebEngineWidgets.dll",
                "Qt6WebEngineCore.dll",
                "Qt6WebEngine.dll",
                "Qt6WebChannel.dll",
                "Qt6Network.dll",
                "Qt6Positioning.dll",
                "Qt6Qml.dll",
                "Qt6Quick.dll",
                "Qt6Gui.dll"
            )
            
            $qtBinPath = Join-Path $QtPath "bin"
            $copiedCount = 0
            foreach ($dll in $qtDlls) {
                $srcPath = Join-Path $qtBinPath $dll
                if (Test-Path $srcPath) {
                    Copy-Item $srcPath -Destination $pluginDest -Force
                    $copiedCount++
                }
            }
            Write-Host "[ok] Copied $copiedCount Qt DLLs" -ForegroundColor Green
            
            # Copy all Qt WebEngine Chromium DLLs if they exist
            $qtWebEngineBin = Join-Path $QtPath "bin\QtWebEngineProcess.exe"
            if (Test-Path $qtWebEngineBin) {
                $webEngineDir = Split-Path $qtWebEngineBin
                $chromiumDlls = Get-ChildItem $webEngineDir -Filter "*.dll" -ErrorAction SilentlyContinue
                foreach ($dll in $chromiumDlls) {
                    Copy-Item $dll.FullName -Destination $pluginDest -Force -ErrorAction SilentlyContinue
                }
                Write-Host "[ok] Copied Qt WebEngine Chromium DLLs" -ForegroundColor Green
            }

            # Copy Qt WebEngine resources if they exist
            $qtWebEngineResources = Join-Path $QtPath "resources"
            if (Test-Path $qtWebEngineResources) {
                $webEngineDest = Join-Path $pluginDest "resources"
                if (-not (Test-Path $webEngineDest)) {
                    Copy-Item -Recurse $qtWebEngineResources -Destination $webEngineDest -Force
                    Write-Host "[ok] Copied Qt WebEngine resources" -ForegroundColor Green
                }
            }

            if (Test-Path "..\data") {
                Copy-Item -Recurse "..\data\*" -Destination $dataDest -Force
            }

            Write-Host "[ok] Plugin installed to $pluginDest" -ForegroundColor Green
        }
    } finally {
        Pop-Location
    }

    $artifactPath = Join-Path $scriptRoot "build\Release"
    Write-Host "`nArtifacts available under: $artifactPath" -ForegroundColor Cyan
} finally {
    Pop-Location
}
