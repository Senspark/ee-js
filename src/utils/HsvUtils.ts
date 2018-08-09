import * as gl from 'gl-matrix';

const rwgt = 0.3086;
const gwgt = 0.6094;
const bwgt = 0.0820;

function transformRGB(m: gl.mat4, r: number, g: number, b: number): [number, number, number] {
    return [
        r * m[0] + g * m[4] + b * m[8] + m[12],
        r * m[1] + g * m[5] + b * m[9] + m[13],
        r * m[2] + g * m[6] + b * m[10] + m[14],
    ];
};

function createShearZMatrix(x: number, y: number): gl.mat4 {
    let matrix = gl.mat4.create();
    matrix[2] = x;
    matrix[6] = y;
    return matrix;
};

export function createHueMatrix(degrees: number): gl.mat4 {
    let m = gl.mat4.create();
    let temp = gl.mat4.create();

    // Rotate the grey vector into positive Z.
    // Sin = 1/sqrt(2).
    // Cos = 1/sqrt(2).
    gl.mat4.multiply(m, m, gl.mat4.fromXRotation(temp, Math.PI / 4));

    // Sin = -1/sqrt(3).
    // Cos = sqrt(2/3).
    gl.mat4.multiply(m, m, gl.mat4.fromYRotation(temp, -0.615479709));

    // Shear the space to make the luminance plane horizontal.
    let [lx, ly, lz] = transformRGB(m, rwgt, gwgt, bwgt);
    let zsx = lx / lz;
    let zsy = ly / lz;
    gl.mat4.multiply(m, m, createShearZMatrix(zsx, zsy));

    const converter = (cc.ENGINE_VERSION >= '2' ? cc.misc.degreesToRadians : cc.degreesToRadians);

    // Rotate the hue.
    gl.mat4.multiply(m, m, gl.mat4.fromZRotation(temp, converter(degrees)));

    // Unshear the space to put the luminance plane back.
    gl.mat4.multiply(m, m, createShearZMatrix(-zsx, -zsy));

    // Rotate the grey vector back into place.
    // Sin = 1/sqrt(3).
    // Cos = sqrt(2/3);
    gl.mat4.multiply(m, m, gl.mat4.fromYRotation(temp, 0.615479709));

    // Sin = -1/sqrt(2).
    // Cos = 1/sqrt(2).
    gl.mat4.multiply(m, m, gl.mat4.fromXRotation(temp, -Math.PI / 4));

    return m;
}

export function createSaturationMatrix(s: number): gl.mat4 {
    let m = gl.mat4.create();
    m[0] = (1 - s) * rwgt + s;
    m[1] = (1 - s) * rwgt;
    m[2] = (1 - s) * rwgt;

    m[4] = (1 - s) * gwgt;
    m[5] = (1 - s) * gwgt + s;
    m[6] = (1 - s) * gwgt;

    m[8] = (1 - s) * bwgt;
    m[9] = (1 - s) * bwgt;
    m[10] = (1 - s) * bwgt + s;

    m[15] = 1.0;
    return m;
};

export function createContrastMatrix(r: number, g: number, b: number): gl.mat4 {
    let m = createBrightnesMatrix((1 - r) / 2, (1 - g) / 2, (1 - b) / 2);
    m[0] = r;
    m[5] = g;
    m[10] = b;
    return m;
};

export function createBrightnesMatrix(r: number, g: number, b: number): gl.mat4 {
    let m = gl.mat4.create();
    return gl.mat4.fromTranslation(m, [r, g, b]);
};