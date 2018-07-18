import assert = require('assert');
import { StaticComponent } from './StaticComponent';

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

    private set prefab(value) {
        if (this._prefab !== undefined) {
            if (this.view === undefined) {
                throw new Error('Prefab exist but the view is not present.');
            }
            this.view.destroy();
            this.view = undefined;
        }
        this._prefab = value;
        if (this._prefab === null) {
            // Change null to undefined.
            this._prefab = undefined;
        }
        if (this._prefab !== undefined) {
            if (this.instantiateView()) {
                if (CC_EDITOR) {
                    this.setupView();
                }
            }
        }
    };

    public onLoad(): void {
        if (!CC_EDITOR && !this.instantiated) {
            if (this.instantiateView()) {
                this.instantiated = true;
            }
        }
    };

    public update(): void {
        if (!CC_EDITOR) {
            assert(this.view !== undefined, 'View should be present at runtime.');
            return;
        }
        if (this.view !== undefined) {
            if (!this.view.isValid) {
                // Object is destroyed but remains referenced.
                this.view = undefined;
            }
        }
        if (this.prefab !== undefined && this.view === undefined) {
            if (this.instantiateView()) {
                this.setupView();
            }
        }
    };

    public getView(): cc.Node {
        if (!this.instantiated) {
            if (this.instantiateView()) {
                this.instantiated = true;
            }
        }
        if (this.view === undefined) {
            throw new Error('Failed to instantiate view.');
        }
        return this.view;
    };

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
        this.view = cc.instantiate(this.prefab);
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
        if (node.getComponent(StaticComponent) === null) {
            node.addComponent(StaticComponent);
        }
        node.children.forEach(child => this.freeze(child));
    };
};