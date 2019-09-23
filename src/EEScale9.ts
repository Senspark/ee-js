import assert = require('assert');

const { ccclass, disallowMultiple, executeInEditMode, menu } = cc._decorator;

// Version >= 2.1.3
const packToDynamicAtlas = (comp: cc.Sprite, frame: cc.SpriteFrame) => {
    const dynamicAtlasManager = (cc as any).dynamicAtlasManager;

    // TODO: Material API design and export from editor could affect the material activation process
    // need to update the logic here
    if (frame && !CC_TEST) {
        if (!(frame as any)._original && dynamicAtlasManager) {
            const packedFrame = dynamicAtlasManager.insertSpriteFrame(frame);
            if (packedFrame) {
                (frame as any)._setDynamicAtlasFrame(packedFrame);
            }
        }
        if ((comp as any).sharedMaterials[0].getProperty('texture') !== (frame as any)._texture) {
            (comp as any)._activateMaterial(true);
        }
    }
};

const assembler = {
    useModel: false,
    createData(sprite: cc.Sprite): any {
        const renderData = sprite.requestRenderData();
        // 0-4 for local verts
        // 5-20 for world verts
        renderData.dataLength = 20;

        renderData.vertexCount = 16;
        renderData.indiceCount = 54;
        return renderData;
    },

    updateRenderData_2_1_3(sprite: cc.Sprite): void {
        packToDynamicAtlas(sprite, sprite.spriteFrame);
        const renderData = sprite._renderData;
        if (!renderData || !sprite.spriteFrame) {
            return;
        }
        if (renderData.vertDirty) {
            this.updateVerts(sprite);
            this.updateWorldVerts(sprite);
        }
    },

    updateRenderData_Old(sprite: cc.Sprite, batchData: any): void {
        const frame = sprite.spriteFrame;
        const dynamicAtlasManager = (cc as any).dynamicAtlasManager;

        // TODO: Material API design and export from editor could affect the material activation process
        // need to update the logic here
        if (frame) {
            if (!(frame as any)._original && dynamicAtlasManager) {
                dynamicAtlasManager.insertSpriteFrame(frame);
            }
            if (sprite._material._texture !== (frame as any)._texture) {
                (sprite as any)._activateMaterial();
            }
        }

        const renderData = sprite._renderData;
        if (renderData && frame) {
            const vertDirty = renderData.vertDirty;
            if (vertDirty) {
                this.updateVerts(sprite);
                this.updateWorldVerts(sprite);
            }
        }
    },

    updateRenderData(sprite: cc.Sprite, batchData: any): void {
        cc.ENGINE_VERSION >= '2.1.3'
            ? this.updateRenderData_2_1_3(sprite)
            : this.updateRenderData_Old(sprite, batchData);
    },

    updateVerts(sprite: cc.Sprite): void {
        const renderData = sprite._renderData;
        const data = renderData._data;
        const node = sprite.node;
        const width = node.width;
        const height = node.height;
        const appx = node.anchorX * width;
        const appy = node.anchorY * height;

        const frame = sprite.spriteFrame;
        const leftWidth = frame.insetLeft;
        const rightWidth = frame.insetRight;
        const topHeight = frame.insetTop;
        const bottomHeight = frame.insetBottom;

        let sizableWidth = width - leftWidth - rightWidth;
        let sizableHeight = height - topHeight - bottomHeight;
        let xScale = width / (leftWidth + rightWidth);
        let yScale = height / (topHeight + bottomHeight);
        xScale = (isNaN(xScale) || xScale > 1) ? 1 : xScale;
        yScale = (isNaN(yScale) || yScale > 1) ? 1 : yScale;
        sizableWidth = sizableWidth < 0 ? 0 : sizableWidth;
        sizableHeight = sizableHeight < 0 ? 0 : sizableHeight;

        data[0].x = -appx;
        data[0].y = -appy;
        data[1].x = leftWidth * xScale - appx;
        data[1].y = bottomHeight * yScale - appy;
        data[2].x = data[1].x + sizableWidth;
        data[2].y = data[1].y + sizableHeight;
        data[3].x = width - appx;
        data[3].y = height - appy;

        renderData.vertDirty = false;
    },

    fillBuffers(sprite: cc.Sprite, renderer: any): void {
        if (renderer.worldMatDirty) {
            this.updateWorldVerts(sprite);
        }

        const renderData = sprite._renderData;
        const data = renderData._data;
        const color = (sprite.node as any)._color._val; // For version 2.1.

        const buffer = renderer._meshBuffer;
        let vertexOffset = buffer.byteOffset >> 2;
        const vertexCount = renderData.vertexCount;

        let indiceOffset = buffer.indiceOffset;
        const vertexId = buffer.vertexOffset;

        // Recalculate uv sliced if needed.
        const frame = sprite.spriteFrame as any;

        const insetL = frame.insetLeft;
        const insetR = frame.insetRight;
        const insetT = frame.insetTop;
        const insetB = frame.insetBottom;

        const sizableWidth = sprite.node.width - insetL - insetR;
        const sizableHeight = sprite.node.height - insetT - insetB;
        const oldInsets = [...frame._capInsets];
        let needRecalculation = false;

        if (sizableWidth < 0) {
            const insetWidth = insetL + insetR;
            frame._capInsets[0] += sizableWidth * insetL / insetWidth;
            frame._capInsets[2] += sizableWidth * insetR / insetWidth;
            needRecalculation = true;
        }
        if (sizableHeight < 0) {
            const insetHeight = insetT + insetB;
            frame._capInsets[1] += sizableHeight * insetT / insetHeight;
            frame._capInsets[3] += sizableHeight * insetB / insetHeight;
            needRecalculation = true;
        }

        const oldUvSliced = [];
        if (needRecalculation) {
            oldUvSliced.push(...frame.uvSliced);
            frame._calculateSlicedUV();
        }

        const uvSliced = frame.uvSliced;

        buffer.request(vertexCount, renderData.indiceCount);

        // buffer data may be realloc, need get reference after request.
        const vbuf = buffer._vData;
        const ibuf = buffer._iData;
        const uintbuf = buffer._uintVData; // For version 2.1.

        for (let i = 4; i < 20; ++i) {
            const vert = data[i];
            const uvs = uvSliced[i - 4];

            vbuf[vertexOffset++] = vert.x;
            vbuf[vertexOffset++] = vert.y;
            vbuf[vertexOffset++] = uvs.u;
            vbuf[vertexOffset++] = uvs.v;
            uintbuf && (uintbuf[vertexOffset++] = color);
        }

        for (let r = 0; r < 3; ++r) {
            for (let c = 0; c < 3; ++c) {
                const start = vertexId + r * 4 + c;
                ibuf[indiceOffset++] = start;
                ibuf[indiceOffset++] = start + 1;
                ibuf[indiceOffset++] = start + 4;
                ibuf[indiceOffset++] = start + 1;
                ibuf[indiceOffset++] = start + 5;
                ibuf[indiceOffset++] = start + 4;
            }
        }

        // Restore.
        if (needRecalculation) {
            frame._capInsets = oldInsets;
            frame.uvSliced = oldUvSliced;
        }
    },

    updateWorldVerts(sprite: cc.Sprite): void {
        const node = sprite.node;
        const data = sprite._renderData._data;

        const matrix = (node as any)._worldMatrix;
        const a = matrix.m00;
        const b = matrix.m01;
        const c = matrix.m04;
        const d = matrix.m05;
        const tx = matrix.m12;
        const ty = matrix.m13;

        for (let row = 0; row < 4; ++row) {
            const rowD = data[row];
            for (let col = 0; col < 4; ++col) {
                const colD = data[col];
                const world = data[4 + row * 4 + col];
                world.x = colD.x * a + rowD.y * c + tx;
                world.y = colD.x * b + rowD.y * d + ty;
            }
        }
    },
};

@ccclass
@disallowMultiple
@executeInEditMode
@menu('ee/Scale9')
export class Scale9 extends cc.Component {
    protected onEnable(): void {
        this.refreshAssembler();
    }

    protected onDisable(): void {
        this.refreshAssembler();
    }

    protected update(delta: number): void {
        this.refreshAssembler();
    }

    private refreshAssembler(): void {
        const component = this.getComponent(cc.Sprite);
        if (component === null) {
            return;
        }
        if (this.enabled) {
            const type = component.type;
            if (type === cc.Sprite.Type.SLICED) {
                if (component._assembler !== assembler) {
                    // Use custom assembler.
                    this.updateAssembler();
                }
            }
        } else {
            (component as any)._updateAssembler();
        }
    }

    /** Updates the current assembler. */
    private updateAssembler(): void {
        const component = this.getComponent(cc.Sprite);
        assert(component !== null);

        if (component._assembler !== assembler) {
            component._assembler = assembler;
            component._renderData = null;
        }

        if (!component._renderData) {
            component._renderData = component._assembler.createData(component);
            component._renderData.material = component._material;
            component.markForUpdateRenderData(true);
        }
    }
}