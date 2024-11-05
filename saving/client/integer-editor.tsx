import { InputHTMLAttributes } from 'react';
import { thusParsableEditor } from './parsable-editor';

export function thusIntegerEditor(defaults: {
    clarifyProps: (props: InputHTMLAttributes<HTMLInputElement>) => void;
}) {
    return thusParsableEditor<number, number, string>({
        format: value => value.toFixed(0),
        parse: text => {
            const parsed = parseInt(text, 10);
            if (!isFinite(parsed)) return 'Bad number: ' + text;
            return parsed;
        },
        parsedValueOf: value => value,
        seeIfParsed: (value): value is number => { return typeof value === 'number'; },
        clarifyProps: props => {
            props.min = 0;
            props.max = 999;
            props.maxLength = 3;
            props.size = 3;
            defaults.clarifyProps(props);
        },
    });
}
