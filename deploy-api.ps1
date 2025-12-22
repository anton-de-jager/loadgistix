# Deploy API to 1-Grid
# This script builds the .NET API and deploys it via FTP

param(
    [Parameter(Mandatory=$true)]
    [string]$FtpHost,
    
    [Parameter(Mandatory=$true)]
    [string]$FtpUsername,
    
    [Parameter(Mandatory=$true)]
    [string]$FtpPassword,
    
    [string]$RemotePath = "/api.loadgistix.com"
)

$ErrorActionPreference = "Stop"

Write-Host "=== LoadGistix API Deployment ===" -ForegroundColor Cyan

# Step 1: Build the .NET API
Write-Host "`n[1/3] Building .NET API..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\loadgistix.api"
dotnet publish -c Release -o ./publish

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

$localPath = "$PSScriptRoot\loadgistix.api\publish"
Write-Host "Build complete: $localPath" -ForegroundColor Green

# Step 2: Deploy via FTP
Write-Host "`n[2/3] Deploying to FTP server..." -ForegroundColor Yellow

Add-Type -AssemblyName System.Net

$ftpUri = "ftp://$FtpHost$RemotePath"
$credentials = New-Object System.Net.NetworkCredential($FtpUsername, $FtpPassword)

function Create-FtpDirectory {
    param($RemoteDir)
    
    try {
        $uri = New-Object System.Uri("$ftpUri/$RemoteDir")
        $request = [System.Net.FtpWebRequest]::Create($uri)
        $request.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
        $request.Credentials = $credentials
        $response = $request.GetResponse()
        $response.Close()
    } catch {
        # Directory might already exist
    }
}

function Upload-FtpFile {
    param($LocalFile, $RemoteFile)
    
    # Create parent directories if needed
    $parentDir = Split-Path -Parent $RemoteFile
    if ($parentDir) {
        $dirs = $parentDir.Split("/")
        $currentPath = ""
        foreach ($dir in $dirs) {
            if ($dir) {
                $currentPath = if ($currentPath) { "$currentPath/$dir" } else { $dir }
                Create-FtpDirectory -RemoteDir $currentPath
            }
        }
    }
    
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

# Upload app_offline.htm to stop the application
Write-Host "  Stopping application..." -ForegroundColor Yellow
$appOfflineContent = @"
<!DOCTYPE html>
<html>
<head><title>Maintenance</title></head>
<body><h1>Application is being updated. Please wait...</h1></body>
</html>
"@
$appOfflinePath = "$env:TEMP\app_offline.htm"
$appOfflineContent | Out-File -FilePath $appOfflinePath -Encoding UTF8

try {
    $uri = New-Object System.Uri("$ftpUri/app_offline.htm")
    $request = [System.Net.FtpWebRequest]::Create($uri)
    $request.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
    $request.Credentials = $credentials
    $request.UseBinary = $true
    $request.UsePassive = $true
    
    $fileContent = [System.IO.File]::ReadAllBytes($appOfflinePath)
    $request.ContentLength = $fileContent.Length
    
    $requestStream = $request.GetRequestStream()
    $requestStream.Write($fileContent, 0, $fileContent.Length)
    $requestStream.Close()
    
    $response = $request.GetResponse()
    $response.Close()
    
    Write-Host "  Waiting for app to stop..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
} catch {
    Write-Host "  Could not upload app_offline.htm (might be first deployment)" -ForegroundColor Yellow
}

# Get all files to upload
$files = Get-ChildItem -Path $localPath -Recurse -File
$totalFiles = $files.Count
$currentFile = 0

Write-Host "  Uploading $totalFiles files..." -ForegroundColor Yellow

foreach ($file in $files) {
    $currentFile++
    $relativePath = $file.FullName.Substring($localPath.Length + 1).Replace("\", "/")
    Write-Progress -Activity "Uploading API files" -Status "$relativePath" -PercentComplete (($currentFile / $totalFiles) * 100)
    
    try {
        Upload-FtpFile -LocalFile $file.FullName -RemoteFile $relativePath
    } catch {
        Write-Host "  Error uploading $relativePath : $_" -ForegroundColor Red
    }
}
Write-Progress -Activity "Uploading API files" -Completed

# Remove app_offline.htm to start the application
Write-Host "  Starting application..." -ForegroundColor Yellow
try {
    $uri = New-Object System.Uri("$ftpUri/app_offline.htm")
    $request = [System.Net.FtpWebRequest]::Create($uri)
    $request.Method = [System.Net.WebRequestMethods+Ftp]::DeleteFile
    $request.Credentials = $credentials
    $response = $request.GetResponse()
    $response.Close()
} catch {
    Write-Host "  Could not remove app_offline.htm" -ForegroundColor Yellow
}

Write-Host "`n[3/3] Deployment complete!" -ForegroundColor Green
Write-Host "API deployed to: https://api.loadgistix.com" -ForegroundColor Cyan
Write-Host "Test health endpoint: https://api.loadgistix.com/health" -ForegroundColor Cyan

