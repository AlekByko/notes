import React, { FormEventHandler } from 'react';
import { broke, fail, isNull } from '../shared/core';
import { Drop } from './drop';
import { Resizable } from './resizable';

const plainTextOnly = 'plaintext-only' as never;

export interface NoteProps {
    key: string;
    drop: Drop;
}

type State = (
    | { kind: 'not-there'; filename: string; }
    | { kind: 'have-no-idea' }
    | { kind: 'there'; text: string; }
) & { x: number; y: number; };



const where = { x: 20, y: 100 };


function makeState(_props: NoteProps): State {
    return { kind: 'have-no-idea', ...where };
}

export function thusNote() {
    return class Note extends React.Component<NoteProps, State> {

        state = makeState(this.props);

        whenChangedContent: FormEventHandler<HTMLDivElement> = async e => {
            const { currentTarget: { innerText } } = e;
            // console.log(innerText);
            const { drop } = this.props;
            await drop.willOverwrite(innerText);
        };

        takeElement = (element: HTMLDivElement | null) => {
            if (isNull(element)) return;
            const { x, y } = this.state;

            element.style.left = x + 'px';
            element.style.top = y + 'px';
        };

        async componentDidMount() {

            const { drop } = this.props;
            const text = await drop.willLoad();
            if (isNull(text)) {
                this.setState({ kind: 'not-there', filename: drop.filename, ...where });
            } else {
                this.setState({ kind: 'there', text, ...where });
            }
        }

        componentDidUpdate(_olderProps: Readonly<NoteProps>, _olderState: Readonly<State>): void {
            const { state } = this;
            switch (state.kind) {
                case 'have-no-idea': return fail('Still no idea? What?');
                case 'not-there': return;
                case 'there': return;
                default: return broke(state);
            }
        }

        render() {
            const { key, drop } = this.props;
            const { state } = this;
            return <Resizable key={key} refin={this.takeElement} className="note">
                <div className="note-header">{drop.dir.name}/{drop.filename}</div>
                {(() => {
                    switch (state.kind) {
                        case 'have-no-idea': return <div>Loading...</div>;
                        case 'not-there': return <div>Not there</div>;
                        case 'there': return <div
                            className="note-content"
                            contentEditable={plainTextOnly}
                            onInput={this.whenChangedContent}>{state.text}</div>
                        default: return broke(state);
                    }
                })()}
            </Resizable>;
        }
    };
}
