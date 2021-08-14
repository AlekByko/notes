export type Either<L, R> = Left<L> | Right<R>;

export interface Left<T> {
    isRight: false;
    isLeft: true;
    left: T;
}

export function leftFrom<T>(left: T): Left<T> {
    return { isRight: false, isLeft: true, left };
}

export interface Right<T> {
    isRight: true;
    isLeft: false;
    right: T;
}

export function rightFrom<T>(right: T): Right<T> {
    return { isRight: true, isLeft: false, right };
}
