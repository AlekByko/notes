import { Server } from 'ws';
import { setConsoleTitle } from './core';
import { willRunChild } from './running';

const port = 8080;
const wss = new Server({ port });
setConsoleTitle('serving...');
console.log('waiting for customer...');
wss.on('connection', ws => {
    console.log('now serving at ' + port);
    ws.on('message', async bytes => {
        const message = bytes.toString("utf-8");
        console.log('now serving: ' + message);
        // https://stackoverflow.com/questions/27688804/how-do-i-debug-error-spawn-enoent-on-node-js
        await willRunChild('cmd.exe /C start /min node.exe ./node_modules/saving-server/cli.js ' + message, true);
    });
});
