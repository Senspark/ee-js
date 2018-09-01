import assert = require('assert');
import { UnselectableComponent } from './UnselectableComponent';

const { ccclass, disallowMultiple, executeInEditMode, menu, property } = cc._decorator;

@ccclass
@disallowMultiple
@executeInEditMode
@menu('ee/NestedPrefab')
export class NestedPrefab extends cc.Component {
    private instantiated: boolean = false;
    private view?: cc.Node;

    @property(cc.Prefab)
    private _prefab?: cc.Prefab = undefined;

    @property({ type: cc.Prefab })
    private get prefab() {
        return this._prefab;
    };

    @property(cc.Boolean)
    private instantiate: boolean = true;

    @property(cc.Boolean)
    private synchronize: boolean = true;

    private set prefab(value) {
        if (this._prefab !== undefined) {
            if (this.view === undefined) {
                if (CC_EDITOR) {
                    throw new Error('Prefab exist but the view is not present.');
                }
            } else {
                this.instantiated = false;
                this.view.destroy();
                this.view = undefined;
            }
        }
        this._prefab = value;
        if (this._prefab === null) {
            // Change null to undefined.
            this._prefab = undefined;
        }
        if (this._prefab !== undefined) {
            if (this.instantiateView()) {
                this.instantiated = true;
                this.setupView();
            }
        }
    };

    public static createNode(prefab: cc.Prefab): cc.Node | undefined {
        const node = new cc.Node();
        const comp = node.addComponent(NestedPrefab);
        comp.prefab = prefab;
        node.name = prefab.name;
        const view = comp.getView();
        if (view === undefined) {
            return undefined;
        }
        node.setContentSize(view.getContentSize());
        node.setAnchorPoint(view.getAnchorPoint());
        return node;
    };

    public onLoad(): void {
        if (!CC_EDITOR && !this.instantiated && this.instantiate) {
            if (this.instantiateView()) {
                this.instantiated = true;
                this.applySync();
            }
        }
    };

    public update(): void {
        if (!CC_EDITOR) {
            if (this.instantiate) {
                assert(this.view !== undefined, 'View should be present at runtime.');
            }
            return;
        }
        if (this.view !== undefined) {
            if (!this.view.isValid) {
                // Object is destroyed but remains referenced.
                this.view = undefined;
            }
        }
        if (this.node.childrenCount > 0 && this.node.children[0] !== this.view) {
            // This node was duplicated.
            this.node.removeAllChildren();
        }
        if (this.prefab !== undefined && this.view === undefined) {
            if (this.instantiateView()) {
                this.instantiated = true;
                this.setupView();
            }
        }
        this.applySync();
    };

    /** Creates a view using the current prefab. */
    public createView(): cc.Node {
        assert(this.prefab !== undefined);
        const view = cc.instantiate(this.prefab!);
        return view;
    };

    public getView(): cc.Node | undefined {
        if (!this.instantiate) {
            return undefined;
        }
        if (this.prefab === undefined) {
            return undefined;
        }
        if (!this.instantiated) {
            if (this.instantiateView()) {
                this.instantiated = true;
            }
        }
        return this.view;
    };

    public setPrefab(prefab: cc.Prefab) {
        this.prefab = prefab;
    }

    /** Creates a view from the current prefab and add it to this. */
    private instantiateView(): boolean {
        if (this.view !== undefined) {
            assert.fail('View already instantiate.');
            return false;
        }
        if (this.prefab === undefined) {
            assert.fail('Prefab is not exist.');
            return false;
        }
        this.view = this.createView();
        this.node.addChild(this.view);
        return true;
    };

    private setupView(): boolean {
        if (this.view === undefined) {
            assert.fail('View is not present');
            return false;
        }
        this.freeze(this.view);
        this.view._objFlags |= cc.Object.Flags.DontSave;
        return true;
    };

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
    };

    private applySync() {
        const view = this.getView();
        if (view !== undefined && this.synchronize) {
            this.node.setContentSize(view.getContentSize());
            this.node.setAnchorPoint(view.getAnchorPoint());
        }
    };
};