#!/usr/bin/env pwsh
# OpenFM OBS Plugin Installer
# Installs the plugin and all required dependencies

param(
    [string]$PluginDll = $null,
    [string]$ObsPath = $null,
    [string]$QtPath = $null,
    [switch]$Force = $false
)

$ErrorActionPreference = "Stop"

Write-Host "`n[*] OpenFM OBS Plugin Installer" -ForegroundColor Cyan
Write-Host "=================================`n" -ForegroundColor Cyan

# Get script directory
$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

# Default plugin DLL location
if (-not $PluginDll) {
    $PluginDll = Join-Path $scriptRoot "build\Release\openfm.dll"
}

if (-not (Test-Path $PluginDll)) {
    Write-Host "[err] Plugin DLL not found: $PluginDll" -ForegroundColor Red
    Write-Host "[info] Build the plugin first using: .\build-windows.ps1" -ForegroundColor Yellow
    exit 1
}

# Discover OBS installation
if (-not $ObsPath) {
    $candidateObsPaths = @(
        "$env:ProgramFiles\obs-studio",
        "${env:ProgramFiles(x86)}\obs-studio",
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
    Write-Host "[err] OBS Studio not found. Please install OBS Studio first." -ForegroundColor Red
    exit 1
}

Write-Host "[ok] OBS Studio found at: $ObsPath" -ForegroundColor Green

# Discover Qt installation for WebEngine DLLs (OBS doesn't include them)
if (-not $QtPath) {
    $candidateQtPaths = @(
        "D:\Qt\6.7.0\msvc2019_64",
        "C:\Qt\6.7.0\msvc2019_64",
        "C:\Qt\6.8.3\msvc2019_64",
        "D:\Qt\6.8.3\msvc2019_64"
    )
    
    foreach ($path in $candidateQtPaths) {
        if (Test-Path (Join-Path $path "bin\Qt6WebEngineCore.dll")) {
            $QtPath = $path
            break
        }
    }
}

if ($QtPath) {
    Write-Host "[ok] Qt installation found at: $QtPath (for WebEngine DLLs)" -ForegroundColor Green
} else {
    Write-Host "[warn] Qt installation not found - WebEngine DLLs may be missing" -ForegroundColor Yellow
    Write-Host "[info] Plugin requires Qt WebEngine which OBS doesn't provide" -ForegroundColor Yellow
}

# Determine plugin installation directory
# OBS loads plugins from %APPDATA%\obs-studio\obs-plugins\64bit\ (user plugins)
$pluginDest = Join-Path $env:APPDATA "obs-studio\obs-plugins\64bit"
$dataDest = Join-Path $env:APPDATA "obs-studio\data\obs-plugins\openfm"

# Create directories
New-Item -ItemType Directory -Force -Path $pluginDest | Out-Null
New-Item -ItemType Directory -Force -Path $dataDest | Out-Null

Write-Host "`n[1/4] Installing plugin DLL..." -ForegroundColor Cyan
Copy-Item $PluginDll -Destination $pluginDest -Force
Write-Host "[ok] Plugin DLL installed to: $pluginDest" -ForegroundColor Green

# Detect OBS's Qt version
$obsQtCore = Join-Path $ObsPath "bin\64bit\Qt6Core.dll"
$obsQtVersion = $null

if (Test-Path $obsQtCore) {
    $versionInfo = [System.Diagnostics.FileVersionInfo]::GetVersionInfo($obsQtCore)
    $obsQtVersion = $versionInfo.ProductVersion
    Write-Host "`n[ok] Detected OBS Qt version: $obsQtVersion" -ForegroundColor Green
} else {
    Write-Host "`n[warn] Could not detect OBS Qt version" -ForegroundColor Yellow
}

Write-Host "`n[2/4] Installing Qt dependencies..." -ForegroundColor Cyan

# Strategy: Use OBS's Qt DLLs if available, otherwise copy from build Qt
$obsBinDir = Join-Path $ObsPath "bin\64bit"
$qtDllsNeeded = @(
    "Qt6Core.dll",
    "Qt6Widgets.dll",
    "Qt6WebEngineWidgets.dll",
    "Qt6WebEngineCore.dll",
    "Qt6WebChannel.dll",
    "Qt6Network.dll",
    "Qt6Gui.dll"
)

$copiedFromOBS = 0
$copiedFromBuild = 0
$missingDlls = @()

foreach ($dll in $qtDllsNeeded) {
    $obsDll = Join-Path $obsBinDir $dll
    $buildDll = Join-Path (Join-Path $scriptRoot "build\Release") $dll
    $destDll = Join-Path $pluginDest $dll
    
    if (Test-Path $obsDll) {
        # Copy from OBS installation (preferred - matches OBS's Qt version)
        Copy-Item $obsDll -Destination $pluginDest -Force -ErrorAction SilentlyContinue
        if (Test-Path $destDll) {
            $copiedFromOBS++
        }
    } elseif (Test-Path $buildDll) {
        # Fallback: Copy from build directory
        Copy-Item $buildDll -Destination $pluginDest -Force -ErrorAction SilentlyContinue
        if (Test-Path $destDll) {
            $copiedFromBuild++
            Write-Host "[warn] Using build Qt DLL for $dll (version may not match OBS)" -ForegroundColor Yellow
        }
    } else {
        # Try to get from Qt installation (for WebEngine DLLs that OBS doesn't have)
        if ($QtPath) {
            $qtBinPath = Join-Path $QtPath "bin"
            $qtDll = Join-Path $qtBinPath $dll
            if (Test-Path $qtDll) {
                Copy-Item $qtDll -Destination $pluginDest -Force -ErrorAction SilentlyContinue
                if (Test-Path $destDll) {
                    $copiedFromBuild++
                    Write-Host "[ok] Copied $dll from Qt installation" -ForegroundColor Green
                }
            } else {
                $missingDlls += $dll
            }
        } else {
            $missingDlls += $dll
        }
    }
}

# Check for additional Qt DLLs that might be needed (especially WebEngine related)
$additionalQtDlls = Get-ChildItem $obsBinDir -Filter "Qt6*.dll" -ErrorAction SilentlyContinue | 
    Where-Object { 
        $_.Name -match "^(Qt6Core|Qt6Widgets|Qt6WebEngine|Qt6WebChannel|Qt6Network|Qt6Gui|Qt6Qml|Qt6Quick|Qt6Positioning)" -and
        -not (Test-Path (Join-Path $pluginDest $_.Name))
    } |
    Select-Object -ExpandProperty Name

foreach ($dll in $additionalQtDlls) {
    $obsDll = Join-Path $obsBinDir $dll
    $destDll = Join-Path $pluginDest $dll
    if (Test-Path $obsDll) {
        Copy-Item $obsDll -Destination $pluginDest -Force -ErrorAction SilentlyContinue
        if (Test-Path $destDll) {
            $copiedFromOBS++
            Write-Host "[ok] Copied additional Qt DLL: $dll" -ForegroundColor Gray
        }
    }
}

Write-Host "[ok] Copied $copiedFromOBS Qt DLLs from OBS installation" -ForegroundColor Green
if ($copiedFromBuild -gt 0) {
    Write-Host "[info] Copied $copiedFromBuild Qt DLLs from build directory" -ForegroundColor Yellow
}
if ($missingDlls.Count -gt 0) {
    Write-Host "[warn] Missing Qt DLLs: $($missingDlls -join ', ')" -ForegroundColor Yellow
    if ($missingDlls -contains "Qt6WebEngineCore.dll" -or $missingDlls -contains "Qt6WebChannel.dll") {
        Write-Host "[err] Qt WebEngine DLLs are required but not found!" -ForegroundColor Red
        Write-Host "[info] OBS doesn't include Qt WebEngine - these must come from Qt installation" -ForegroundColor Yellow
        Write-Host "[info] Set -QtPath parameter to your Qt installation directory" -ForegroundColor Yellow
        Write-Host "[info] Example: .\install-plugin.ps1 -QtPath 'D:\Qt\6.7.0\msvc2019_64'" -ForegroundColor Yellow
    } else {
        Write-Host "[info] These DLLs may be loaded from OBS at runtime" -ForegroundColor Yellow
    }
}

# Copy Qt WebEngine resources
Write-Host "`n[3/4] Installing Qt WebEngine resources..." -ForegroundColor Cyan

# Try to find Qt WebEngine resources
$webEngineResourcePaths = @(
    (Join-Path $ObsPath "resources"),
    (Join-Path (Join-Path $scriptRoot "build\Release") "resources"),
    (Join-Path (Split-Path (Split-Path $ObsPath)) "resources")
)

$resourcesCopied = $false
foreach ($resourcePath in $webEngineResourcePaths) {
    if (Test-Path $resourcePath) {
        $webEngineDest = Join-Path $pluginDest "resources"
        if (-not (Test-Path $webEngineDest)) {
            Copy-Item -Recurse $resourcePath -Destination $webEngineDest -Force -ErrorAction SilentlyContinue
            if (Test-Path $webEngineDest) {
                Write-Host "[ok] Copied Qt WebEngine resources from: $resourcePath" -ForegroundColor Green
                $resourcesCopied = $true
                break
            }
        } else {
            $resourcesCopied = $true
            Write-Host "[ok] Qt WebEngine resources already exist" -ForegroundColor Green
            break
        }
    }
}

if (-not $resourcesCopied) {
    # Try to find resources in OBS installation
    $obsResourcePaths = @(
        (Join-Path $ObsPath "resources"),
        (Join-Path $obsBinDir "resources"),
        (Join-Path (Split-Path $ObsPath) "resources")
    )
    
    foreach ($resourcePath in $obsResourcePaths) {
        if (Test-Path $resourcePath) {
            $webEngineDest = Join-Path $pluginDest "resources"
            Copy-Item -Recurse $resourcePath -Destination $webEngineDest -Force -ErrorAction SilentlyContinue
            if (Test-Path $webEngineDest) {
                Write-Host "[ok] Copied Qt WebEngine resources from: $resourcePath" -ForegroundColor Green
                $resourcesCopied = $true
                break
            }
        }
    }
    
    if (-not $resourcesCopied) {
        Write-Host "[warn] Qt WebEngine resources not found - WebEngine may not work" -ForegroundColor Yellow
        Write-Host "[info] OBS should have WebEngine resources in its installation" -ForegroundColor Yellow
        Write-Host "[info] The plugin will try to use OBS's WebEngine resources at runtime" -ForegroundColor Yellow
    }
}

# Copy any additional data files
Write-Host "`n[4/4] Installing data files..." -ForegroundColor Cyan
$dataSource = Join-Path $scriptRoot "data"
if (Test-Path $dataSource) {
    Copy-Item -Recurse "$dataSource\*" -Destination $dataDest -Force -ErrorAction SilentlyContinue
    Write-Host "[ok] Data files installed" -ForegroundColor Green
} else {
    Write-Host "[info] No additional data files to install" -ForegroundColor Gray
}

# Summary
Write-Host "`n=================================" -ForegroundColor Cyan
Write-Host "[*] Installation Complete!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "`nPlugin installed to: $pluginDest" -ForegroundColor Cyan
Write-Host "Data files: $dataDest" -ForegroundColor Cyan

if ($obsQtVersion) {
    Write-Host "`nOBS Qt version: $obsQtVersion" -ForegroundColor Cyan
    Write-Host "Qt DLLs: $copiedFromOBS from OBS, $copiedFromBuild from build" -ForegroundColor Cyan
}

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Close OBS Studio if it's running" -ForegroundColor White
Write-Host "2. Restart OBS Studio" -ForegroundColor White
Write-Host "3. Go to View → Docks → OpenFM" -ForegroundColor White
Write-Host "4. Ensure the OpenFM service is running on http://127.0.0.1:6767" -ForegroundColor White
Write-Host ""

