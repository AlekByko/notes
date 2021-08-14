export function willHttpGet(url: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = function () {
            resolve(xhr.responseText);
        }
        xhr.onerror = function () {
            reject(xhr);
        }
        xhr.send(null);
    });
}
