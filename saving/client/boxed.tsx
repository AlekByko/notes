import React, { MouseEventHandler } from 'react';
import { isNull } from '../shared/core';
import { Box } from '../shared/shapes';
import { startListening } from './eventing';
import { Resizable } from './resizable';




export function enableMoving<Pos>(
    headerElement: HTMLElement,
    contentElement: HTMLElement,
    defaults: {
        readPos: (element: HTMLElement) => Pos;
        applyDelta: (element: HTMLElement, pos: Pos, dx: number, dy: number) => void;
        reportPos: (pos: Pos, dx: number, dy: number) => void;
    },
) {

    function whenMousedown(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();

        const startX = e.pageX;
        const startY = e.pageY;
        const startPos = defaults.readPos(contentElement);

        document.addEventListener('mousemove', whenMousemove);
        document.addEventListener('mouseup', whenMouseup);

        function whenMouseup(e: MouseEvent) {
            document.removeEventListener('mouseup', whenMouseup);
            document.removeEventListener('mousemove', whenMousemove);
            const dx = e.pageX - startX;
            const dy = e.pageY - startY;
            defaults.reportPos(startPos, dx, dy);
        }

        function whenMousemove(e: MouseEvent) {
            e.stopPropagation();
            e.preventDefault();
            const dx = e.pageX - startX;
            const dy = e.pageY - startY;
            defaults.applyDelta(contentElement, startPos, dx, dy);
        }
    }

    headerElement.addEventListener('mousedown', whenMousedown);

    return function dispose() {
        headerElement.removeEventListener('mousedown', whenMousedown);
    };
}
export interface BoxedDefaults<Props> {
    titleOf: (props: Props) => string;
    boxOf: (props: Props) => Box;
    onChangedBox: (props: Props, box: Partial<Box>) => void;
    onChangedTitle: (props: Props, title: string) => void;
    onDeleting: (props: Props) => void;
}

interface State {
    title: string;
}

export function thusBoxed<Props>(defaults: BoxedDefaults<Props>) {
    function makeState(props: Props): State {
        const title = defaults.titleOf(props);
        return { title };
    }
    return class Boxed extends React.Component<Props, State> {

        state = makeState(this.props);

        whenChangedBox = (box: Partial<Box>) => {
            defaults.onChangedBox(this.props, box);
        };

        private headerElement: HTMLDivElement | null = null;
        private rootElement: HTMLElement | null = null;

        dispose = [] as Act[];


        whenDeleting: MouseEventHandler<HTMLButtonElement> = _e => {
            defaults.onDeleting(this.props);
        }


        async componentDidMount(): Promise<void> {
            const { rootElement, headerElement } = this;
            if (isNull(rootElement) || isNull(headerElement)) return;
            const { x, y, width, height } = defaults.boxOf(this.props);
            rootElement.style.left = x + 'px';
            rootElement.style.top = y + 'px';
            rootElement.style.width = width + 'px';
            rootElement.style.height = height + 'px';

            this.dispose.push(enableMoving(headerElement, rootElement, {
                readPos: element => {
                    const childAt = element.getBoundingClientRect();
                    const parentAt = element.parentElement!.getBoundingClientRect();
                    const x = childAt.left - parentAt.left;
                    const y = childAt.top - parentAt.top;
                    return { x, y };
                },
                applyDelta: (element, { x, y }, dx, dy) => {
                    element.style.left = (x + dx) + 'px';
                    element.style.top = (y + dy) + 'px';
                },
                reportPos: ({ x, y }, dx, dy) => {
                    x += dx;
                    y += dy;
                    defaults.onChangedBox(this.props, { y, x });
                },
            }));

            this.dispose.push(startListening(headerElement, 'dblclick', e => {
                e.preventDefault();
                e.stopPropagation();
                this.setState(state => {
                    const { title: olderTitle } = state;
                    const newerTitle = prompt('Title', olderTitle);
                    if (isNull(newerTitle)) return null;
                    return { ...state, title: newerTitle } satisfies State;
                }, () => {
                    const { title } = this.state;
                    defaults.onChangedTitle(this.props, title);
                });
            }));
        }

        componentWillUnmount(): void {
            this.dispose.forEach(dispose => dispose());
        }

        render() {
            const { children } = this.props;
            const box = defaults.boxOf(this.props);
            const { title } = this.state;
            return <Resizable refin={el => this.rootElement = el} className="boxed" onChanged={this.whenChangedBox} box={box}>
                <div className="boxed-header" ref={el => this.headerElement = el}>{title}<button onClick={this.whenDeleting}>X</button></div>
                {children}
            </Resizable>;
        }
    };
}
