import assert = require('assert');
import { UnselectableComponent } from './UnselectableComponent';

const { ccclass, disallowMultiple, executeInEditMode, menu, property } = cc._decorator;

/** Decorator for nested prefabs. */
export const nest = (type: { prototype: cc.Component }) => {
    return (target: any, propertyKey: string) => {
        const internalProperty = `${propertyKey}_prefab`; // Prefixed with a dash.

        // Let cocos handle with the internal property.
        property({
            type: NestedPrefab,
            displayName: propertyKey,
            visible: true,
        })(target, internalProperty, {
            initializer: () => null,
        });

        Object.defineProperty(target, propertyKey, {
            set(value: any): void {
                // No effect.
            },
            get(this: any): any {
                const prefab = this[internalProperty];
                if (prefab === undefined) {
                    return null;
                }
                const view = prefab.getView();
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

@ccclass
@disallowMultiple
@executeInEditMode
@menu('ee/NestedPrefab')
export class NestedPrefab extends cc.Component {
    public static createNode(prefab: cc.Prefab): cc.Node | null {
        const node = new cc.Node();
        const comp = node.addComponent(NestedPrefab);
        comp.prefab = prefab;
        node.name = prefab.name;
        const view = comp.getView();
        if (view === null) {
            return null;
        }
        node.setContentSize(view.getContentSize());
        node.setAnchorPoint(view.getAnchorPoint());
        return node;
    }

    private instantiated: boolean = false;
    private view: cc.Node | null = null;

    @property(cc.Prefab)
    private _prefab: cc.Prefab | null = null;

    @property({ type: cc.Prefab })
    private get prefab(): cc.Prefab | null {
        return this._prefab;
    }

    private set prefab(value: cc.Prefab | null) {
        if (this._prefab !== null) {
            if (this.view === null) {
                if (CC_EDITOR) {
                    throw new Error('Prefab exist but the view is not present.');
                }
            } else {
                this.instantiated = false;
                this.view.destroy();
                this.view = null;
            }
        }
        this._prefab = value;
        if (this._prefab !== null) {
            if (this.instantiateView()) {
                this.instantiated = true;
                this.setupView();
            }
        }
    }

    @property(cc.Boolean)
    private instantiate: boolean = true;

    @property(cc.Boolean)
    private synchronize: boolean = false;

    public onLoad(): void {
        if (!CC_EDITOR && !this.instantiated && this.instantiate) {
            if (this.instantiateView()) {
                this.instantiated = true;
                this.applySync();
            }
        }
    }

    public update(): void {
        if (!CC_EDITOR) {
            if (this.instantiate) {
                assert(this.view !== null, 'View should be present at runtime.');
            }
            return;
        }
        if (this.view !== null) {
            if (!this.view.isValid) {
                // Object is destroyed but remains referenced.
                this.view = null;
            }
        }
        if (this.node.childrenCount > 0 && this.node.children[0] !== this.view) {
            // This node was duplicated.
            this.node.removeAllChildren();
        }
        if (this.prefab !== null && this.view === null) {
            if (this.instantiateView()) {
                this.instantiated = true;
                this.setupView();
            }
        }
        this.applySync();
    }

    /** Creates a view using the current prefab. */
    public createView(): cc.Node {
        assert(this.prefab !== null);
        const view = cc.instantiate(this.prefab!);
        return view;
    }

    public getView(): cc.Node | null {
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
        return this.view;
    }

    public setPrefab(prefab: cc.Prefab): void {
        this.prefab = prefab;
    }

    /** Creates a view from the current prefab and add it to this. */
    private instantiateView(): boolean {
        if (this.view !== null) {
            assert.fail('View already instantiate.');
            return false;
        }
        if (this.prefab === null) {
            assert.fail('Prefab is not exist.');
            return false;
        }
        this.view = this.createView();
        this.node.addChild(this.view);
        return true;
    }

    private setupView(): boolean {
        if (this.view === null) {
            assert.fail('View is not present');
            return false;
        }
        this.freeze(this.view);
        this.view._objFlags |= cc.Object.Flags.DontSave;
        return true;
    }

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

    private applySync(): void {
        const view = this.getView();
        if (view !== null && this.synchronize) {
            this.node.setContentSize(view.getContentSize());
            this.node.setAnchorPoint(view.getAnchorPoint());
        }
    }
}