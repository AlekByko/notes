import React from 'react';

export interface TrackedNumberProps<Holder> {
    holder: Holder;
}

interface State {
    lastValue: number ;
    delta: number ;
}

export function thusTrackedNumber<Holder>(
    defaults: {
        numberOf: (holder: Holder) => number,
        formatNumber: (value: number) => string,
    },
) {

    type Props = TrackedNumberProps<Holder>;

    function makeDefaultState(props: Props): State {
        const { holder } = props;
        const value = defaults.numberOf(holder);
        return { lastValue: value, delta: 0 };
    }

    return class TrackedNumber extends React.Component<Props, State> {
        state = makeDefaultState(this.props);
        static getDerivedStateFromProps(props: Props, state: State): State | null {
            const { holder } = props;
            const value = defaults.numberOf(holder);
            const delta = state.lastValue - value;
            return { ...state, lastValue: value, delta } satisfies State;
        }
        render() {
            const { delta, lastValue } = this.state;
            const trendClassModifier = seeWhatTrendClassIs(delta);
            const classes = 'tracked-number ' + trendClassModifier;
            const renderedDelta = delta !== 0 && <span className="tracked-number-delta">{delta}</span>;
            return <span className={classes}>{lastValue} {renderedDelta}</span>;
        }
    };
}

function seeWhatTrendClassIs(delta: number): string {
    if (delta < 0) return 'as-negative';
    if (delta > 0) return 'as-positive';
    return 'as-no-change';
}
