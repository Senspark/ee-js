namespace cc {
    export interface Object {
        _objFlags: number;
    }

    export namespace Object {
        export enum Flags {
            DontSave /*        */ = 1 << 3,
            LockedInEditor /*  */ = 1 << 9,
            IsRotationLocked /**/ = 1 << 17,
            IsScaleLocked /*   */ = 1 << 18,
            IsAnchorLocked /*  */ = 1 << 19,
            IsSizeLocked /*    */ = 1 << 20,
            IsPositionLocked /**/ = 1 << 21,
        }
    }
};