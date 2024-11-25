import * as React from 'react';

export interface NumbericValueEditortProps {
    value: number;
    context: any;
    onChange: (value: number) => void;
}

interface State {
    text: string;
}

export function thusNumericValueEditor(size: number) {
    return class NumericValueEditor extends React.Component<NumbericValueEditortProps> {
        state = makeState(this.props);
        render() {
            const { onChange } = this.props;
            const { text } = this.state;
            return <input
                value={text}
                size={size}
                onChange={e => {
                    const text = e.currentTarget.value;
                    this.setState({ text });
                }}
                onBlur={e => {
                    const text = e.currentTarget.value
                    const value = eval(text);
                    if (!isFinite(value)) return;
                    onChange(value);
                }}
            />;
        }
    };
}

function makeState(props: NumbericValueEditortProps): State {
    const { value } = props;
    return { text: String(value) };
}
