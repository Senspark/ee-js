// Example:
// https://github.com/pandamicro/heartfelt/blob/master/assets/RainMaterial.js
// https://github.com/pandamicro/heartfelt/blob/master/assets/RainShader.js

const shader = {
    name: 'ee_hsv',
    defines: [],
    vert: `
uniform mat4 viewProj;

attribute vec3 a_position;
attribute mediump vec2 a_uv0;
// attribute lowp vec4 a_color;

varying mediump vec2 v_uv0;
// varying lowp vec4 v_color;

void main() {
    gl_Position = viewProj * vec4(a_position, 1);
    v_uv0 = a_uv0;
    // v_color = a_color;
}
`,
    frag: `
uniform sampler2D texture;

varying mediump vec2 v_uv0;
// varying lowp vec4 v_color;

uniform mat4 hsvMatrix;
uniform vec4 customColor;

void main() {
    vec4 pixelColor = texture2D(texture, v_uv0);

    // Store the original alpha.
    float alpha = pixelColor.w;

    // Reset alpha to 1.0.
    pixelColor.w = 1.0;

    vec4 fragColor = hsvMatrix * pixelColor;

    // Restore the original alpha.
    fragColor.w = alpha;
    gl_FragColor = fragColor; //  * v_color;
}
`};

(cc.game as any).once(cc.game.EVENT_ENGINE_INITED, () => {
    cc.log('register shader: %s', shader.name);
    const lib = cc.renderer._forward._programLib;
    if (lib._templates[shader.name] !== undefined) {
        delete lib._templates[shader.name];
    }
    if (cc.ENGINE_VERSION >= '2.1.3') {
        lib.define(shader);
    } else {
        lib.define(shader.name, shader.vert, shader.frag, shader.defines);
    }
});

import * as gl from 'gl-matrix';

const renderEngine = cc.renderer.renderEngine;
const renderer = renderEngine.renderer;
const materialClass = cc.ENGINE_VERSION >= '2.1.3' ? cc.Material : renderEngine.Material;
const gfx = cc.ENGINE_VERSION >= '2.1.3' ? cc.gfx : renderEngine.gfx;

export class HsvMaterial extends materialClass {
    public constructor() {
        super(false);
        const pass = new renderer.Pass('ee_hsv');
        pass.setDepth(false, false);
        pass.setCullMode(gfx.CULL_NONE);
        pass.setBlend(
            gfx.BLEND_FUNC_ADD,
            gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA,
            gfx.BLEND_FUNC_ADD,
            gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA,
        );
        const mainTech = new renderer.Technique(
            ['transparent'],
            [
                { name: 'texture', type: renderer.PARAM_TEXTURE_2D },
                { name: 'hsvMatrix', type: renderer.PARAM_MAT4 },
            ],
            [pass],
        );
        const effect = new renderer.Effect(
            [mainTech], {}, [],
        );
        this._texture = null;
        this._mainTech = mainTech;
        this.effect = this._effect = effect;

        // Set default hsv matrix.
        this.setMatrix(gl.mat4.create());
    }

    public setTexture(texture: cc.Texture2D): void {
        if (this._texture === texture) {
            return;
        }
        this._texture = texture;
        this._effect.setProperty('texture', texture.getImpl());
        this._texIds['texture'] = texture.getId();
    }

    public setMatrix(matrix: cc.vmath.mat4): void {
        this._effect.setProperty('hsvMatrix', matrix);
    }
}