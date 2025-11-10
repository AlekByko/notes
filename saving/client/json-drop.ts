import { isNull } from '../shared/core';
import { parseJsonOr } from './reading-from-file-handles';
import { willTryGetFile, willTrySaveFile } from './reading-writing-files';

/** Abstraction for something stored in the file system. */
export class JsonDrop<Json extends object> {

    constructor(
        public dir: FileSystemDirectoryHandle,
        public filename: string,

    ) { }

    async willSave(json: Json) {
        const text = JSON.stringify(json, null, 4);
        const wasSaved = await willTrySaveFile(
            this.dir, this.filename, text, true,
        );
        return wasSaved;
    }

    async willLoad() {
        const { dir, filename } = this;
        const handle = await willTryGetFile(dir, filename, false);
        if (isNull(handle)) return undefined;
        const file = await handle.getFile();
        const text = await file.text();
        const json = parseJsonOr(text, undefined);
        return json;
    }

}
