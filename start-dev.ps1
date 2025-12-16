# Start loadgistix Development Environment
# This script opens 2 terminals and runs both the API and Frontend

Write-Host "Starting loadgistix Development Environment..." -ForegroundColor Cyan
Write-Host ""

# Start the API in a new PowerShell window
Write-Host "Starting loadgistix.api on https://localhost:44368..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Code\loadgistix\loadgistix.api'; Write-Host 'Starting loadgistix.api...' -ForegroundColor Cyan; dotnet run --urls 'https://localhost:44368'"

# Start the Frontend in a new PowerShell window
Write-Host "Starting loadgistix.frontend on http://localhost:4200..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Code\loadgistix\loadgistix.frontend'; Write-Host 'Starting loadgistix.frontend...' -ForegroundColor Cyan; ng serve --port 4200"

Write-Host ""
Write-Host "Both services are starting in separate windows!" -ForegroundColor Yellow
Write-Host ""
Write-Host "API:      https://localhost:44368" -ForegroundColor White
Write-Host "Frontend: http://localhost:4200" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit this window..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

