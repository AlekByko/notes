export function makeBroadcastChannel() {
    const channel = new BroadcastChannel('saving');
    return channel;
}
