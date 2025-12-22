# Simple Deploy Script for LoadGistix
# Usage: .\deploy-simple.ps1

param(
    [string]$FtpHost = "ftp.loadgistix.com",
    [string]$FtpUsername,
    [string]$FtpPassword
)

$ErrorActionPreference = "Stop"

# Prompt for credentials if not provided
if (-not $FtpUsername) {
    $FtpUsername = Read-Host "FTP Username"
}
if (-not $FtpPassword) {
    $securePassword = Read-Host "FTP Password" -AsSecureString
    $FtpPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword))
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  LoadGistix Deployment" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Step 1: Build API
Write-Host "[1/4] Building API..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\loadgistix.api"
dotnet publish -c Release -o ./publish --nologo -v q
if ($LASTEXITCODE -ne 0) { throw "API build failed" }
Write-Host "  API build complete" -ForegroundColor Green

# Step 2: Build Frontend
Write-Host "`n[2/4] Building Frontend..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\loadgistix.frontend"
npm run build -- --configuration=production 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) { throw "Frontend build failed" }
Write-Host "  Frontend build complete" -ForegroundColor Green

# Create web.config
@"
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Angular Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/index.html" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
"@ | Set-Content "$PSScriptRoot\loadgistix.frontend\dist\fuse\browser\web.config" -Encoding UTF8

# FTP Upload Function
function Upload-ToFtp {
    param(
        [string]$LocalPath,
        [string]$RemotePath,
        [string]$Description
    )
    
    Write-Host "`n  Uploading $Description..." -ForegroundColor Yellow
    
    $webclient = New-Object System.Net.WebClient
    $webclient.Credentials = New-Object System.Net.NetworkCredential($FtpUsername, $FtpPassword)
    
    $files = Get-ChildItem -Path $LocalPath -Recurse -File
    $total = $files.Count
    $current = 0
    
    foreach ($file in $files) {
        $current++
        $relativePath = $file.FullName.Substring($LocalPath.Length + 1).Replace("\", "/")
        $remoteFile = "ftp://$FtpHost$RemotePath/$relativePath"
        
        # Create directory structure
        $remoteDir = Split-Path $remoteFile -Parent
        
        Write-Progress -Activity "Uploading $Description" -Status "$current of $total - $relativePath" -PercentComplete (($current / $total) * 100)
        
        try {
            $webclient.UploadFile($remoteFile, $file.FullName) | Out-Null
        } catch {
            # Try creating parent directory and retry
            try {
                $ftpRequest = [System.Net.FtpWebRequest]::Create($remoteDir)
                $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
                $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($FtpUsername, $FtpPassword)
                $ftpRequest.GetResponse() | Out-Null
            } catch {}
            
            try {
                $webclient.UploadFile($remoteFile, $file.FullName) | Out-Null
            } catch {
                Write-Host "    Failed: $relativePath" -ForegroundColor Red
            }
        }
    }
    
    Write-Progress -Activity "Uploading $Description" -Completed
    $webclient.Dispose()
    Write-Host "  Upload complete ($total files)" -ForegroundColor Green
}

# Step 3: Deploy API
Write-Host "`n[3/4] Deploying API..." -ForegroundColor Yellow
Upload-ToFtp -LocalPath "$PSScriptRoot\loadgistix.api\publish" -RemotePath "/api.loadgistix.com" -Description "API"

# Step 4: Deploy Frontend  
Write-Host "`n[4/4] Deploying Frontend..." -ForegroundColor Yellow
Upload-ToFtp -LocalPath "$PSScriptRoot\loadgistix.frontend\dist\fuse\browser" -RemotePath "/loadgistix.com" -Description "Frontend"

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nFrontend: https://loadgistix.com" -ForegroundColor Cyan
Write-Host "API:      https://api.loadgistix.com" -ForegroundColor Cyan
Write-Host "Health:   https://api.loadgistix.com/health`n" -ForegroundColor Cyan

