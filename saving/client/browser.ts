export function enableAskingForUnsavedChanged(window: Window): void {
    window.addEventListener('beforeunload', e => {
        return e.returnValue = 'unsaved changed';
    });
}
