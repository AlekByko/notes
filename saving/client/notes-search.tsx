import React, { useEffect, useRef, useState } from 'react';
import { isNull } from '../shared/core';
import { CardProps } from './cards';
import { seeIfElement } from './doming';
import { CardKey } from './notes-workspace';

export interface NotesSearchProps {
    search: (text: string) => CardProps[];
    onPreview: (cardKey: CardKey) => void;
    onSelect: (cardKey: CardKey) => void;
    onHide: () => void;
}

function pullCardKey(target: EventTarget) {
    if (!seeIfElement(target)) return null;
    const cardKey = target.getAttribute('data-card-key');
    return cardKey as CardKey;
}
export function thusNotesSearch(delay: number) {
    return function NotesSearch(props: NotesSearchProps) {
        const lastSearchTextRef = useRef('');
        const timerRef = useRef(0);
        const [found, setFound] = useState([] as CardProps[]);
        const lastOveredRef = useRef(null as null | CardKey);

        const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            let text = e.currentTarget.value;
            setText(text);
            const searchText = text.trim().toLowerCase();
            if (searchText === lastSearchTextRef.current || searchText === '') return;
            lastSearchTextRef.current = searchText;
            window.clearTimeout(timerRef.current);
            timerRef.current = window.setTimeout(() => {
                const found = props.search(searchText);
                setFound(found);
            }, delay);
        };

        const whenMouseOver = (e: React.MouseEvent<HTMLElement>) => {
            const cardKey = pullCardKey(e.target);
            if (isNull(cardKey)) return;
            lastOveredRef.current = cardKey;
            props.onPreview(cardKey);
        }

        const [text, setText] = useState('');
        const whenMouseClick = (e: React.MouseEvent<HTMLElement>) => {
            const cardKey = pullCardKey(e.target);
            if (isNull(cardKey)) return;
            props.onSelect(cardKey);
        };

        const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
            if (e.nativeEvent.code === 'Escape') props.onHide();
        };

        const inputRef = useRef(null as HTMLInputElement | null);

        useEffect(() => {
            if (isNull(inputRef.current)) return;
            inputRef.current.focus();
        }, []);

        return <div className="notes-search">
            <div>
                <input className="notes-search-input" value={text} onChange={onChange} onKeyDown={onKeyDown} ref={inputRef} />
            </div>
            <div className="notes-search-results" onMouseOver={whenMouseOver} onClick={whenMouseClick}>
                {found.map(card => {
                    return <div key={card.cardKey} data-card-key={card.cardKey} className="notes-search-result">{card.title}</div>;
                })}
            </div>
        </div>;
    };
}
