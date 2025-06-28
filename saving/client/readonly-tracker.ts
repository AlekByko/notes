export interface ReadOnlyTracker<Config, Key> {
    atOr<Or>(key: Key, or: Or): Config | Or;
}
