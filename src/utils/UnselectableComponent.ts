const { ccclass, disallowMultiple, executeInEditMode, menu } = cc._decorator;

@ccclass
@disallowMultiple
@executeInEditMode
@menu('ee/UnselectableComponent')
export class UnselectableComponent extends cc.Component {
    public onEnable(): void {
        if (CC_EDITOR) {
            let component = this.getComponent(cc.PolygonCollider);
            if (component !== null) {
                let gizmo = component.gizmo;
                if (gizmo !== null) {
                    let element = <SVGPolygonElement>(gizmo._root.dragArea.node);
                    element.style.pointerEvents = 'none';
                }
            }
        }
    };

    public onDisable(): void {
        if (CC_EDITOR) {
            let component = this.getComponent(cc.PolygonCollider);
            if (component !== null) {
                let gizmo = component.gizmo;
                if (gizmo !== null) {
                    let element = <SVGPolygonElement>(gizmo._root.dragArea.node);
                    element.style.pointerEvents = 'fill';
                }
            }
        }
    };
};