export function keepScheduling(act: () => void, delay: number): void {
    function schedule() {
        act();
        setTimeout(schedule, delay);
    }
    setTimeout(schedule, delay);
}

export function debounceOver(delay: number) {
    let timer = 0;
    return function (act: Act) {
        window.clearTimeout(timer);
        timer = window.setTimeout(act, delay);
    };
}
