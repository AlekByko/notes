export function startListening<K extends keyof HTMLElementEventMap>(
    element: HTMLElement,
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
): Act {
    element.addEventListener(type, listener, options);
    function stopListening() {
        element.removeEventListener(type, listener);
    }
    return stopListening;
}
