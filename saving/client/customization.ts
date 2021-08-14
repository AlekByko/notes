export interface FileSystemCustomization {
    kind: 'file-system';
    handle: FileSystemDirectoryHandle;
}

export type Customization = FileSystemCustomization;
