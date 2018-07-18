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
            assert(this.view !== undefined);
            this.view!.destroy();
            this.view = undefined;
        }
        this._prefab = value;
        if (this._prefab === null) {
            this._prefab = undefined;
        }
        if (this._prefab !== undefined) {
            this.instantiateView();
            if (CC_EDITOR) {
                this.setupView();
            }
        }
    };

    public onLoad(): void {
        if (!CC_EDITOR && !this.instantiated) {
            this.instantiateView();
            this.instantiated = true;
        }
    };

    public update(): void {
        if (!CC_EDITOR) {
            assert(this.view !== undefined);
            return;
        }
        if (this.view !== undefined) {
            if (this.view.parent === null) {
                // Somehow object is destroyed but remains referenced.
                this.view = undefined;
            }
        }
        if (this.prefab !== undefined && this.view === undefined) {
            this.instantiateView();
            this.setupView();
        }
    };

    public getView(): cc.Node {
        if (!this.instantiated) {
            this.instantiateView();
            this.instantiated = true;
        }
        return this.view!;
    }

    /** Creates a view from the current prefab and add it to this. */
    private instantiateView(): void {
        // cc.log('instantiate view for prefab ' + this.prefab.name);
        assert(this.view === undefined);
        assert(this.prefab !== undefined);
        this.view = cc.instantiate(this.prefab!);
        this.node.addChild(this.view);
    };

    private setupView(): void {
        assert(this.view !== undefined);
        this.freeze(this.view!);
        this.view!._objFlags |= cc.Object.Flags.DontSave;
    }

    private freeze(node: cc.Node): void {
        if (node.getComponent(StaticComponent) === null) {
            node.addComponent(StaticComponent);
        }
        node.children.forEach(child => this.freeze(child));
    };
};