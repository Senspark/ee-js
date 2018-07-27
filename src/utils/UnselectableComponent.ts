const { ccclass, disallowMultiple, menu } = cc._decorator;

@ccclass
@disallowMultiple
@menu('ee/UnselectableComponent')
export class UnselectableComponent extends cc.Component {
    public onEnable(): void {
        if (CC_EDITOR) {
            let component = this.getComponent(cc.PolygonCollider);
            if (component !== null) {
                let element = <SVGPolygonElement>(component.gizmo._root.dragArea.node);
                element.style.pointerEvents = 'fill';
            }
        }
    };

    public onDisable(): void {
        if (CC_EDITOR) {
            let component = this.getComponent(cc.PolygonCollider);
            if (component !== null) {
                let element = <SVGPolygonElement>(component.gizmo._root.dragArea.node);
                element.style.pointerEvents = 'none';
            }
        }
    };
};