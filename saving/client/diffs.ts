export type HomoDiff<T> = Diff<T, T>;
export interface Diff<Exit, Enter> {
    exited: Exit;
    entered: Enter;
}

export function diffFrom<Exit, Enter>(exited: Exit, entered: Enter): Diff<Exit, Enter> {
    return { exited, entered };
}
