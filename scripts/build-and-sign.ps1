# PowerShell script to build signed APK and AAB for Play Store
# Run from the project root: .\scripts\build-and-sign.ps1

param(
    [int]$VersionCode = 11136,
    [string]$VersionName = "1.0.1"
)

$ErrorActionPreference = "Stop"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Loadgistix Android Build Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Version Code: $VersionCode" -ForegroundColor Yellow
Write-Host "Version Name: $VersionName" -ForegroundColor Yellow
Write-Host ""

# Check we're in the right directory
if (-not (Test-Path "loadgistix.frontend")) {
    Write-Host "Error: Run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Check keystore exists
$keystorePath = "loadgistix.frontend\loadgistix.keystore"
if (-not (Test-Path $keystorePath)) {
    Write-Host "Error: Keystore not found at $keystorePath" -ForegroundColor Red
    exit 1
}

# Set environment variables for version
$env:VERSION_CODE = $VersionCode
$env:VERSION_NAME = $VersionName

Write-Host "Step 1: Building Angular frontend..." -ForegroundColor Green
Push-Location loadgistix.frontend
npm run build -- --configuration=production
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Frontend build failed" -ForegroundColor Red
    Pop-Location
    exit 1
}

Write-Host "Step 2: Syncing Capacitor..." -ForegroundColor Green
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Capacitor sync failed" -ForegroundColor Red
    Pop-Location
    exit 1
}

Write-Host "Step 3: Building Release APK..." -ForegroundColor Green
Push-Location android
.\gradlew.bat assembleRelease
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: APK build failed" -ForegroundColor Red
    Pop-Location
    Pop-Location
    exit 1
}

Write-Host "Step 4: Building Release AAB (for Play Store)..." -ForegroundColor Green
.\gradlew.bat bundleRelease
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: AAB build failed" -ForegroundColor Red
    Pop-Location
    Pop-Location
    exit 1
}

Pop-Location
Pop-Location

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  BUILD SUCCESSFUL!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

$apkPath = "loadgistix.frontend\android\app\build\outputs\apk\release\app-release.apk"
$aabPath = "loadgistix.frontend\android\app\build\outputs\bundle\release\app-release.aab"

if (Test-Path $apkPath) {
    $apkSize = [math]::Round((Get-Item $apkPath).Length / 1MB, 2)
    Write-Host "APK: $apkPath ($apkSize MB)" -ForegroundColor Yellow
}

if (Test-Path $aabPath) {
    $aabSize = [math]::Round((Get-Item $aabPath).Length / 1MB, 2)
    Write-Host "AAB: $aabPath ($aabSize MB)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "To upload to Play Store:" -ForegroundColor Cyan
Write-Host "1. Go to https://play.google.com/console" -ForegroundColor White
Write-Host "2. Select 'Loadgistix' app" -ForegroundColor White
Write-Host "3. Go to Release > Testing > Internal testing" -ForegroundColor White
Write-Host "4. Create new release and upload the AAB file" -ForegroundColor White
Write-Host ""

