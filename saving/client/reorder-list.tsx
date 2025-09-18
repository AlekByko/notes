import * as React from 'react';
import { DragEventHandler } from 'react';
import ReactDOM from 'react-dom';
import { areStringsEqual, broke, compareRandom, isNull } from '../shared/core';
import { addClassIfDefined, ReactConstructor } from './reacting';


export interface ReorderListProps<Item> {
    items: Item[];
}

export function thusReorderList<ItemProps extends object>(
    defaults: {
        Item: ReactConstructor<ItemProps>,
        keyOf: (item: ItemProps) => string;
    }
) {

    type HoldingPlace = 'top' | 'bottom';

    interface Hovered { key: string; where: HoldingPlace; }

    interface State {
        items: ItemProps[];
        baselineItems: ItemProps[];
        draggedKey: string | null;
        hovered: Hovered | null;
    }

    function makeState(props: Props): State {
        const { items } = props;
        return { items, baselineItems: items, draggedKey: null, hovered: null };
    }

    type Props = ReorderListProps<ItemProps>;

    return class ReorderList extends React.Component<Props, State> {

        static Props: Props;

        state = makeState(this.props);

        static getDerivedStateFromProps(props: Props, state: State): State | null {
            const { items } = props;
            if (items !== state.baselineItems) {
                return { ...state, baselineItems: items, items } satisfies State;
            }
            return null;
        }

        whenDragLeave: DragEventHandler<HTMLDivElement> = e => {
            const isStillInside = (e.relatedTarget as HTMLElement)?.closest('.reorder-list-item');
            if (!isStillInside) {
                this.setState({ hovered: null });
            }
        };

        whenDrop: DragEventHandler<HTMLDivElement> = _e => {
            const { draggedKey, hovered, items } = this.state;
            if (isNull(draggedKey)) return;
            if (isNull(hovered)) return;
            const draggedAt = items.findIndex(item => areStringsEqual(defaults.keyOf(item), draggedKey));
            if (draggedAt < 0) return;
            let holdingAt = items.findIndex(x => areStringsEqual(defaults.keyOf(x), hovered.key));
            if (holdingAt < 0) return;
            switch (hovered.where) {
                case 'top': break;
                case 'bottom': holdingAt += 1; break;
                default: return broke(hovered.where);
            }
            const dragged = items[draggedAt];
            items.splice(draggedAt, 1);
            items.splice(holdingAt > draggedAt ? holdingAt - 1 : holdingAt, 0, dragged);
        };

        whenDragOver: DragEventHandler<HTMLDivElement> = e => {
            e.preventDefault();
            const key = e.currentTarget.getAttribute('data-key');
            if (isNull(key)) return;
            const { clientY } = e;
            const { top, height } = e.currentTarget.getBoundingClientRect();
            const midY = top + height / 2;
            let where;
            if (clientY > midY) {
                where = 'bottom' as const;
            } else {
                where = 'top' as const;
            }
            this.setState({ hovered: { key, where } });
        };

        whenDragEnd: DragEventHandler<HTMLDivElement> = _e => {
            this.setState({ draggedKey: null, hovered: null });
        };

        whenDragStart: DragEventHandler<HTMLDivElement> = e => {
            const key = e.currentTarget.getAttribute('data-key');
            if (isNull(key)) return;
            this.setState({ draggedKey: key });
        };

        render() {
            const { items, draggedKey, hovered } = this.state;
            return <div className="reorder-list">
                {items.map(item => {
                    const key = defaults.keyOf(item);
                    const draggedClass = draggedKey === key ? 'as-dragged' : undefined;
                    const hoveredClass = seeWhatHoveredClassIs(hovered, key, draggedKey);
                    const itemClass = 'reorder-list-item' + addClassIfDefined(draggedClass) + addClassIfDefined(hoveredClass);
                    return <div
                        key={key}
                        className={itemClass}
                        draggable
                        data-key={key}
                        onDragStart={this.whenDragStart}
                        onDragEnd={this.whenDragEnd}
                        onDragOver={this.whenDragOver}
                        onDrop={this.whenDrop}
                        onDragLeave={this.whenDragLeave}
                    ><div className="reorder-list-item-drag-handle"></div><defaults.Item {...item} /></div>;
                })}
            </div>;
        }
    };

    function seeWhatHoveredClassIs(hovered: Hovered | null, key: string, draggedKey: string | null) {
        if (isNull(hovered)) return undefined;
        if (hovered.key !== key) return undefined;
        if (hovered.key === draggedKey) return undefined;
        const { where } = hovered;
        switch (where) {
            case 'top': return 'as-holding-place-at-top';
            case 'bottom': return 'as-holding-place-at-bottom';
            default: return broke(where);
        }
    }
}

if (window.sandbox === 'reorder-list') {

    interface ItemProps {
        key: string;
        name: string;
    }
    class Item extends React.Component<ItemProps> {
        render() {
            const { name } = this.props;
            return <div>{name}</div>
        }
    }
    const ReorderList = thusReorderList({
        Item: Item,
        keyOf: (x: ItemProps) => x.key,
    });
    interface AppState { items: ItemProps[] }
    class App extends React.Component<AppState, AppState> {

        state = this.props;
        whenOutsideEffect: React.MouseEventHandler<HTMLButtonElement> = () => {
            this.setState(state => {
                let { items } = state;
                items = [...items].sort(compareRandom);
                return { ...state, items } satisfies AppState;
            });
        };
        render() {
            const { items } = this.state;
            const props: typeof ReorderList.Props = { items };
            return <div>
                <div><ReorderList {...props} /></div>
                <div><button onClick={this.whenOutsideEffect}>Outside effect</button></div>
            </div>;
        }
    }


    const rootElement = document.getElementById('root')!
    const items: ItemProps[] = [
        { key: 'A', name: 'Alpha' },
        { key: 'B', name: 'Beta' },
        { key: 'C', name: 'Gamma' },
        { key: 'D', name: 'Delta' },
    ];
    ReactDOM.render(<App items={items} />, rootElement);
    rootElement.style.padding = '10px';
}
