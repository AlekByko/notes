type Exec = Use<string>;
export class ExecRegistry {
    private _all = [] as Exec[]
    add(exec: Exec) {
        this._all.push(exec);
    }
    remove(exec: Function) {
        const index = this._all.findIndex(x => x === exec);
        if (index < 0) return;
        this._all.splice(index, 1);
    }
    forEach(exec: (exec: Exec) => void) {
        this._all.forEach(exec);
    }
}
