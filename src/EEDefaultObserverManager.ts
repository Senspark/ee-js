import { ObserverManager } from "./EEObserverManager";

export class DefaultObserverManager<T> implements ObserverManager<T> {
    /** Observes language changing events. */
    private observers: { [index: string]: T | undefined };

    public constructor() {
        this.observers = {};
    }

    /** Adds an observer whose the specified key. */
    public addObserver(key: string, observer: T): boolean {
        if (this.observers[key] !== undefined) {
            return false;
        }
        this.observers[key] = observer;
        return true;
    }

    /** Removes an observer whose the specified key. */
    public removeObserver(key: string): boolean {
        if (this.observers[key] === undefined) {
            return false;
        }
        delete this.observers[key];
        return true;
    }

    public async dispatch(callback: (observer: T) => Promise<void>): Promise<void> {
        await Promise.all(Object.keys(this.observers).map(async key => {
            const observer = this.observers[key];
            observer && await callback(observer);
        }));
    }
}