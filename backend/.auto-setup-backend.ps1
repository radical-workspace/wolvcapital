<#
Auto-setup script for Laravel backend on Windows.
What it does:

Run from the repository root or the backend folder:
  cd <repo>/backend
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  .\auto-setup-backend.ps1
#>

function Write-Ok($msg){ Write-Host "[OK]    $msg" -ForegroundColor Green }
function Write-Warn($msg){ Write-Host "[WARN]  $msg" -ForegroundColor Yellow }
function Write-Err($msg){ Write-Host "[ERROR] $msg" -ForegroundColor Red }

# 1) detect php
$phpPath = (Get-Command php -ErrorAction SilentlyContinue).Path
if (-not $phpPath) {
    Write-Warn "PHP not found in PATH, searching common locations..."
    $candidates = @(
        'C:\php\php.exe',
        'C:\Windows\php.exe',
        'C:\Windows\php-8*\\php.exe',
        'C:\Program Files\\php\\php.exe',
        'C:\Program Files (x86)\\php\\php.exe',
        'C:\xampp\php\php.exe',
        'C:\wamp64\bin\php\*\php.exe',
        'C:\wamp\bin\php\*\php.exe'
    )
    foreach ($pat in $candidates){
        $found = Get-ChildItem -Path (Split-Path $pat -Parent) -Filter (Split-Path $pat -Leaf) -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($found) { $phpPath = $found.FullName; break }
    }
    if (-not $phpPath){
        Write-Err "PHP executable not found. Please install PHP and add it to PATH, or rerun this script from a shell where 'php' is available."; exit 1
    }
    else { Write-Ok "Discovered PHP at: $phpPath" }
}
else { Write-Ok "Found PHP in PATH: $phpPath" }

# Prepend PHP directory to PATH for this process so child commands find php
$phpDir = Split-Path -Path $phpPath -Parent
if ($env:PATH -notlike "*$phpDir*"){
    $env:PATH = "$phpDir;$env:PATH"
    Write-Ok "Prepended PHP dir to PATH for this session: $phpDir"
}

# detect php.ini used by CLI using php_ini_loaded_file()
$phpIniPath = (& php -r "echo php_ini_loaded_file() ?: '';" 2>$null).Trim()
if (-not $phpIniPath) {
    # fallback common location
    $phpIniPath = 'C:\\Windows\\php.ini'
}
Write-Ok "Using php.ini: $phpIniPath"

if (-not (Test-Path $phpIniPath)){
    Write-Warn "php.ini not found at $phpIniPath. You may need to edit your php.ini manually.";
} else {
    # enable extensions we need
    $ini = Get-Content $phpIniPath -Raw
    $changes = $false
    $exts = @('fileinfo','zip','sqlite3','pdo_sqlite')
    foreach ($e in $exts){
        if ($ini -match [Regex]::Escape("extension=$e")) { continue }
        # try to uncomment existing line
        $new = $ini -replace "(?im)^;?\s*extension\s*=\s*${e}.*","extension=$e"
        if ($new -ne $ini){ $ini = $new; $changes = $true }
        else {
            # append if no line existed
            $ini += "`r`nextension=$e"; $changes = $true
        }
    }
    if ($changes){
        try { Set-Content -Path $phpIniPath -Value $ini -Force; Write-Ok "Updated php.ini and enabled extensions: $($exts -join ', ')" }
        catch { Write-Warn "Failed to update php.ini automatically: $_. Exception. You may need to run the script as admin or edit php.ini manually." }
    } else { Write-Ok "php.ini already contains required extensions." }
}

# 2) offer to install 7-zip (optional)
function Test-7ZipAvailability {
    $seven = Get-Command 7z.exe -ErrorAction SilentlyContinue
    if ($seven) { Write-Ok "7z found: $($seven.Path)"; return }
    Write-Warn "7-Zip not found. This is optional; the script will continue without it.";
}

Test-7ZipAvailability

# 3) run composer install
# Try to run composer. If composer isn't on PATH, try composer.phar next to php (idempotent).
function Invoke-ComposerInstall {
    if (Get-Command composer -ErrorAction SilentlyContinue) {
        Write-Host "Running composer install..."
        composer install --no-interaction --prefer-dist
        return $LASTEXITCODE
    }

    # Try common composer.phar locations
    $possible = @(
        "$PSScriptRoot\composer.phar",
        "vendor\composer\composer.phar",
        "$phpDir\composer.phar"
    )
    foreach ($p in $possible){ if (Test-Path $p) { $composerPhar = (Resolve-Path $p).Path; break } }

    if ($composerPhar) {
        Write-Host "Running composer via PHP: $composerPhar"
        & php $composerPhar install --no-interaction --prefer-dist
        return $LASTEXITCODE
    }

    Write-Warn "Composer not found; skipping composer install. Please run 'composer install' manually if needed.";
    return 0
}

$rc = Invoke-ComposerInstall
if ($rc -ne 0) { Write-Warn "composer install returned exit code $rc" }
else { Write-Ok "composer step finished (or skipped)." }

# 4) env and app key
if (-not (Test-Path .env)){
    if (Test-Path .env.example){ Copy-Item .env.example .env; Write-Ok "Copied .env.example -> .env" }
    else { Write-Warn ".env.example not found; create .env manually." }
}

Write-Host "Generating app key..."
php artisan key:generate
if ($LASTEXITCODE -ne 0){ Write-Warn "key:generate failed or artisan not available. Ensure 'artisan' file exists in project root." }

# 5) choose DB (sqlite by default)
Write-Host "Configuring DB: defaulting to sqlite (non-interactive)"
# ensure database folder and sqlite file
if (-not (Test-Path database)) { New-Item -ItemType Directory -Path database | Out-Null }
$dbfile = "database/database.sqlite"
if (-not (Test-Path $dbfile)) { New-Item -ItemType File -Path $dbfile | Out-Null; Write-Ok "Created $dbfile" }
# update .env values for sqlite (idempotent replace)
if (Test-Path .env){
    (Get-Content .env) -replace '^DB_CONNECTION=.*','DB_CONNECTION=sqlite' -replace '^DB_DATABASE=.*','DB_DATABASE=database/database.sqlite' | Set-Content .env
    Write-Ok "Configured .env for sqlite"
} else { Write-Warn ".env not found to update DB settings" }
 

# 6) run migrations
Write-Host "Ensuring storage directories exist..."
foreach ($d in @('storage','storage/framework','storage/framework/sessions','storage/framework/cache','storage/framework/views','bootstrap/cache')){
    if (-not (Test-Path $d)) { New-Item -ItemType Directory -Path $d | Out-Null; Write-Ok "Created $d" }
}

Write-Host "Running migrations (non-interactive)..."
php artisan migrate --force
if ($LASTEXITCODE -ne 0){ Write-Warn "migrate failed. Check DB configuration and php extensions and logs (storage/logs)." }
else { Write-Ok "Migrations ran successfully." }

# 7) start the server
Write-Host "Starting Laravel server on http://127.0.0.1:8000"
# Start the Laravel built-in server in the background if not already running on :8000
function Test-PortListening($port){
    try { $sock = New-Object System.Net.Sockets.TcpClient('127.0.0.1',$port); $sock.Close(); return $true } catch { return $false }
}

if (-not (Test-PortListening 8000)){
    Write-Host "Starting Laravel server on http://127.0.0.1:8000"
    Start-Process -NoNewWindow -FilePath php -ArgumentList 'artisan','serve','--host=127.0.0.1','--port=8000' -WorkingDirectory (Get-Location)
    Write-Ok "Laravel server started (background)."
} else { Write-Ok "Port 8000 already in use; assuming server already running." }
