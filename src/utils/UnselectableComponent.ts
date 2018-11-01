const { ccclass, disallowMultiple, executeInEditMode, menu } = cc._decorator;

@ccclass
@disallowMultiple
@executeInEditMode
@menu('ee/UnselectableComponent')
export class UnselectableComponent extends cc.Component {
    public onEnable(): void {
        if (CC_EDITOR) {
            const component = this.getComponent(cc.PolygonCollider);
            if (component !== null) {
                const gizmo = component.gizmo;
                if (gizmo !== null && gizmo !== undefined) {
                    const element = gizmo._root.dragArea.node as SVGPolygonElement;
                    element.style.pointerEvents = 'none';
                }
            }
        }
    }

    public onDisable(): void {
        if (CC_EDITOR) {
            const component = this.getComponent(cc.PolygonCollider);
            if (component !== null) {
                const gizmo = component.gizmo;
                if (gizmo !== null && gizmo !== undefined) {
                    const element = gizmo._root.dragArea.node as SVGPolygonElement;
                    element.style.pointerEvents = 'fill';
                }
            }
        }
    }
}