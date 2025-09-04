import { Deferred, isUndefined, toDeferredOf } from '../shared/core';
import { Timestamp, toTimestamp } from '../shared/time-stamping';

export interface Running<Key, Result> {
    key: Key;
    since: Timestamp;
    soon: Deferred<Result>;
}

export function thusMessageApiBroker<Response, Key, Output, Request, Input>(
    defaults: {
        isIt: (data: unknown) => data is Response;
        keyOf: (message: Response) => Key;
        resultOf: (message: Response) => Output;
        makeKey: () => Key;
        makeRequest: (key: Key, input: Input) => Request;
    }
) {
    return class MessageApiBroker {
        constructor(
            private running: Map<Key, Running<Key, Output>> = new Map()
        ) {
            window.addEventListener('message', this.whenMessage);
        }

        clear() {
            this.running.clear();
        }

        private whenMessage = (e: MessageEvent<any>) => {
            const { data } = e;
            if (!defaults.isIt(data)) return;
            const correlationKey = defaults.keyOf(data);
            const running = this.running.get(correlationKey);
            if (isUndefined(running)) return;
            this.running.delete(correlationKey);
            const result = defaults.resultOf(data);
            running.soon.resolve(result);
        };

        fetch(input: Input) {
            const key = defaults.makeKey();
            const message = defaults.makeRequest(key, input);
            const since = toTimestamp();
            const soon = toDeferredOf<Output>();
            const running: Running<Key, Output> = { key, since, soon };
            this.running.set(key, running);
            window.postMessage(message);
            return running.soon.once;
        }
    }
}
