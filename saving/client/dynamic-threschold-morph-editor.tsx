import React, { ChangeEventHandler } from 'react';
import { BeReplacedMorphConcern, UpDown } from './editing-morphs';
import { DynamicThrescholdMorph } from './morphs';
import { Regarding, toNextKey } from './reacting';

export type DynamicThrescholdMorphEditorConcern =
    | BeReplacedMorphConcern<DynamicThrescholdMorph>
    | typeof UpDown.Concern;

export interface DynamicThrescholdMorphEditorProps {
    morph: DynamicThrescholdMorph;
    regarding: Regarding<DynamicThrescholdMorphEditorConcern>;
}

export class DynamicThrescholdMorphEditor extends React.PureComponent<DynamicThrescholdMorphEditorProps> {

    static Concern: DynamicThrescholdMorphEditorConcern;

    transform = (change: (morph: DynamicThrescholdMorph) => DynamicThrescholdMorph) => {
        let { morph, regarding } = this.props;
        const { key } = morph;
        morph = change(morph);
        morph.key = toNextKey();
        regarding({ about: 'be-replaced-morph', key, morph });
    }

    whenToggled: ChangeEventHandler<HTMLInputElement> = e => {
        this.transform(morph => ({ ...morph, isEnabled: e.currentTarget.checked }));
    };
    whenChangedDynamicSize: ChangeEventHandler<HTMLInputElement> = e => {
        this.transform(morph => ({ ...morph, dynamicWindowSize: parseInt(e.currentTarget.value, 10) }));
    };
    whenChangedGaussSize: ChangeEventHandler<HTMLInputElement> = e => {
        this.transform(morph => ({ ...morph, gaussKernelSize: parseInt(e.currentTarget.value, 10) }));
    };
    whenChangedMinDynamicRange: ChangeEventHandler<HTMLInputElement> = e => {
        this.transform(morph => ({ ...morph, minDynamicRange: parseInt(e.currentTarget.value, 10) }));
    };

    render() {
        const { morph: { isEnabled, dynamicWindowSize, gaussKernelSize, minDynamicRange, key }, regarding } = this.props;
        return <div className="morph">
            <div className="morph-name">
                <label><input type="checkbox" checked={isEnabled} onChange={this.whenToggled} /> dynamic threschold</label> <span>
                    <UpDown context={key} regarding={regarding} />
                </span>
            </div>
            <div className="morph-props">
                gauss window size: <input type="number" step="2" className="morph-number" value={gaussKernelSize} onChange={this.whenChangedGaussSize} />
            </div>
            <div className="morph-props">
                dynamic window size: <input type="number" step="2" className="morph-number" value={dynamicWindowSize} onChange={this.whenChangedDynamicSize} />
            </div>
            <div className="morph-props">
                min dynamic range: <input type="number" step="1" className="morph-number" value={minDynamicRange} onChange={this.whenChangedMinDynamicRange} />
            </div>
        </div>;
    }
}

