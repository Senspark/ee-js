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
                if (!this.updateInternal(delta)) {
                    return;
                }
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
        return <sp.spine.TrackEntry>(this.setAnimationInternal(trackIndex, name, loop));
    };

    private updateInternal(delta: number): boolean {
        if (cc.ENGINE_VERSION >= '2') {
            const state = this.getState();
            if (state === undefined) {
                return false;
            }
            state.update(delta);
            return true;
        } else {
            const node = this._sgNode;
            if (node === null) {
                return false;
            }
            node.update(delta);
            return true;
        }
    };

    private setAnimationInternal(trackIndex: number, name: string, loop: boolean): sp.spine.TrackEntry | null {
        if (cc.ENGINE_VERSION >= '2') {
            const state = this.getState();
            if (state === undefined) {
                return null;
            }
            const track = state.setAnimation(trackIndex, name, loop);
            return track;
        } else {
            const node = this._sgNode;
            if (node === null) {
                return null;
            }
            const track = node.setAnimation(trackIndex, name, loop);
            return track;
        }
    };
};