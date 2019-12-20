import assert = require('assert');
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

interface ListenerExtend {
    __bestView: cc.ScrollView | null;
    __touchedViews: cc.ScrollView[];
}

function _stopPropagationIfTargetIsMe(this: cc.ScrollView, event: cc.Event): void {
    if ((this as any)._touchMoved /* Fix nested events cause _cachedArray.length be zero */
        || (event.eventPhase === cc.Event.AT_TARGET && event.target === this.node)) {
        event.stopPropagation();
    }
}

interface ScrollViewExtend {
    __isActiveView?: boolean;
}

function _hasNestedViewGroup(
    this: cc.ScrollView, event: cc.Event.EventTouch, captureListeners: cc.Node[] | undefined): boolean {
    interface TargetExtend {
        __active?: string;
        // __ignored: string[];
    }
    interface EventExtend {
        __initialized?: boolean;
    }
    // Use target to store data.
    const target = event.target as cc.Node;
    const targetExt = target as unknown as TargetExtend;

    // Target + capturedListeners.
    const listeners = [target, ...captureListeners || []];
    const scrollViewListeners: cc.ScrollView[] = [];
    for (const listener of listeners) {
        const view = listener.getComponent(cc.ScrollView);
        if (view !== null) {
            scrollViewListeners.push(view);
        }
    }

    if (event.type === cc.Node.EventType.TOUCH_START) {
        const eventExt = event as unknown as EventExtend;
        if (eventExt.__initialized === undefined) {
            eventExt.__initialized = true;
            targetExt.__active = undefined;
            // targetExt.__ignored = [];
            for (const view of scrollViewListeners) {
                (view as ScrollViewExtend).__isActiveView = undefined;
            }
        }
        // Use this will disable scrolling when bouncing.
        // if (scrollViewListeners.length > 1 && (this as any)._isBouncing && this instanceof cc.PageView) {
        //     // Page view.
        //     targetExt.__ignored.push(this.uuid);
        //     return true;
        // }
        return false;
    }
    if (event.type === cc.Node.EventType.TOUCH_END) {
        // if (targetExt.__ignored.includes(this.uuid)) {
        //     return true;
        // }
        return false;
    }
    if (event.type === cc.Node.EventType.TOUCH_CANCEL) {
        // if (targetExt.__ignored.includes(this.uuid)) {
        //     return true;
        // }
        return false;
    }

    // TOUCH_MOVE events.
    // if (targetExt.__ignored.includes(this.uuid)) {
    //     return true;
    // }

    // Order:
    // target listener[0] listener[1] ...
    if (targetExt.__active !== undefined) {
        return targetExt.__active !== this.uuid;
    }

    const delta = event.touch.getDelta();
    let activeView = scrollViewListeners[0];
    if (Math.abs(delta.x) > Math.abs(delta.y)) {
        // Horizontal.
        for (let i = 0, n = scrollViewListeners.length; i < n; ++i) {
            const view = scrollViewListeners[i];
            if (view.horizontal) {
                activeView = view;
                break;
            }
        }
    } else if (Math.abs(delta.y) > Math.abs(delta.x)) {
        // Vertical.
        for (let i = 0, n = scrollViewListeners.length; i < n; ++i) {
            const view = scrollViewListeners[i];
            if (view.vertical) {
                activeView = view;
                break;
            }
        }
    }
    targetExt.__active = activeView.uuid;
    for (const view of scrollViewListeners) {
        (view as ScrollViewExtend).__isActiveView = targetExt.__active === view.uuid;
    }
    return targetExt.__active !== this.uuid;
}

function getSign(value: number): number {
    return value === 0 ? 0 : value > 0 ? +1 : -1;
}

function _getDragDirection(this: cc.PageView, moveOffset: cc.Vec2): number {
    if (!(this as ScrollViewExtend).__isActiveView) {
        return 0;
    }
    if (this.isAutoScrolling() && (this as any)._isBouncing) {
        const delta = (this as any)._autoScrollTargetDelta;
        if (this.direction === cc.PageView.Direction.Horizontal) {
            return getSign(delta.x);
        }
        if (this.direction === cc.PageView.Direction.Vertical) {
            return getSign(delta.y);
        }
    } else {
        if (this.direction === cc.PageView.Direction.Horizontal) {
            return getSign(moveOffset.x);
        }
        if (this.direction === cc.PageView.Direction.Vertical) {
            return getSign(moveOffset.y);
        }
    }
    return 0;
}

const updatePrototype = () => {
    Object.assign(cc.ScrollView.prototype, {
        _stopPropagationIfTargetIsMe,
        _hasNestedViewGroup,
    });
    Object.assign(cc.PageView.prototype, {
        _getDragDirection,
    });
};

updatePrototype();

@ccclass
@menu('ee/NestedScrollView')
export class NestedScrollView extends cc.Component {
    protected onEnable(): void {
        const scrollView = this.getComponent(cc.ScrollView);
        const listener = this.node._touchListener;
        if (listener !== null && scrollView !== null) {
            // Legacy way.
            // this.setupTouchBegan(scrollView, listener);
            // this.setupTouchMoved(scrollView, listener);
            // this.setupTouchEnded(scrollView, listener);
            // this.setupTouchCancelled(scrollView, listener);
        }
    }

    protected onDisable(): void {
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

                const item = (this as unknown as ListenerExtend);
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

            const item = (this as unknown as ListenerExtend);
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
            const item = (this as unknown as ListenerExtend);
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
            const item = (this as unknown as ListenerExtend);
            item.__touchedViews.forEach(view => view.node.dispatchEvent(event));
        };
    }
}
