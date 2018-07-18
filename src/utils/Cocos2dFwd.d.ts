interface AssetDB {
    queryPathByUuid(uuid: string, callback: (error: string | null, result: string | null) => void): void;
    queryUrlByUuid(uuid: string, callback: (error: string | null, result: string | null) => void): void;
    queryInfoByUuid(uuid: string, callback: (error: string | null, result: {}) => void): void;
    queryMetaInfoByUuid(uuid: string, callback: (error: string | null, result: {}) => void): void;
    queryAssets(pattern: string, type: string, callback: (error: string | null, result: any) => void): void;
}

interface AssetTable {
    getUuid(path: string, type?: string): string;
    getUuidArray(path: string, type?: string, out_urls?: string[]): string[];
}

interface Profile {
    data: any;
    save();
}

interface ProfileDB {
    load(path: string, callback: (err: string | null, profile: Profile | null) => void): void;
}

declare namespace Editor {
    const assetdb: AssetDB;
    const Profile: ProfileDB;
}

declare namespace _ccsg {
    export class Node {
        getShaderProgram(): cc.GLProgram;
        setShaderProgram(program: cc.GLProgram): void;

        /** For native. */
        getGLProgramState(): cc.GLProgramState;
        setGLProgramState(state: cc.GLProgramState): void;
    }

    export class Label extends Node {
        width: number;
        height: number;

        getContentSize(): cc.Size;
        setContentSize(widthOrSize: number | cc.Size, height?: number): void;

        setMargin(margin: number): void;

        getString(): string;
        setString(value: string): void;

        getStringLength(): number;

        isWrapTextEnabled(): boolean;
        enableWrapText(enabled: boolean): void;

        enableItalics(enabled: boolean): void;
        enableBold(enabled: boolean): void;
        enableUnderline(enabled: boolean): void;

        getFontName(): string;

        getFontSize(): number;
        setFontSize(size: number): void;

        getSpacingX(): number;
        setSpacingX(spacing: number): void;

        isOutlined(): boolean;
        setOutlined(enabled: boolean): void;

        getOutlineColor(): cc.Color;
        setOutlineColor(color: cc.Color): void;

        getOutlineWidth(): number;
        setOutlineWidth(width: number): void;

        getLineHeight(): number;
        setLineHeight(height: number): void;

        getBMFontLineHeight(): number;
    }
}

declare namespace cc {
    type WebGLUniformLocation = number;

    /** Creates a cc.AffineTRansform object with all contents in the matrix. */
    export function affineTransformMake(a: number, b: number, c: number, d: number, tx: number, ty: number): AffineTransform;

    /** Clones a cc.AffineTransform object from the specified transform. */
    export function affineTransformClone(t: AffineTransform): AffineTransform;

    /**
     * Applies the affine transformation on a point.
     * @param point Point or x.
     * @param transOrY Transform matrix or y.
     * @param t Tranform matrix.
     */
    export function pointApplyAffineTransform(point: Vec2 | number, transOrY: number | AffineTransform, t?: AffineTransform): Vec2;

    /** Applies the affine transformation on a size. */
    export function sizeApplyAffineTransform(size: Size, t: AffineTransform): Size;

    /** Creates an identity transformation matrix. */
    export function affineTransformMakeIdentity(): AffineTransform;

    /** Applies the affine transform on a rect. */
    export function rectApplyAffineTransform(rect: Rect, t: AffineTransform): Record;

    export function affineTransformTranslate(t: AffineTransform, tx: number, ty: number): AffineTransform;
    export function affineTransformScale(t: AffineTransform, sx: number, sy: number): AffineTransform;
    export function affineTransformRotate(t: AffineTransform, angle: number): AffineTransform;
    export function affineTransformConcat(t1: AffineTransform, t2: AffineTransform): AffineTransform;
    export function affineTransformConcatIn(t1: AffineTransform, t2: AffineTransform): AffineTransform;
    export function affineTransformEqualToTranform(t1: AffineTransform, t2: AffineTransform): boolean;
    export function affineTranformInvert(t1: AffineTransform): AffineTransform;
    export function affineTransformInvertIn(t: AffineTransform): AffineTransform;
    export function affineTransformInvertOut(t: AffineTransform, out: AffineTransform): void;

    export class AssetLibrary {
        static loadAsset(uuid: string, callback: (error: string | null, asset: string | null) => void, options?: {}): void;
        static getLibUrlNoExt(uuid: string): string;
        static queryAssetInfo(uuid: string, callback: (error: string | null, url: string | null, raw: boolean) => void): void;

        /**
         * Gets the exists asset by uuid.
         * @return The existing asset, if not loaded, just returns null.
         */
        static getAssetByUuid(uuid: string): Asset | null;
    }

    export namespace loader {
        const _resources: AssetTable;
        export function _loadResUuids(uuids: string[],
            progressCallback?: (completedCount: number, totalCount: number, item: any) => void,
            completeCallback?: (error: Error, resource: any) => void): void;
    }

    export interface Object {
        _objFlags: number;
    }

    export namespace Object {
        export enum Flags {
            Destroyed /*             */ = 1 << 0,
            RealDestroyed /*         */ = 1 << 1,
            ToDestroy /*             */ = 1 << 2,
            DontSave /*              */ = 1 << 3,
            EditorOnly /*            */ = 1 << 4,
            Dirty /*                 */ = 1 << 5,
            DontDestroy /*           */ = 1 << 6,
            Destroying /*            */ = 1 << 7,
            Deactivating /*          */ = 1 << 8,
            LockedInEditor /*        */ = 1 << 9,
            IsOnEnableCalled /*      */ = 1 << 11,
            IsEditorOnEnableCalled /**/ = 1 << 12,
            IsPreloadStarted /*      */ = 1 << 13,
            IsOnLoadCalled /*        */ = 1 << 14,
            IsOnLoadStarted /*       */ = 1 << 15,
            IsStartCalled /*         */ = 1 << 16,
            IsRotationLocked /*      */ = 1 << 17,
            IsScaleLocked /*         */ = 1 << 18,
            IsAnchorLocked /*        */ = 1 << 19,
            IsSizeLocked /*          */ = 1 << 20,
            IsPositionLocked /*      */ = 1 << 21,
        }
    }

    export interface Action {
        startWithTarget(target: any): void;
        stop(): void;
        step(delta: number): void;
        update(delta: number): void;
    }

    export interface Label {
        _sgNode: _ccsg.Label;
    }

    export interface Sprite {
        _sgNode: Scale9Sprite;
    }

    export class Scale9Sprite extends _ccsg.Node {
        loaded(): boolean;

        /** Changes the texture file of 9 slice sprite. */
        setTexture(textureOrTextureFile: string | cc.Texture2D): void;

        /** Changes the sprite frame of 9 slice sprite. */
        setSpriteFrame(spriteFrame: cc.SpriteFrame): void;

        /** Returns the blending function that is currently being used. */
        getBlendFunc(): cc.BlendFunc;

        /** Sets the source blending function. */
        setBlendFunc(blendFunc: number | cc.BlendFunc, dst: number): void;

        enableTrimmedContentSize(isTrimmed: boolean): void;

        getInsetLeft(): number;
        setInsetLeft(inset: number): void;

        getInsetTop(): number;
        setInsetTop(inset: number): void;

        getInsetRight(): number;
        setInsetRight(inset: number): void;

        getInsetBottom(): number;
        setInsetBottom(inset: number): void;
    }

    export interface Node {
        _sgNode: _ccsg.Node;
    }

    /** shaders */
    export namespace gl {
        /** Invalidates the GL state cache. */
        export function invalidateStateCache(): void;

        /** Uses the GL program in case program is different than the current one. */
        export function useProgram(program: GLProgram): void;

        /** Deletes the GL program. If it is the one that is being used, it invalidates it. */
        export function deleteProgram(program: GLProgram): void;

        /** Uses a blending function in case it is not already used. */
        export function blendFunc(src: number, dst: number): void;

        /** If the texture is not already bound, it binds it. */
        export function bindTexture2D(texture: cc.Texture2D): void;

        /** It will delete the given texture. If the texture was bound, it will invalidate the cached. */
        export function deleteTexture2D(texture: cc.Texture2D): void;
    }

    export class GLProgram {
        constructor(vShaderFileName?: string, fShaderFileName?: string, glContext?: any);

        /** Destroys the program. */
        destroyProgram(): void;

        /** Initializes the GL program with a vertex and fragment with contents of filenames. */
        init(vert: string, frag: string): boolean;

        /** Initializes the GL program with a vertex and fragment with string. */
        initWithString(vert: string, frag: string): boolean;

        /** Adds a new attribute to the shader. */
        addAttribute(attributeName: string, index: number): void;

        /** Links the GL program. */
        link(): boolean;

        /** Calls gl.useProgram(). */
        use(): void;

        /** Creats 4 uniforms:
         * cc.macro.UNIFORM_PMATRIX
         * cc.macro.UNIFORM_MNMATRIX
         * cc.macro.UNIFORM_MVPMATRIX
         * cc.macro.UNIFORM_SAMPLER
         */
        updateUniforms(): void;

        /** Retrieves the named unifrom location for this GL program. */
        getUniformLocationForName(name: string): WebGLUniformLocation;

        setUniformLocationWith1i(location: WebGLUniformLocation, i1: number): void;
        setUniformLocationWith2i(location: WebGLUniformLocation, i1: number, i2: number): void;
        setUniformLocationWith3i(location: WebGLUniformLocation, i1: number, i2: number, i3: number): void;
        setUniformLocationWith4i(location: WebGLUniformLocation, i1: number, i2: number, i3: number, i4: number): void;
        setUniformLocationWith2iv(location: WebGLUniformLocation, array: number[]): void;
        setUniformLocationWith3iv(location: WebGLUniformLocation, array: number[]): void;
        setUniformLocationWith4iv(location: WebGLUniformLocation, array: number[]): void;
        setUniformLocationWith1f(location: WebGLUniformLocation, f1: number): void;
        setUniformLocationWith2f(location: WebGLUniformLocation, f1: number, f2: number): void;
        setUniformLocationWith3f(location: WebGLUniformLocation, f1: number, f2: number, f3: number): void;
        setUniformLocationWith4f(location: WebGLUniformLocation, f1: number, f2: number, f3: number, f4: number): void;
        setUniformLocationWith2fv(location: WebGLUniformLocation, array: number[]): void;
        setUniformLocationWith3fv(location: WebGLUniformLocation, array: number[]): void;
        setUniformLocationWith4fv(location: WebGLUniformLocation, array: number[]): void;
        setUniformLocationWithMatrix3fv(location: WebGLUniformLocation, array: number[]): void;
        setUniformLocationWithMatrix4fv(location: WebGLUniformLocation, array: number[]): void;

        /** Updates the built-in uniforms if they are different than the previous call for this same GL program. */
        setUniformsForBuilins(): void;

        /** Reloads all shaders, designed for Android when OpenGL context lost. */
        reset(): void;
    }

    /** For native. */
    export class UniformValue {
        constructor(uniform: any, program: GLProgram);
        setFloat(value: number): void;
        setInt(value: number): void;
        setVec2(v1: number, v2: number): void;
        setVec2v(value: number[]): void;
        setVec3(v1: number, v2: number, v3: number): void;
        setVec3v(value: number[]): void;
        setVec4(v1: number, v2: number, v3: number, v4: number): void;
        setVec4v(value: number[]): void;
        setMat4(matrix: number[]): void;
        setCallback(callback: any): void;
        setTexture(textureId: number, textureUnit: Texture2D): void;
        apply(): void;
    }

    /** For native. */
    export class GLProgramState {
        static getOrCreateWithGLProgram(program: GLProgram): GLProgramState;
        constructor(program: GLProgram);
        getGLProgram(): GLProgram;
        setGLProgram(program: GLProgram): void;
        getUniformCount(): number;
        getUniformValue(name: string): UniformValue;
        setUniformInt(name: string, value: number): void;
        setUniformFloat(name: string, value: number): void;
        setUniformVec2(name: string, v1: number, v2: number): void;
        setUniformVec2v(name: string, value: number[]): void;
        setUniformVec3(name: string, v1: number, v2: number, v3: number): void;
        setUniformVec3v(name: string, value: number[]): void;
        setUniformVec4(name: string, v1: number, v2: number, v3: number, v4: number): void;
        setUniformVec4v(name: string, value: number[]): void;
        setUniformMat4(name: string, value: number[]): void;
        setUniformCallback(name: string, callback: any): void;
        setUniformTexture(name: string, textureId: number): void;
    };

    export class shaderCache {
        /** Reloads the default shaders. */
        static reloadDefaultShaders(): void;

        /** Returns a GL program for the given key. */
        static getProgram(key: string): GLProgram;

        /** Adds a GL program to the cache for the given key. */
        static addProgram(program: GLProgram, key: string): void;
    }

    /** kazmath */
    export namespace math {
        export function vec3(x: number | Vec3, y?: number, z?: number);

        export class Vec3 {
            static zero: Vec3;
            x: number;
            y: number;
            z: number;
            constructor(x: number | Vec3, y?: number, z?: number);
            fill(x: number | Vec3, y?: number, z?: number);
            length(): number;
            lengthSq(): number;
            normalize(): this;
            cross(vec: Vec3): this;
            dot(vec: Vec3): number;
            add(vec: Vec3): this;
            subtract(vec: Vec3): this;
            transform(matrix: Matrix4): this;
            transformNormal(matrix: Matrix4): this;
            transformCoord(matrix: Matrix4): this;
            scale(scale: number): this;
            equals(vec: Vec3): boolean;
            inverseTransform(matrix: Matrix4): this;
            inverseTransformNormal(matrix: Matrix4): this;
            assignFrom(vec: Vec3): this;
            toTypeArray(): number[];
        }

        export class Quaternion {
            static rotationMatrix(matrix: Matrix3): Quaternion;
            static rotationYawPitchRoll(yaw: number, pitch: number, roll: number): Quaternion;
            static slerp(quaternion: Quaternion, t: number): Quaternion;
            x: number;
            y: number;
            z: number;
            w: number;
            constructor(x: number | Quaternion, y?: number, z?: number, w?: number);
            conjugate(quaternion: Quaternion): this;
            dot(quaternion: Quaternion): number;
            identity(): this;
            inverse(): this;
            isIdentity(): boolean;
            length(): number;
            lengthSq(): number;
            multiply(quaternion: Quaternion): this;
            normalize(): this;
            rotationAxis(axis: Vec3, angle: number): this;
            scale(scale: number): this;
            assignFrom(quaternion: Quaternion): this;
            add(quaternion: Quaternion): this;
            multiplyVec3(vec: Vec3): Vec3;
        }

        export class Matrix3 {
            static createByRotationX(radians: number): Matrix3;
            static createByRotationY(radians: number): Matrix3;
            static createByRotationZ(radians: number): Matrix3;
            static createByRotation(radians: number): Matrix3;
            static createByScale(x: number, y: number): Matrix3;
            static createByTranslation(x: number, y: number): Matrix3;
            static createByQuaternion(quaternion: Quaternion): Matrix3;
            mat: Float32Array;
            constructor(matrix?: Matrix3);
            fill(arr: number[]): this;
            adjugate(): this;
            identity(): this;
            inverse(determinate: number): this;
            isIdentity(): boolean;
            transpose(): this;
            determinant(): number;
            multiply(matrix: Matrix3): this;
            multiplyScalar(factor: number): this;
            assignFrom(matrix: Matrix3): this;
            equals(matrix: Matrix3): boolean;
        }

        /** Sets matrix to an identity matrix. */
        export function mat4Identity(matrix: Matrix4): Matrix4;

        /** Calculates the inverse of matrix and stores the result in out. */
        export function mat4Inverse(out: Matrix4, matrix: Matrix4): Matrix4 | null;

        /** Multiples x with y and stores the result in out, returns out. */
        export function mat4Multiply(out: Matrix4, x: Matrix4, y: Matrix4): Matrix4;

        /**
         * Builds a translation matrix. All other elements in the matrix
         * will be set to zero except for the diagonal which is set to 1.0
         */
        export function mat4Translation(matrix: Matrix4, x: number, y: number, z: number): Matrix4;

        export class Matrix4 {
            /** Builds a rotation matrix around the X-axis. */
            static createByRotationX(radians: number, matrix?: Matrix4): Matrix4;

            /** Builds a rotation matrix around the Y-axis. */
            static createByRotationY(radians: number, matrix?: Matrix4): Matrix4;

            /** Builds a rotation matrix around the Z-axis. */
            static createByRotationZ(radians: number, matrix?: Matrix4): Matrix4;

            /** Builds a rotation matrix from pitch, yaw and roll. */
            static createByPitchYawRoll(pitch: number, yaw: number, roll: number, matrix?: Matrix4): Matrix4;

            /** Builds a matrix by a quaternion. */
            static createByQuaternion(quaternion: Quaternion, matrix?: Matrix4): Matrix4;

            /** Builds a 4x4 OpenGL transformation matrix using a 3x3 rotation matrix and a 3d vector representing a translation. */
            static createByRotationTranslation(rotation: Matrix3, translation: Vec3, matrix?: Matrix4): Matrix4;

            /** Builds a scaling matrix. */
            static createByScale(x: number, y: number, z: number, matrix?: Matrix4): Matrix4;

            /** Builds a translation matrix. */
            static createByTranslation(x: number, y: number, z: number, matrix?: Matrix4): Matrix4;

            mat: Float32Array;

            constructor(matrix?: Matrix4);

            /** Fills this matrix stucture with the values from a 16-element array of floats. */
            fill(arr: number[]): this;

            /** Sets matrix to identity value. */
            identity(): this;

            get(row: number, col: number): number;
            set(row: number, col: number, value: number): void;
            swap(r1, number, c1: number, r2: number, c2: number): void;

            /**
             * Calculates the inverse of the current matrix.
             * @return null if there is no inverse, else returns a new inverse matrix object.
             */
            inverse(): Matrix4 | null;

            /** Returns true if current matrix is an identity matrix, false otherwise. */
            isIdentity(): boolean;

            /** Transposes the current matrix. */
            transpose(): this;

            /** Current matrix mutiplies with other matrix. */
            multiply(matrix: Matrix4): this;

            /** Assigns the value of the current matrix from the specified matrix. */
            assignFrom(matrix: Matrix4): this;

            /** Checks whether the current matrix equal to the specified matrix (approximately). */
            equals(matrix: Matrix4): boolean;
        }
    }
}

declare namespace sp {
    export class _SGSkeleton extends _ccsg.Node {
        constructor(skeletonDataFile?: string, atlasFile?: string, scale?: number);

        /** Sets whether open debug slots. */
        setDebugSlotsEnabled(enabled: boolean): void;

        /** Gets whether open debug slots. */
        getDebugSlotsEnabled(): boolean;

        /** Sets whether open debug bones. */
        setDebugBonesEnabled(enableD: boolean): void;

        /** Gets whether open debug bones. */
        getDebugBonesEnabled(): boolean;

        /** Sets the time scale of skeleton. */
        setTimeScale(scale: number): void;

        /** Gets the time scale of skeleton. */
        getTimeScale(): number;
    }

    export class _SGSkeletonAnimation extends _SGSkeleton {
    }

    export interface Skeleton {
        _sgNode: _SGSkeletonAnimation | null;
    }

    export namespace spine {
        export class Animation {
            name: string;
            timelines: any[];
            duration: number;

            apply(skeleton: any, lastTime: any, time: any, loop: boolean, events: any, alpha: number, setupPose: boolean, mixingOut: any): void;
            static binarySearch(values: number[], target: number, step: number): number;
            static linearSearch(values: number[], target: number, step: number): number;
        }

        export class SkeletonData {
            findBone(name: string): Bone;
            findBoneIndex(name: string): number;
            findSlot(name: string): any;
            findSlotIndex(name: string): number;
            findSkin(name: string): any;
            findEvent(name: string): any;
            findAnimation(name: string): any;
            findIkConstraint(name: string): any;
        }

        export class TrackEntry {
            trackIndex: number;
            animation: Animation | null;
            loop: boolean;
            eventThreshold: number;
            attachmentThreshold: number;
            drawOrderThreshold: number;
            animationStart: number;
            animationEnd: number;
            animationLast: number;
            nextAnimationLast: number;
            delay: number;
            trackTime: number;
            trackLast: number;
            nextTrackLast: number;
            trackEnd: number;
            timeScale: number;
            alpha: number;
            mixAlpha: number;
            mixTime: number;
            mixDuration: number;

            timelinesFirst: any[];
            timelinesRotation: any[];
            next: any | null;
            mixingFrom: any | null
            listener: any | null;

            reset(): void;
            getAnimationTime(): number;
            setAnimationLast(animationLast: any): void;
            isComplete(): boolean;
            resetRotationDirections(): void;
        }

        export class AnimationState { }
        export class AnimationStateData { }
        export class AssetManager { }
        export class AtlasAttachmentLoader { }
        export class Attachment { }
        export enum AttachmentType { }
        export enum BlendMode { }
        export class Bone { }
        export class BoneData { }
        export class BoundingBoxAttachment { }
        export class Color { }
        export class Event { }
        export class EventData { }
        export class EventQueue { }
        export class IkConstraint { }
        export class IkConstraintData { }
        export class MeshAttachment { }
        export class PathAttachment { }
        export class PathConstraint { }
        export class RegionAttachment { }
        export class SharedAssetManager { }
        export class Skeleton { }
        export class SkeletonBounds { }
        export class SkeletonData { }
        export class SkeletonJson { }
        export class Skin { }
        export class Slot { }
        export class SlotData { }
        export class Texture { }
        export enum TextureFilter { }
        export enum TextureWrap { }
        export class TextureRegion { }
        export class TextureAtlas { }
        export class TextureAtlasReader { }
        export class TextureAtlasPage { }
        export class TransformConstraint { }
        export class TransformConstraintData { }
    }
}