@echo off
REM ────────────────────────────────
REM Скрипт авто-коммита и пуша всех изменений проекта с UTF-8 логом
REM ────────────────────────────────

REM UTF-8 для консоли
chcp 65001

REM Переходим в папку скрипта (корень проекта)
cd /d %~dp0

REM Файл для логирования
set LOGFILE=push_log.txt

echo =============================== >> %LOGFILE%
echo %date% %time% >> %LOGFILE%
echo Начало авто-обновления проекта >> %LOGFILE%

REM Добавляем все изменения
git add . >> %LOGFILE% 2>&1

REM Создаём коммит с датой и временем
for /f "tokens=1-5 delims=:. " %%a in ("%date% %time%") do set datetime=%%a-%%b-%%c_%%d-%%e
git commit -m "auto_commit %datetime%" >> %LOGFILE% 2>&1

REM Пушим изменения на GitHub
git push origin main >> %LOGFILE% 2>&1

echo ✔ Обновление завершено >> %LOGFILE%
echo Смотрите лог в %LOGFILE%
pause
