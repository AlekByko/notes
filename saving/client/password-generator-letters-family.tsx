import React, { ChangeEventHandler, FocusEventHandler, KeyboardEventHandler } from 'react';
import type { LettersFamiliy } from './letters-family';
import { to } from './shared/core';

export interface PasswordGeneratorFamilyProps {
    family: LettersFamiliy,
    onDone: (family: LettersFamiliy) => void;
}

interface State {
    key: string;
    weight: string;
    letters: string;
}

export class PasswordGeneratorLettersFamily extends React.Component<PasswordGeneratorFamilyProps, State>{

    state = to<State>({
        key: this.props.family.key,
        letters: this.props.family.letters,
        weight: this.props.family.weight.toString(),
    });

    finish() {

        const weight = parseInt(this.state.weight, 10);
        if (!isFinite(weight)) {
            this.setState({ weight: this.props.family.weight.toString() });
        }
        const { letters } = this.state;
        const family: LettersFamiliy = {
            key: this.props.family.key, weight, letters,
        };
        this.props.onDone(family);
    }

    whenChangedWeight: ChangeEventHandler<HTMLInputElement> = e => {
        this.setState({ weight: e.currentTarget.value });
    };
    whenKeydownWeight: KeyboardEventHandler<HTMLInputElement> = e => {
        switch (e.key) {
            case 'Escape': {
                this.setState({ weight: this.props.family.weight.toString() });
                break;
            }
            case 'Enter': {
                this.finish();
                break;
            }
        }
    }
    whenBlurredEither: FocusEventHandler<HTMLInputElement> = _e => {
        this.finish();
    }
    whenChangedLetters: ChangeEventHandler<HTMLInputElement> = e => {
        this.setState({ letters: e.currentTarget.value });
    }
    whenKeydownLetters: KeyboardEventHandler<HTMLInputElement> = e => {
        switch (e.key) {
            case 'Escape': {
                this.setState({ letters: this.props.family.letters });
                break;
            }
            case 'Enter': {
                this.finish();
                break;
            }
        }
    }

    render() {
        const { weight, letters } = this.state;
        return <div className="password-letter-family">
            <input
                size={1} value={weight}
                onChange={this.whenChangedWeight}
                onKeyDown={this.whenKeydownWeight}
                onBlur={this.whenBlurredEither}
            /> <input
                size={35} value={letters}
                onChange={this.whenChangedLetters}
                onKeyDown={this.whenKeydownLetters}
                onBlur={this.whenBlurredEither}
            />
        </div>;
    }
}
