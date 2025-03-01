import { Either } from '../shared/core';
import { $of, $on, By } from '../shared/inside';

export interface Statefull<State> {
    state: State;
    setState(across: (state: State) => State | null, then: Act): void;
}

export function inTermsOf<State, Event>() {
    return {
        beSettingValue: function setWithTerms<Crude, Fine>(
            byState: By<State, Fine>,
            byEvent: By<Event, Crude>,
        ) {
            return {
                thisWayOrIfBadIgnore: function thisWayOrIfBadIgnore(
                    parse: (value: Crude, state: State) => Either<unknown, Fine>,
                ) {
                    return {
                        andSaveToConfig<Config>(
                            byConfig: By<State, Config>,
                            storeIt: (config: Config, fine: Fine) => void,
                            saveIt: Act,
                        ) {
                            return {
                                done(stateful: Statefull<State>) {
                                    return function settingValue(e: Event): void {
                                        const crude = byEvent[$of](e); // <-- has to be here because event doesn't live long
                                        return stateful.setState(state => {
                                            const olderState = state;
                                            const either = parse(crude, olderState);
                                            if (either.isLeft) {
                                                const notFine = either.left;
                                                debugger;
                                                window.document.title = '!!! SITUATION !!!';
                                                console.warn('!!! Situation !!!');
                                                console.warn(crude);
                                                console.warn(notFine);
                                                console.warn(state);
                                                return null;
                                            } else {
                                                const fine = either.right;
                                                const newerState = byState[$on](olderState, fine);
                                                return newerState;
                                            }
                                        }, () => {
                                            const { state } = stateful;
                                            const fine = byState[$of](state);
                                            const config = byConfig[$of](state);
                                            storeIt(config, fine);
                                            saveIt();
                                        });
                                    };
                                }
                            }
                        }
                    }
                }
            };
        },
    };
}
