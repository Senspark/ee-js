const rwgt = 0.3086;
const gwgt = 0.6094;
const bwgt = 0.0820;

function transformRGB(m: cc.math.Matrix4, r: number, g: number, b: number): [number, number, number] {
    return [
        r * m.get(0, 0) + g * m.get(1, 0) + b * m.get(2, 0) + m.get(3, 0),
        r * m.get(0, 1) + g * m.get(1, 1) + b * m.get(2, 1) + m.get(3, 1),
        r * m.get(0, 2) + g * m.get(1, 2) + b * m.get(2, 2) + m.get(3, 2),
    ];
};

function createShearZMatrix(x: number, y: number): cc.math.Matrix4 {
    let matrix = new cc.math.Matrix4();
    matrix.identity();
    matrix.set(0, 2, x);
    matrix.set(1, 2, y);
    return matrix;
};

export function createHueMatrix(degrees: number): cc.math.Matrix4 {
    let m = new cc.math.Matrix4();
    m.identity();

    // Rotate the grey vector into positive Z.
    // Sin = 1/sqrt(2).
    // Cos = 1/sqrt(2).
    m.multiply(cc.math.Matrix4.createByRotationX(Math.PI / 4));

    // Sin = -1/sqrt(3).
    // Cos = sqrt(2/3).
    m.multiply(cc.math.Matrix4.createByRotationY(-0.615479709));

    // Shear the space to make the luminance plane horizontal.
    let [lx, ly, lz] = transformRGB(m, rwgt, gwgt, bwgt);
    let zsx = lx / lz;
    let zsy = ly / lz;
    m.multiply(createShearZMatrix(zsx, zsy));

    // Rotate the hue.
    m.multiply(cc.math.Matrix4.createByRotationZ(cc.degreesToRadians(degrees)));

    // Unshear the space to put the luminance plane back.
    m.multiply(createShearZMatrix(-zsx, -zsy));

    // Rotate the grey vector back into place.
    // Sin = 1/sqrt(3).
    // Cos = sqrt(2/3);
    m.multiply(cc.math.Matrix4.createByRotationY(0.615479709));

    // Sin = -1/sqrt(2).
    // Cos = 1/sqrt(2).
    m.multiply(cc.math.Matrix4.createByRotationX(-Math.PI / 4));

    return m;
}

export function createSaturationMatrix(s: number): cc.math.Matrix4 {
    let m = new cc.math.Matrix4();
    m.set(0, 0, (1 - s) * rwgt + s);
    m.set(0, 1, (1 - s) * rwgt);
    m.set(0, 2, (1 - s) * rwgt);

    m.set(1, 0, (1 - s) * gwgt);
    m.set(1, 1, (1 - s) * gwgt + s);
    m.set(1, 2, (1 - s) * gwgt);

    m.set(2, 0, (1 - s) * bwgt);
    m.set(2, 1, (1 - s) * bwgt);
    m.set(2, 2, (1 - s) * bwgt + s);

    m.set(3, 3, 1.0);
    return m;
};

export function createContrastMatrix(r: number, g: number, b: number): cc.math.Matrix4 {
    let m = createBrightnesMatrix((1 - r) / 2, (1 - g) / 2, (1 - b) / 2);
    m.set(0, 0, r);
    m.set(1, 1, g);
    m.set(2, 2, b);
    return m;
};

export function createBrightnesMatrix(r: number, g: number, b: number): cc.math.Matrix4 {
    return cc.math.Matrix4.createByTranslation(r, g, b);
};