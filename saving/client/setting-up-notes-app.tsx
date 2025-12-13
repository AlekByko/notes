import React, { MouseEventHandler } from 'react';
import ReactDOM from 'react-dom';
import { broke, isNull } from '../shared/core';
import { KnownPickedDirRef } from './known-db-stores';
import { willSaveDirRef, willTryLoadDirRef } from './reading-writing-files';


export async function willClaimDir(
    db: IDBDatabase, element: HTMLElement, ref: KnownPickedDirRef,
) {
    return new Promise<FileSystemDirectoryHandle>(async resolve => {

        class App extends React.Component {
            async willTryLoad() {
                const dir = await willTryLoadDirRef(db, ref);
                if (isNull(dir)) return;
                const permissions = await dir.requestPermission({ mode: "readwrite" });
                switch (permissions) {
                    case 'granted': return resolve(dir);
                    case 'prompt': break;
                    default: return broke(permissions);
                }
            }
            whenPickingNotesDir: MouseEventHandler<HTMLButtonElement> = async _e => {
                const dir = await willPickDirOr(null);
                if (isNull(dir)) return;
                await willSaveDirRef(ref, dir, db);
                resolve(dir);
            };
            componentDidMount(): void {
                this.willTryLoad();
            }
            whenStarting: MouseEventHandler<HTMLButtonElement> = async _e => {
                this.willTryLoad()
            };
            render() {
                return <div>
                    <button onClick={this.whenStarting}>Start</button>
                    <button onClick={this.whenPickingNotesDir}>Pick Dir</button>
                </div>
            }
        }
        ReactDOM.render(<App />, element);
    });

}


async function willPickDirOr<Or>(or: Or) {
    try {
        return await window.showDirectoryPicker();
    } catch {
        return or;
    }
}

