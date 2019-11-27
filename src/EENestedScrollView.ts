const { ccclass, menu, property } = cc._decorator;

/** Get ancestor nodes that contains cc.ScrollView. */
const getAncestors = (event: cc.Event, sender: cc.ScrollView) => {
    const targets: cc.Node[] = [];
    sender.node._getCapturingTargets(event.type, targets);
    const views: cc.ScrollView[] = [];
    for (let i = 0, n = targets.length; i < n; ++i) {
        const target = targets[i];
        const component = target.getComponent(cc.ScrollView);
        component !== null
            && component.vertical === !sender.vertical
            && component.horizontal === !sender.horizontal
            && views.push(component);
    }
    return views;
};

const findBestScrollView = (event: cc.Event.EventTouch, sender: cc.ScrollView, views: cc.ScrollView[]) => {
    const delta = event.touch.getDelta();
    if (sender.vertical && Math.abs(delta.x) > Math.abs(delta.y)) {
        for (let i = 0, n = views.length; i < n; ++i) {
            const view = views[i];
            if (view.horizontal) {
                return view;
            }
        }
    }
    if (sender.horizontal && Math.abs(delta.x) < Math.abs(delta.y)) {
        for (let i = 0, n = views.length; i < n; ++i) {
            const view = views[i];
            if (view.vertical) {
                return view;
            }
        }
    }
    return sender;
};

interface Extend {
    __bestView: cc.ScrollView | null;
    __touchedViews: cc.ScrollView[];
}

@ccclass
@menu('ee/NestedScrollView')
export class NestedScrollView extends cc.Component {
    public onEnable(): void {
        const scrollView = this.getComponent(cc.ScrollView);
        const listener = this.node._touchListener;
        if (listener !== null && scrollView !== null) {
            this.setupTouchBegan(scrollView, listener);
            this.setupTouchMoved(scrollView, listener);
            this.setupTouchEnded(scrollView, listener);
            this.setupTouchCancelled(scrollView, listener);
        }
    }

    public onDisable(): void {
        // TODO.
    }

    private setupTouchBegan(scrollView: cc.ScrollView, listener: cc.TouchOneByOne): void {
        const self = this;
        listener.onTouchBegan = function (touch: cc.Touch, event: cc.Event.EventTouch): boolean {
            const pos = touch.getLocation();
            const node = this.owner;
            if (node._hitTest(pos, this)) {
                event.type = cc.Node.EventType.TOUCH_START;
                event.touch = touch;
                event.bubbles = true;
                node.dispatchEvent(event);

                // Continue to propagate (was disabled in _stopPropagationIfTargetIsMe).
                // Don't use this: event._propagationStopped = false;
                const touchedViews: cc.ScrollView[] = [];
                const views = getAncestors(event, scrollView);
                for (let i = 0, n = views.length; i < n; ++i) {
                    const view = views[i];
                    if ((view as any)._isBouncing) {
                        /* FIX not to bounce when auto scrolling in: this._getDragDirection(moveOffset); */
                        // Ignore.
                    } else {
                        touchedViews.push(view);
                    }
                }

                const item = (this as unknown as Extend);
                item.__touchedViews = touchedViews;
                item.__bestView = null;

                touchedViews.forEach(view => view.node.dispatchEvent(event));
                return true;
            }
            return false;
        };
    }

    private setupTouchMoved(scrollView: cc.ScrollView, listener: cc.TouchOneByOne): void {
        listener.onTouchMoved = function (touch: cc.Touch, event: cc.Event.EventTouch): void {
            const node = this.owner;
            event.type = cc.Node.EventType.TOUCH_MOVE;
            event.touch = touch;
            event.bubbles = true;

            const item = (this as unknown as Extend);
            const bestView = item.__bestView = item.__bestView ||
                findBestScrollView(event, scrollView, item.__touchedViews);
            bestView.node.dispatchEvent(event);
        };
    }

    private setupTouchEnded(scrollView: cc.ScrollView, listener: cc.TouchOneByOne): void {
        listener.onTouchEnded = function (touch: cc.Touch, event: cc.Event.EventTouch): void {
            // Original lines in CCScrollView.js
            const pos = touch.getLocation();
            const node = this.owner;
            if (node._hitTest(pos, this)) {
                event.type = cc.Node.EventType.TOUCH_END;
            } else {
                event.type = cc.Node.EventType.TOUCH_CANCEL;
            }
            event.touch = touch;
            event.bubbles = true;
            node.dispatchEvent(event);

            // Additional lines.
            const item = (this as unknown as Extend);
            item.__touchedViews.forEach(view => view.node.dispatchEvent(event));
        };
    }

    private setupTouchCancelled(scrollView: cc.ScrollView, listener: cc.TouchOneByOne): void {
        listener.onTouchCancelled = function (touch: cc.Touch, event: cc.Event.EventTouch): void {
            // Original lines in CCScrollView.js
            const node = this.owner;
            event.type = cc.Node.EventType.TOUCH_CANCEL;
            event.touch = touch;
            event.bubbles = true;
            node.dispatchEvent(event);

            // Additional lines.
            const item = (this as unknown as Extend);
            item.__touchedViews.forEach(view => view.node.dispatchEvent(event));
        };
    }
}
