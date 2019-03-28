const { ccclass, disallowMultiple, property } = cc._decorator;

type BackButtonCallback = (sender: BackButtonListener) => void;

/** Manages all back button listeners. */
class Manager {
    private static sharedInstance?: Manager;

    /** Gets the singleton. */
    public static getInstance(): Manager {
        return this.sharedInstance || (this.sharedInstance = new this());
    }

    private listeners: Array<() => boolean> = [];

    public constructor() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    public push(callback: () => boolean): this {
        this.listeners.push(callback);
        return this;
    }

    public pop(): this {
        this.listeners.pop();
        return this;
    }

    private onKeyUp(event: cc.Event.EventKeyboard): void {
        if (event.keyCode === cc.macro.KEY.back) {
            for (let i = this.listeners.length - 1; i >= 0; --i) {
                const listener = this.listeners[i];
                if (listener()) {
                    break;
                }
            }
        }
    }
}

@ccclass
@disallowMultiple
export class BackButtonListener extends cc.Component {
    private callback?: BackButtonCallback;

    public constructor() {
        super();
    }

    protected onEnable(): void {
        Manager.getInstance().push(() => {
            if (this.node.active) {
                this.callback && this.callback(this);
                return true;
            }
            return false;
        });
    }

    protected onDisable(): void {
        Manager.getInstance().pop();
    }

    /** Sets the back button callback. */
    public setCallback(callback: BackButtonCallback): this {
        this.callback = callback;
        return this;
    }
}