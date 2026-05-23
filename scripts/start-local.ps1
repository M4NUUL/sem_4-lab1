$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot

& (Join-Path $PSScriptRoot 'setup-local-env.ps1')

Start-Process -FilePath powershell.exe `
  -WorkingDirectory (Join-Path $root 'backend') `
  -ArgumentList @('-NoExit', '-Command', 'npm.cmd start')

Start-Process -FilePath powershell.exe `
  -WorkingDirectory (Join-Path $root 'frontend') `
  -ArgumentList @('-NoExit', '-Command', 'npm.cmd start')

Write-Host 'Started backend and frontend in separate PowerShell windows.'
