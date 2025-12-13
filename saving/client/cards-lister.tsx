import React from 'react';
import { broke } from '../shared/core';
import { thusArea } from './area';
import { CardProps } from './cards';
import { NoteDefaults, thusNote } from './note';

export interface CardsListerProps {
    cards: CardProps[];
}
/** The purpose of this component is to prevent all cards from being re-rendered when something else is changed at the app level (but `cards` stay the same). */
export function thusCardLister(defaults: NoteDefaults) {
    const Note = thusNote(defaults);
    const Area = thusArea();

    return class CardsLister extends React.PureComponent<CardsListerProps> {
        render() {
            const { cards } = this.props;
            return cards.map(card => {
                switch (card.kind) {
                    case 'note': return <Note key={card.cardKey} {...card} />
                    case 'area': return <Area key={card.cardKey} {...card} />
                    default: return broke(card);
                }
            });
        }
    };
}
