import { ObserverManager } from './ObserverManager';

type Observer = (delta: number) => void;

export class UpdateManager extends ObserverManager<Observer> {
    private static sharedInstance?: UpdateManager;

    /** Editor only. */
    private timer?: NodeJS.Timer;

    public static getInstance(): UpdateManager {
        return this.sharedInstance || (this.sharedInstance = new this());
    };

    private constructor() {
        super();
        if (CC_EDITOR) {
            let last = Date.now();
            this.timer = setInterval(() => {
                let now = Date.now();
                let delta = now - last;
                last = now;
                this.dispatch(observer => observer(delta / 1000 /* seconds */));
            }, 1 / 24);
        }
    };
};