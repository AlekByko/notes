// @ts-nocheck
var chrome;
export function getStorage(): LocalStorage {
    return chrome === undefined
        ? window.localStorage
        : new ChromeStorage(chrome.storage.local);
}

class ChromeStorage {
    constructor(
        private storage
    ) {}
}
