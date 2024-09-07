import React, { ChangeEventHandler } from 'react';
import { BeReplacedConfigConcern } from './editing-configs';
import { HorzVertBitHistoModConfig } from './morphs';
import { Regarding } from './reacting';

export type HorzVertBitHistoModderConcern =
    | BeReplacedConfigConcern<HorzVertBitHistoModConfig>;

export interface HorzVertBitHistoModderProps {
    config: HorzVertBitHistoModConfig;
    regarding: Regarding<HorzVertBitHistoModderConcern>;
}

export class HorzVertBitHistoModder extends React.PureComponent<HorzVertBitHistoModderProps> {

    static Concern: HorzVertBitHistoModderConcern;

    transform = (change: (morph: HorzVertBitHistoModConfig) => HorzVertBitHistoModConfig) => {
        let { config, regarding } = this.props;
        config = change(config);
        regarding({ about: 'be-replaced-config', config });
    }
    whenToggled: ChangeEventHandler<HTMLInputElement> = e => {
        this.transform(morph => ({
            ...morph,
            isEnabled: e.currentTarget.checked
        }));
    };

    whenChangedSize: ChangeEventHandler<HTMLInputElement> = e => {
        this.transform(morph => ({ ...morph, featureVectorSize: parseInt(e.currentTarget.value, 10) }));
    };

    render() {
        const { config: { featureVectorSize } } = this.props;
        return <div>
            <div className="morph-props">
                feature vector size: <input className="morph-number" type="number" value={featureVectorSize} onChange={this.whenChangedSize} />
            </div>
        </div>;
    }
}
