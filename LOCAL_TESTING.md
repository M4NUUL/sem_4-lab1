# Локальное тестирование

## Настройка

```powershell
.\scripts\setup-local-env.ps1
```

Если PowerShell блокирует локальные скрипты, используйте:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\setup-local-env.ps1
```

## Локальный запуск

```powershell
.\scripts\start-local.ps1
```

Или с тем же обходом политики выполнения:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\start-local.ps1
```
