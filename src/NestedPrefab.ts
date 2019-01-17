import assert = require('assert');
import { UnselectableComponent } from './UnselectableComponent';

const { ccclass, disallowMultiple, executeInEditMode, menu, property } = cc._decorator;

/** Decorator for nested prefabs. */
export const nest = (type: { prototype: cc.Component } | Array<{ prototype: cc.Component }>) => {
    assert(type !== undefined, 'Type is undefined.');
    if (type instanceof Array) {
        return nestArray(type[0]);
    } else {
        return nestSingle(type);
    }
};

export const nestSingle = (type: { prototype: cc.Component }) => {
    return (target: any, propertyKey: string) => {
        const internalProperty = `${propertyKey}_prefab`; // Prefixed with a dash.

        // Let cocos handle with the internal property.
        property({
            type: NestedPrefab,
            displayName: propertyKey,
            visible: true,
        })(target, internalProperty, {
            /** Default value is null */
            initializer: () => null,
        });

        Object.defineProperty(target, propertyKey, {
            set(value: any): void {
                // No effect.
            },
            get(this: any): any {
                const prefab = this[internalProperty] as NestedPrefab;
                if (prefab === undefined) {
                    return null;
                }
                const view = prefab.view;
                if (view === null) {
                    return null;
                }
                const component = view.getComponent(type);
                assert(component !== null);
                return component;
            },
            configurable: false,
            enumerable: true,
        });
    };
};

export const nestArray = (type: { prototype: cc.Component }) => {
    return (target: any, propertyKey: string) => {
        const internalProperty = `${propertyKey}_prefab`;

        property({
            type: [NestedPrefab],
            displayName: propertyKey,
            visible: true,
        })(target, internalProperty, {
            /** Default value is an empty array. */
            initializer: () => [],
        });

        Object.defineProperty(target, propertyKey, {
            set(value: any): void {
                // No effect.
            },
            get(this: any): any {
                const prefabs = this[internalProperty];
                if (prefabs === undefined) {
                    return null;
                }
                const views = (prefabs as NestedPrefab[]).map(item => item.view);
                const components = views.map(item => item === null ? null : item.getComponent(type));
                return components;
            },
            configurable: false,
            enumerable: true,
        });
    };
};

enum NestMode {
    /** Use nested prefab to instantiate nested view. */
    Prefab,

    /** Use passed node to display nested view. */
    Node,
}

@ccclass
@disallowMultiple
@executeInEditMode
@menu('ee/NestedPrefab')
export class NestedPrefab extends cc.Component {
    /** Creates a node from this component. */
    public static createNode(prefab: cc.Prefab): cc.Node | null {
        const node = new cc.Node();
        const comp = node.addComponent(NestedPrefab);
        comp.prefab = prefab;
        node.name = prefab.name;
        const view = comp.view;
        if (view === null) {
            return null;
        }
        node.setContentSize(view.getContentSize());
        node.setAnchorPoint(view.getAnchorPoint());
        return node;
    }

    /** Current nest mode. */
    private mode = NestMode.Prefab;

    /** Whether the nested view is instantiated by the nested prefab. */
    private instantiated: boolean = false;

    /** The nested view (usually a child of this node). */
    private _view: cc.Node | null = null;

    /** Gets or sets the nested view. */
    public get view(): cc.Node | null {
        if (this.mode === NestMode.Prefab) {
            if (!this.instantiate) {
                return null;
            }
            if (this.prefab === null) {
                return null;
            }
            if (!this.instantiated) {
                if (this.instantiateView()) {
                    this.instantiated = true;
                    this.applySync();
                    if (CC_EDITOR) {
                        this.setupView();
                    }
                }
            }
        }
        return this._view;
    }

    public set view(value: cc.Node | null) {
        this.destroyView();
        this._view = value;
        if (this._view !== null) {
            // Switch mode.
            this.mode = NestMode.Node;
            this._prefab = null;
            if (this._view.parent !== null) {
                throw new Error('View is already in scene.');
            }
            this._view.parent = this.node;
        }
    }

    /** The nested prefab. */
    @property(cc.Prefab)
    private _prefab: cc.Prefab | null = null;

    /** Gets or sets the nested prefab. */
    @property({ type: cc.Prefab })
    public get prefab(): cc.Prefab | null {
        return this._prefab;
    }

    public set prefab(value: cc.Prefab | null) {
        this.destroyView();
        this._prefab = value;
        if (this._prefab !== null) {
            // Switch mode.
            this.mode = NestMode.Prefab;
            if (this.instantiateView()) {
                this.instantiated = true;
                this.setupView();
            }
        }
    }

    /** Whether to instantiate the nested view using the nested prefab. */
    @property(cc.Boolean)
    private instantiate: boolean = true;

    /** Whether to synchronize the component size and anchor with the nested view's. */
    @property(cc.Boolean)
    private synchronize: boolean = false;

    public onLoad(): void {
        if (!CC_EDITOR && !this.instantiated && this.instantiate && this.mode === NestMode.Prefab) {
            if (this.instantiateView()) {
                this.instantiated = true;
                this.applySync();
            }
        }
    }

    public update(): void {
        if (!CC_EDITOR) {
            if (this.instantiate && this.mode === NestMode.Prefab) {
                assert(this._view !== null, 'View should be present at runtime.');
            }
            return;
        }
        if (this._view !== null) {
            if (!this._view.isValid) {
                // Object is destroyed but remains referenced.
                this._view = null;
            }
        }
        if (this.node.childrenCount > 0 && this.node.children[0] !== this._view) {
            // This node was duplicated.
            this.node.removeAllChildren();
        }
        if (this.prefab !== null && this._view === null) {
            if (this.instantiateView()) {
                this.instantiated = true;
                this.setupView();
            }
        }
        this.applySync();
    }

    /** Creates a view using the current prefab. */
    public createView(): cc.Node | null {
        if (this.prefab === null) {
            return null;
        }
        const view = cc.instantiate(this.prefab);
        return view;
    }

    /** Destroys existing view. */
    private destroyView(): void {
        if (this.mode === NestMode.Prefab) {
            if (this._prefab !== null) {
                if (this._view === null) {
                    if (CC_EDITOR) {
                        // The nested view should be always present in editor.
                        throw new Error('Prefab exist but the view is not present.');
                    } else {
                        if (this.instantiate && this._isOnLoadCalled) {
                            // The nested view should be instantiated when onLoad is called.
                            throw new Error('Prefab exist but the view is not present');
                        }
                    }
                } else {
                    this.instantiated = false;
                    this._view.removeFromParent(true);
                    this._view.destroy();
                    this._view = null;
                }
            }
        }
        if (this.mode === NestMode.Node) {
            if (this._view !== null) {
                this._view.removeFromParent(true);
                this._view.destroy();
                this._view = null;
            }
        }
    }

    /** Creates a view from the current prefab and add it to this. */
    private instantiateView(): boolean {
        if (this._view !== null) {
            assert.fail('View already instantiate.');
            return false;
        }
        if (this.prefab === null) {
            assert.fail('Prefab is not exist.');
            return false;
        }
        this._view = this.createView();
        this._view && this.node.addChild(this._view);
        return true;
    }

    private setupView(): boolean {
        if (this._view === null) {
            assert.fail('View is not present');
            return false;
        }
        this.freeze(this._view);
        this._view._objFlags |= cc.Object.Flags.DontSave;
        return true;
    }

    /** Disables editing the nested view in editor. */
    private freeze(node: cc.Node): void {
        if (node.getComponent(UnselectableComponent) === null) {
            node.addComponent(UnselectableComponent);
        }
        const prefab = node.getComponent(NestedPrefab);
        if (prefab !== null) {
            if (!prefab.instantiate) {
                node.active = false;
            }
        }
        node.children.forEach(child => this.freeze(child));
    }

    /** Synchronizes this node's size and anchor with the nested view's. */
    public applySync(): void {
        const view = this.view;
        if (view !== null && this.synchronize) {
            this.node.setContentSize(view.getContentSize());
            this.node.setAnchorPoint(view.getAnchorPoint());
        }
    }
}