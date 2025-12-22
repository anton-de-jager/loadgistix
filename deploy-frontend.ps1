# Deploy Frontend to 1-Grid
# This script builds the Angular app and deploys it via FTP

param(
    [Parameter(Mandatory=$true)]
    [string]$FtpHost,
    
    [Parameter(Mandatory=$true)]
    [string]$FtpUsername,
    
    [Parameter(Mandatory=$true)]
    [string]$FtpPassword,
    
    [string]$RemotePath = "/loadgistix.com"
)

$ErrorActionPreference = "Stop"

Write-Host "=== LoadGistix Frontend Deployment ===" -ForegroundColor Cyan

# Step 1: Build the Angular app
Write-Host "`n[1/4] Building Angular application..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\loadgistix.frontend"
npm run build -- --configuration=production

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

$localPath = "$PSScriptRoot\loadgistix.frontend\dist\fuse\browser"
Write-Host "Build complete: $localPath" -ForegroundColor Green

# Step 2: Create web.config for IIS
Write-Host "`n[2/4] Creating web.config for IIS..." -ForegroundColor Yellow
$webConfig = @'
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
    <staticContent>
      <remove fileExtension=".woff" />
      <remove fileExtension=".woff2" />
      <mimeMap fileExtension=".woff" mimeType="font/woff" />
      <mimeMap fileExtension=".woff2" mimeType="font/woff2" />
      <remove fileExtension=".json" />
      <mimeMap fileExtension=".json" mimeType="application/json" />
    </staticContent>
  </system.webServer>
</configuration>
'@
$webConfig | Out-File -FilePath "$localPath\web.config" -Encoding UTF8
Write-Host "web.config created" -ForegroundColor Green

# Step 3: Deploy via FTP using WinSCP or native PowerShell
Write-Host "`n[3/4] Connecting to FTP server..." -ForegroundColor Yellow

# Create FTP script
$ftpScript = @"
open ftp://${FtpUsername}:${FtpPassword}@${FtpHost}/
cd $RemotePath
lcd "$localPath"
# Remove old files (except .well-known for SSL)
rm *.*
rm -r assets
rm -r media
# Upload new files
put -r *
bye
"@

# Check if WinSCP is available
$winscpPath = "C:\Program Files (x86)\WinSCP\WinSCP.com"
if (Test-Path $winscpPath) {
    Write-Host "Using WinSCP for deployment..." -ForegroundColor Yellow
    $ftpScript | & $winscpPath /script=/dev/stdin
} else {
    # Use lftp via WSL or fall back to .NET FTP
    Write-Host "Using .NET FTP client..." -ForegroundColor Yellow
    
    # Load .NET FTP functionality
    Add-Type -AssemblyName System.Net
    
    $ftpUri = "ftp://$FtpHost$RemotePath"
    $credentials = New-Object System.Net.NetworkCredential($FtpUsername, $FtpPassword)
    
    function Upload-FtpFile {
        param($LocalFile, $RemoteFile)
        
        $uri = New-Object System.Uri("$ftpUri/$RemoteFile")
        $request = [System.Net.FtpWebRequest]::Create($uri)
        $request.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $request.Credentials = $credentials
        $request.UseBinary = $true
        $request.UsePassive = $true
        
        $fileContent = [System.IO.File]::ReadAllBytes($LocalFile)
        $request.ContentLength = $fileContent.Length
        
        $requestStream = $request.GetRequestStream()
        $requestStream.Write($fileContent, 0, $fileContent.Length)
        $requestStream.Close()
        
        $response = $request.GetResponse()
        $response.Close()
    }
    
    function Delete-FtpFile {
        param($RemoteFile)
        
        try {
            $uri = New-Object System.Uri("$ftpUri/$RemoteFile")
            $request = [System.Net.FtpWebRequest]::Create($uri)
            $request.Method = [System.Net.WebRequestMethods+Ftp]::DeleteFile
            $request.Credentials = $credentials
            $response = $request.GetResponse()
            $response.Close()
        } catch {
            # Ignore errors when deleting
        }
    }
    
    # Get all files to upload
    $files = @(Get-ChildItem -Path $localPath -Recurse -File)
    $totalFiles = $files.Count
    if ($totalFiles -eq 0) {
        Write-Host "  No files to upload" -ForegroundColor Yellow
        return
    }
    $currentFile = 0
    
    foreach ($file in $files) {
        $currentFile++
        $relativePath = $file.FullName.Substring($localPath.Length + 1).Replace("\", "/")
        $percentComplete = [math]::Round(($currentFile / $totalFiles) * 100, 0)
        Write-Progress -Activity "Uploading files" -Status "$currentFile of $totalFiles" -PercentComplete $percentComplete
        
        try {
            Upload-FtpFile -LocalFile $file.FullName -RemoteFile $relativePath
        } catch {
            Write-Host "  Error uploading $relativePath : $_" -ForegroundColor Red
        }
    }
    Write-Progress -Activity "Uploading files" -Completed
}

Write-Host "`n[4/4] Deployment complete!" -ForegroundColor Green
Write-Host "Frontend deployed to: https://loadgistix.com" -ForegroundColor Cyan

