import React from 'react';
import { Regarding } from './reacting';
import { to } from './shared/core';
import { NounConfig, WordConfig } from './word-config';

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

    private whenOk: React.MouseEventHandler<HTMLButtonElement> | undefined = _e => {
        const { config } = this.state;
        if (config.kind === 'unknown') return;
        this.props.regarding({ about: 'be-configured', config });
    }

    render() {
        const { config } = this.state;
        const { text } = config;
        return <div>
            <div>{text}</div>
            <div>
                <label><input type="radio" radioGroup="xxx" value="noun" onClick={() => {
                    const config: NounConfig = { kind: 'noun', text };
                    this.setState({ config });
                }} /> Noun</label>
            </div>
            <div>
                <button onClick={this.whenCancelled}>Reset</button>
                {config.kind !== 'unknown' && <button onClick={this.whenOk}>OK</button>}
            </div>
        </div>;
    }
}

