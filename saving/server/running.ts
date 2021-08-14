import * as cp from 'child_process';
interface Ran {
    output: string;
    error: string;
}
export async function willRunChild(text: string, shouldBeDetached: boolean): Promise<Ran> {
    return new Promise<Ran>((resolve, reject) => {

        const [command, ...args] = text.split(' ');
        console.log(command, args);
        const options: cp.SpawnOptions = {
            detached: shouldBeDetached,
            cwd: process.cwd(),
            shell: true,
            env: process.env,
            windowsHide: true,
            stdio: shouldBeDetached ? undefined : [process.stdin, process.stdout, process.stderr],
        };
        // https://nodejs.org/dist./v0.10.44/docs/api/child_process.html#child_process_child_stdio
        const child = cp.spawn(command, args, options);

        if (!shouldBeDetached) {
            const outChunks: string[] = [];
            if (child.stdout !== null) {
                child.stdout.pipe(process.stdout);
                child.stdout.on('data', chunk => {
                    outChunks.push(chunk);
                });
                child.stdout.on('end', () => {
                    const output = outChunks.join('');
                    const error = errChunks.join('');
                    resolve({ output, error });
                });
            }
            const errChunks: string[] = [];
            if (child.stderr !== null) {
                child.stderr.pipe(process.stderr);
                child.stderr.on('data', chunk => {
                    errChunks.push(chunk);
                });
                child.stderr.on('end', () => {
                    const output = outChunks.join('');
                    const error = errChunks.join('');
                    resolve({ output, error });
                });
            }
        } else {
            resolve(null!);
        }

        child.on('error', e => {
            reject(e);
        });
    })
}
