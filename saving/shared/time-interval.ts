import { asDefinedOr } from './core';

export interface TimeInterval {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
}
export type TimeIntervalRead = Partial<TimeInterval>;
export function solidifyTimeIntervalRead(interval: TimeIntervalRead): TimeInterval {
    const { days, hours, milliseconds, minutes, seconds } = interval;
    return {
        days: asDefinedOr(days, 0),
        hours: asDefinedOr(hours, 0),
        minutes: asDefinedOr(minutes, 0),
        seconds: asDefinedOr(seconds, 0),
        milliseconds: asDefinedOr(milliseconds, 0),
    };
}
export function makeTimeIntervalOfMs(ms: number): TimeInterval {
    const milliseconds = ms % 1000;
    ms = (ms - milliseconds) / 1000;
    const seconds = ms % 60;
    ms = (ms - seconds) / 60;
    const minutes = ms % 60;
    ms = (ms - minutes) / 60;
    const hours = ms % 24;
    ms = (ms - hours) / 24;
    const days = ms;
    return { days, hours, minutes, seconds, milliseconds };
}

export function formatTimeInterval({ days, hours, minutes, seconds, milliseconds }: TimeInterval) {
    const result: string[] = [];
    if (days > 0) {
        result.push(`${days}d`);
    }
    if (hours > 0) {
        result.push(`${hours}h`);
    }
    if (minutes > 0) {
        result.push(`${minutes}m`);
    }
    if (seconds > 0) {
        result.push(`${seconds}s`);
    }
    if (milliseconds > 0) {
        result.push(`${milliseconds}ms`);
    }
    return result.join(' ');
}

export function getMsOfTimeInterval(interval: TimeInterval) {
    const { days, hours, minutes, seconds, milliseconds } = interval;
    let internal = 0;
    internal += days * 1000 * 60 * 60 * 24;
    internal += hours * 1000 * 60 * 60;
    internal += minutes * 1000 * 60;
    internal += seconds * 1000;
    internal += milliseconds;
    return internal;
}

