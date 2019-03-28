import { ObserverManager } from './EEObserverManager';

type Observer = (delta: number) => void;

export class UpdateManager extends ObserverManager<Observer> {
    private static sharedInstance?: UpdateManager;

    public static getInstance(): UpdateManager {
        return this.sharedInstance || (this.sharedInstance = new this());
    }

    /** Editor only. */
    private timer?: NodeJS.Timer;

    private constructor() {
        super();
        if (CC_EDITOR) {
            let last = Date.now();
            this.timer = setInterval(() => {
                const now = Date.now();
                const delta = now - last;
                last = now;
                this.dispatch(observer => observer(delta / 1000 /* seconds */));
            }, 1 / 24);
        }
    }
}