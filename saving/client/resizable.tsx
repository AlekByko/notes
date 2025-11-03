import React from 'react';
import { isNull } from '../shared/core';
import { addClassIfDefined } from './reacting';
export interface ResizableProps {
    className?: string;
    refin: (element: HTMLDivElement | null) => void;
}

export function henceResizing<Owner>(
    defaults: {
        elementOf: (owner: Owner) => HTMLElement | null;
    }
) {
    function whenMousedown(e: MouseEvent) {
        const { pageX, pageY } = e;
        console.log({ pageX, pageY });
    }
    function componentDidMount(owner: Owner) {
        const element = defaults.elementOf(owner);
        if (isNull(element)) return;
        element.addEventListener('mousedown', whenMousedown);
    }
    function componentWillUnmount(owner: Owner) {
        const element = defaults.elementOf(owner);
        if (isNull(element)) return;
        element.addEventListener('mousedown', whenMousedown);
    };
    return {
        componentDidMount,
        componentWillUnmount,
    };
}

const hences = [
    henceResizing<Resizable>({
        elementOf: x => x.bottomElement,
    }),
    henceResizing<Resizable>({
        elementOf: x => x.topElement,
    }),
    henceResizing<Resizable>({
        elementOf: x => x.leftElement,
    }),
    henceResizing<Resizable>({
        elementOf: x => x.rightElement,
    }),
];

export class Resizable extends React.Component<ResizableProps> {

    public bottomElement: HTMLDivElement | null = null;
    public topElement: HTMLDivElement | null = null;
    public leftElement: HTMLDivElement | null = null;
    public rightElement: HTMLDivElement | null = null;

    componentDidMount(): void {
        hences.forEach(hence => {
            hence.componentDidMount(this);
        });
    }
    componentWillUnmount(): void {
        hences.forEach(hence => {
            hence.componentWillUnmount(this);
        });
    }
    render() {
        const { className, refin } = this.props;
        return <div ref={refin} className={'resizable' + addClassIfDefined(className)}>
            {this.props.children}
            <div className="resizable-top-bar" ref={el => this.topElement = el}></div>
            <div className="resizable-left-bar" ref={el => this.leftElement = el}></div>
            <div className="resizable-right-bar" ref={el => this.rightElement = el}></div>
            <div className="resizable-bottom-bar" ref={el => this.bottomElement = el}></div>
        </div>
    }
}
