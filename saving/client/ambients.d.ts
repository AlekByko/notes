declare const FaceDetector: {
    new(options: {
        maxDetectedFaces?: number;
        fastMode?: boolean;
    }): FaceDetector;
};
interface DetectedFace {
    boundingBox: DOMRectReadOnly;
    landmarks: unknown[];
}
interface FaceDetector {
    detect(sourface: any): Promise<DetectedFace[]>;
}
interface Window {
    showDirectoryPicker(): Promise<FileSystemDirectoryHandle>;
}

type FileSystemHandle = FileSystemDirectoryHandle | FileSystemFileHandle;
interface QueryPemissionsOptions {
    mode: 'readwrite';
}
type RequestPermissionsOptions = QueryPemissionsOptions;
type QueryPermissionsResult = 'granted';
type RequestPermissionsResult = QueryPermissionsResult;
interface FileSystemHandleBase {
    isSameEntry(): any;
    queryPermissions(options: QueryPemissionsOptions): Promise<QueryPermissionsResult>;
    requestPermissions(options: RequestPermissionsOptions): Promise<RequestPermissionsResult>;
}
interface GetFileHandleOptions { create: boolean; }
interface RemoveEntryOptions { recursive: boolean; }
interface FileSystemDirectoryHandle extends FileSystemHandleBase {
    kind: 'directory';
    name: string;
    getDirectoryHandle(options: GetFileHandleOptions): Promise<FileSystemDirectoryHandle>;
    getFileHandle(name: string, options?: GetFileHandleOptions): Promise<any>;
    keys(): any;
    values(): AsyncIterableIterator<FileSystemHandle>;
    removeEntry(name: string, options?: RemoveEntryOptions): any;
    resolve(): any;
}
interface FileSystemFileHandle extends FileSystemHandleBase {
    kind: 'file';
    name: string;
    getFile(): any;
    createWritable(): any;
}
interface FileSystemGetFileOptions {
    create?: boolean;
}
type USVString = string;

