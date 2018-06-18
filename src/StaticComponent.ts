const { ccclass, disallowMultiple, executeInEditMode, menu } = cc._decorator;

/** Used with NestedPrefab */
@ccclass
@disallowMultiple
@executeInEditMode
@menu('ee/utils/StaticComponent')
export default class StaticComponent extends cc.Component {
    private originalPosition: cc.Vec2 = cc.Vec2.ZERO;

    public onLoad() {
        if (CC_EDITOR) {
            this.originalPosition = this.node.position;
            let Flags = cc.Object.Flags;
            let flags = this._objFlags;
            flags |= Flags.LockedInEditor;
            flags |= Flags.IsPositionLocked;
            flags |= Flags.IsRotationLocked;
            flags |= Flags.IsScaleLocked;
            flags |= Flags.IsAnchorLocked;
            flags |= Flags.IsSizeLocked;
            this._objFlags = flags;
        }
    };

    public update() {
        if (CC_EDITOR) {
            this.node.position = this.originalPosition;
        }
    }
};