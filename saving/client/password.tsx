import React, { FocusEventHandler, MouseEventHandler } from 'react';
import ReactDOM from 'react-dom';
import { compareRandom, to } from '../shared/core';
import type { LettersFamiliy } from './letters-family';
import { PasswordGeneratorLettersFamily } from './password-generator-letters-family';

export interface PasswordGeneratorProps {
    families: LettersFamiliy[];
    generated: string;
    onFamily: (family: LettersFamiliy) => void;
    onMake: (families: LettersFamiliy[]) => void;
}

export class PasswordGenerator extends React.PureComponent<PasswordGeneratorProps> {
    whenFamily = (family: LettersFamiliy) => {
        this.props.onFamily(family);
    }
    whenMake: MouseEventHandler<HTMLButtonElement> = _e => {
        this.props.onMake(this.props.families);
    };
    whenFocused: FocusEventHandler<HTMLTextAreaElement> = e => {
        e.currentTarget.select();
    };
    render() {
        const { families, generated } = this.props;
        const total = families.reduce((s, x) => s + x.weight, 0);
        return <div>

            {families.map(family => {
                return <PasswordGeneratorLettersFamily key={family.key} family={family} onDone={this.whenFamily} />;
            })}
            <div className="password-result">
                <input value={total} size={1} /> <textarea onFocus={this.whenFocused} value={generated} cols={35} />
            </div>
            <div className="off">
                <button onClick={this.whenMake}>Make</button>
            </div>
        </div>;
    }
}

if (window.sandbox === 'password') {
    class App extends React.Component<{}, PasswordGeneratorProps> {
        state = to<PasswordGeneratorProps>({
            generated: '',
            families: [
                { key: 'lows', weight: 5, letters: 'abcdefghijklmnopqrstuvwxyz' },
                { key: 'caps', weight: 2, letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
                { key: 'digits', weight: 3, letters: '0123456789' },
                { key: 'other', weight: 2, letters: '$@#!%^&*_' },
            ],
            onFamily: family => {
                let { families } = this.state;
                families = families.map(olderFamily => {
                    if (olderFamily.key !== family.key) return olderFamily;
                    return family;
                });
                this.setState({ families });
            },
            onMake: families => {
                const result: string[] = [];
                for (const family of families) {
                    const { weight } = family;
                    const { letters } = family;
                    for (let index = 0; index < weight; index++) {
                        const at = between(0, letters.length - 1);
                        const letter = letters[at];
                        result.push(letter);
                    }
                }
                result.sort(compareRandom);
                const generated = result.join('');
                this.setState({ generated });
            }
        });
        render() {
            return <PasswordGenerator {...this.state} />;
        }
    }
    const element = document.createElement('div');
    document.body.appendChild(element);
    ReactDOM.render(<App />, element);
}


function between(min: number, max: number): number {
    var randomnumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomnumber;
}
