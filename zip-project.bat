@echo off
chcp 65001 >nul
echo ========================================
echo   ضغط مشروع نظام تسجيل المقررات
echo   Zipping Course Registration Project
echo ========================================
echo.

cd /d "%~dp0"

echo جاري ضغط المشروع...
echo Zipping project...

powershell -Command "Get-ChildItem -Path . -Exclude 'node_modules','.git','.env','*.zip','zip-project.bat' -Recurse | Compress-Archive -DestinationPath '../kku-course-registration-complete.zip' -Force"

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   تم الضغط بنجاح! ✅
    echo   Zipping completed successfully!
    echo ========================================
    echo.
    echo الملف المضغوط موجود في:
    echo Zipped file location:
    echo %cd%\..\kku-course-registration-complete.zip
    echo.
) else (
    echo.
    echo ========================================
    echo   حدث خطأ أثناء الضغط ❌
    echo   Error occurred during zipping
    echo ========================================
    echo.
)

pause

