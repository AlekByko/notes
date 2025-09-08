
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

export function whenClosedOrErroredSocketOver(
    takeSocket: (socket: WebSocket) => void,
    socketPort: number,
    whenSocketMessage: (e: MessageEvent<any>) => void,
) {
    return async function whenClosedOrErroredSocket(e: Event) {
        console.log(e);
        alert('SOCKET CLOSED!');
        function scheduleTryReopen(delay: number): void {
            setTimeout(async () => {
                willTryReopen();
            }, delay);
        }
        const retryInThatManySeconds = 10;
        const retryDelay = retryInThatManySeconds * 1000;
        let attemptCounter = 0;
        async function willTryReopen() {
            try {
                const socket = await willOpenSocket(socketPort);
                socket.onmessage = whenSocketMessage;
                socket.onclose = whenClosedOrErroredSocket;
                socket.onerror = whenClosedOrErroredSocket;
                takeSocket(socket);
                alert('SOCKET REOPENED');
                window.document.title = `SOCKET REOPENED after #${attemptCounter} attempts`;
            } catch (e) {
                debugger;
                console.log(e);
                if (attemptCounter < 1) {
                    alert(`UNABLE TO REOPEN THE SOCKET!!!! CHECK THE CONSOLE!!!`);
                }
                attemptCounter += 1;
                window.document.title = `#${attemptCounter}: UNABLE TO REOPEN THE SOCKET!!!! CHECK THE CONSOLE!!!`;
                scheduleTryReopen(retryDelay);
            }
        }
        scheduleTryReopen(retryDelay);
    };
}

