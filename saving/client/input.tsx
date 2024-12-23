import React, { ChangeEventHandler, FocusEventHandler, InputHTMLAttributes, KeyboardEventHandler } from 'react';
import { to } from '../shared/core';

export interface InputProps {
    text: string;
    timesReset: number;
    defaults: InputHTMLAttributes<unknown>;
    onText(text: string): void;
}
interface State {
    isEdited: boolean;
    text: string
    timesSet: number;
}

export class Input extends React.PureComponent<InputProps, State> {
    state = to<State>({ text: this.props.text, timesSet: this.props.timesReset, isEdited: false });

    static getDerivedStateFromProps(props: InputProps, state: State): State | null {
        if (state.isEdited) return null;
        if (props.timesReset === state.timesSet) return null;
        return { text: props.text, timesSet: props.timesReset, isEdited: false };
    }

    whenFocused: FocusEventHandler<HTMLInputElement> = _e => {
        this.setState({ isEdited: true });
    }

    whenBlurred: FocusEventHandler<HTMLInputElement> = _e => {
        this.setState({ isEdited: false });
    }

    whenChanged: ChangeEventHandler<HTMLInputElement> = e => {
        this.setState({ text: e.currentTarget.value });
    }

    whenKeyDown: KeyboardEventHandler<HTMLInputElement> = e => {
        switch (e.key) {
            case 'Escape': {
                this.setState({ text: this.props.text });
                e.currentTarget.blur();
                break;
            }
            case 'Enter': {
                this.props.onText(this.state.text);
                e.currentTarget.blur();
                break;
            }
        }
    }
    render() {
        const { defaults } = this.props;
        const { text } = this.state;
        return <input {...defaults} value={text} onKeyDown={this.whenKeyDown} onChange={this.whenChanged} onBlur={this.whenBlurred} onFocus={this.whenFocused} />;
    }
}
