import React, { MouseEventHandler } from 'react';
import { broke, cast, isNull, isUndefined } from '../shared/core';
import { willStart } from './auto-correlating-sound';
import { toRandKey } from './reacting';
import { synthProfiles } from './sound-profiles';
import { playNote } from './sound-synth';

interface PianoKey {
    type: 'black' | 'white';
    key: string;
    name: string;
    freq: number;
}


const keys: PianoKey[] = [
    { key: toRandKey(), type: 'white', name: 'C', freq: 261.63 },
    { key: toRandKey(), type: 'black', name: 'C#', freq: 277.18 },
    { key: toRandKey(), type: 'white', name: 'D', freq: 293.66 },
    { key: toRandKey(), type: 'black', name: 'D#', freq: 311.13 },
    { key: toRandKey(), type: 'white', name: 'E', freq: 329.63 },
    { key: toRandKey(), type: 'white', name: 'F', freq: 349.23 },
    { key: toRandKey(), type: 'black', name: 'F#', freq: 369.99 },
    { key: toRandKey(), type: 'white', name: 'G', freq: 392.00 },
    { key: toRandKey(), type: 'black', name: 'G#', freq: 415.30 },
    { key: toRandKey(), type: 'white', name: 'A', freq: 440.00 },
    { key: toRandKey(), type: 'black', name: 'A#', freq: 466.16 },
    { key: toRandKey(), type: 'white', name: 'B', freq: 493.88 }
];

export interface MusicAppProps {
    ctx: AudioContext;
}

export class MusicApp extends React.Component<MusicAppProps> {
    myElement: HTMLDivElement | null = null;
    whenKeyDown: MouseEventHandler<HTMLDivElement> = e => {
        cast<HTMLElement>(e.target);
        const { target } = e;
        const key = target.getAttribute('data-piano-key-key');
        if (isNull(key)) return;
        const found = keys.safeFind(x => x.key === key);
        if (isUndefined(found)) return;
        const { freq } = found;
        const { ctx } = this.props;
        playNote(ctx, freq, synthProfiles.freightTrain);
    }
    componentDidMount(): void {
        const { myElement } = this;
        if (isNull(myElement)) return;
        willStart(myElement);
    }
    render() {
        return <div>
            <div>Music App</div>
            <div ref={el => this.myElement = el}></div>
            <div className="piano-keyboard" onMouseDown={this.whenKeyDown} tabIndex={-1}>
                {keys.map(key => {
                    switch (key.type) {
                        case 'black': {
                            return <div className="piano-black-key" data-piano-key-key={key.key}></div>;
                        }
                        case 'white': {
                            return <div className="piano-white-key" data-piano-key-key={key.key}></div>;
                        }
                        default: return broke(key.type);
                    }
                })}
            </div>
        </div>;
    }
}


