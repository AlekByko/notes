export function keepScheduling(act: () => void, delay: number): void {
    function schedule() {
        act();
        setTimeout(schedule, delay);
    }
    setTimeout(schedule, delay);
}
