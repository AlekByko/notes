import { As } from './shared/core';

export type KnownPickedDirRef = string & As<'known-picked-dir-ref'>;

export interface FileSystemEntry {
    name: KnownPickedDirRef;
    handle: FileSystemDirectoryHandle;
}

export const knownBaseDirEntryName = 'base-dir' as KnownPickedDirRef;
export const knownSnapsDirEntryName = 'recorded-dir' as KnownPickedDirRef;
