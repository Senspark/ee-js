import * as gl from 'gl-matrix';
import { HsvMaterial } from './EEHsvMaterial';
import { shader as fragShader } from './EEHsvShaderFrag';
import { shader as vertShader } from './EEHsvShaderVert';
import { createBrightnesMatrix, createContrastMatrix, createHueMatrix, createSaturationMatrix } from './EEHsvUtils';

const { ccclass, disallowMultiple, executeInEditMode, menu, property } = cc._decorator;

/**
 * Finds the rendering node (_ccsg.Node).
 * @param view The view.
 */
const getRenderingNode = (view: cc.Node | undefined): _ccsg.Node | undefined => {
    if (view === undefined) {
        return undefined;
    }
    {
        const component = view.getComponent(cc.Sprite);
        if (component !== null) {
            return component._sgNode;
        }
    }
    {
        const component = view.getComponent(sp.Skeleton);
        if (component !== null && component._sgNode !== null) {
            return component._sgNode;
        }
    }
    {
        const component = view.getComponent(cc.Label);
        if (component !== null) {
            return component._sgNode;
        }
    }
    return undefined;
};

const createRenderer = (view: cc.Node) => {
    if (cc.ENGINE_VERSION >= '2') {
        const renderer = new HsvRenderer_2_0_WebGL();
        if (renderer.initialize(view)) {
            return renderer;
        }
    } else {
        if (cc.sys.isNative) {
            const renderer = new HsvRenderer_1_9_Native();
            if (renderer.initialize(view)) {
                return renderer;
            }
        } else {
            const renderer = new HsvRenderer_1_9_WebGL();
            if (renderer.initialize(view)) {
                return renderer;
            }
        }
    }
    return new NullHsvRenderer();
};

interface HsvRenderer {
    initialize(view: cc.Node): boolean;
    setEnabled(enabled: boolean): void;
    updateMatrix(matrix: gl.mat4): void;
    updateMaterial(): void;
}

class NullHsvRenderer implements HsvRenderer {
    public initialize(view: cc.Node): boolean { return true; }
    public setEnabled(enabled: boolean): void { }
    public updateMatrix(matrix: gl.mat4): void { }
    public updateMaterial(): void { }
}

// tslint:disable-next-line:class-name
class HsvRenderer_1_9_WebGL implements HsvRenderer {
    private view?: cc.Node;

    private renderingNode?: _ccsg.Node;

    private program?: cc.GLProgram;
    private oldProgram?: cc.GLProgram;

    private isSupported(): boolean {
        return 'opengl' in cc.sys.capabilities;
    }

    public initialize(view: cc.Node): boolean {
        if (!this.isSupported()) {
            return false;
        }
        this.view = view;
        const program = new cc.GLProgram();
        program.initWithString(vertShader, fragShader);
        program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
        program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
        program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
        program.link();
        program.updateUniforms();
        this.program = program;
        return true;
    }

    private setRenderingNode(node: _ccsg.Node | undefined): void {
        if (node === this.renderingNode) {
            return;
        }
        if (this.renderingNode !== undefined) {
            this.renderingNode.setShaderProgram(this.oldProgram!);
        }
        this.renderingNode = node;
        if (this.renderingNode !== undefined) {
            this.oldProgram = this.renderingNode.getShaderProgram();
            this.renderingNode.setShaderProgram(this.program!);
        }
    }

    public setEnabled(enabled: boolean): void {
        if (enabled) {
            this.setRenderingNode(getRenderingNode(this.view));
        } else {
            this.setRenderingNode(undefined);
        }
    }

    public updateMatrix(matrix: gl.mat4): void {
        // Constantly update the current rendering node.
        this.setRenderingNode(getRenderingNode(this.view));
        const array: number[] = Array.prototype.slice.call(matrix);
        const location = this.program!.getUniformLocationForName('u_hsv');
        this.program!.use();
        this.program!.setUniformLocationWithMatrix4fv(location, array);
    }

    public updateMaterial(): void { }
}

// tslint:disable-next-line:class-name
class HsvRenderer_1_9_Native implements HsvRenderer {
    private view?: cc.Node;

    private renderingNode?: _ccsg.Node;

    private programState?: cc.GLProgramState;
    private oldProgramState?: cc.GLProgramState;

    private isSupported(): boolean {
        return 'opengl' in cc.sys.capabilities;
    }

    public initialize(view: cc.Node): boolean {
        if (!this.isSupported()) {
            return false;
        }
        this.view = view;
        const program = new cc.GLProgram();
        program.initWithString(vertShader, fragShader);
        program.link();
        program.updateUniforms();
        this.programState = cc.GLProgramState.getOrCreateWithGLProgram(program);
        return true;
    }

    private setRenderingNode(node: _ccsg.Node | undefined): void {
        if (node === this.renderingNode) {
            return;
        }
        if (this.renderingNode !== undefined) {
            this.renderingNode.setGLProgramState(this.oldProgramState!);
        }
        this.renderingNode = node;
        if (this.renderingNode !== undefined) {
            this.oldProgramState = this.renderingNode.getGLProgramState();
            this.renderingNode.setGLProgramState(this.programState!);
        }
    }

    public setEnabled(enabled: boolean): void {
        if (enabled) {
            this.setRenderingNode(getRenderingNode(this.view));
        } else {
            this.setRenderingNode(undefined);
        }
    }

    public updateMatrix(matrix: gl.mat4): void {
        // Constantly update the current rendering node.
        this.setRenderingNode(getRenderingNode(this.view));
        const array: number[] = Array.prototype.slice.call(matrix);
        this.programState!.setUniformMat4('u_hsv', array);
    }

    public updateMaterial(): void { }
}

// tslint:disable-next-line:class-name
class HsvRenderer_2_0_WebGL implements HsvRenderer {
    private view?: cc.Node;
    private material: HsvMaterial | null;

    public constructor() {
        this.material = null;
    }

    public initialize(view: cc.Node): boolean {
        this.view = view;
        const material = new HsvMaterial();
        this.material = material;
        return true;
    }

    public setEnabled(enabled: boolean): void {
        // Do nothing.
    }

    public updateMatrix(matrix: gl.mat4): void {
        const material = this.material;
        if (material === null) {
            return;
        }
        const array: number[] = Array.prototype.slice.call(matrix);
        // Convert gl.mat4 to cc.vmath.mat4.
        const convertedMatrix = cc.vmath.mat4.create();
        cc.vmath.mat4.set.call(null, convertedMatrix, ...array);
        material.setMatrix(convertedMatrix);
    }

    public updateMaterial(): void {
        const material = this.material;
        if (material === null) {
            return;
        }
        const view = this.view;
        if (view === undefined) {
            return;
        }
        const sprite = view.getComponent(cc.Sprite);
        if (material === sprite.getMaterial()) {
            return;
        }
        sprite._updateMaterial(material);

        const texture = sprite.spriteFrame.getTexture();
        material.setTexture(texture);
        if (sprite._renderData !== null) {
            sprite._renderData._material = material;
        }
        sprite.markForUpdateRenderData(true);
        sprite.markForRender(true);
    }
}

@ccclass
@disallowMultiple
@executeInEditMode
@menu('ee/HsvComponent')
export class HsvComponent extends cc.Component {
    @property(cc.Integer)
    private _hue: number = 0;

    @property(cc.Float)
    private _brightness: number = 0.0;

    @property(cc.Float)
    private _saturation: number = 1.0;

    @property(cc.Float)
    private _contrast: number = 1.0;

    @property({
        type: cc.Integer,
        min: 0,
        max: 359,
        slide: true,
    })
    private get hue(): number {
        return this._hue;
    }

    private set hue(value: number) {
        if (this._hue === value) {
            return;
        }
        this._hue = value;
        this.hueMatrixDirty = true;
    }

    @property({
        type: cc.Float,
        min: -1.0,
        max: +1.0,
        slide: true,
    })
    private get brightness(): number {
        return this._brightness;
    }

    private set brightness(value: number) {
        if (this._brightness === value) {
            return;
        }
        this._brightness = value;
        this.brightnessMatrixDirty = true;
    }

    @property({ type: cc.Float })
    private get saturation(): number {
        return this._saturation;
    }

    private set saturation(value: number) {
        if (this._saturation === value) {
            return;
        }
        this._saturation = value;
        this.saturationMatrixDirty = true;
    }

    @property({ type: cc.Float })
    private get contrast(): number {
        return this._contrast;
    }

    private set contrast(value: number) {
        if (this._contrast === value) {
            return;
        }
        this._contrast = value;
        this.contrastMatrixDirty = true;
    }

    private renderer: HsvRenderer;

    private hueMatrixDirty = true;
    private saturationMatrixDirty = true;
    private brightnessMatrixDirty = true;
    private contrastMatrixDirty = true;

    private matrix: gl.mat4;
    private hueMatrix: gl.mat4;
    private saturationMatrix: gl.mat4;
    private brightnessMatrix: gl.mat4;
    private contrastMatrix: gl.mat4;

    constructor() {
        super();

        this.matrix = gl.mat4.create();
        this.hueMatrix = gl.mat4.create();
        this.saturationMatrix = gl.mat4.create();
        this.brightnessMatrix = gl.mat4.create();
        this.contrastMatrix = gl.mat4.create();
        this.renderer = new NullHsvRenderer();
    }

    public onLoad(): void {
        this.renderer = createRenderer(this.node);
    }

    public onEnable(): void {
        this.renderer.setEnabled(true);
    }

    public onDisable(): void {
        this.renderer.setEnabled(false);
    }

    public update(delta: number): void {
        if (this.updateMatrix()) {
            this.renderer.updateMatrix(this.matrix);
        }
        this.renderer.updateMaterial();
    }

    private updateMatrix(): boolean {
        let dirty = false;
        dirty = this.updateHueMatrix() || dirty;
        dirty = this.updateSaturationMatrix() || dirty;
        dirty = this.updateBrightnessMatrix() || dirty;
        dirty = this.updateContrastMatrix() || dirty;
        if (dirty) {
            gl.mat4.identity(this.matrix);
            gl.mat4.multiply(this.matrix, this.matrix, this.hueMatrix);
            gl.mat4.multiply(this.matrix, this.matrix, this.saturationMatrix);
            gl.mat4.multiply(this.matrix, this.matrix, this.brightnessMatrix);
            gl.mat4.multiply(this.matrix, this.matrix, this.contrastMatrix);
            return true;
        }
        return false;
    }

    private updateHueMatrix(): boolean {
        if (this.hueMatrixDirty) {
            this.hueMatrixDirty = false;
            this.hueMatrix = createHueMatrix(this.hue);
            return true;
        }
        return false;
    }

    private updateSaturationMatrix(): boolean {
        if (this.saturationMatrixDirty) {
            this.saturationMatrixDirty = false;
            this.saturationMatrix = createSaturationMatrix(this.saturation);
            return true;
        }
        return false;
    }

    private updateBrightnessMatrix(): boolean {
        if (this.brightnessMatrixDirty) {
            this.brightnessMatrixDirty = false;
            this.brightnessMatrix = createBrightnesMatrix(this.brightness, this.brightness, this.brightness);
            return true;
        }
        return false;
    }

    private updateContrastMatrix(): boolean {
        if (this.contrastMatrixDirty) {
            this.contrastMatrixDirty = false;
            this.contrastMatrix = createContrastMatrix(this.contrast, this.contrast, this.contrast);
            return true;
        }
        return false;
    }
}
