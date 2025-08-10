import React, { ChangeEventHandler } from 'react';
import { isNull } from '../shared/core';

export interface CliArgValuePickerProps<Arg, Value> {
    arg: Arg;
    whenChanging: (arg: Value) => void;
}

export function thusCliArgValuePicker<Arg, Value>(defaults: {
    keyOf: (value: Value) => string;
    render: (value: Value) => JSX.Element | string | null;
    defaultValuesOf: (arg: Arg) => Value[];
}) {
    type Props = CliArgValuePickerProps<Arg, Value>;

    return class CliArgValuePicker extends React.Component<Props> {
        static Props: Props;
        whenChanging: ChangeEventHandler<HTMLSelectElement> = e => {
            const { arg, whenChanging } = this.props;
            const { selectedIndex } = e.currentTarget;
            if (selectedIndex < 0) return;
            const defaultValues = defaults.defaultValuesOf(arg);
            const picked = defaultValues[selectedIndex];
            whenChanging(picked);
        };
        render() {
            const { arg } = this.props;
            const defaultValues = defaults.defaultValuesOf(arg);
            return <select onChange={this.whenChanging}>{
                defaultValues.map(value => {
                    const key = defaults.keyOf(value);
                    const rendered = defaults.render(value);
                    if (isNull(rendered)) return null;
                    return <option key={key}>{rendered}</option>;
                })
            }</select>;
        }
    };
}
