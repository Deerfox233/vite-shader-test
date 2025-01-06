import { mat3 } from "gl-matrix";
import VAO from "./vao";
import { Context } from "./webgl";
import { colorToFloat } from "./color";

const VERTEX_SIZE = 3; //x, y, color（?）
const SPRITE_SIZE = 4;
const INDEX_SIZE = 6;

export class SpriteBatch {
    private gl: Context;
    private spriteCount: number = 0;
    private spriteCapacity: number = 0;
    private vertices: Float32Array;
    private vertexBuffer: WebGLBuffer;
    private indices: Uint16Array;
    private vao: VAO;

    constructor(params: { gl: Context, capacity: number }) {
        const { gl, capacity } = params;

        this.gl = gl;
        this.spriteCapacity = capacity;
        this.vertices = new Float32Array(capacity * VERTEX_SIZE * SPRITE_SIZE);
        this.indices = new Uint16Array(capacity * INDEX_SIZE);

        for (let i = 0; i < capacity; i++) {
            const offset = i * SPRITE_SIZE;
            const index = i * INDEX_SIZE;

            this.indices.set([offset, offset + 1, offset + 2, offset, offset + 2, offset + 3], index);
        }

        const vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
            throw new Error('Failed to create vertex buffer');
        }
        this.vertexBuffer = vertexBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

        const indexBuffer = gl.createBuffer();
        if (!indexBuffer) {
            throw new Error('Failed to create index buffer');
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

        // 与特定着色器相关的代码，有待商榷
        this.vao = new VAO(indexBuffer, [
            {
                name: "aVertexPosition",
                size: 2, // x, y
                type: gl.FLOAT,
                normalized: false,
                stride: VERTEX_SIZE * Float32Array.BYTES_PER_ELEMENT,
                offset: 0
            },
            {
                name: "aVertexColor",
                size: 4, // r, g, b, a
                type: gl.UNSIGNED_BYTE,
                normalized: true,
                stride: VERTEX_SIZE * Float32Array.BYTES_PER_ELEMENT,
                offset: 2 * Float32Array.BYTES_PER_ELEMENT
            }
        ]);
    }

    public begin() {
        this.vao.bind(this.gl);
    }

    // public drawRect(params: { rectVertices: Float32Array, color?: number, transform?: mat3 }) {
    //     const { rectVertices, color = 0xffffffff, transform = mat3.create() } = params;

    //     if (this.spriteCount >= this.spriteCapacity) {
    //         throw new Error('SpriteBatch capacity reached'); // TODO
    //     }

    //     const [x0, y0] = [rectVertices[0], rectVertices[1]];
    //     const [x1, y1] = [rectVertices[2], rectVertices[3]];
    //     const [x2, y2] = [rectVertices[4], rectVertices[5]];
    //     const [x3, y3] = [rectVertices[6], rectVertices[7]];

    //     const t = transform;

    //     let offset = this.spriteCount * VERTEX_SIZE * SPRITE_SIZE;

    //     // ↖
    //     this.vertices[offset++] = x0 * t[0] + y0 * t[3] + t[6];
    //     this.vertices[offset++] = x0 * t[1] + y0 * t[4] + t[7];
    //     this.vertices[offset++] = colorToFloat(color);

    //     // ↗
    //     this.vertices[offset++] = x1 * t[0] + y1 * t[3] + t[6];
    //     this.vertices[offset++] = x1 * t[1] + y1 * t[4] + t[7];
    //     this.vertices[offset++] = colorToFloat(color);

    //     // ↘
    //     this.vertices[offset++] = x2 * t[0] + y2 * t[3] + t[6];
    //     this.vertices[offset++] = x2 * t[1] + y2 * t[4] + t[7];
    //     this.vertices[offset++] = colorToFloat(color);

    //     // ↙
    //     this.vertices[offset++] = x3 * t[0] + y3 * t[3] + t[6];
    //     this.vertices[offset++] = x3 * t[1] + y3 * t[4] + t[7];
    //     this.vertices[offset++] = colorToFloat(color);

    //     this.spriteCount++;
    // }

    public drawRect(params: { color: number, w: number, h: number, x: number, y: number }) {
        const { color, w, h, x, y } = params;

        if (this.spriteCount >= this.spriteCapacity) {
            throw new Error('SpriteBatch capacity reached'); // TODO
        }

        const vertices = new Float32Array([x, y, x + w, y, x + w, y + h, x, y + h]);

        const [x0, y0] = [vertices[0], vertices[1]];
        const [x1, y1] = [vertices[2], vertices[3]];
        const [x2, y2] = [vertices[4], vertices[5]];
        const [x3, y3] = [vertices[6], vertices[7]];

        const t = mat3.create(); // test

        let offset = this.spriteCount * VERTEX_SIZE * SPRITE_SIZE;

        // ↖
        this.vertices[offset++] = x0 * t[0] + y0 * t[3] + t[6];
        this.vertices[offset++] = x0 * t[1] + y0 * t[4] + t[7];
        this.vertices[offset++] = colorToFloat(color);

        // ↗
        this.vertices[offset++] = x1 * t[0] + y1 * t[3] + t[6];
        this.vertices[offset++] = x1 * t[1] + y1 * t[4] + t[7];
        this.vertices[offset++] = colorToFloat(color);

        // ↘
        this.vertices[offset++] = x2 * t[0] + y2 * t[3] + t[6];
        this.vertices[offset++] = x2 * t[1] + y2 * t[4] + t[7];
        this.vertices[offset++] = colorToFloat(color);

        // ↙
        this.vertices[offset++] = x3 * t[0] + y3 * t[3] + t[6];
        this.vertices[offset++] = x3 * t[1] + y3 * t[4] + t[7];
        this.vertices[offset++] = colorToFloat(color);

        this.spriteCount++;
    }

    public end() {
        this.flush();
    }

    private flush() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, this.vertices.subarray(0, this.spriteCount * VERTEX_SIZE * SPRITE_SIZE));

        this.vao.draw(this.gl, this.spriteCount * INDEX_SIZE);
        this.spriteCount = 0;
    }
}