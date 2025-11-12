export interface NotesWorkspace {
    notes: NoteConfig[];
}

export type NoteKey = string & As<'note-key'>;

export interface NoteConfig {
    key: NoteKey;
    path: string;
}
