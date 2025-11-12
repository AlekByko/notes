import { asDefinedOr } from './core';

export interface Box {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface BeingBox {
    defaultize: (box: Partial<Box>) => asserts box is Box;
    roundize: (box: Box) => void;
    defaultBox: Box;
}

export function henceBeingBox(defaultBox: Box): BeingBox {

    function defaultize(box: Partial<Box>): asserts box is Box {
        const { x, y, width, height } = box;
        box.x = asDefinedOr(x, defaultBox.x);
        box.y = asDefinedOr(y, defaultBox.y);
        box.width = asDefinedOr(width, defaultBox.width);
        box.height = asDefinedOr(height, defaultBox.height);
    }
    function roundize(box: Box): void {
        const { x, y, width, height } = box;
        box.x = Math.round(x);
        box.y = Math.round(y);
        box.width = Math.round(width);
        box.height = Math.round(height);
    }
    return { defaultBox, defaultize, roundize };
}
