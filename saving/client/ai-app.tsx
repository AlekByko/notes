import React, { ChangeEventHandler, MouseEventHandler } from 'react';
import { makeSeed } from './ed-backend';
import { executeTemplate } from './executing-prompt-template';
import { InferenceParams } from './inference-params';


export interface AiAppProps {
    text: string;
    onScheduling: (params: InferenceParams) => void;
}
export function thusAiApp() {

    interface State {
        template: string;
        seed: number;
        prompt: string;
    }

    return class AiApp extends React.Component<AiAppProps, State> {

        static Props: AiAppProps;

        whenChangingText: ChangeEventHandler<HTMLTextAreaElement> = _e => {
            const template = _e.currentTarget.value;
            this.setState(state => {
                return { ...state, template } satisfies State;
            });
        };

        whenScheduling: MouseEventHandler<HTMLButtonElement> = _e => {
            const { template, seed, prompt } = this.state;
            if (seed < 1) return;
            const { onScheduling } = this.props;
            onScheduling({ prompt, width: 640, height: 640, template, seed });
        };
        whenSpinning: MouseEventHandler<HTMLButtonElement> = _e => {
            this.setState(state => {
                const { template } = state;
                const seed = makeSeed();
                const prompt = executeTemplate(template, seed);
                return { ...state, seed, prompt } satisfies State;
            });
        };

        makeState(): State {
            const { text: template } = this.props;
            return { template, seed: 0, prompt: '' };
        }

        state = this.makeState();

        render() {
            const { template, seed, prompt } = this.state;
            const canSchedule = seed > 0;
            return <div className="ai-inputs">
                <div>
                    <textarea rows={20} cols={100} onChange={this.whenChangingText} value={template}></textarea>
                </div>
                <div>
                    Seed: <input value={seed} disabled />
                </div>
                <div>
                    <textarea rows={10} cols={100} value={prompt} disabled></textarea>
                </div>
                <div className="ai-buttons">
                    <button onClick={this.whenScheduling} disabled={!canSchedule}>Schedule</button>
                    <button onClick={this.whenSpinning}>Spin</button>
                </div>
            </div>;
        }
    };
}
