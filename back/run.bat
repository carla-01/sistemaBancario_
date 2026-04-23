@echo off
echo Executando Dridri Bank API (HTTP via Maven)...

where mvn >nul 2>nul
if %errorlevel%==0 (
	mvn -q -Dexec.mainClass=com.bancojavinha.api.MainApi clean compile exec:java
) else (
	if exist "C:\Program Files\JetBrains\IntelliJ IDEA 2026.1\plugins\maven\lib\maven3\bin\mvn.cmd" (
		"C:\Program Files\JetBrains\IntelliJ IDEA 2026.1\plugins\maven\lib\maven3\bin\mvn.cmd" -q -Dexec.mainClass=com.bancojavinha.api.MainApi clean compile exec:java
	) else (
		echo Maven nao encontrado no PATH e nem no caminho padrao do IntelliJ.
		echo Instale o Maven ou ajuste o caminho no arquivo run.bat.
	)
)

pause
