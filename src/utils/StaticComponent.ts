const { ccclass, disallowMultiple, executeInEditMode, menu } = cc._decorator;

const LockFlags =
    cc.Object.Flags.IsPositionLocked |
    cc.Object.Flags.IsRotationLocked |
    cc.Object.Flags.IsScaleLocked |
    cc.Object.Flags.IsAnchorLocked |
    cc.Object.Flags.IsSizeLocked;

/** Used with NestedPrefab */
@ccclass
@disallowMultiple
@executeInEditMode
@menu('ee/StaticComponent')
export class StaticComponent extends cc.Component {
    private originalPosition: cc.Vec2 = cc.Vec2.ZERO;

    public onEnable(): void {
        if (CC_EDITOR) {
            this.originalPosition = this.node.position;
            this._objFlags |= LockFlags;
        }
    };

    public onDisable(): void {
        if (CC_EDITOR) {
            this._objFlags &= ~LockFlags;
        }
    };

    public update(delta: number): void {
        if (CC_EDITOR && this.enabled) {
            this.node.position = this.originalPosition;
        }
    }
};