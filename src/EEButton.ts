const { ccclass, disallowMultiple, menu, property, requireComponent } = cc._decorator;

const modifyButton = () => {
    const proto = cc.Button.prototype;
    if ((proto as any).__ee_modified) {
        return;
    }
    (proto as any).__ee_modified = true;
    // tslint:disable-next-line: only-arrow-functions
    (proto as any)._onTouchEnded = function (this: cc.Button, event: cc.Event): void {
        if (!this.interactable || !this.enabledInHierarchy) {
            return;
        }
        if ((this as any)._pressed) {
            if ((this as any).__ee_waitForTransition) {
                (this as any).__ee_schedule_click = true;
            } else {
                cc.Component.EventHandler.emitEvents(this.clickEvents, event);
                this.node.emit('click', this);
            }
        }
        (this as any)._pressed = false;
        (this as any)._updateState();
        event.stopPropagation();
    };
    const _update = (proto as any).update;
    (proto as any).update = function (this: cc.Button, delta: number): void {
        _update.call(this, delta);
        if ((this as any)._transitionFinished && (this as any).__ee_schedule_click) {
            (this as any).__ee_schedule_click = false;
            cc.Component.EventHandler.emitEvents(this.clickEvents);
            this.node.emit('click', this);
        }
    };
};

modifyButton();

@ccclass
@disallowMultiple
@requireComponent(cc.Button)
@menu('ee/Button')
export class Button extends cc.Component {
    @property({ visible: true })
    private _waitForTransition = false;

    public get waitForTransition(): boolean {
        return this._waitForTransition;
    }

    public set waitForTransition(value: boolean) {
        if (this._waitForTransition !== value) {
            this._waitForTransition = value;
            this.updateButton();
        }
    }

    protected onLoad(): void {
        this.updateButton();
    }

    private updateButton(): void {
        (this.getComponent(cc.Button) as any).__ee_waitForTransition = this.waitForTransition;
    }
}