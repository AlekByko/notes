import { alwaysNull, isNull, run } from '../shared/core';
import { parseTimeInternalOr } from '../shared/reading-time-interval';
import { formatTimeInterval, getMsOfTimeInterval, makeTimeIntervalOfMs } from '../shared/time-interval';

if (window.sandbox === 'trying-reading-time-internal') {
    console.log(parseTimeInternalOr(`1d`, alwaysNull));
    console.log(parseTimeInternalOr(`1d 2h`, alwaysNull));
    console.log(parseTimeInternalOr(`1d 2h 3m`, alwaysNull));
    console.log(parseTimeInternalOr(`1d 2h 3m 4s 5ms`, alwaysNull));
    console.log(parseTimeInternalOr(`2h`, alwaysNull));
    console.log(parseTimeInternalOr(`2h 3m`, alwaysNull));
    console.log(parseTimeInternalOr(`2h 3m 4s 5ms`, alwaysNull));
    console.log(parseTimeInternalOr(`3m`, alwaysNull));
    console.log(parseTimeInternalOr(`3m 4s 5ms`, alwaysNull));
    console.log(parseTimeInternalOr(`4s`, alwaysNull));
    console.log(parseTimeInternalOr(`4s 5ms`, alwaysNull));

    console.log(parseTimeInternalOr(`1d 2h 3m 4s 5ms`, alwaysNull));

    run(() => {
        const inputText = `1d 2h 3m 4s 5ms`;
        const inputInterval = parseTimeInternalOr(inputText, alwaysNull);
        if (isNull(inputInterval)) return console.log(`Bad text: ${inputText}`);

        const ms = getMsOfTimeInterval(inputInterval);
        console.log(ms);
        const outputInterval = makeTimeIntervalOfMs(ms);
        console.log(outputInterval);
        const outputText = formatTimeInterval(outputInterval);
        console.log('identity text', { inputText, inputInterval, ms, outputInterval, outputText });
    });
}
