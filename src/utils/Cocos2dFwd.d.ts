// tslint:disable:class-name
// tslint:disable:member-access
// tslint:disable:member-ordering
// tslint:disable:no-empty-interface
// tslint:disable:no-namespace
// tslint:disable:variable-name

interface AssetDB {
    queryPathByUuid(uuid: string, callback: (error: string | null, result: string | null) => void): void;
    queryUrlByUuid(uuid: string, callback: (error: string | null, result: string | null) => void): void;
    queryInfoByUuid(uuid: string, callback: (error: string | null, result: {}) => void): void;
    queryMetaInfoByUuid(uuid: string, callback: (error: string | null, result: any) => void): void;
    queryUuidByUrl(url: string, callback: (error: string | null, uuid: string | null) => void): void;
    queryAssets(pattern: string, type: string, callback: (error: string | null, result: any) => void): void;
}

interface AssetTable {
    getUuid(path: string, type?: string): string;
    getUuidArray(path: string, type?: string, out_urls?: string[]): string[];
}

interface Profile {
    data: any;
    save(): void;
}

interface ProfileDB {
    load(path: string, callback: (err: string | null, profile: Profile | null) => void): void;
}

declare namespace Editor {
    const assetdb: AssetDB;
    const Profile: ProfileDB;

    function polymerElement(data: object): void;

    // app.asar/editor/page/gizmos/elements/gizmo.js
    class Gizmo {
        _root: any;
        node: cc.Node | null;
        nodes: cc.Node[];
        topNodes: cc.Node[];
        selecting: boolean;
        editing: boolean;
        hovering: boolean;

        layer(): string;
        createRoot(): void;
        registerMoveSvg(t: any, e: any, i: any): void;
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

    namespace UI {
        // app.asar/editor-framework/lib/renderer/ui/utils
        namespace PolymerUtils {
            function registerElement(data: object): void;
            function registerPanel(e: any, t: any): void;
            const elements: { [key: string]: any };
            const panels: { [key: string]: any };
        }
    }

    class Ipc {
        static sendToAll(event: string, ...args: any[]): void;
    }

    // app.asar/editor-framework/lib/share
    class IpcListener {
        on(event: string, callback: any): void;
        once(event: string, callback: any): void;
        clear(): void;
    }

    namespace Selection {
        function hover(e: any, t: any): void;
        function select(e: any, t: any): void;
    }

    namespace Utils {
        class Polygon { }
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
    getIntersectionList(rect: cc.Rect, t?: boolean): Array<{
        node: cc.Node,
        aabb?: cc.Rect,
        obb?: Editor.Utils.Polygon,
    }>;
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
    const view: any;
    function reset(): void;
    function _softReload(e: any, t: any): void;
    function softReload(e: any, t: any): void;
    function defaultScene(): void;
    function newScene(e: any): void;
    function _loadSceneByUuid(uuid: string, callback: any): void;
    function loadSceneByUuid(uuid: string, callback: any): void;
    function initScene(e: any): void;
    function getEditingWorkspace(): object;
    function loadWorkspace(e: any, t: any): void;
    function stashScene(e: any): void;
    function _applyCanvasPreferences(e: any, t: any): void;
    const currentScene: () => cc.Scene;
    const title: () => string;
    function updateTitle(e: any): void;
    function save(e: any): void;
    function confirmClose(): void;
    function close(e: any, callback: any): void;
    const dirty: boolean;
    function copyNodes(e: any): void;
    function pasteNodes(e: any): void;
    function createNodes(uuids: string[], t: any, options: { unlinkPrefab?: boolean }, callback: any): void;
    function createNodesAt(uuids: string[], x: number, y: number, options: { unlinkPrefab?: boolean }): void;
    function createNodeByClassID(e: any, t: any, n: any, i: any): void;
    function createNodeByPrefab(e: any, t: any, n: any, i: any): void;
    function deleteNodes(e: any): void;
    function duplicateNodes(e: any): void;
    function moveNodes(e: any, t: any, n: any): void;
    function addComponent(e: any, t: any): void;
    function removeComponent(e: any, t: any): void;
    function copyComponent(e: any): void;
    function pasteComponent(e: any, t: any): void;
    function newProperty(e: any, t: any, n: any): void;
    function resetProperty(e: any, t: any, n: any): void;
    function setProperty(e: any): void;
    function createPrefab(e: any, t: any): void;
    function applyPrefab(e: any): void;
    function revertPrefab(e: any): void;
    function setPrefabSync(e: any): void;
    function breakPrefabInstance(e: any): void;
    function linkPrefab(): void;
    function dumpNode(e: any): any;
    function select(e: any): void;
    function unselect(e: any): void;
    function hoverin(e: any): void;
    function hoverout(e: any): void;
    function activate(e: any): void;
    function deactivate(e: any): void;
    function hitTest(x: number, y: number): cc.Node | undefined;
    function rectHitTest(x: number, y: number, width: number, height: number): cc.Node | undefined;
    function _syncPrefab(e: any, t: any): void;
    function syncPrefab(e: any): void;
    function assetChanged(e: any): void;
    function assetsMoved(e: any): void;
    function setTransformTool(e: any): void;
    function setPivot(e: any): void;
    function setCoordinate(e: any): void;
    function alignSelection(e: any): void;
    function distributeSelection(e: any): void;
    function projectProfileUpdated(e: any): void;
    function printSimulatorLog(message: string): void;

    /**
     * Version < 2.0
     * app.asar/editor/page/scene-utils/dump/get-hierarchy-dump.js
     */
    function dumpHierarchy(scene?: cc.Scene, includeScene?: boolean): any;

    // app.asar/editor/page/scene-utils/utils.js
    function createNodeFromAsset(uuid: string, callback: any): void;

    // app.asar/editor/page/scene-utils/node-utils.js
    class NodeUtils {
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
    class Node {
        getShaderProgram(): cc.GLProgram;
        setShaderProgram(program: cc.GLProgram): void;

        /** For native. */
        getGLProgramState(): cc.GLProgramState;
        setGLProgramState(state: cc.GLProgramState): void;
    }

    class Label extends Node {
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

    const engine: EditorEngine;

    /** Version >= 2 */
    function log(msg: string | any, ...subst: any[]): void;

    /** Creates a cc.AffineTRansform object with all contents in the matrix. */
    function affineTransformMake(a: number, b: number, c: number, d: number, tx: number, ty: number): AffineTransform;

    /** Clones a cc.AffineTransform object from the specified transform. */
    function affineTransformClone(t: AffineTransform): AffineTransform;

    /**
     * Applies the affine transformation on a point.
     * @param point Point or x.
     * @param transOrY Transform matrix or y.
     * @param t Tranform matrix.
     */
    function pointApplyAffineTransform(
        point: Vec2 | number,
        transOrY: number | AffineTransform,
        t?: AffineTransform): Vec2;

    /** Applies the affine transformation on a size. */
    function sizeApplyAffineTransform(size: Size, t: AffineTransform): Size;

    /** Creates an identity transformation matrix. */
    function affineTransformMakeIdentity(): AffineTransform;

    /** Applies the affine transform on a rect. */
    function rectApplyAffineTransform(rect: Rect, t: AffineTransform): Record;

    function affineTransformTranslate(t: AffineTransform, tx: number, ty: number): AffineTransform;
    function affineTransformScale(t: AffineTransform, sx: number, sy: number): AffineTransform;
    function affineTransformRotate(t: AffineTransform, angle: number): AffineTransform;
    function affineTransformConcat(t1: AffineTransform, t2: AffineTransform): AffineTransform;
    function affineTransformConcatIn(t1: AffineTransform, t2: AffineTransform): AffineTransform;
    function affineTransformEqualToTranform(t1: AffineTransform, t2: AffineTransform): boolean;
    function affineTransformInvert(t1: AffineTransform): AffineTransform;
    function affineTransformInvertIn(t: AffineTransform): AffineTransform;
    function affineTransformInvertOut(t: AffineTransform, out: AffineTransform): void;

    /** Version < 2.0 */
    function degreesToRadians(degrees: number): number;
    function radiansToDegrees(angle: number): number;

    namespace macro {
        /** Version < 2.0 */
        const ATTRIBUTE_NAME_POSITION: string;
        const ATTRIBUTE_NAME_COLOR: string;
        const ATTRIBUTE_NAME_TEX_COORD: string;

        const VERTEX_ATTRIB_POSITION: number;
        const VERTEX_ATTRIB_COLOR: number;
        const VERTEX_ATTRIB_TEX_COORDS: number;
    }

    /** Version >= 2.0 */
    namespace misc {
        function degreesToRadians(degrees: number): number;
        function radiansToDegrees(angle: number): number;
    }

    class AssetLibrary {
        static loadAsset(uuid: string, callback: (error: string | null, asset: any | null) => void, options?: {}): void;
        static getLibUrlNoExt(uuid: string): string;
        static queryAssetInfo(uuid: string, callback: (
            error: string | null,
            url?: string,
            raw?: boolean,
            ctor?: any,
        ) => void): void;

        /**
         * Gets the exists asset by uuid.
         * @return The existing asset, if not loaded, just returns null.
         */
        static getAssetByUuid(uuid: string): Asset | null;
    }

    namespace loader {
        const _resources: AssetTable;
        function _loadResUuids(
            uuids: string[],
            progressCallback?: (completedCount: number, totalCount: number, item: any) => void,
            completeCallback?: (error: Error, resource: any) => void): void;
    }

    /** Version >= 2 */
    namespace vmath {
        export { vec2, vec3, vec4, mat2, mat3, mat4 } from 'gl-matrix';
    }

    /** Version >= 2 */
    namespace AffineTransform {
        function fromMat4(out: AffineTransform, matrix: vmath.mat4): AffineTransform;
        function transformRect(out: Rect, rect: Rect, transform: AffineTransform): Rect;

        function identity(): AffineTransform;
        function invert(out: AffineTransform, transform: AffineTransform): AffineTransform;
    }

    interface Object {
        _objFlags: number;
    }

    namespace Object {
        enum Flags {
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

    interface Action {
        startWithTarget(target: any): void;
        stop(): void;
        step(delta: number): void;
        update(delta: number): void;
    }

    interface ActionInterval {
        _computeEaseTime(delta: number): number;
    }

    interface Component {
        gizmo: any;
    }

    class PrefabInfo {
        root: any;
    }

    interface Event {
        _propagationStopped: boolean;
        _propagationImmediateStopped: boolean;
    }

    class EventListener {
        owner: Node;
        checkAvailable(): boolean;
        clone(): EventListener;
        isEnabled(): boolean;
        setEnabled(enabled: boolean): void;
    }

    class TouchOneByOne extends EventListener {
        onTouchBegan: ((touch: Touch, event: Event.EventTouch) => boolean) | null;
        onTouchMoved: ((touch: Touch, event: Event.EventTouch) => void) | null;
        onTouchEnded: ((touch: Touch, event: Event.EventTouch) => void) | null;
        onTouchCancelled: ((touch: any, event: any) => void) | null;
        isSwalowTouches(): boolean;
        setSwallowTouches(needSwallow: boolean): void;
    }

    interface Texture2D {
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

    interface _BaseNode {
        /** Version 2.0.2 */
        parent: Node;

        _parent: any | null;
        _children: _BaseNode[];
        _tag: number;
        _active: boolean;
        _activeInHierarchy: boolean;
        _components: Component[];
        _prefab: PrefabInfo | null;
    }

    interface Label {
        _sgNode: _ccsg.Label;
    }

    interface Sprite extends RenderComponent {
        _sgNode: Scale9Sprite;
    }

    class Scale9Sprite extends _ccsg.Node {
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

    interface Node {
        /** Version < 2 */
        _sgNode: _ccsg.Node;

        _touchListener: TouchOneByOne | null;
        _mouseListener: EventListener | null;

        _hitTest(point: Vec2, listener?: EventListener): boolean;
        _getCapturingTargets(eventType: string, targets: Node[]): void;

        /** Version >= 2 */
        getWorldMatrix(out: vmath.mat4): vmath.mat4;

        /** Version >= 2 */
        getNodeToWorldTransformAR(out?: cc.AffineTransform): cc.AffineTransform;
        getWorldToNodeTransform(out?: cc.AffineTransform): cc.AffineTransform;
    }

    interface PageView {
        _updatePageView(): void;
    }

    /** Version >= 2 */
    class RenderFlow {
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
    }

    namespace renderer {
        const _forward: renderEngine.ForwardRenderer;

        namespace renderEngine {
            /** Version >= 2 */
            interface Camera { }
            interface Device { }

            class ForwardRenderer extends renderer.Base {
                constructor(device: any, builtin: any);
                reset(): void;
                render(scene: any): void;
                renderCamera(camera: any, scene: any): void;
                _transparentStage(view: any, items: any): void;
            }

            class Asset {
                constructor(persist?: boolean);
                unload(): void;
                reload(): void;
            }

            class TextureAsset extends Asset {
                _texture: any;
                constructor(persist?: boolean);
                getImpl(): any;
                getId(): void;
                destroy(): void;
            }

            class Material extends Asset {
                hash: string;
                _texIds: any;
                effect: renderer.Effect;
                _effect: renderer.Effect;
                _mainTech: renderer.Technique;
                _texture: Texture2D | null;
                constructor(persist?: boolean);
                updateHash(): void;
            }

            class SpriteMaterial extends Material {
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

            class GraySpriteMaterial extends Material {
                effect: any;
                texture: any;
                color: any;
                constructor();
                clone(): GraySpriteMaterial;
            }

            class StencilMaterial extends Material {
                effect: any;
                useTexture: boolean;
                useModel: boolean;
                useColor: boolean;
                texture: any;
                alphaThreshold: number;
                constructor();
                clone(): StencilMaterial;
            }

            interface IARenderData { }
            interface InputAssembler { }
            interface Model { }
            interface Pool { }
            interface RecyclePool { }
            interface RenderData { }
            interface Scene { }

            interface View { }

            namespace canvas {
                class Device { }
                class Texture2D { }
            }

            namespace gfx {
                /** Buffer usage. */
                /** gl.STATIC_DRAW */
                const USAGE_STATIC: number;
                /** gl.DYNAMIC_DRAW */
                const USAGE_DYNAMIC: number;
                /** gl.STREAM_DRAW */
                const USAGE_STREAM: number;

                /** Index buffer format. */
                /** gl.UNSIGNED_BYTE */
                const INDEX_FMT_UINT8: number;
                /** gl.UNSIGNED_SHORT */
                const INDEX_FMT_UINT16: number;
                /** gl.UNSIGNED_INT */
                const INDEX_FMT_UINT32: number;

                /** Vertex attribute semantic. */
                const ATTR_POSITION: string;
                const ATTR_NORMAL: 'a_normal';
                const ATTR_TANGENT: 'a_tangent';
                const ATTR_BITANGENT: 'a_bitangent';
                const ATTR_WEIGHTS: 'a_weights';
                const ATTR_JOINTS: 'a_joints';
                const ATTR_COLOR: 'a_color';
                const ATTR_COLOR0: 'a_color0';
                const ATTR_COLOR1: 'a_color1';
                const ATTR_UV: 'a_uv';
                const ATTR_UV0: 'a_uv0';
                const ATTR_UV1: 'a_uv1';
                const ATTR_UV2: 'a_uv2';
                const ATTR_UV3: 'a_uv3';
                const ATTR_UV4: 'a_uv4';
                const ATTR_UV5: 'a_uv5';
                const ATTR_UV6: 'a_uv6';
                const ATTR_UV7: 'a_uv7';

                /** Blend equations. */
                /** gl.FUNC_ADD */
                const BLEND_FUNC_ADD: number;
                /** gl.FUNC_SUBTRACT */
                const BLEND_FUNC_SUBTRACT: number;
                /** gl.FUNC_REVERSE_SUBTRACT */
                const BLEND_FUNC_REVERSE_SUBTRACT: number;

                /** Blend modes. */
                /** gl.ZERO */
                const BLEND_ZERO: number;
                /** gl.ONE */
                const BLEND_ONE: number;
                /** gl.SRC_COLOR */
                const BLEND_SRC_COLOR: number;
                /** gl.ONE_MINUS_SRC_COLOR */
                const BLEND_ONE_MINUS_SRC_COLOR: number;
                /** gl.DST_COLOR */
                const BLEND_DST_COLOR: number;
                /** gl.ONE_MINUS_DST_COLOR */
                const BLEND_ONE_MINUS_DST_COLOR: number;
                /** gl.SRC_ALPHA */
                const BLEND_SRC_ALPHA: number;
                /** gl.ONE_MINUS_SRC_ALPHA */
                const BLEND_ONE_MINUS_SRC_ALPHA: number;
                /** gl.DST_ALPHA */
                const BLEND_DST_ALPHA: number;
                /** gl.ONE_MINUS_DST_ALPHA */
                const BLEND_ONE_MINUS_DST_ALPHA: number;
                /** gl.CONSTANT_COLOR */
                const BLEND_CONSTANT_COLOR: number;
                /** gl.ONE_MINUS_CONSTANT_COLOR */
                const BLEND_ONE_MINUS_CONSTANT_COLOR: number;
                /** gl.CONSTANT_ALPHA */
                const BLEND_CONSTANT_ALPHA: number;
                /** gl.ONE_MINUS_CONSTANT_ALPHA */
                const BLEND_ONE_MINUS_CONSTANT_ALPHA: number;
                /** gl.SRC_ALPHA_SATURATE */
                const BLEND_SRC_ALPHA_SATURATE: number;

                /** Cull modes. */
                const CULL_NONE: number;
                const CULL_FRONT: number;
                const CULL_BACK: number;
                const CULL_FRONT_AND_BACK: number;

                class VertexFormat { }
                class IndexBuffer { }
                class VertexBuffer { }
                class Program {
                    id: number;
                    constructor(device: any, options: any);
                    link(): void;
                    destroy(): void;
                }
                class Texture { }
                class Texture2D { }
                class TextureCube { }
                class RenderBuffer { }
                class FrameBuffer { }
                class Device { }

                function attrTypeBytes(attyType: any): number;
                function glFilter(gl: WebGLContext, filter: any, mipFilter: any): any;
                function glTextureFmt(fmt: any): any;
            }

            interface math { }

            namespace renderer {
                /** Parameter types. */
                const PARAM_INT: number;
                const PARAM_INT2: number;
                const PARAM_INT3: number;
                const PARAM_INT4: number;
                const PARAM_FLOAT: number;
                const PARAM_FLOAT2: number;
                const PARAM_FLOAT3: number;
                const PARAM_FLOAT: number;
                const PARAM_MAT2: number;
                const PARAM_MAT3: number;
                const PARAM_MAT4: number;
                const PARAM_TEXTURE_2D: number;
                const PARAM_TEXTURE_CUBE: number;

                function addStage(name: string): void;
                function createIA(device: any, data: any): InputAssembler | null;

                class Pass {
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

                class Technique {
                    passes: Pass[];
                    stageIDs: number[];

                    constructor(
                        stages: string[],
                        parameters: Array<{
                            name: string,
                            type: number,
                            size?: number,
                        }>,
                        passes: Pass[],
                        layer?: any);

                    setStages(stages: string[]): void;
                }

                class Effect {
                    constructor(
                        techniques: Technique[],
                        properties?: {
                            [key: string]: any,
                        },
                        defines?: Array<{
                            name: string,
                            value: any,
                        }>);

                    clear(): void;
                    getTechnique(stage: any): Technique | null;
                    getProperty(name: string): any;
                    setProperty(name: string, value: any): void;
                    getDefine(name: string): any | null;
                    define(name: string, value: any): void;
                    extractDefines(out: any): any;
                }

                interface InputAssembler { }

                interface View { }

                interface Light { }
                interface Camera { }
                interface Model { }
                interface Scene { }

                class Base {
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

                class ProgramLib {
                    _templates: any;
                    constructor(device: any, templates: any, chunks: any);
                    define(name: any, vert: any, frag: any, defines: any): void;
                    getKey(name: string, defines: any): any;
                    getProgram(name: string, defines: any): gfx.Program;
                }
            }

            namespace shaders {
                const chunks: any;
                const templates: any;
            }
        }
    }

    interface RenderComponent {
        _material: any;
        _renderData: any;
        __allocedDatas: any[];
        _vertexFormat: any;
        _assembler: any;
        _postAssembler: any;
        _canRender(): boolean;
        markForUpdateRenderData(enabled: boolean): void;
        markForRender(enabled: boolean): void;
        markForCustomIARender(enabled: boolean): void;
        disableRender(): void;
        requestRenderData(): any;
        destroyRenderData(data: any): void;
        _updateColor(): void;
        getMaterial(): Material | null;
        _updateMaterial(material: Material): void;
        _updateBlendFunc(updateHash: boolean): void;
    }

    /** shaders */
    namespace gl {
        /** Invalidates the GL state cache. */
        function invalidateStateCache(): void;

        /** Uses the GL program in case program is different than the current one. */
        function useProgram(program: GLProgram): void;

        /** Deletes the GL program. If it is the one that is being used, it invalidates it. */
        function deleteProgram(program: GLProgram): void;

        /** Uses a blending function in case it is not already used. */
        function blendFunc(src: number, dst: number): void;

        /** If the texture is not already bound, it binds it. */
        function bindTexture2D(texture: cc.Texture2D): void;

        /** It will delete the given texture. If the texture was bound, it will invalidate the cached. */
        function deleteTexture2D(texture: cc.Texture2D): void;
    }

    class GLProgram {
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
    class UniformValue {
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
    class GLProgramState {
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
    }

    class shaderCache {
        /** Reloads the default shaders. */
        static reloadDefaultShaders(): void;

        /** Returns a GL program for the given key. */
        static getProgram(key: string): GLProgram;

        /** Adds a GL program to the cache for the given key. */
        static addProgram(program: GLProgram, key: string): void;
    }

    /** kazmath */
    namespace math {
        function vec3(x: number | Vec3, y?: number, z?: number): Vec3;

        class Vec3 {
            static zero: Vec3;
            x: number;
            y: number;
            z: number;
            constructor(x: number | Vec3, y?: number, z?: number);
            fill(x: number | Vec3, y?: number, z?: number): void;
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

        class Quaternion {
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

        class Matrix3 {
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
        function mat4Identity(matrix: Matrix4): Matrix4;

        /** Calculates the inverse of matrix and stores the result in out. */
        function mat4Inverse(out: Matrix4, matrix: Matrix4): Matrix4 | null;

        /** Multiples x with y and stores the result in out, returns out. */
        function mat4Multiply(out: Matrix4, x: Matrix4, y: Matrix4): Matrix4;

        /**
         * Builds a translation matrix. All other elements in the matrix
         * will be set to zero except for the diagonal which is set to 1.0
         */
        function mat4Translation(matrix: Matrix4, x: number, y: number, z: number): Matrix4;

        class Matrix4 {
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

            /**
             * Builds a 4x4 OpenGL transformation matrix using a 3x3 rotation matrix and a 3d vector representing a
             * translation.
             */
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
            swap(r1: number, c1: number, r2: number, c2: number): void;

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
    class _SGSkeleton extends _ccsg.Node {
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
        getTextureAtlas(
            regionAttachment: spine.RegionAttachment | spine.BoundingBoxAttachment): spine.TextureAtlasRegion;

        /** Returns the blend func. */
        getBlendFunc(): cc.BlendFunc;

        /** Sets the blend func. */
        setBlendFunc(src: cc.BlendFunc | number, dst?: number): void;

        update(delta: number): void;
    }

    class _SGSkeletonAnimation extends _SGSkeleton {
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

    interface Skeleton extends cc.RenderComponent {
        /** Version < 2.0 */
        _sgNode: _SGSkeletonAnimation | null;

        _skeleton: spine.Skeleton | null;

        /** Version > 2.0 */
        _renderDatas: any[]; // Don't use _renderData.

        getState(): spine.AnimationState | undefined;

        getCurrent(trackIndex: number): sp.spine.TrackEntry;
    }
}

declare namespace ee {
    namespace core {
        class LogLevel {
            static readonly Verbose: LogLevel;
            static readonly Debug: LogLevel;
            static readonly Info: LogLevel;
            static readonly Warn: LogLevel;
            static readonly Error: LogLevel;
            static readonly Assert: LogLevel;
            constructor(priority: number, desc: string);

            priority: number;
        }

        class Logger {
            static getSystemLogger(): this;
            static setSystemLogger(logger: Logger): void;

            constructor();
            constructor(tag: string);
            constructor(tag: string, callback: (level: LogLevel, tag: string, message: string) => void);

            setEnabled(enabled: boolean): void;

            log(level: LogLevel, formatString: string, ...args: any[]): void;
            verbose(formatString: string, ...args: any[]): void;
            debug(formatString: string, ...args: any[]): void;
            info(formatString: string, ...args: any[]): void;
            warn(formatString: string, ...args: any[]): void;
            error(formatString: string, ...args: any[]): void;
            wtf(formatString: string, ...args: any[]): void;
        }
    }

    namespace ads {
        class IInterstitialAd {
            isLoaded(): boolean;
            load(): void;
            show(): boolean;
            setResultCallback(callback: () => void): void;
            setOnClickedCallback(callback: () => void): void;
            doOnClicked(): void;
        }

        class IRewardedVideo {
            isLoaded(): boolean;
            load(): void;
            show(): boolean;
            setResultCallback(callback: (boolean) => void): void;
            setOnClickedCallback(callback: () => void): void;
            doOnClicked(): void;
        }

        class MultiRewardedVideo extends IRewardedVideo {
            constructor();
            addItem(item: IRewardedVideo): this;
        }
    }

    namespace ironsource {
        class IronSource {
            constructor();
            constructor(logger: ee.core.Logger);

            initialize(gameId: string): void;
            createRewardedVideo(placementId: string): ads.IRewardedVideo;
            createInterstitialAd(placementId: string): ads.IInterstitialAd;
            setCloseTimeout(timeout: number): void;
        }
    }
}