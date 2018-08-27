interface AssetDB {
    queryPathByUuid(uuid: string, callback: (error: string | null, result: string | null) => void): void;
    queryUrlByUuid(uuid: string, callback: (error: string | null, result: string | null) => void): void;
    queryInfoByUuid(uuid: string, callback: (error: string | null, result: {}) => void): void;
    queryMetaInfoByUuid(uuid: string, callback: (error: string | null, result: any) => void): void;
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

    export function polymerElement(data: object): void;

    // app.asar/editor/page/gizmos/elements/gizmo.js
    export class Gizmo {
        _root: any;
        node: cc.Node | null;
        nodes: cc.Node[];
        topNodes: cc.Node[];
        selecting: boolean;
        editing: boolean;
        hovering: boolean;

        layer(): string;
        createRoot(): void;
        registerMoveSvg(t: any, e: any, i: any);
        createMoveCallbacks(t: any): any;
        onCreateMoveCallbacks(): any;
        recordChanges(): void;
        commitChanges(): void;
        worldToPixel(position: cc.Vec2): cc.Vec2;
        pixelToWorld(position: cc.Vec2): cc.Vec2;
        sceneToPixel(position: cc.Vec2): cc.Vec2;
        pixelToScene(position: cc.Vec2): cc.Vec2;
        defaultMinDifference(): number;
        registerAdjustValue(t: any, e: any): void;
        adjustValue(t: any, e: any, i: any): void;
        targetValid(): boolean;
        visible(): boolean;
        _viewDirty(): boolean;
        _nodeDirty(node?: cc.Node): boolean;
        dirty(): boolean;
        update(): void;
        remove(): void;
        ensureRoot(): void;
        hide(): void;
        show(): void;
        rectHitTest(t: any, e: any): boolean;
        _registerEvent(): void;
    }

    export namespace UI {
        // app.asar/editor-framework/lib/renderer/ui/utils
        export namespace PolymerUtils {
            export function registerElement(data: object): void;
            export function registerPanel(e: any, t: any): void;
            export const elements: { [key: string]: any };
            export const panels: { [key: string]: any };
        }
    }

    export class Ipc {
        static sendToAll(event: string, ...args: any[]): void;
    };

    // app.asar/editor-framework/lib/share
    export class IpcListener {
        on(event: string, callback: any);
        once(event: string, callback: any);
        clear(): void;
    };

    export namespace Selection {
        export function hover(e: any, t: any): void;
        export function select(e: any, t: any): void;
    }

    export namespace Utils {
        export class Polygon { }
    }
}

// app.asar/editor/page/scene-utils/editor-engine.js
interface EditorEngine {
    isInitialized(): boolean;
    loadingScene(): cc.Scene;

    forceRepaintIntervalInEM: number;
    editingRootNode: cc.Node | null;

    playInEditor(): void;
    tick(delta: number, updateAnimation: boolean): void;
    tickInEditMode(delta: number, updateAnimation: boolean): void;
    repaintInEditMode(): void;
    getInstanceById(id: any): any | null;
    getIntersectionList(rect: cc.Rect, t?: boolean): { node: cc.Node, aabb?: cc.Rect, obb?: Editor.Utils.Polygon }[];
    setDesignResolutionSize(width: number, height: number): void;
    getDesignResolutionSize(): cc.Size;
    obbApplyAffineTransform(e: any, t: any, i: any, n: any, c: any, r: any): void;
    onError(error: any): void;
    onResume(): void;
    onPause(): void;
    onPlay(): void;
    onStop(): void;
    startTick(): void;
    _tick(): void;
    _tickStart(): void;
    _tickStop(): void;
    reset(): void;
    updateAnimatingInEditMode(): void;
}

// app.asar/editor/page/scene-utils/index.js
declare namespace _Scene {
    export const view: any;
    export function reset(): void;
    export function _softReload(e: any, t: any): void;
    export function softReload(e: any, t: any): void;
    export function defaultScene(): void;
    export function newScene(e: any): void;
    export function _loadSceneByUuid(uuid: string, callback: any): void;
    export function loadSceneByUuid(uuid: string, callback: any): void;
    export function initScene(e: any): void;
    export function getEditingWorkspace(): object;
    export function loadWorkspace(e: any, t: any): void;
    export function stashScene(e: any): void;
    export function _applyCanvasPreferences(e: any, t: any): void;
    export const currentScene: () => cc.Scene;
    export const title: () => string;
    export function updateTitle(e: any): void;
    export function save(e: any): void;
    export function confirmClose(): void;
    export function close(e: any, callback: any): void;
    export const dirty: boolean;
    export function copyNodes(e: any): void;
    export function pasteNodes(e: any): void;
    export function createNodes(uuids: string[], t: any, options: { unlinkPrefab?: boolean }, callback: any): void;
    export function createNodesAt(uuids: string[], x: number, y: number, options: { unlinkPrefab?: boolean }): void;
    export function createNodeByClassID(e: any, t: any, n: any, i: any): void;
    export function createNodeByPrefab(e: any, t: any, n: any, i: any): void;
    export function deleteNodes(e: any): void;
    export function duplicateNodes(e: any): void;
    export function moveNodes(e: any, t: any, n: any): void;
    export function addComponent(e: any, t: any): void;
    export function removeComponent(e: any, t: any): void;
    export function copyComponent(e: any): void;
    export function pasteComponent(e: any, t: any): void;
    export function newProperty(e: any, t: any, n: any): void;
    export function resetProperty(e: any, t: any, n: any): void;
    export function setProperty(e: any): void;
    export function createPrefab(e: any, t: any): void;
    export function applyPrefab(e: any): void;
    export function revertPrefab(e: any): void;
    export function setPrefabSync(e: any): void;
    export function breakPrefabInstance(e: any): void;
    export function linkPrefab(): void;
    export function dumpNode(e: any): any;
    export function select(e: any): void;
    export function unselect(e: any): void;
    export function hoverin(e: any): void;
    export function hoverout(e: any): void;
    export function activate(e: any): void;
    export function deactivate(e: any): void;
    export function hitTest(x: number, y: number): cc.Node | undefined;
    export function rectHitTest(x: number, y: number, width: number, height: number): cc.Node | undefined;
    export function _syncPrefab(e: any, t: any): void;
    export function syncPrefab(e: any): void;
    export function assetChanged(e: any): void;
    export function assetsMoved(e: any): void;
    export function setTransformTool(e: any): void;
    export function setPivot(e: any): void;
    export function setCoordinate(e: any): void;
    export function alignSelection(e: any): void;
    export function distributeSelection(e: any): void;
    export function projectProfileUpdated(e: any): void;
    export function printSimulatorLog(message: string): void;

    /**
     * Version < 2.0
     * app.asar/editor/page/scene-utils/dump/get-hierarchy-dump.js
     */
    export function dumpHierarchy(scene?: cc.Scene, includeScene?: boolean): any;

    // app.asar/editor/page/scene-utils/utils.js
    export function createNodeFromAsset(uuid: string, callback: any): void;

    // app.asar/editor/page/scene-utils/node-utils.js
    export class NodeUtils {
        static getWorldBounds(node: cc.Node, size?: cc.Size, out?: cc.Rect): cc.Rect;
        static getWorldOrientedBounds(t: any, e: any, n: any, o: any, c: any, i: any): cc.Rect;
        static getScenePosition(node: cc.Node): cc.Vec2;
        static setScenePosition(node: cc.Node, position: cc.Vec2): void;
        static getSceneRotation(node: cc.Node): number;
        static setSceneRotation(node: cc.Node, rotation: number): void;
        static getWorldPosition(node: cc.Node): cc.Vec2;
        static setWorldPosition(node: cc.Node, position: cc.Vec2): void;
        static getWorldRotation(node: cc.Node): number;
        static setWorldRotation(node: cc.Node, rotation: number): void;
        static getWorldScale(node: cc.Node): number;
        static _hasFlagInComponents(node: cc.Node, flags: number): boolean;
        static _destroyForUndo(node: cc.Node, callback: any): void;
        static getNodePath(node: cc.Node): string;
        static getChildUuids(node: cc.Node, includeOwn: boolean): string[];
    }
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
    type WebGLContext = any;

    export const engine: EditorEngine;

    /** Version >= 2 */
    export function log(msg: string | any, ...subst: any[]): void;

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
    export function affineTransformInvert(t1: AffineTransform): AffineTransform;
    export function affineTransformInvertIn(t: AffineTransform): AffineTransform;
    export function affineTransformInvertOut(t: AffineTransform, out: AffineTransform): void;

    /** Version < 2.0 */
    export function degreesToRadians(degrees: number): number;
    export function radiansToDegrees(angle: number): number;

    export namespace macro {
        /** Version < 2.0 */
        export const ATTRIBUTE_NAME_POSITION: string;
        export const ATTRIBUTE_NAME_COLOR: string;
        export const ATTRIBUTE_NAME_TEX_COORD: string;

        export const VERTEX_ATTRIB_POSITION: number;
        export const VERTEX_ATTRIB_COLOR: number;
        export const VERTEX_ATTRIB_TEX_COORDS: number;
    }

    /** Version >= 2.0 */
    export namespace misc {
        export function degreesToRadians(degrees: number): number;
        export function radiansToDegrees(angle: number): number;
    }

    export class AssetLibrary {
        static loadAsset(uuid: string, callback: (error: string | null, asset: any | null) => void, options?: {}): void;
        static getLibUrlNoExt(uuid: string): string;
        static queryAssetInfo(uuid: string, callback: (error: string | null, url?: string, raw?: boolean, ctor?: any) => void): void;

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

    /** Version >= 2 */
    export namespace vmath {
        export { vec2, vec3, vec4, mat2, mat3, mat4 } from 'gl-matrix';
    }

    /** Version >= 2 */
    export namespace AffineTransform {
        export function fromMat4(out: AffineTransform, matrix: vmath.mat4): AffineTransform;
        export function transformRect(out: Rect, rect: Rect, transform: AffineTransform): Rect;

        export function identity(): AffineTransform;
        export function invert(out: AffineTransform, transform: AffineTransform): AffineTransform;
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

    export interface ActionInterval {
        _computeEaseTime(delta: number): number;
    }

    export interface Component {
        gizmo: any;
    }

    export class PrefabInfo {
        root: any;
    }

    export interface Texture2D {
        update(options?: {
            image?: DOMImageElement,
            mipmap?: boolean,
            format?: PixelFormat,
            minFilter?: Filter,
            magFilter?: Filter,
            wrapS?: WrapMode,
            wrapT?: WrapMode,
            premultiplyAlpha?: boolean,
        }): void;

        getId(): string;
    }

    export interface _BaseNode {
        _parent: any | null;
        _children: _BaseNode[];
        _tag: number;
        _active: boolean;
        _activeInHierarchy: boolean;
        _components: Component[];
        _prefab: PrefabInfo | null;
    }

    export interface Label {
        _sgNode: _ccsg.Label;
    }

    export interface Sprite extends RenderComponent {
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

        /** Version >= 2 */
        getWorldMatrix(out: vmath.mat4): vmath.mat4;

        /** Version >= 2 */
        getNodeToWorldTransformAR(out?: cc.AffineTransform): cc.AffineTransform;
        getWorldToNodeTransform(out?: cc.AffineTransform): cc.AffineTransform;
    }

    /** Version >= 2 */
    export class RenderFlow {
        static FLAG_DONOTHING: number;
        static FLAG_LOCAL_TRANFORM: number;
        static FLAG_WORLD_TRANFORM: number;
        static FLAG_TRANFORM: number;
        static FLAG_COLOR: number;
        static FLAG_OPACITY: number;
        static FLAG_UPDATE_RENDER_DATA: number;
        static FLAG_RENDER: number;
        static FLAG_CUSTOM_IA_RENDER: number;
        static FLAG_CHILDREN: number;
        static FLAG_POST_UPDATE_RENDER_DATA: number;
        static FLAG_POST_RENDER: number;
        static FLAG_FINAL: number;
    };

    export namespace renderer {
        export const _forward: renderEngine.ForwardRenderer;

        export namespace renderEngine {
            /** Version >= 2 */
            export interface Camera { }
            export interface Device { }

            export class ForwardRenderer extends renderer.Base {
                constructor(device: any, builtin: any);
                reset(): void;
                render(scene: any): void;
                renderCamera(camera: any, scene: any): void;
                _transparentStage(view: any, items: any): void;
            }

            export class Asset {
                constructor(persist?: boolean);
                unload(): void;
                reload(): void;
            }

            export class TextureAsset extends Asset {
                _texture: any;
                constructor(persist?: boolean);
                getImpl(): any;
                getId(): void;
                destroy(): void;
            }

            export class Material extends Asset {
                hash: string;
                _texIds: any;
                effect: renderer.Effect;
                _effect: renderer.Effect;
                _mainTech: renderer.Technique;
                _texture: Texture2D | null;
                constructor(persist?: boolean);
                updateHash(): void;
            }

            export class SpriteMaterial extends Material {
                effect: any;
                useTexture: boolean;
                useModel: boolean;
                use2DPos: boolean;
                useColor: boolean;
                texture: any;
                color: any;
                constructor();
                clone(): SpriteMaterial;
            }

            export class GraySpriteMaterial extends Material {
                effect: any;
                texture: any;
                color: any;
                constructor();
                clone(): GraySpriteMaterial;
            }

            export interface StencilMaterial extends Material {
                effect: any;
                useTexture: boolean;
                useModel: boolean;
                useColor: boolean;
                texture: any;
                alphaThreshold: number;
                constructor();
                clone(): StencilMaterial;
            }

            export interface IARenderData { }
            export interface InputAssembler { }
            export interface Model { }
            export interface Pool { }
            export interface RecyclePool { }
            export interface RenderData { }
            export interface Scene { }

            export interface Texture2D { }
            export interface View { }

            export namespace canvas {
                export class Device { }
                export class Texture2D { }
            }

            export namespace gfx {
                /** Buffer usage. */
                /** gl.STATIC_DRAW */
                export const USAGE_STATIC: number;
                /** gl.DYNAMIC_DRAW */
                export const USAGE_DYNAMIC: number;
                /** gl.STREAM_DRAW */
                export const USAGE_STREAM: number;

                /** Index buffer format. */
                /** gl.UNSIGNED_BYTE */
                export const INDEX_FMT_UINT8: number;
                /** gl.UNSIGNED_SHORT */
                export const INDEX_FMT_UINT16: number;
                /** gl.UNSIGNED_INT */
                export const INDEX_FMT_UINT32: number;

                /** Vertex attribute semantic. */
                export const ATTR_POSITION: string;
                export const ATTR_NORMAL: 'a_normal';
                export const ATTR_TANGENT: 'a_tangent'
                export const ATTR_BITANGENT: 'a_bitangent';
                export const ATTR_WEIGHTS: 'a_weights';
                export const ATTR_JOINTS: 'a_joints';
                export const ATTR_COLOR: 'a_color';
                export const ATTR_COLOR0: 'a_color0';
                export const ATTR_COLOR1: 'a_color1';
                export const ATTR_UV: 'a_uv';
                export const ATTR_UV0: 'a_uv0';
                export const ATTR_UV1: 'a_uv1';
                export const ATTR_UV2: 'a_uv2';
                export const ATTR_UV3: 'a_uv3';
                export const ATTR_UV4: 'a_uv4';
                export const ATTR_UV5: 'a_uv5';
                export const ATTR_UV6: 'a_uv6';
                export const ATTR_UV7: 'a_uv7';

                /** Blend equations. */
                /** gl.FUNC_ADD */
                export const BLEND_FUNC_ADD: number;
                /** gl.FUNC_SUBTRACT */
                export const BLEND_FUNC_SUBTRACT: number;
                /** gl.FUNC_REVERSE_SUBTRACT */
                export const BLEND_FUNC_REVERSE_SUBTRACT: number;

                /** Blend modes. */
                /** gl.ZERO */
                export const BLEND_ZERO: number;
                /** gl.ONE */
                export const BLEND_ONE: number;
                /** gl.SRC_COLOR */
                export const BLEND_SRC_COLOR: number;
                /** gl.ONE_MINUS_SRC_COLOR */
                export const BLEND_ONE_MINUS_SRC_COLOR: number;
                /** gl.DST_COLOR */
                export const BLEND_DST_COLOR: number;
                /** gl.ONE_MINUS_DST_COLOR */
                export const BLEND_ONE_MINUS_DST_COLOR: number;
                /** gl.SRC_ALPHA */
                export const BLEND_SRC_ALPHA: number;
                /** gl.ONE_MINUS_SRC_ALPHA */
                export const BLEND_ONE_MINUS_SRC_ALPHA: number;
                /** gl.DST_ALPHA */
                export const BLEND_DST_ALPHA: number;
                /** gl.ONE_MINUS_DST_ALPHA */
                export const BLEND_ONE_MINUS_DST_ALPHA: number;
                /** gl.CONSTANT_COLOR */
                export const BLEND_CONSTANT_COLOR: number;
                /** gl.ONE_MINUS_CONSTANT_COLOR */
                export const BLEND_ONE_MINUS_CONSTANT_COLOR: number;
                /** gl.CONSTANT_ALPHA */
                export const BLEND_CONSTANT_ALPHA: number;
                /** gl.ONE_MINUS_CONSTANT_ALPHA */
                export const BLEND_ONE_MINUS_CONSTANT_ALPHA: number;
                /** gl.SRC_ALPHA_SATURATE */
                export const BLEND_SRC_ALPHA_SATURATE: number;

                /** Cull modes. */
                export const CULL_NONE: number;
                export const CULL_FRONT: number;
                export const CULL_BACK: number;
                export const CULL_FRONT_AND_BACK: number;

                export class VertexFormat { }
                export class IndexBuffer { }
                export class VertexBuffer { }
                export class Program {
                    id: number;
                    constructor(device: any, options: any);
                    link(): void;
                    destroy(): void;
                }
                export class Texture { }
                export class Texture2D { }
                export class TextureCube { }
                export class RenderBuffer { }
                export class FrameBuffer { }
                export class Device { }

                export function attrTypeBytes(attyType: any): number;
                export function glFilter(gl: WebGLContext, filter: any, mipFilter: any): any;
                export function glTextureFmt(fmt: any): any;
            }

            export interface math { }

            export namespace renderer {
                /** Parameter types. */
                export const PARAM_INT: number;
                export const PARAM_INT2: number;
                export const PARAM_INT3: number;
                export const PARAM_INT4: number;
                export const PARAM_FLOAT: number;
                export const PARAM_FLOAT2: number;
                export const PARAM_FLOAT3: number;
                export const PARAM_FLOAT: number;
                export const PARAM_MAT2: number;
                export const PARAM_MAT3: number;
                export const PARAM_MAT4: number;
                export const PARAM_TEXTURE_2D: number;
                export const PARAM_TEXTURE_CUBE: number;

                export function addStage(name: string): void;
                export function createIA(device: any, data: any): InputAssembler | null;

                export class Pass {
                    constructor(name: string);

                    setCullMode(cullMode: number): void;

                    setBlend(
                        blendEq?: number,
                        blendSrc?: number,
                        blendDst?: number,
                        blendAlphaEq?: number,
                        blendSrcAlpha?: number,
                        blendDstAlpha?: number,
                        blendColor?: number): void;

                    setDepth(
                        depthTest?: boolean,
                        depthWrite?: boolean,
                        depthFunc?: number): void;

                    setStencilFront(
                        stencilFunc?: number,
                        stencilRef?: number,
                        stencilMask?: number,
                        stencilFailOp?: number,
                        stencilZFailOp?: number,
                        stencilZPassOp?: number,
                        stencilWriteMask?: number): void;

                    setStencilBack(
                        stencilFunc?: number,
                        stencilRef?: number,
                        stencilMask?: number,
                        stencilFailOp?: number,
                        stencilZFailOp?: number,
                        stencilZPassOp?: number,
                        stencilWriteMask?: number): void;

                    disableStencilTest(): void;
                }

                export class Technique {
                    passes: Pass[];
                    stageIDs: number[];

                    constructor(
                        stages: string[],
                        parameters: {
                            name: string,
                            type: number
                        }[],
                        passes: Pass[],
                        layer?: any);

                    setStages(stages: string[]): void;
                }

                export class Effect {
                    constructor(
                        techniques: Technique[],
                        properties?: {
                            [key: string]: any
                        },
                        defines?: {
                            name: string,
                            value: boolean
                        }[]);

                    clear(): void;
                    getTechnique(stage: any): Technique | null;
                    getProperty(name: string): any;
                    setProperty(name: string, value: any): void;
                    getDefine(name: string): any | null;
                    define(name: string, value: any): void;
                    extractDefines(out: any): any;
                }

                export interface InputAssembler { }

                export interface View { }

                export interface Light { }
                export interface Camera { }
                export interface Model { }
                export interface Scene { }

                export class Base {
                    _device: any;
                    _programLib: ProgramLib;
                    _opts: any;
                    _type2defaultValue: any;
                    _stage2fn: any;
                    _usedTextureUnits: number;
                    _viewPools: any;
                    _drawItemsPools: any;
                    _stageItemsPools: any;
                    constructor(device: any, opts: any);
                    _resetTextureUnit(): void;
                    _registerStaghe(name: any, fn: any): void;
                    _reset(): void;
                    _requestView(): void;
                    _render(view: any, scene: any): void;
                    _draw(item: any): void;
                }

                export class ProgramLib {
                    _templates: any;
                    constructor(device: any, templates: any, chunks: any);
                    define(name: any, vert: any, frag: any, defines: any): void;
                    getKey(name: string, defines: any): any;
                    getProgram(name: string, defines: any): gfx.Program;
                }
            }

            export namespace shaders {
                export const chunks: any;
                export const templates: any;
            }
        }
    }

    export interface RenderComponent {
        _renderData: any;
        markForUpdateRenderData(enabled: boolean): void;
        markForRender(enabled: boolean): void;
        markForCustomIARender(enabled: boolean): void;
        disableRender(): void;
        requestRenderData(data: any): void;
        getMaterial(): Material | null;
        _updateMaterial(material: Material): void;
        _updateBlendFunc(updateHash: boolean): void;
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

        /** Computes the world SRT from the local SRT for each bone. */
        updateWorldTransform(): void;

        /** Sets the bones and slots to the setup pose. */
        setToSetupPose(): void;

        /** Sets the bones to the setup pose, using the values form the BoneData list in the SkeletonData. */
        setBonesToSetupPose(): void;

        /** Sets the slots to the setup pose, using the values from the SlotData list in the SkeletonData. */
        setSlotsToSetupPose(): void;

        /** Finds a bone by name. */
        findBone(name: string): spine.Bone;

        /** Finds a slot by name. */
        findSlot(name: string): spine.Slot;

        /** Finds a skin by name and makes it the active skin. */
        setSkin(name: string): spine.Skin;

        /** Returns the attachment for the slot and attachment name. */
        getAttachment(slotName: string, attachmentName: string): spine.Attachment;

        /** Sets the attachment for the slot and attachment name. */
        setAttachment(slotName: string, attachmentName: string): void;

        /** Sets the premultiplied alpha value. */
        setPremultipliedAlpha(premultiplied: boolean): void;

        /** Returns whether to enable premultipled alpha. */
        isPremultipliedAlpha(): boolean;

        /** Sets skeleton data. */
        setSkeletonData(data: spine.SkeletonData, ownsDat: boolean): void;

        /** Returns the renderer of attachment. */
        getTextureAtlas(regionAttachment: spine.RegionAttachment | spine.BoundingBoxAttachment): spine.TextureAtlasRegion;

        /** Returns the blend func. */
        getBlendFunc(): cc.BlendFunc;

        /** Sets the blend func. */
        setBlendFunc(src: cc.BlendFunc | number, dst?: number): void;

        update(delta: number): void;
    }

    export class _SGSkeletonAnimation extends _SGSkeleton {
        /** Sets animation state data. */
        setAnimationStateData(stateData: spine.AnimationStateData): void;

        /** Mix applies all keyframe values, interpolated for the specified time and mixed with the current values. */
        setMix(fromAnimation: string, toAnimation: string, duration: number): void;

        /** Sets the current animation, any queued animations are cleared. */
        setAnimation(trackIndex: number, name: string, loop: boolean): spine.TrackEntry | null;

        /** Adds an animation to be played delay seconds after the current or last queued animation. */
        addAnimation(trackIndex: number, name: string, loop: boolean, delay: number = 0): spine.TrackEntry | null;

        /** Finds animation with specified name. */
        findAnimation(name: string): spine.Animation | null;

        /** Returns track entry by trackIndex. */
        getCurrent(trackIndex: number): spine.TrackEntry | null;

        /** Clears all tracks of animation state. */
        clearTracks(): void;

        /** Clears track of animation state by trackIndex. */
        clearTrack(trackIndex: number): void;

        update(delta: number): void;
    }

    export interface Skeleton {
        /** Version < 2.0 */
        _sgNode: _SGSkeletonAnimation | null;

        _skeleton: spine.Skeleton | null;

        /** Version > 2.0 */
        getState(): spine.AnimationState | undefined;

        getCurrent(trackIndex: number): sp.spine.TrackEntry;
    }
}