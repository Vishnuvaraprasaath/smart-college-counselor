# Smart College Admission Counselor Agent - Integrated Launcher
param (
    [switch]$NoBrowser
)

$ErrorActionPreference = "Stop"

$rootDir = (Resolve-Path "$PSScriptRoot\..").Path
$backendDir = Join-Path $rootDir "backend"
$frontendDir = Join-Path $rootDir "frontend"

Write-Host '====================================================================' -ForegroundColor Cyan
Write-Host '  Smart College Admission Counselor Agent (TNEA Intelligence)       ' -ForegroundColor Cyan
Write-Host '  Single Integrated Local Launcher                                  ' -ForegroundColor Cyan
Write-Host '====================================================================' -ForegroundColor Cyan
Write-Host ''

# ── 1. Check MySQL Service (Port 3306) ─────────────────────────────────────────
Write-Host '[Step 1/5] Checking MySQL Service on Port 3306...' -ForegroundColor Yellow
$mysqlActive = $false
try {
    $tcp = New-Object System.Net.Sockets.TcpClient
    $iar = $tcp.BeginConnect('127.0.0.1', 3306, $null, $null)
    $success = $iar.AsyncWaitHandle.WaitOne(2000, $false)
    if ($success -and $tcp.Connected) {
        $tcp.EndConnect($iar)
        $mysqlActive = $true
    }
    $tcp.Close()
} catch {}

if (-not $mysqlActive) {
    Write-Host ''
    Write-Host '====================================================================' -ForegroundColor Red
    Write-Host ' [ERROR] MySQL service is NOT reachable on 127.0.0.1:3306!' -ForegroundColor Red
    Write-Host ' Database connection unavailable. Please start MySQL and try again.' -ForegroundColor Red
    Write-Host '====================================================================' -ForegroundColor Red
    Write-Host ''
    Read-Host 'Press Enter to exit'
    exit 1
}
Write-Host ' [PASS] MySQL is active and listening on port 3306.' -ForegroundColor Green
Write-Host ''

# ── 2. Check & Start Backend API (Port 5000) ──────────────────────────────────
Write-Host '[Step 2/5] Starting Backend API Server (Port 5000)...' -ForegroundColor Yellow
$backendRunning = $false
try {
    $tcp = New-Object System.Net.Sockets.TcpClient
    $iar = $tcp.BeginConnect('127.0.0.1', 5000, $null, $null)
    if ($iar.AsyncWaitHandle.WaitOne(1000, $false) -and $tcp.Connected) {
        $backendRunning = $true
    }
    $tcp.Close()
} catch {}

if ($backendRunning) {
    Write-Host ' [INFO] Backend is already running on port 5000.' -ForegroundColor Green
} else {
    Write-Host ' [LAUNCH] Starting Backend Server in dedicated console...' -ForegroundColor Gray
    Start-Process cmd.exe -ArgumentList "/c title SmartCounsel Backend API && cd /d `"$backendDir`" && node src/server.js" -WindowStyle Normal
}
Write-Host ''

# ── 3. Wait for Backend Health Check ──────────────────────────────────────────
Write-Host '[Step 3/5] Waiting for Backend Health Check (http://localhost:5000/api/health)...' -ForegroundColor Yellow
$backendHealthy = $false
$maxBackendAttempts = 40
$attempt = 0

while ($attempt -lt $maxBackendAttempts) {
    Start-Sleep -Milliseconds 800
    $attempt++
    try {
        $res = Invoke-RestMethod -Uri 'http://localhost:5000/api/health' -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($res.status -eq 'ok' -or $res.database -eq 'connected') {
            $backendHealthy = $true
            break
        }
    } catch {}
    Write-Host '.' -NoNewline
}

if (-not $backendHealthy) {
    Write-Host ''
    Write-Host ' [ERROR] Unable to connect to the counseling service backend at http://localhost:5000/api/health' -ForegroundColor Red
    Read-Host 'Press Enter to exit'
    exit 1
}
Write-Host ''
Write-Host ' [READY] Backend API is online and database is connected!' -ForegroundColor Green
Write-Host ''

# ── 4. Check & Start Frontend Server (Port 3000) ──────────────────────────────
Write-Host '[Step 4/5] Starting Frontend Server (Port 3000)...' -ForegroundColor Yellow
$frontendRunning = $false
try {
    $tcp = New-Object System.Net.Sockets.TcpClient
    $iar = $tcp.BeginConnect('127.0.0.1', 3000, $null, $null)
    if ($iar.AsyncWaitHandle.WaitOne(1000, $false) -and $tcp.Connected) {
        $frontendRunning = $true
    }
    $tcp.Close()
} catch {}

if ($frontendRunning) {
    Write-Host ' [INFO] Frontend server is already active on port 3000.' -ForegroundColor Green
} else {
    Write-Host ' [LAUNCH] Starting Vite Frontend in dedicated console...' -ForegroundColor Gray
    Start-Process cmd.exe -ArgumentList "/c title SmartCounsel Frontend UI && cd /d `"$frontendDir`" && npm.cmd run dev" -WindowStyle Normal
}

$frontendReady = $false
$maxFrontendAttempts = 40
$attempt = 0

while ($attempt -lt $maxFrontendAttempts) {
    Start-Sleep -Milliseconds 800
    $attempt++
    try {
        $tcp = New-Object System.Net.Sockets.TcpClient
        $iar = $tcp.BeginConnect('127.0.0.1', 3000, $null, $null)
        if ($iar.AsyncWaitHandle.WaitOne(1000, $false) -and $tcp.Connected) {
            $frontendReady = $true
            $tcp.Close()
            break
        }
        $tcp.Close()
    } catch {}
    Write-Host '.' -NoNewline
}

if (-not $frontendReady) {
    Write-Host ''
    Write-Host ' [ERROR] Frontend failed to respond on http://localhost:3000' -ForegroundColor Red
    Read-Host 'Press Enter to exit'
    exit 1
}
Write-Host ''
Write-Host ' [READY] Frontend Vite dev server is running on http://localhost:3000' -ForegroundColor Green
Write-Host ''

# ── 5. Launch in Default Browser ──────────────────────────────────────────────
Write-Host '[Step 5/5] Opening Smart College Counselor in default browser...' -ForegroundColor Yellow
if (-not $NoBrowser) {
    Start-Process 'http://localhost:3000'
}

Write-Host ''
Write-Host '====================================================================' -ForegroundColor Green
Write-Host '   Smart College Admission Counselor is LIVE!                       ' -ForegroundColor Green
Write-Host '                                                                    ' -ForegroundColor Green
Write-Host '  Website Frontend : http://localhost:3000                          ' -ForegroundColor White
Write-Host '  Backend API      : http://localhost:5000                          ' -ForegroundColor White
Write-Host '  Health Status    : http://localhost:5000/api/health               ' -ForegroundColor White
Write-Host '====================================================================' -ForegroundColor Green
Write-Host ''
Write-Host 'Both Backend and Frontend are running.' -ForegroundColor Cyan
Write-Host 'Press Enter in this window to stop both services and exit cleanly...' -ForegroundColor Yellow
Write-Host ''

# If run interactively, wait for Enter key
if ([Environment]::UserInteractive) {
    try {
        $null = Read-Host
    } catch {}
}

Write-Host 'Stopping SmartCounsel services...' -ForegroundColor Gray
try {
    Get-Process cmd -ErrorAction SilentlyContinue | Where-Object { 
        $_.MainWindowTitle -like '*SmartCounsel Backend API*' -or $_.MainWindowTitle -like '*SmartCounsel Frontend UI*' 
    } | Stop-Process -Force -ErrorAction SilentlyContinue
    
    Get-Process node -ErrorAction SilentlyContinue | Where-Object { 
        $_.MainWindowTitle -like '*SmartCounsel*' 
    } | Stop-Process -Force -ErrorAction SilentlyContinue
} catch {}

Write-Host 'All services stopped cleanly. Goodbye!' -ForegroundColor Green
Start-Sleep -Seconds 1
