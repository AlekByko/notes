
export function willLoadImageFromUrlOr<Or>(url: string, timeout: number, or: Or) {
    return new Promise<HTMLImageElement | Or>(resolve => {
        const imageElement = document.createElement('img');

        let wasTimedout = false;

        const scheduled = setTimeout(() => {
            wasTimedout = true;
            resolve(or);
        }, timeout);

        imageElement.onload = () => {
            if (wasTimedout) return;
            window.clearTimeout(scheduled);
            resolve(imageElement);
        }

        imageElement.src = url;
    });
}
