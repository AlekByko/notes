import React from 'react';
import { NoteProps, thusNote } from './note';
import { NotesGlob } from './notes-glob';

export interface NotesAppProps {
    notes: NoteProps[];
    glob: NotesGlob;
}

export function thusNotesApp() {
    const Note = thusNote();
    return class NotesApp extends React.Component<NotesAppProps> {
        render() {
            const { notes } = this.props;
            return <div>
                {notes.map(note => {
                    return <div key={note.key}><Note {...note} /></div>;
                })}
            </div>;
        }
    };
}
