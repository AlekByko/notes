import { Either } from '../shared/core';
import { $of, $on, By } from '../shared/inside';

export interface Statefull<State> {
    state: State;
    setState(across: (state: State) => State | null): void;
}

export function setValueOver<State, T>(by: By<State, T>) {
    return function setValueUnder(this: Statefull<State>, value: T): void {
        return this.setState(state => {
            return by[$on](state, value);
        });
    };
}
export function inTermsOf<State, Event>() {
    return {
        beSettingValue: function setWithTerms<Crude, NotFine, Fine>(
            byState: By<State, Fine>,
            byEvent: By<Event, Crude>,
            parse: (value: Crude, state: State) => Either<NotFine, Fine>,
            deal: (notFine: NotFine, state: State, crude: Crude) => State,
        ) {
            return function settingValue(this: Statefull<State>, e: Event): void {
                return this.setState(state => {
                    const olderState = state;
                    const crude = byEvent[$of](e);
                    const either = parse(crude, olderState);
                    if (either.isLeft) {
                        const notFine = either.left;
                        debugger;
                        console.warn('!!! Situation !!!');
                        console.warn(crude);
                        console.warn(notFine);
                        const dealtState = deal(notFine, olderState, crude);
                        console.warn(dealtState);
                        return dealtState;
                    } else {
                        const fine = either.right;
                        const newerState = byState[$on](olderState, fine);
                        return newerState;
                    }
                });
            };
        },
    };
}
