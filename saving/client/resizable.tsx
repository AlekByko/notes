import React from 'react';
import { addClassIfDefined } from './reacting';
export interface ResizableProps {
    className?: string;
    refin: (element: HTMLDivElement | null) => void;
}
export class Resizable extends React.Component<ResizableProps> {
    render() {
        const { className, refin } = this.props;
        return <div ref={refin} className={'resizable' + addClassIfDefined(className)}>
            {this.props.children}
            <div className="resizable-top-bar"></div>
            <div className="resizable-left-bar"></div>
            <div className="resizable-right-bar"></div>
            <div className="resizable-bottom-bar"></div>
        </div>
    }
}
