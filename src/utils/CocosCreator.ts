import assert = require('assert');

import { UnselectableComponent } from './UnselectableComponent';
import { NestedPrefab } from './NestedPrefab';

type Dict = { [key: string]: any };

let globalProfile: Profile | undefined;

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

let overwriteGetIntersectionList = (oldFunction: typeof cc.engine.getIntersectionList) => {
    cc.log('overwrite cc.engine.getIntersectionList.');

    // Clone the original getIntersectionList function.
    let original = <typeof oldFunction>cloneFunction(oldFunction).bind(cc.engine);

    // Overwrite the getIntersectionList function.
    return (rect: cc.Rect, t?: boolean) => {
        return original(rect, t).filter(entry => {
            let node = entry.node;
            assert(node !== null);
            let comp = node.getComponent(UnselectableComponent);
            if (comp !== null && comp.enabled) {
                // Ignore this node.
                return false;
            }
            return true;
        });
    };
};

let overwriteDumpHierarchy = (oldFunction: typeof _Scene.dumpHierarchy) => {
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

    return <typeof oldFunction>((scene?: cc.Scene, includeScene?: boolean) => {
        scene = scene || cc.director.getScene();
        let nodes = includeScene ? [scene] : scene._children;
        return nodes.map(getChildren);
    });
};

let overwriteCreateNodeFromAsset = (oldFunction: typeof _Scene.createNodeFromAsset) => {
    cc.log('overwrite _Scene.createNodeFromAsset.');

    let original = cloneFunction(oldFunction);
    return <typeof oldFunction>((uuid: string, callback: any) => {
        if (globalProfile !== undefined && !globalProfile.data['use_nested_prefab']) {
            original(uuid, callback);
            return;
        }
        cc.AssetLibrary.queryAssetInfo(uuid, (error, url, raw, ctor) => {
            if (ctor === cc.Prefab) {
                cc.AssetLibrary.loadAsset(uuid, (error, result) => {
                    if (error) {
                        callback(error);
                        return;
                    }
                    if (result instanceof cc.Prefab) {
                        const defaultPrefabs = [
                            'sprite',
                            'sprite_splash',
                            'label',
                            'richtext',
                            'particlesystem',
                            'tiledmap',
                            'canvas',
                            'button',
                            'pageview',
                            'progressBar',
                            'editbox',
                            'slider',
                            'toggle',
                            'toggleContainer',
                            'videoplayer',
                            'webview',
                        ];
                        if (defaultPrefabs.indexOf(result.name) === -1) {
                            callback(null, NestedPrefab.createNode(result));
                        } else {
                            original(uuid, callback);
                        }
                    } else {
                        callback(new Error(`Expected asset type cc.Prefab but found ${cc.js.getClassName(result)}`));
                    }
                });
            } else {
                original(uuid, callback);
            }
        });
    });
};

let overwriteGizmoRegisterEvent = (oldFunction: any) => {
    cc.log('overwrite Editor.Gizmo._registerEvent');

    return function (this: Editor.Gizmo) {
        let node = this._root.node;
        let isIgnore = () => {
            assert(this.node !== null);
            let comp = this.node!.getComponent(UnselectableComponent);
            return comp !== null && comp.enabled;
        };
        node.addEventListener("mousedown", () => {
            if (!isIgnore()) {
                let uuid = this.nodes.map(node => node.uuid);
                Editor.Selection.select("node", uuid)
            }
        }, true);
        node.addEventListener("mouseover", () => {
            if (!isIgnore()) {
                Editor.Selection.hover("node", this.node!.uuid)
            }
        }, true);
        node.addEventListener("mouseleave", () => {
            if (!isIgnore()) {
                Editor.Selection.hover("node", null)
            }
        }, true);
        node.addEventListener("mousemove", (event: any) => {
            if (!isIgnore()) {
                event.srcElement.instance.ignoreMouseMove || event.stopPropagation()
            }
        })
    };
};

let overwriteFunction = (oldFunction: any, callback: any) => {
    const key = '__ee_js_overwrite';
    let originalFunction = oldFunction;
    if (oldFunction[key] !== undefined) {
        originalFunction = oldFunction[key];
    }
    let newFunction = callback(originalFunction);
    newFunction[key] = originalFunction;
    return newFunction;
};

if (CC_EDITOR) {
    cc.engine.getIntersectionList = overwriteFunction(cc.engine.getIntersectionList, overwriteGetIntersectionList);
    _Scene.dumpHierarchy = overwriteFunction(_Scene.dumpHierarchy, overwriteDumpHierarchy);
    _Scene.createNodeFromAsset = overwriteFunction(_Scene.createNodeFromAsset, overwriteCreateNodeFromAsset);
    Editor.Gizmo.prototype._registerEvent = overwriteFunction(Editor.Gizmo.prototype._registerEvent, overwriteGizmoRegisterEvent);

    Editor.Profile.load('profile://project/ee.json', (err, profile) => {
        if (profile !== null) {
            globalProfile = profile;
        }
    });
}
