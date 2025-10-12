import React from 'react';
import { Drop } from './drop';
import { thusNote } from './note';
import { NotesGlob } from './notes-glob';

export interface NotesAppProps {
    drop: Drop;
    glob: NotesGlob;
}

export function thusNotesApp() {
    const Note = thusNote();
    return class NotesApp extends React.Component<NotesAppProps> {
        render() {
            const { drop, glob: { notesDir } } = this.props;
            return <div>
                <div>{notesDir.name}/{drop.filename}</div>
                <div><Note drop={drop} /></div>
            </div>;
        }
    };
}
