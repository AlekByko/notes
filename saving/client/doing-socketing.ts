export function willOpenSocket(port: number): Promise<WebSocket> {
    const socket = new WebSocket('ws://localhost:' + port);
    return new Promise<WebSocket>((resolve, reject) => {
        socket.onopen = () => {
            resolve(socket);
        };
        socket.onclose = e => {
            reject(e);
        }
        socket.onerror = e => {
            reject(e);
        }
    });
}
