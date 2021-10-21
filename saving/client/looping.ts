import { wait } from './promises';
import { isNonNull, isUndefined } from './shared/core';
import { Timestamp, toTimestamp } from './shared/time-stamping';
export type Job<State> = (state: State) => Promise<State>

export interface JobController { shouldFinish: boolean; }
export async function willBeWorking<State>(
    state: State,
    willDigest: (state: State) => Promise<void>,
    jobs: Job<State>[],
    controller: JobController,
    refill: (jobs: Job<State>[]) => void,
): Promise<State> {
    let lastState = state;
    let shouldWait = false;
    while (true) {
        if (shouldWait) await wait(100);
        if (controller.shouldFinish) return lastState;
        let willDo = jobs.shift();
        if (isUndefined(willDo)) {
            shouldWait = true;
            refill(jobs);
            willDo = jobs.shift();
            if (isUndefined(willDo)) return lastState; // <-- no jobs
        }
        const newerState = await willDo(lastState);
        if (newerState === lastState) continue;
        await willDigest(newerState);
        lastState = newerState;
        shouldWait = false;
    }
}

export function willRunIfOver<State>(
    seeIfShouldRun: (state: State) => boolean,
    willRun: (state: State) => Promise<State>,
) {
    return async function willRunIf(state: State) {
        const shouldRun = seeIfShouldRun(state);
        return shouldRun
            ? willRun(state)
            : state;
    };
}

export function willRunEveryOver<State>(
    delay: number,
    willRun: (state: State) => Promise<State>,
) {
    let lastRunAt: Timestamp | null = null;
    return async function willRunEvery(state: State) {
        if (isNonNull(lastRunAt)) {
            let now = toTimestamp();
            const ago = now - lastRunAt;
            if (ago < delay) return state;
        }
        state = await willRun(state);
        lastRunAt = toTimestamp();
        return state;
    };
}

export function willRunEmitApplyOver<State, Stuff>(
    willEmit: () => Promise<Stuff>,
    willApply: (state: State, stuff: Stuff) => Promise<State>,
) {
    return async function willRunEmitApply(state: State) {
        const stuff = await willEmit();
        state = await willApply(state, stuff);
        return state;
    };
}
export function jobFor<State>(
    willDo: (state: State) => Promise<State> = async state => state,
) {
    return new JobBuilder<State>(willDo);
}
export class JobBuilder<State> {
    constructor(
        public willDo: (state: State) => Promise<State>,
    ) {
    }
    emit<Stuff>(
        willEmit: () => Promise<Stuff>,
        willApply: (state: State, stuff: Stuff) => Promise<State>
    ) {
        this.willDo = willRunEmitApplyOver(willEmit, willApply);
        return this;
    }
    runIf(seeIfShouldRun: (state: State) => boolean) {
        this.willDo = willRunIfOver(seeIfShouldRun, this.willDo);
        return this;
    }
    runEvery(delay: number) {
        this.willDo = willRunEveryOver(delay, this.willDo);
        return this;
    }
}
