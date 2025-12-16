import React, { useEffect, useRef, useState } from 'react';
import { cast, isNonNull, isNull } from '../shared/core';
import { CardProps, titleOf } from './cards';
import { seeIfElement, seeIfHTMLElement } from './doming';
import { CardKey } from './notes-workspace';

export interface NotesSearchProps {
    search: (text: string) => CardProps[];
    onPreview: (cardKey: CardKey) => void;
    onSelect: (cardKey: CardKey) => void;
    onHide: () => void;
}

export function thusNotesSearch(delay: number) {
    return function NotesSearch(props: NotesSearchProps) {
        const lastTextRef = useRef('');
        const timerRef = useRef(0);
        const [found, setFound] = useState([] as CardProps[]);
        const lastCardKeyRef = useRef(null as null | CardKey);
        const lastElementRef = useRef(null as null | HTMLElement);
        const lastMouseOverPosRef = useRef(null as null | { x: number, y: number });

        const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            let text = e.currentTarget.value;
            setText(text);
            const searchText = text.trim().toLowerCase();
            if (searchText === lastTextRef.current || searchText === '') return;
            lastTextRef.current = searchText;
            window.clearTimeout(timerRef.current);
            timerRef.current = window.setTimeout(() => {
                const found = props.search(searchText);
                reset();
                setFound(found);
            }, delay);
        };

        const reset = () => {
            if (isNonNull(lastElementRef.current)) {
                lastElementRef.current.classList.remove('as-highlighted');
                lastElementRef.current = null;
            }
            lastCardKeyRef.current = null;
            lastMouseOverPosRef.current = null;
        }

        const whenMouseOver = (e: React.MouseEvent<HTMLElement>) => {
            if (isNonNull(lastMouseOverPosRef.current)) {
                const { x, y } = lastMouseOverPosRef.current;
                // it means the mouse hasn't moved but another
                // mouseover occured, it can be when users scrolls
                // by up/down arrow keys in which case we don't want
                // this mouseover to happen
                if (e.pageX === x && e.pageY === y) return;
            }
            lastMouseOverPosRef.current = { x: e.pageX, y: e.pageY };
            if (!seeIfHTMLElement(e.target)) return;
            const cardKey = e.target.getAttribute('data-card-key');
            if (isNull(cardKey)) return;
            cast<CardKey>(cardKey);
            highlight(e.target, cardKey, false);
        }

        function highlight(element: HTMLElement, cardKey: CardKey, shouldScroll: boolean) {
            lastCardKeyRef.current = cardKey;
            if (isNonNull(lastElementRef.current)) {
                lastElementRef.current.classList.remove('as-highlighted');
            }
            lastElementRef.current = element;
            lastElementRef.current.classList.add('as-highlighted');
            if (shouldScroll) {
                element.scrollIntoView({ block: 'center' });
            }
            props.onPreview(cardKey);
        }

        const [text, setText] = useState('');
        const whenMouseClick = (e: React.MouseEvent<HTMLElement>) => {
            if (!seeIfElement(e.target)) return;
            const cardKey = e.target.getAttribute('data-card-key');
            if (isNull(cardKey)) return;
            cast<CardKey>(cardKey);
            reset();
            props.onSelect(cardKey);
        };
        function select() {
            const cardKey = lastCardKeyRef.current;
            if (isNull(cardKey)) return;
            reset();
            props.onSelect(cardKey);
        }
        const goUp = (e: React.KeyboardEvent) => {
            e.preventDefault();
            if (isNull(resultListElementRef.current)) return;
            let at = isNonNull(lastCardKeyRef.current)
                ? found.findIndex(x => x.cardKey === lastCardKeyRef.current)
                : found.length > 0
                    ? 0
                    : -1;
            if (at < 0) return;
            if (at > 1) {
                at -= 1;
            } else {
                at = found.length - 1;
            }
            const { cardKey } = found[at];
            const elements = resultListElementRef.current.querySelectorAll("div");
            const element = elements.item(at);
            highlight(element, cardKey, true);
        };
        const goDown = (e: React.KeyboardEvent) => {
            e.preventDefault();
            if (isNull(resultListElementRef.current)) return;
            let at = isNonNull(lastCardKeyRef.current)
                ? found.findIndex(x => x.cardKey === lastCardKeyRef.current)
                : found.length > 0
                    ? found.length - 1
                    : -1;
            if (at < 0) return;
            if (at < found.length - 1) {
                at += 1;
            } else {
                at = 0;
            }
            const { cardKey } = found[at];
            const elements = resultListElementRef.current.querySelectorAll("div");
            const element = elements.item(at);
            highlight(element, cardKey, true);
        };

        const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
            const { code } = e.nativeEvent;
            switch (code) {
                case 'Escape': return props.onHide();
                case 'ArrowUp': return goUp(e);
                case 'ArrowDown': return goDown(e);
                case 'Enter': return select();
                default: break; // do nothing
            }
        };

        const inputRef = useRef(null as HTMLInputElement | null);

        useEffect(() => {
            if (isNull(inputRef.current)) return;
            inputRef.current.focus();
        }, []);

        const resultListElementRef = useRef(null as HTMLDivElement | null);

        return <div className="notes-search">
            <div>
                <input className="notes-search-input" value={text} onChange={onChange} onKeyDown={onKeyDown} ref={inputRef} />
            </div>
            <div className="notes-search-results" ref={resultListElementRef} onMouseOver={whenMouseOver} onClick={whenMouseClick}>
                {found.map(card => {
                    return <div key={card.cardKey} data-card-key={card.cardKey} className="notes-search-result">{titleOf(card)}</div>;
                })}
            </div>
        </div>;
    };
}
