@echo off
cd /D "%~dp0"
set ELECTRON_RUN_AS_NODE=
start "Solo Founder OS" node_modules\electron\dist\electron.exe electron-launcher.js
