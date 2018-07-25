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

let overwriteGetIntersectionList = () => {
    cc.log('overwrite cc.engine.getIntersectionList.');

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
};

let overwriteDumpHierarchy = () => {
    cc.log('overwrite _Scene.dumpHierarchy.');

    enum NodeStates {
        Normal = 0,
        Prefab = 1,
        Prefab_AutoSync = 2,
        Prefab_Missing = 3,
    };

    let getChildren = (node: cc._BaseNode) => {
        if (node.getComponent(UnselectableComponent) !== null) {
            // Ignore this node.
            return undefined;
        }
        let state = NodeStates.Normal;
        if (node._prefab) {
            if (node._prefab.root && node._prefab.root._prefab.sync) {
                state = NodeStates.Prefab_AutoSync;
            } else {
                state = NodeStates.Prefab;
            }
        };
        let children: {}[] = [];
        node._children.map(getChildren).forEach(entry => {
            if (entry !== undefined) {
                children.push(entry);
            }
        });
        return {
            name: node.name,
            id: node.uuid,
            children: children.length > 0 ? children : null,
            state: state,
            isActive: node._activeInHierarchy,
        };
    };

    _Scene.dumpHierarchy = (scene?: cc.Scene, includeScene?: boolean) => {
        scene = scene || cc.director.getScene();
        let nodes = includeScene ? [scene] : scene._children;
        return nodes.map(getChildren);
    };
};

if (CC_EDITOR) {
    // Check if it is already cloned.
    const key = '__ee_js_overwrite_getIntersectionList';
    if ((<Dict>cc.engine.getIntersectionList)[key] === undefined) {
        overwriteGetIntersectionList();
        overwriteDumpHierarchy();
        ((<Dict>cc.engine.getIntersectionList)[key] = 'ok');
    }
}

@ccclass
@disallowMultiple
@menu('ee/UnselectableComponent')
export class UnselectableComponent extends cc.Component {
};