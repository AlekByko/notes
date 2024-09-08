import React, { ChangeEventHandler, MouseEventHandler } from 'react';
import { BeAppliedConfigConcern, BeReplacedConfigConcern } from './editing-configs';
import { EnergyPerSquareModConfig } from './morphs';
import { Regarding } from './reacting';

export type EnergyPerSquareModderConcern =
    | BeReplacedConfigConcern<EnergyPerSquareModConfig>
    | BeAppliedConfigConcern<EnergyPerSquareModConfig>;

export interface EnergyPerSquareModderProps {
    config: EnergyPerSquareModConfig;
    regarding: Regarding<EnergyPerSquareModderConcern>;
}

export class EnergyPerSquareModder extends React.PureComponent<EnergyPerSquareModderProps> {

    static Concern: EnergyPerSquareModderConcern;

    transform = (change: (morph: EnergyPerSquareModConfig) => EnergyPerSquareModConfig) => {
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
            squareSize: parseInt(e.currentTarget.value, 10)
        } satisfies EnergyPerSquareModConfig));
    };

    whenApplied: MouseEventHandler<HTMLButtonElement> = _e => {
        const { regarding, config } = this.props;
        regarding({ about: 'be-applied-config', config });
    };

    render() {
        const { config: { squareSize } } = this.props;
        return <div className="mod">
            <div className="mod-name">energy per square</div>
            <div className="mod-note">Sensitive to camera shifts</div>
            <div className="morph-props">
                square size: <input className="morph-number" type="number" value={squareSize} onChange={this.whenChangedSize} />
            </div>
            <div>
                <button onClick={this.whenApplied}>Apply</button>
            </div>
        </div>;
    }
}
