import assert = require('assert');

const { ccclass, disallowMultiple, menu } = cc._decorator;

if (CC_EDITOR) {
    Editor.UI.PolymerUtils.elements['scene-view'].prototype._onMouseMove = (event: any) => {
        event.stopPropagation();

        let position = _Scene.view.pixelToWorld(cc.v2(event.offsetX, event.offsetY));
        let delta = Number.MAX_VALUE;
        let bestNode: cc.Node | undefined;
        let entries = cc.engine.getIntersectionList(cc.rect(position.x, position.y, 1, 1));
        entries.forEach(entry => {
            let node = entry.node;
            assert(node !== null);
            let comp = node.getComponent(UnselectableComponent);
            if (comp !== null && comp.enabled) {
                // Ignore this node.
                // Also disable polygon collider.
                let collider = node.getComponent(cc.PolygonCollider);
                if (collider !== null) {
                    collider.gizmo._root.dragArea.ignoreMouseMove = true;
                }
                return;
            }
            // Reenable polygon collider
            let collider = node.getComponent(cc.PolygonCollider);
            if (collider !== null) {
                collider.gizmo._root.dragArea.ignoreMouseMove = false;
            }
            let rect = entry.aabb || _Scene.NodeUtils.getWorldBounds(node);
            let c = position.sub(rect.center).magSqr();
            if (c - delta < -1e-6) {
                delta = c;
                bestNode = node;
            }
        });

        let uuid = bestNode !== undefined ? bestNode.uuid : null;
        Editor.Selection.hover('node', uuid);
    };
}

@ccclass
@disallowMultiple
@menu('ee/UnselectableComponent')
export class UnselectableComponent extends cc.Component {
};