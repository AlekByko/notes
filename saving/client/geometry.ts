export interface Rectangle {
    top: number;
    bottom: number;
    left: number;
    right: number;
    width: number;
    height: number;
}

export interface Point { x: number; y: number; }
export function pointFrom(x: number, y: number): Point {
    return { x, y };
}
