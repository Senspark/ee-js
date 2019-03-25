export class AsyncManager {
    private static sharedInstance?: AsyncManager;

    /** Gets the singleton. */
    public static getInstance(): AsyncManager {
        return this.sharedInstance || (this.sharedInstance = new this());
    }

    private callbacks: Array<() => Promise<void>>;

    private constructor() {
        this.callbacks = [];
    }

    public isEmpty(): boolean {
        return this.callbacks.length === 0;
    }

    /** Adds an async callback. */
    public add(callback: () => Promise<void>): void {
        this.callbacks.push(callback);
    }

    /** Flush the oldest callback. */
    public async flush(): Promise<void> {
        const callback = this.callbacks.shift();
        callback && await callback();
    }
}