@echo off
del /S/Q .\server\*.js > nul
node ./node_modules/typescript/bin/tsc --project ./saving/server/tsconfig.json