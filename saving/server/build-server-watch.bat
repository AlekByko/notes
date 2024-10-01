@echo off
del /S/Q .\server\*.js > nul
node ../../node_modules/typescript/bin/tsc --pretty --watch --project ./tsconfig.json
