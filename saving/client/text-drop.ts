import { isNull } from '../shared/core';
import { willTryGetFile, willTrySaveFile } from './reading-writing-files';

/** Abstraction for something stored in the file system. */
export class TextDrop {

    constructor(
        public dir: FileSystemDirectoryHandle,
        public filename: string,
        private lastText = '',
    ) { }
    async willOverwrite(text: string) {
        const wasSaved = await willTrySaveFile(
            this.dir, this.filename, text, true,
        );
        this.lastText = text;
        return wasSaved;
    }
    async willAppend(text: string) {
        const { lastText } = this;
        text = lastText + ' ' + text;
        this.lastText = text;
        const wasSaved = await willTrySaveFile(
            this.dir, this.filename, text, true,
        );
        return wasSaved;
    }
    async willLoad() {
        const { dir, filename } = this;
        const handle = await willTryGetFile(dir, filename, false);
        if (isNull(handle)) return null;
        const file = await handle.getFile();
        const text = await file.text();
        this.lastText = text;
        return text;
    }

}
