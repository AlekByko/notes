import { isNull } from './shared/core';

// direct control of a DOM element
export class DirectControl {
    element: HTMLElement | null = null;
    whenElement = (element: HTMLElement | null) => {
        this.element = element;
    }
    update = (use: (element: HTMLElement) => void) => {
        const { element } = this;
        if (isNull(element)) return;
        use(element);
    }
}
