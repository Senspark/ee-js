export interface ObserverManager<T> {
    /** Adds an observer whose the specified key. */
    addObserver(key: string, observer: T): boolean;

    /** Removes an observer whose the specified key. */
    removeObserver(key: string): boolean;

    /** Dispatches an event. */
    dispatch(callback: (observer: T) => Promise<void>): Promise<void>;
}