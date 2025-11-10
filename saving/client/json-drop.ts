import { isNull, isUndefined } from '../shared/core';
import { parseJsonOr } from './reading-from-file-handles';
import { willGetFileHandlePermittedOr, willGetSubdirAndFilename, willSaveFile } from './reading-writing-files';

/** Abstraction for something stored in the file system. */
export function thusJsonDrop<Json extends object>() {

    async function willLoad(handle: FileSystemFileHandle) {
        const file = await handle.getFile();
        const text = await file.text();
        const json = parseJsonOr<Json, undefined>(text, undefined);
        return json;
    }

    return class JsonDrop {

        constructor(
            public data: Json,
            private handle: FileSystemFileHandle,
        ) { }

        async willSave(json: Json) {
            const text = JSON.stringify(json, null, 4);
            const wasSaved = await willSaveFile(
                this.handle, text
            );
            return wasSaved;
        }

        static async willTryMake(
            dir: FileSystemDirectoryHandle,
            subpath: string,
        ) {
            const sub = await willGetSubdirAndFilename(dir, subpath);
            if (isNull(sub)) return null;
            const { fileDir, fileName } = sub;
            const file = await willGetFileHandlePermittedOr(fileDir, fileName, true, null);
            if (isNull(file)) return null;
            const data = await willLoad(file);
            if (isUndefined(data)) return null;
            return new JsonDrop(data, file);
        }

    };

}
