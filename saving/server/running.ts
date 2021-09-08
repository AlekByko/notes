import * as cp from 'child_process';
interface Ran {
    output: string;
    error: string;
}

export async function willRunChild(text: string, shouldBeDetached: boolean): Promise<void> {
    const [command, ...args] = text.split(' ');
    return willRunChildExt(command, args, shouldBeDetached);
}

export async function willRunChildExt(command: string, args: string[], shouldBeDetached: boolean): Promise<void> {
    return new Promise<void>(async resolve => {
        console.log(command, args);
        const options: cp.SpawnOptions = {
            detached: shouldBeDetached,
            cwd: process.cwd(),
            shell: shouldBeDetached ? true : false,
            env: process.env,
            windowsHide: true,
            windowsVerbatimArguments: true,
            stdio: shouldBeDetached ? undefined : 'inherit',
        };
        // https://nodejs.org/dist./v0.10.44/docs/api/child_process.html#child_process_child_stdio
        const child = cp.spawn(command, args, options);
        resolve();
    })
}
