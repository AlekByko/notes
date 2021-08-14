export function enableAskingForUnsavedChanged(window: Window): void {
    window.addEventListener('beforeunload', e => {
        e.returnValue = 'unsaved changed';
    });
}
