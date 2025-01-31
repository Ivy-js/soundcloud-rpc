@echo off
setlocal

:askForLogs
set /p logs="Do you want to enable logs? (yes/no): "

if /i "%logs%"=="yes" (
    echo Logs will be enabled.
    npm run app
) else if /i "%logs%"=="no" (
    echo Logs will not be enabled.
    npm run app --no-console
) else (
    echo Invalid input. Please enter yes or no.
    goto askForLogs
)