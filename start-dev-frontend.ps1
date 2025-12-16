# Start loadgistix Frontend Development Server
# Runs the Angular frontend on http://localhost:4200

Write-Host "Starting loadgistix.frontend..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend URL: http://localhost:4200" -ForegroundColor Green
Write-Host ""

Set-Location "C:\Code\loadgistix\loadgistix.frontend"
ng serve --port 4200

