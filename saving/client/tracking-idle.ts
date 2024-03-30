import { toTimestamp } from './shared/time-stamping';

export function startTrackingIdle(
    timeout: number,
    whenIdle: (left: number, readiness: number) => void
) {
    let idlingSince = toTimestamp();
    window.document.addEventListener('mousemove', () => {
        idlingSince = toTimestamp();
    });
    window.document.addEventListener('keydown', () => {
        idlingSince = toTimestamp();
    });
    window.setInterval(() => {
        const now = toTimestamp();
        const since = now - idlingSince;
        const ago = Math.min(since, timeout);
        const ready = ago / timeout;
        const left = timeout - ago;
        whenIdle(ready, left);
    }, 250);
}
