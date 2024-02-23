import { existsSync, readFileSync } from 'fs';
import { IncomingMessage, ServerOptions, ServerResponse, createServer } from 'http';
import { MongoClient } from 'mongodb';
import { extname, join } from 'path';
import { parse } from 'url';
import { CamConfig } from './shared/cam-config';
import { asNonNullOr, isNull } from './shared/core';
import { setConsoleTitle } from './utils';


const port = 8081;
const options: ServerOptions = {};
async function run() {

    const mongoUrl = 'mongodb://0.0.0.0:27017/';
    const mongo = new MongoClient(mongoUrl);
    console.log('connecting to backend at', mongoUrl, '...');
    await mongo.connect();
    console.log('connected');
    const db = mongo.db('saving');

    setConsoleTitle(`http://localhost:${port}`)
    console.log(`listening at ${port}`);
    console.log(`http://localhost:${port}`);

    const server = createServer(options, async (req, res) => {
        res.setDefaultEncoding('utf-8');
        req.setEncoding('utf-8');

        const url = parse(req.url!, true);
        let path = asNonNullOr(url.pathname, '/index.html');
        path = path === '/' ? '/index.html' : path;

        const filepath = join(process.cwd(), path);
        if (req.method === 'GET') {
            if (path.startsWith('/cam/')) {
                // geting cam config
                const name = path.substring(5);
                console.log('pulling cam config:', name);
                const config: CamConfig | null = await db.collection('cams').findOne({ name }) as any;
                if (isNull(config)) {
                    const message = 'No config for cam:' + name;
                    console.log(message);
                    return tooBad(404, req, res, message);
                } else {
                    const json = JSON.stringify(config, null, 4);
                    console.log('Cam config for', name, json);
                    res.write(json);
                    res.end();
                }
            } else {
                console.log(path, filepath);
                if (!existsSync(filepath)) return tooBad(404, req, res, 'No file: ' + filepath);
                const extension = extname(filepath);
                setContentType(res, extension);
                const file = readFileSync(filepath);
                res.write(file);
                res.end();
            }
        } else if (req.method === 'POST') {
            console.log('POST', path);
            if (path === '/cam') {
                const text = req.read();
                const data: CamConfig[] = JSON.parse(text);
                console.log(data);
            }
        }
    });

    server.listen(port);
}






function tooBad(code: number, req: IncomingMessage, res: ServerResponse, message: string): void {
    console.log('unhandled:');
    console.log(req.url);
    console.log(message);
    res.statusCode = code;
    res.setHeader('content-type', 'text/plain');
    res.write(message);
    res.end();
}

function setContentType(res: ServerResponse, extension: string) {
    const mime = toMimeType(extension);
    if (isNull(mime)) return;
    res.setHeader('content-type', mime);
}

function toMimeType(extension: string): string | null {
    switch (extension) {
        case '.ico': return 'image/x-icon';
        case '.js': return 'application/javascript';
        case '.json': return 'application/json';
        case '.jpg': return 'image/jpeg';
        case '.svg': return 'image/svg+xml';
        case '.css': return 'text/css';
        case '.html': return 'text/html';
        default: return null;
    }
}
