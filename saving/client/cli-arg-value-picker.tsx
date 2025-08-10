import React from 'react';
import { CliArg } from './command-line-args';

export interface CliArgValuePickerProps {
    arg: CliArg;
}
export function thusCliArgValuePicker() {
    type Props = CliArgValuePickerProps;
    interface State {
        timesTriggered: number;
    }
    function makeState(_props: Props): State {
        return { timesTriggered: 0 };
    }
    return class CliArgValuePicker extends React.Component<Props> {
        static Props: Props;
        static getDerivedStateFromProps(_props: Props, _state: State): State | null {
            return null;
        }
        state = makeState(this.props);
        render() {
            const { defaultValues } = this.props.arg;
            return <select>{
                defaultValues.map(x => {
                    return <option key={x}>{x}</option>;
                })
            }</select>;
        }
    };
}
