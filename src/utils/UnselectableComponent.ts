import assert = require('assert');

const { ccclass, disallowMultiple, menu } = cc._decorator;

type Dict = { [key: string]: any };

let cloneFunction = <T extends Function>(f: T) => {
    let result = function (this: any) {
        return f.apply(this, arguments);
    };
    for (let key in f) {
        if (f.hasOwnProperty(key)) {
            (<Dict>result)[key] = (<Dict>f)[key];
        }
    }
    return <T><any>result;
};

let applyUnselectableComponent = () => {
    cc.log('Apply unselectable component.');

    // Clone the original getIntersectionList function.
    let f = cc.engine.getIntersectionList;
    let original = <typeof f>cloneFunction(f).bind(cc.engine);

    // Overwrite the getIntersectionList function.
    cc.engine.getIntersectionList = (rect: cc.Rect, t?: boolean) => {
        return original(rect, t).filter(entry => {
            let node = entry.node;
            assert(node !== null);
            let comp = node.getComponent(UnselectableComponent);
            if (comp !== null && comp.enabled) {
                // Ignore this node.
                // Also disable polygon collider.
                let collider = node.getComponent(cc.PolygonCollider);
                if (collider !== null && collider.gizmo !== undefined) {
                    collider.gizmo._root.dragArea.node.style.pointerEvents = 'none';
                }
                return false;
            }
            // Reenable polygon collider
            let collider = node.getComponent(cc.PolygonCollider);
            if (collider !== null && collider.gizmo !== undefined) {
                collider.gizmo._root.dragArea.node.style.pointerEvents = 'fill';
            }
            return true;
        });
    };
}

if (CC_EDITOR) {
    // Check if it is already cloned.
    const key = '__ee_js_overwrite_getIntersectionList';
    if ((<Dict>cc.engine.getIntersectionList)[key] === undefined) {
        applyUnselectableComponent();
        ((<Dict>cc.engine.getIntersectionList)[key] = 'ok');
    }
}

@ccclass
@disallowMultiple
@menu('ee/UnselectableComponent')
export class UnselectableComponent extends cc.Component {
};