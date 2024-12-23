import { isNull } from '../shared/core';

// direct control of a DOM element
export class DirectControl {
    constructor(
        private controller: { shouldWorryAboutUnsafe: boolean }
    ) {
    }
    element: HTMLElement | null = null;
    whenElement = (element: HTMLElement | null) => {
        this.element = element;
    }
    update = (use: (element: HTMLElement) => void) => {
        const { element } = this;
        if (isNull(element)) return;
        if (this.controller.shouldWorryAboutUnsafe) {
            use(element);
        } else {
            element.innerText = 'xxx';
        }
    }
}
