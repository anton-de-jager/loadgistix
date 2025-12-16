# Start loadgistix API Development Server
# Runs the .NET API on https://localhost:7204

Write-Host "Starting loadgistix.api..." -ForegroundColor Cyan
Write-Host ""
Write-Host "API URL: https://localhost:44368" -ForegroundColor Green
Write-Host ""

Set-Location "C:\Code\loadgistix\loadgistix.api"
dotnet run --urls "https://localhost:44368"

