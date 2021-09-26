import { wait } from './promises';

export async function willBeLooping<State, Ticket>(
    state: State,
    tickets: Ticket[],
    decided: { isRunning: boolean; },
    seeIfDue: (state: State, ticket: Ticket) => boolean,
): Promise<void> {
    while (decided.isRunning) {
        if (tickets.length < 1) {
            await wait(0);
            continue;
        }

        for (let index = 0; index < tickets.length; index++) {
            const ticket = tickets[index];
            const isDue = seeIfDue(state, ticket);
            if (!isDue) continue;
            tickets.splice(index, 1);
            break;
        }

    }
}
