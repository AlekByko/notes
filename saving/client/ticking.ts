import { Regarding } from "./reacting";

export function toTicker<Props, ProgressConcern, FinalConcern>(
    peek: () => Props,
    seeIfShouldRun: (props: Props) => boolean,
    regardingOf: (props: Props) => Regarding<FinalConcern | ProgressConcern>,
    willBeConcern: (props: Props) => AsyncGenerator<ProgressConcern, FinalConcern>
) {
    let isRunning = false;
    function tryStart() {
        if (isRunning) return;
        isRunning = true;
        run();
    }
    async function run() {
        const beforeProps = peek();
        if (!seeIfShouldRun(beforeProps)) {
            isRunning = false;
            return;
        }
        const go = willBeConcern(beforeProps);
        while (true) {
            const next = await go.next();
            const afterProps = peek();
            if (!seeIfShouldRun(afterProps)) {
                isRunning = false;
                return;
            }
            if (!isRunning) return;
            const regarding = regardingOf(afterProps);
            if (next.done) {
                const concern = next.value;
                regarding(concern);
                isRunning = false;
                return;
            } else {
                const concern = next.value;
                regarding(concern);
            }
        }
    }
    function stop() {
        isRunning = false;
    }
    return { tryStart, stop };
}
