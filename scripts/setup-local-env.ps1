$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$backendEnv = Join-Path $root 'backend\.env'
$frontendEnv = Join-Path $root 'frontend\.env.local'

if (-not (Test-Path -LiteralPath $backendEnv)) {
  @'
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=
DB_NAME=security_incidents_lab1
PORT=5000
'@ | Set-Content -LiteralPath $backendEnv -Encoding UTF8
  Write-Host "Created backend\.env"
} else {
  Write-Host "backend\.env already exists"
}

if (-not (Test-Path -LiteralPath $frontendEnv)) {
  @'
REACT_APP_API_URL=http://localhost:5000/api
'@ | Set-Content -LiteralPath $frontendEnv -Encoding UTF8
  Write-Host "Created frontend\.env.local"
} else {
  Write-Host "frontend\.env.local already exists"
}

Write-Host ''
Write-Host 'Local env files are ignored by git and will not be deployed.'
