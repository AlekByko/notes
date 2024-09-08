import React, { ChangeEventHandler, MouseEventHandler } from 'react';
import { BeAppliedConfigConcern, BeReplacedConfigConcern } from './editing-configs';
import { EnergyPerHueModConfig } from './morphs';
import { Regarding } from './reacting';

export type EnergyPerHueModderConcern =
    | BeReplacedConfigConcern<EnergyPerHueModConfig>
    | BeAppliedConfigConcern<EnergyPerHueModConfig>;

export interface EnergyPerHueModderProps {
    config: EnergyPerHueModConfig;
    regarding: Regarding<EnergyPerHueModderConcern>;
}

export class EnergyPerHueModder extends React.PureComponent<EnergyPerHueModderProps> {

    static Concern: EnergyPerHueModderConcern;

    transform = (change: (morph: EnergyPerHueModConfig) => EnergyPerHueModConfig) => {
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
        this.transform(morph => ({
            ...morph,
            numberOfHueBins: parseInt(e.currentTarget.value, 10)
        }) satisfies EnergyPerHueModConfig);
    };

    whenApplied: MouseEventHandler<HTMLButtonElement> = _e => {
        const { regarding, config } = this.props;
        regarding({ about: 'be-applied-config', config });
    };

    render() {
        const { config: { numberOfHueBins } } = this.props;
        return <div className="mod">
            <div className="mod-name">energt per hue</div>
            <div className="morph-props">
                number of hue bins: <input className="morph-number" type="number" value={numberOfHueBins} onChange={this.whenChangedSize} />
            </div>
            <div>
                <button onClick={this.whenApplied}>Apply</button>
            </div>
        </div>;
    }
}
