import { broke } from '../shared/core';
import { AreaProps } from './area';
import { NoteProps } from './note';

export type CardProps = AreaProps | NoteProps;
export function boxOf(card: CardProps) {
    switch(card.kind) {
        case 'area': return card.box;
        case 'note': return card.config.box;
        default: return broke(card);
    }
}
export function titleOf(card: CardProps) {
    switch(card.kind) {
        case 'area': return card.title;
        case 'note': return card.config.title;
        default: return broke(card);
    }
}
