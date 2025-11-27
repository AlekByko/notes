import React from 'react';
import { thusBoxed } from './boxed';
import { Box } from './doing-image-coordinates';
import { CardKey } from './notes-workspace';
import { Regarding } from './reacting';

export interface AreaProps {
    kind: 'area';
    cardKey: CardKey;
    box: Box;
    title: string;
    regarding: Regarding<AreaConcern>;
}
export type AreaConcern =
    | { about: 'be-deleted-area'; cardKey: CardKey; }
    | { about: 'be-changed-area-box'; cardKey: CardKey; box: Partial<Box>; }
    | { about: 'be-changed-area-title'; cardKey: CardKey; title: string; };

export function thusArea() {

    const Boxed = thusBoxed({
        boxOf: (props: AreaProps) => props.box,
        titleOf: ({ title }) => title,
        onChangedBox: ({ regarding, cardKey }, box) => regarding({ about: 'be-changed-area-box', cardKey, box }),
        onChangedTitle: ({ regarding, cardKey }, title) => regarding({ about: 'be-changed-area-title', cardKey, title }),
        onDeleting: ({ regarding, cardKey }) => regarding({ about: 'be-deleted-area', cardKey }),
    });
    return class Area extends React.Component<AreaProps> {
        render() {
            return <Boxed {...this.props}>
                Area
            </Boxed>;
        }
    };
}
