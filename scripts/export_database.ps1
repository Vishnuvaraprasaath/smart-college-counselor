# Export SmartCounsel MySQL Database to SQL Dump for Production Migration
$ErrorActionPreference = "Stop"

$rootDir = (Resolve-Path "$PSScriptRoot\..").Path
$backendEnv = Join-Path $rootDir "backend\.env"
$outputSql = Join-Path $rootDir "smart_counsel_dump.sql"

Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "  Smart College Admission Counselor - Database Export Utility       " -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

# Default parameters
$dbHost = "127.0.0.1"
$dbPort = "3306"
$dbUser = "root"
$dbPass = ""
$dbName = "smart_counsel"

# Read backend/.env if present
if (Test-Path $backendEnv) {
    Get-Content $backendEnv | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith('#')) {
            $parts = $line.Split('=', 2)
            if ($parts.Length -eq 2) {
                $k = $parts[0].Trim()
                $v = $parts[1].Trim().Trim('"').Trim("'")
                if ($k -eq "DB_HOST") { $dbHost = $v }
                if ($k -eq "DB_PORT") { $dbPort = $v }
                if ($k -eq "DB_USER") { $dbUser = $v }
                if ($k -eq "DB_PASS") { $dbPass = $v }
                if ($k -eq "DB_NAME") { $dbName = $v }
            }
        }
    }
}

# Find mysqldump.exe
$mysqldumpPath = $null
$foundCmd = Get-Command mysqldump -ErrorAction SilentlyContinue
if ($foundCmd) {
    $mysqldumpPath = $foundCmd.Source
} else {
    $searchPaths = @(
        "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqldump.exe",
        "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe",
        "C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysqldump.exe",
        "C:\xampp\mysql\bin\mysqldump.exe"
    )
    foreach ($p in $searchPaths) {
        if (Test-Path $p) {
            $mysqldumpPath = $p
            break
        }
    }
}

if (-not $mysqldumpPath) {
    Write-Host "[ERROR] mysqldump.exe was not found. Please install MySQL client tools or add to PATH." -ForegroundColor Red
    exit 1
}

Write-Host "Using mysqldump: $mysqldumpPath" -ForegroundColor Gray
Write-Host "Exporting database '$dbName' from ${dbHost}:${dbPort}..." -ForegroundColor Yellow

if ($dbPass) {
    $env:MYSQL_PWD = $dbPass
}

try {
    # Use cmd redirection with escaped quotes for space-safe file output
    $cmdLine = "/c `"`"$mysqldumpPath`" --host=$dbHost --port=$dbPort --user=$dbUser --single-transaction --quick --routines --triggers $dbName > `"$outputSql`"`""
    $proc = Start-Process -FilePath "cmd.exe" -ArgumentList $cmdLine -NoNewWindow -Wait -PassThru

    if ($proc.ExitCode -eq 0 -and (Test-Path $outputSql) -and (Get-Item $outputSql).Length -gt 1000) {
        $fileSize = (Get-Item $outputSql).Length / 1MB
        Write-Host ""
        Write-Host "====================================================================" -ForegroundColor Green
        Write-Host "  Database export completed successfully!" -ForegroundColor Green
        Write-Host "  Dump file: smart_counsel_dump.sql ($([math]::Round($fileSize, 2)) MB)" -ForegroundColor White
        Write-Host "====================================================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "You can now import this dump file into any managed cloud MySQL service:" -ForegroundColor Cyan
        Write-Host "  mysql -h <managed-host> -P <port> -u <user> -p <database_name> < smart_counsel_dump.sql" -ForegroundColor Gray
    } else {
        Write-Host "[ERROR] mysqldump failed or produced an empty dump file." -ForegroundColor Red
    }
} finally {
    $env:MYSQL_PWD = $null
}
