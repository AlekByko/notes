import { As } from "./core";

export type FileSystemEntryName = string & As<'file-system-entry-name'>;
export interface FileSystemEntry {
    name: FileSystemEntryName;
    handle: FileSystemHandle;
}
export const knownTaggedImagesDirectoryEntryName = 'tagged-images' as FileSystemEntryName;
