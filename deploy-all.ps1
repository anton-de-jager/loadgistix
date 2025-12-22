# Deploy Both Frontend and API to 1-Grid
# Usage: .\deploy-all.ps1 -FtpHost "ftp.loadgistix.com" -FtpUsername "your-username" -FtpPassword "your-password"

param(
    [Parameter(Mandatory=$true)]
    [string]$FtpHost,
    
    [Parameter(Mandatory=$true)]
    [string]$FtpUsername,
    
    [Parameter(Mandatory=$true)]
    [string]$FtpPassword
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  LoadGistix Full Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Deploy API first
Write-Host ">>> Deploying API..." -ForegroundColor Magenta
& "$PSScriptRoot\deploy-api.ps1" -FtpHost $FtpHost -FtpUsername $FtpUsername -FtpPassword $FtpPassword

if ($LASTEXITCODE -ne 0) {
    Write-Host "API deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Deploy Frontend
Write-Host ">>> Deploying Frontend..." -ForegroundColor Magenta
& "$PSScriptRoot\deploy-frontend.ps1" -FtpHost $FtpHost -FtpUsername $FtpUsername -FtpPassword $FtpPassword

if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: https://loadgistix.com" -ForegroundColor Cyan
Write-Host "API:      https://api.loadgistix.com" -ForegroundColor Cyan
Write-Host "Health:   https://api.loadgistix.com/health" -ForegroundColor Cyan
Write-Host ""

