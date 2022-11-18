import React from 'react';
import { Regarding } from './reacting';
import { to } from './shared/core';
import { AdjectiveConfig, AdverbConfig, NounConfig, VerbConfig, WordConfig } from './word-config';

export type WordEditorConcern =
    | { about: 'be-cancelled'; }
    | { about: 'be-configured', config: WordConfig; }

export interface WordEditorProps {
    config: WordConfig;
    regarding: Regarding<WordEditorConcern>;
}

interface State {
    config: WordConfig;
}

export class WordEditor extends React.PureComponent<WordEditorProps> {

    state = to<State>({ config: this.props.config });

    private whenCancelled: React.MouseEventHandler<HTMLButtonElement> | undefined = _e => {
        this.props.regarding({ about: 'be-cancelled' });
    }

    render() {
        const { config } = this.state;
        let { text } = config;
        text = text.toLowerCase();
        return <div>
            <div>{text}</div>
            <div>
                <label><input type="radio" radioGroup="xxx" value="noun" onClick={() => {
                    const config: NounConfig = { kind: 'noun', text };
                    this.props.regarding({ about: 'be-configured', config });
                }} /> Noun</label> <label><input type="radio" radioGroup="xxx" value="verb" onClick={() => {
                    const config: VerbConfig = { kind: 'verb', text };
                    this.props.regarding({ about: 'be-configured', config });
                }} /> Verb</label> <label><input type="radio" radioGroup="xxx" value="adjective" onClick={() => {
                    const config: AdjectiveConfig = { kind: 'adjective', text };
                    this.props.regarding({ about: 'be-configured', config });
                }} /> Ajective</label> <label><input type="radio" radioGroup="xxx" value="adverb" onClick={() => {
                    const config: AdverbConfig = { kind: 'adverb', text };
                    this.props.regarding({ about: 'be-configured', config });
                }} /> Adverb</label>
            </div>
            <div>
                <button onClick={this.whenCancelled}>Reset</button>
            </div>
        </div>;
    }
}

