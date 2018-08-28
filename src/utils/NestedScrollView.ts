const { ccclass, menu, property } = cc._decorator;

/** Get ancestor nodes that contains cc.ScrollView. */
const getAncestors = (event: cc.Event, node: cc.Node) => {
    const targets: cc.Node[] = [];
    node._getCapturingTargets(event.type, targets);
    const views = targets
        .filter(item => item.getComponent(cc.ScrollView) !== null)
        .map(item => item.getComponent(cc.ScrollView));
    return views;
};

const findBestScrollView = (event: cc.Event.EventTouch, target: cc.Node) => {
    const firstView = target.getComponent(cc.ScrollView);
    let bestView = firstView; // Assume the first view is the best.

    if (bestView.horizontal && bestView.vertical) {
        // Already capture both directions.
    } else {
        const delta = event.touch.getDelta();
        // Check all ancestor scroll views.
        const ancestors = getAncestors(event, target)
        if (bestView.vertical && Math.abs(delta.x) > Math.abs(delta.y)) {
            ancestors.some(item => {
                if (item.horizontal) {
                    bestView = item;
                    return true;
                }
                return false;
            });
        }
        if (bestView.horizontal && Math.abs(delta.x) < Math.abs(delta.y)) {
            ancestors.some(item => {
                if (item.vertical) {
                    bestView = item;
                    return true;
                }
                return false;
            });
        }
    }
    return bestView;
};

@ccclass
@menu('ee/NestedScrollView')
export class NestedScrollView extends cc.Component {
    public onEnable(): void {
        const scrollView = this.getComponent(cc.ScrollView);
        const listener = this.node._touchListener;
        if (listener !== null && scrollView !== null) {
            this.setupTouchBegan(listener);
            this.setupTouchMoved(listener);
            this.setupTouchEnded(listener);
            this.setupTouchCancelled(listener);
        }
    };

    public onDisable(): void {
        // TODO.
    };

    private setupTouchBegan(listener: cc.TouchOneByOne): void {
        listener.onTouchBegan = function (touch, event) {
            const pos = touch.getLocation();
            const node = this.owner;
            if (node._hitTest(pos, this)) {
                event.type = cc.Node.EventType.TOUCH_START;
                event.touch = touch;
                event.bubbles = true;
                node.dispatchEvent(event);

                // Continue to propagate (was disabled in _stopPropagationIfTargetIsMe).
                // Don't use this: event._propagationStopped = false;
                const views = getAncestors(event, node);
                views.forEach(view => view.node.dispatchEvent(event));

                // Reset best view.
                (<any>(this)).__bestView = undefined;
                return true;
            }
            return false;
        };
    };

    private setupTouchMoved(listener: cc.TouchOneByOne): void {
        listener.onTouchMoved = function (touch, event) {
            const node = this.owner;
            event.type = cc.Node.EventType.TOUCH_MOVE;
            event.touch = touch;
            event.bubbles = true;

            let bestView: cc.ScrollView = (<any>(this)).__bestView; // Last calculated best view.
            if (bestView === undefined) {
                bestView = (<any>(this)).__bestView = findBestScrollView(event, node);
            }
            bestView.node.dispatchEvent(event);
        };
    };

    private setupTouchEnded(listener: cc.TouchOneByOne): void {
        listener.onTouchEnded = function (touch, event) {
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
            const views = getAncestors(event, node);
            views.forEach(view => view.node.dispatchEvent(event));
        };
    };

    private setupTouchCancelled(listener: cc.TouchOneByOne): void {
        listener.onTouchCancelled = function (touch, event) {
            // Original lines in CCScrollView.js
            const node = this.owner;
            event.type = cc.Node.EventType.TOUCH_CANCEL;
            event.touch = touch;
            event.bubbles = true;
            node.dispatchEvent(event);

            // Additional lines.
            const views = getAncestors(event, node);
            views.forEach(view => view.node.dispatchEvent(event));
        };
    };
};
