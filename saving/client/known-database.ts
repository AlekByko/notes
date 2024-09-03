import { knownDbStores } from "./known-settings";
import { isNonNull } from './shared/core';
import { StoreName } from './shared/identities';

export function willOpenKnownDb(): Promise<IDBDatabase> {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const { name, version } = knownDbStores;
        const request = window.indexedDB.open(name, version);
        request.onerror = function () {
            reject(this.error);
        };
        request.onsuccess = function () {
            resolve(this.result);
        };
        request.onupgradeneeded = function (_event: IDBVersionChangeEvent) {
            debugger;

        };
    });
}


function tryGetStore(transation: IDBTransaction, name: StoreName): IDBObjectStore | null {
    try {
        return transation.objectStore(name);
    } catch (e) {
        console.error(e);
        return null;
    }
}

export function seeIfHasStore(transaction: IDBTransaction, name: StoreName): boolean {
    return isNonNull(tryGetStore(transaction, name));
}
