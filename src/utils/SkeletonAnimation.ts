import { UpdateManager } from './UpdateManager';

const { ccclass, disallowMultiple, executeInEditMode, menu } = cc._decorator;

@ccclass
@disallowMultiple
@executeInEditMode
@menu('ee/SkeletonAnimation')
export class SkeletonAnimation extends sp.Skeleton {
    public constructor() {
        super();
        if (CC_EDITOR) {
            UpdateManager.getInstance().addObserver(this.uuid, delta => {
                if (!this.enabled) {
                    return;
                }
                if (this._sgNode === null) {
                    return;
                }
                this._sgNode.update(delta);
                cc.engine.repaintInEditMode();
            });
        }
    };

    public onDestroy(): void {
        if (CC_EDITOR) {
            UpdateManager.getInstance().removeObserver(this.uuid);
        }
    };

    public setAnimation(trackIndex: number, name: string, loop: boolean): sp.spine.TrackEntry {
        if (!CC_EDITOR) {
            return super.setAnimation(trackIndex, name, loop);
        }
        super.setAnimation(trackIndex, name, loop);
        if (this._sgNode === null) {
            return <sp.spine.TrackEntry><any>null;
        }
        let track = this._sgNode.setAnimation(trackIndex, name, loop);
        return <sp.spine.TrackEntry>track;
    };
};