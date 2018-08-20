import * as gl from 'gl-matrix';

import vertShader from './HsvShaderVert';
import fragShader from './HsvShaderFrag';
import { createHueMatrix, createSaturationMatrix, createBrightnesMatrix, createContrastMatrix } from './HsvUtils';

const { ccclass, disallowMultiple, executeInEditMode, menu, property } = cc._decorator;

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
    private get hue() {
        return this._hue;
    };

    private set hue(value) {
        if (this._hue === value) {
            return;
        }
        this._hue = value;
        this.hueMatrixDirty = true;
    };

    @property({
        type: cc.Float,
        min: -1.0,
        max: +1.0,
        slide: true,
    })
    private get brightness() {
        return this._brightness;
    };

    private set brightness(value) {
        if (this._brightness === value) {
            return;
        }
        this._brightness = value;
        this.brightnessMatrixDirty = true;
    };

    @property({ type: cc.Float })
    private get saturation() {
        return this._saturation;
    };

    private set saturation(value) {
        if (this._saturation === value) {
            return;
        }
        this._saturation = value;
        this.saturationMatrixDirty = true;
    };

    @property({ type: cc.Float })
    private get contrast() {
        return this._contrast;
    };

    private set contrast(value) {
        if (this._contrast === value) {
            return;
        }
        this._contrast = value;
        this.contrastMatrixDirty = true;
    };

    private renderingNode?: _ccsg.Node;

    private program?: cc.GLProgram;
    private oldProgram?: cc.GLProgram;

    /* For native. */
    private programState?: cc.GLProgramState;
    private oldProgramState?: cc.GLProgramState;

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

        if (cc.ENGINE_VERSION >= '2') {
            // TODO.
        } else {
            this.initializeShader();
        }
    };

    private isSupported(): boolean {
        return 'opengl' in cc.sys.capabilities
    };

    private initializeShader(): void {
        if (!this.isSupported()) {
            return;
        }
        this.program = new cc.GLProgram();
        this.program.initWithString(vertShader, fragShader);
        if (!cc.sys.isNative) {
            this.program.addAttribute(<string><any>cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this.program.addAttribute(<string><any>cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this.program.addAttribute(<string><any>cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
        }
        this.program.link();
        this.program.updateUniforms();
        if (cc.sys.isNative) {
            this.programState = cc.GLProgramState.getOrCreateWithGLProgram(this.program);
        }
    };

    public onEnable(): void {
        if (!this.isSupported()) {
            return;
        }
        this.setRenderingNode(this.getRenderingNode());
    };

    public onDisable(): void {
        if (!this.isSupported()) {
            return;
        }
        this.setRenderingNode(undefined);
    };

    public update(delta: number): void {
        if (!this.isSupported()) {
            return;
        }
        if (this.enabled) {
            // Constantly update the current rendering node.
            this.setRenderingNode(this.getRenderingNode());
        }
        if (!this.updateMatrix()) {
            return;
        }
        let array: number[] = Array.prototype.slice.call(this.matrix);
        if (cc.sys.isNative) {
            this.programState!.setUniformMat4('u_hsv', array);
        } else {
            let location = this.program!.getUniformLocationForName('u_hsv');
            this.program!.use();
            this.program!.setUniformLocationWithMatrix4fv(location, array);
        }
    };

    private getRenderingNode(): _ccsg.Node | undefined {
        {
            let component = this.getComponent(cc.Sprite);
            if (component !== null) {
                return component._sgNode;
            }
        }
        {
            let component = this.getComponent(sp.Skeleton);
            if (component !== null && component._sgNode !== null) {
                return component._sgNode;
            }
        }
        {
            let component = this.getComponent(cc.Label);
            if (component !== null) {
                return component._sgNode;
            }
        }
        return undefined;
    };

    private setRenderingNode(node: _ccsg.Node | undefined) {
        if (node === this.renderingNode) {
            return;
        }
        if (this.renderingNode !== undefined) {
            // Restore old program.
            if (cc.sys.isNative) {
                this.renderingNode.setGLProgramState(this.oldProgramState!);
            } else {
                this.renderingNode.setShaderProgram(this.oldProgram!);
            }
        }
        this.renderingNode = node;
        if (this.renderingNode !== undefined) {
            // Apply custom program.
            if (cc.sys.isNative) {
                this.oldProgramState = this.renderingNode.getGLProgramState();
                this.renderingNode.setGLProgramState(this.programState!);
            } else {
                this.oldProgram = this.renderingNode.getShaderProgram();
                this.renderingNode.setShaderProgram(this.program!);
            }
        }
    };

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
    };

    private updateHueMatrix(): boolean {
        if (this.hueMatrixDirty) {
            this.hueMatrixDirty = false;
            this.hueMatrix = createHueMatrix(this.hue);
            return true;
        }
        return false;
    };

    private updateSaturationMatrix(): boolean {
        if (this.saturationMatrixDirty) {
            this.saturationMatrixDirty = false;
            this.saturationMatrix = createSaturationMatrix(this.saturation);
            return true;
        }
        return false;
    };

    private updateBrightnessMatrix(): boolean {
        if (this.brightnessMatrixDirty) {
            this.brightnessMatrixDirty = false;
            this.brightnessMatrix = createBrightnesMatrix(this.brightness, this.brightness, this.brightness);
            return true;
        }
        return false;
    };

    private updateContrastMatrix(): boolean {
        if (this.contrastMatrixDirty) {
            this.contrastMatrixDirty = false;
            this.contrastMatrix = createContrastMatrix(this.contrast, this.contrast, this.contrast);
            return true;
        }
        return false;
    };
};
