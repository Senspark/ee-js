import assert = require('assert');

import { UnselectableComponent } from './UnselectableComponent';
import { NestedPrefab } from './NestedPrefab';
import { ProfileManager } from './ProfileManager';

type Dict = { [key: string]: any };

const setting_key = 'use_nested_prefab';

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
        let profile = ProfileManager.getInstance();
        if (!profile.loadData(setting_key)) {
            return original(rect, t);
        }
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

    let original = <typeof oldFunction>cloneFunction(oldFunction);

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
        let profile = ProfileManager.getInstance();
        if (!profile.loadData(setting_key)) {
            return original(scene, includeScene);
        }
        scene = scene || cc.director.getScene();
        let nodes = includeScene ? [scene] : scene._children;
        return nodes.map(getChildren);
    });
};

let overwriteCreateNodeFromAsset = (oldFunction: typeof _Scene.createNodeFromAsset) => {
    cc.log('overwrite _Scene.createNodeFromAsset.');

    let original = cloneFunction(oldFunction);
    return <typeof oldFunction>((uuid: string, callback: any) => {
        let profile = ProfileManager.getInstance();
        if (!profile.loadData('use_nested_prefab')) {
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

let overwriteGizmoRegisterEvent = (oldFunction: typeof Editor.Gizmo.prototype._registerEvent) => {
    cc.log('overwrite Editor.Gizmo._registerEvent');

    return function (this: Editor.Gizmo) {
        let node = <SVGPolygonElement>(this._root.node);
        let isIgnore = () => {
            let profile = ProfileManager.getInstance();
            if (!profile.loadData(setting_key)) {
                return false;
            }
            assert(this.node !== null);
            let comp = this.node!.getComponent(UnselectableComponent);
            return comp !== null && comp.enabled;
        };
        node.addEventListener("mousedown", (event: MouseEvent) => {
            if (isIgnore()) {
                return;
            }
            let uuid = this.nodes.map(node => node.uuid);
            Editor.Selection.select("node", uuid)
        }, true);
        node.addEventListener("mouseover", (event: MouseEvent) => {
            if (isIgnore()) {
                return;
            }
            Editor.Selection.hover("node", this.node!.uuid);
        }, true);
        node.addEventListener("mouseleave", (event: Event) => {
            if (isIgnore()) {
                return;
            }
            Editor.Selection.hover("node", null);
        }, true);
        node.addEventListener("mousemove", (event: MouseEvent) => {
            if (isIgnore()) {
                return;
            }
            let element = <SVGPolygonElement>event.srcElement;
            (<any>element).instance.ignoreMouseMove || event.stopPropagation();
        }, false)
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
}
