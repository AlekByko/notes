import React, { useRef, useState } from 'react';
import { CardProps } from './cards';
import { CardKey } from './notes-workspace';

export interface NotesSearchProps {
    search: (text: string) => CardProps[];
    onPreview: (cardKey: CardKey) => void;
}
export function thusNotesSearch(delay: number) {
    return function NotesSearch(props: NotesSearchProps) {
        const lastSearchTextRef = useRef('');
        const timerRef = useRef(0);
        const [found, setFound] = useState([] as CardProps[]);


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

        const [text, setText] = useState('');
        return <div className="notes-search">
            <div>
                <input className="notes-search-input" value={text} onChange={onChange} />
            </div>
            <div className="notes-search-results">
                {found.map(card => {
                    return <div key={card.cardKey} className="notes-search-result" onMouseOver={() => {
                        props.onPreview(card.cardKey);
                    }}>{card.title}</div>;
                })}
            </div>
        </div>;
    };
}
