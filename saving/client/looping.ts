import { wait } from './promises';
import { isNonNull, isUndefined } from './shared/core';
import { Timestamp, toTimestamp } from './shared/time-stamping';

export type JobStep<State> = (state: State) => Promise<State>;
export type Job<State> = (state: State) => JobStep<State>[];
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
        let job = jobs.shift();
        if (isUndefined(job)) {
            shouldWait = true;
            refill(jobs);
            job = jobs.shift();
            if (isUndefined(job)) return lastState; // <-- no jobs
        }
        const steps = job(lastState);
        for (const step of steps) {
            const newerState = await step(lastState);
            if (newerState === lastState) continue;
            await willDigest(newerState);
            lastState = newerState;
            shouldWait = false;
        }
    }
}

export function stepsIfOver<State>(
    seeIfShouldRun: (state: State) => boolean,
    job: Job<State>,
) {
    return function stepsIf(state: State): JobStep<State>[] {
        const shouldRun = seeIfShouldRun(state);
        return shouldRun
            ? job(state)
            : [];
    };
}

export function stepsEveryOver<State>(
    delay: number,
    job: Job<State>,
) {
    let lastRunAt: Timestamp | null = null;
    return function stepsEvery(state: State): JobStep<State>[] {
        if (isNonNull(lastRunAt)) {
            let now = toTimestamp();
            const ago = now - lastRunAt;
            if (ago < delay) return [];
        }
        const steps = job(state);
        lastRunAt = toTimestamp();
        return steps;
    };
}

export function willRunEmitApplyOver<State, Stuff>(
    willEmit: () => Promise<Stuff>,
    willApply: (state: State, stuff: Stuff) => Promise<State>,
) {
    return function willRunEmitApply(_state: State): JobStep<State>[] {
        async function step(state: State): Promise<State> {
            const stuff = await willEmit();
            state = await willApply(state, stuff);
            return state;
        }
        return [step];
    };
}
export function jobFor<State>(
    willDo: Job<State> = _state => [],
) {
    return new JobBuilder<State>(willDo);
}
export class JobBuilder<State> {
    constructor(
        public job: Job<State>,
    ) {
    }
    emit<Stuff>(
        willEmit: () => Promise<Stuff>,
        willApply: (state: State, stuff: Stuff) => Promise<State>
    ) {
        this.job = willRunEmitApplyOver(willEmit, willApply);
        return this;
    }
    step(step: JobStep<State>) {
        this.job = () => [step];
        return this;
    }
    runIf(seeIfShouldRun: (state: State) => boolean) {
        this.job = stepsIfOver(seeIfShouldRun, this.job);
        return this;
    }
    runEvery(delay: number) {
        this.job = stepsEveryOver(delay, this.job);
        return this;
    }
}
