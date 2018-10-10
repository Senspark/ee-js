import assert = require('assert');

import { NestedPrefab } from './NestedPrefab';
import { ProfileManager } from './ProfileManager';
import { UnselectableComponent } from './UnselectableComponent';

interface Dict {
    [key: string]: any;
}

const settingKey = 'use_nested_prefab';

// tslint:disable-next-line:ban-types
const cloneFunction = <T extends Function>(f: T) => {
    const result = function (this: any): any {
        return f.apply(this, arguments);
    };
    for (const key in f) {
        if (f.hasOwnProperty(key)) {
            (result as Dict)[key] = (f as Dict)[key];
        }
    }
    return result as any as T;
};

const overwriteGetIntersectionList = (oldFunction: typeof cc.engine.getIntersectionList) => {
    cc.log('overwrite cc.engine.getIntersectionList.');

    // Clone the original getIntersectionList function.
    const original = cloneFunction(oldFunction).bind(cc.engine) as typeof oldFunction;

    // Overwrite the getIntersectionList function.
    return (rect: cc.Rect, t?: boolean) => {
        const profile = ProfileManager.getInstance();
        if (!profile.loadData(settingKey)) {
            return original(rect, t);
        }
        return original(rect, t).filter(entry => {
            const node = entry.node;
            assert(node !== null);
            const comp = node.getComponent(UnselectableComponent);
            if (comp !== null && comp.enabled) {
                // Ignore this node.
                return false;
            }
            return true;
        });
    };
};

/** Version < 2 */
const overwriteDumpHierarchy = (oldFunction: typeof _Scene.dumpHierarchy) => {
    cc.log('overwrite _Scene.dumpHierarchy.');

    const original = cloneFunction(oldFunction) as typeof oldFunction;

    enum NodeStates {
        Normal = 0,
        Prefab = 1,
        Prefab_AutoSync = 2,
        Prefab_Missing = 3,
    }

    const getChildren = (node: cc._BaseNode) => {
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
        }
        const children: Array<{}> = [];
        node._children.map(getChildren).forEach(entry => {
            if (entry !== undefined) {
                children.push(entry);
            }
        });
        return {
            name: node.name,
            id: node.uuid,
            children: children.length > 0 ? children : null,
            state,
            isActive: node._activeInHierarchy,
        };
    };

    return ((scene?: cc.Scene, includeScene?: boolean) => {
        const profile = ProfileManager.getInstance();
        if (!profile.loadData(settingKey)) {
            return original(scene, includeScene);
        }
        scene = scene || cc.director.getScene();
        const nodes = includeScene ? [scene as cc._BaseNode] : scene._children;
        return nodes.map(getChildren);
    }) as typeof oldFunction;
};

/** Version < 2 */
const overwriteCreateNodeFromAsset = (oldFunction: typeof _Scene.createNodeFromAsset) => {
    cc.log('overwrite _Scene.createNodeFromAsset.');

    const original = cloneFunction(oldFunction);
    return ((uuid: string, callback: any) => {
        const profile = ProfileManager.getInstance();
        if (!profile.loadData('use_nested_prefab')) {
            original(uuid, callback);
            return;
        }
        cc.AssetLibrary.queryAssetInfo(uuid, (err0, url, raw, ctor) => {
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
    }) as typeof oldFunction;
};

const overwriteGizmoRegisterEvent = (oldFunction: typeof Editor.Gizmo.prototype._registerEvent) => {
    cc.log('overwrite Editor.Gizmo._registerEvent');

    return function (this: Editor.Gizmo): void {
        const node = this._root.node as SVGPolygonElement;
        const isIgnore = () => {
            const profile = ProfileManager.getInstance();
            if (!profile.loadData(settingKey)) {
                return false;
            }
            assert(this.node !== null);
            const comp = this.node!.getComponent(UnselectableComponent);
            return comp !== null && comp.enabled;
        };
        node.addEventListener("mousedown", (event: MouseEvent) => {
            if (isIgnore()) {
                return;
            }
            const uuid = this.nodes.map(item => item.uuid);
            Editor.Selection.select("node", uuid);
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
            const element = event.srcElement as SVGPolygonElement;
            (element as any).instance.ignoreMouseMove || event.stopPropagation();
        }, false);
    };
};

const overwriteFunction = (oldFunction: any, callback: any) => {
    const key = '__ee_js_overwrite';
    let originalFunction = oldFunction;
    if (oldFunction[key] !== undefined) {
        originalFunction = oldFunction[key];
    }
    const newFunction = callback(originalFunction);
    newFunction[key] = originalFunction;
    return newFunction;
};

// Version >= 2
// app.asar/editor/page/scene-utils/dump/hierarchy.js
const dumpHierarchy = (scene?: cc.Scene, includeScene?: boolean) => {
    enum NodeStates {
        Normal = 0,
        Prefab = 1,
        Prefab_AutoSync = 2,
        Prefab_Missing = 3,
    }

    const getChildren = (node: cc._BaseNode, filter: boolean) => {
        if (filter && node.getComponent(UnselectableComponent) !== null) {
            // Ignore this node.
            return undefined;
        }
        let state = NodeStates.Normal;
        if (node._prefab) {
            if (node._prefab.root) {
                if (node._prefab.root._prefab.asset) {
                    if (node._prefab.root._prefab.sync) {
                        state = NodeStates.Prefab_AutoSync;
                    } else {
                        state = NodeStates.Prefab;
                    }
                } else {
                    state = NodeStates.Prefab_Missing;
                }
            } else {
                state = NodeStates.Prefab;
            }
        }
        const children: Array<{}> = [];
        node._children.map(item => getChildren(item, filter)).forEach(entry => {
            if (entry !== undefined) {
                children.push(entry);
            }
        });
        return {
            name: node.name,
            id: node.uuid,
            children: children.length > 0 ? children : null,
            prefabState: state,
            locked: !!(node._objFlags & cc.Object.Flags.LockedInEditor),
            isActive: node._activeInHierarchy,
            hidden: node instanceof cc.PrivateNode,
        };
    };

    const profile = ProfileManager.getInstance();
    scene = scene || cc.director.getScene();
    const nodes = includeScene ? [scene as cc._BaseNode] : scene._children;
    return nodes.map(node => getChildren(node, profile.loadData(settingKey)));
};

if (CC_EDITOR) {
    cc.engine.getIntersectionList = overwriteFunction(cc.engine.getIntersectionList, overwriteGetIntersectionList);
    if (cc.ENGINE_VERSION >= '2') {
        const panels = Editor.UI.PolymerUtils.panels;

        // app.asar/editor/builtin/scene/panel/scene.js
        const scene = panels['scene'];

        // app.asar/editor/builtin/scene/panel/messages/*.js
        const messages = scene.prototype.messages;
        messages['scene:query-hierarchy'] = (event: any) => {
            if (!cc.engine.isInitialized) {
                event.reply(null, '', []);
                return;
            }
            const nodes = dumpHierarchy();
            const uuid = _Scene.currentScene().uuid;
            event.reply(null, uuid, nodes);
        };

        // TODO: createNodeFromAsset for version >= 2.
    } else {
        _Scene.dumpHierarchy = overwriteFunction(_Scene.dumpHierarchy, overwriteDumpHierarchy);
        _Scene.createNodeFromAsset = overwriteFunction(_Scene.createNodeFromAsset, overwriteCreateNodeFromAsset);
    }
    Editor.Gizmo.prototype._registerEvent = overwriteFunction(Editor.Gizmo.prototype._registerEvent,
        overwriteGizmoRegisterEvent);
}
