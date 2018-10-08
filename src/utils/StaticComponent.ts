const { ccclass, disallowMultiple, executeInEditMode, menu } = cc._decorator;

const Flags = cc.Object.Flags;
const LOCK_FLAGS =
    Flags.IsPositionLocked |
    Flags.IsRotationLocked |
    Flags.IsScaleLocked |
    Flags.IsAnchorLocked |
    Flags.IsSizeLocked;

/** Used with NestedPrefab */
@ccclass
@disallowMultiple
@executeInEditMode
@menu('ee/StaticComponent')
export class StaticComponent extends cc.Component {
    private originalPosition?: cc.Vec2;

    public onEnable(): void {
        if (CC_EDITOR) {
            // Save original position.
            this.originalPosition = this.node.position;

            // Apply lock flags.
            this.node._components.forEach(comp => comp._objFlags |= LOCK_FLAGS);
            this.node._objFlags |= LOCK_FLAGS;
        }
    }

    public onDisable(): void {
        if (CC_EDITOR) {
            // Remove lock flags.
            this.node._components.forEach(comp => comp._objFlags &= ~LOCK_FLAGS);
            this.node._objFlags &= ~LOCK_FLAGS;
        }
    }

    public update(delta: number): void {
        if (CC_EDITOR) {
            if (this.originalPosition !== undefined) {
                // Restore original position.
                this.node.position = this.originalPosition;
            }
        }
    }
}