export function willFetch<T>(
    url: string,
    parse: (text: string, headers: string) => T,
): Promise<T> {
    const xhr = new XMLHttpRequest();
    return new Promise<T>((resolve, reject) => {
        xhr.onload = () => {
            const headers = xhr.getAllResponseHeaders();
            const parsed = parse(xhr.responseText, headers);
            return resolve(parsed);
        };
        xhr.onerror = e => {
            debugger;
            reject(e);
        };
        xhr.open('GET', url);
        xhr.send(null);
    });
}
