const { ccclass, disallowMultiple, property } = cc._decorator;

type ConditionCallback = (listener: cc.TouchOneByOne, touch: cc.Touch) => boolean;

@ccclass
@disallowMultiple
export class ConditionTouchListener extends cc.Component {
    private conditionCallback: ConditionCallback;

    public constructor() {
        super();

        // Default behavior.
        this.conditionCallback = (listener: cc.TouchOneByOne, touch: cc.Touch) => {
            const position = touch.getLocation();
            const node = listener.owner;
            return node._hitTest(position, listener);
        };
    }

    private updateTouchBegan(): void {
        const listener = this.node._touchListener;
        if (listener !== null) {
            this.modifyTouchBegan(listener);
        }
    }

    private modifyTouchBegan(listener: cc.TouchOneByOne): void {
        const callback = this.conditionCallback;
        listener.onTouchBegan = function (touch: cc.Touch, event: cc.Event.EventTouch): boolean {
            if (callback(this, touch)) {
                event.type = cc.Node.EventType.TOUCH_START;
                event.touch = touch;
                event.bubbles = true;
                this.owner.dispatchEvent(event);
                return true;
            }
            return false;
        };
    }

    public update(delta: number): void {
        this.updateTouchBegan();
    }

    /** Sets the condition callback used in touch start event. */
    public setConditionCallback(callback: ConditionCallback): this {
        this.conditionCallback = callback;
        this.updateTouchBegan();
        return this;
    }
}