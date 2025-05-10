import { existsSync, mkdirSync, statSync } from 'fs';

export function assureDirIsThere<Or>(dir: string, which: string, notaDir: Or) {
    if (existsSync(dir)) {
        const stats = statSync(dir);
        if (!stats.isDirectory()) {
            console.log(`Unable to remove a ${which} dir: ${dir}. It is not a dir.`);
            return notaDir;
        }
        return;
    } else {
        mkdirSync(dir);
        return;
    }
}
