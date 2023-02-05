import React from 'react';
import { Regarding } from './reacting';

interface State {
    text: string;
}
export interface TexterProps<Concern> {
    regarding: Regarding<Concern>;
}

export function thusTexter<Concern>(placeholder: string, toConcern: (text: string) => Concern) {
    return class Texter extends React.Component<TexterProps<Concern>, State> {
        private whenChangedText: React.ChangeEventHandler<HTMLInputElement> = e => {
            const text = e.currentTarget.value;
            this.setState({ text });
        }
        private whenKeyDown: React.KeyboardEventHandler<HTMLInputElement> = e => {
            if (e.key === 'Enter') {
                this.props.regarding(toConcern(this.state.text));
            }
        }
        render() {
            return <input placeholder={placeholder} onKeyDown={this.whenKeyDown} onChange={this.whenChangedText} />;
        }
    };
}
