import { sleep } from "./EEUtils";

export class AsyncManager {
    private static stack: AsyncManager[] = [];

    /** Gets the current instance. */
    public static getInstance(): AsyncManager {
        const length = this.stack.length;
        if (length === 0) {
            return new this();
        }
        return this.stack[length - 1];
    }

    private callbacks: Array<() => Promise<void>>;

    /**
     * Creates a new instance of async manager.
     * This instance will be the current singleton instance.
     */
    public constructor() {
        this.callbacks = [];
        AsyncManager.stack.push(this);
    }

    /** Destroys this instance. */
    public destroy(): void {
        AsyncManager.stack.pop();
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
        const callback = this.callbacks.pop();
        callback && await callback();
    }

    public async flushAll(delay: number = 0): Promise<void> {
        while (!this.isEmpty()) {
            await this.flush();
            delay && await sleep(delay);
        }
    }
}