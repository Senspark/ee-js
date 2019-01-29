const { ccclass, disallowMultiple, property } = cc._decorator;

type BackButtonCallback = (sender: BackButtonListener) => void;

@ccclass
@disallowMultiple
export class BackButtonListener extends cc.Component {
    private callback?: BackButtonCallback;

    public constructor() {
        super();
    }

    protected onLoad(): void {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    public setCallback(callback: BackButtonCallback): this {
        this.callback = callback;
        return this;
    }

    private onKeyUp(event: cc.Event.EventKeyboard): void {
        if (event.keyCode === cc.macro.KEY.back) {
            if (this.node.active) {
                event.stopPropagation();
                this.callback && this.callback(this);
            }
        }
    }
}