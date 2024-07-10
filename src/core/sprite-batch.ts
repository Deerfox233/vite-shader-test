import VAO from "./vao";
import { Context } from "./webgl";

const VERTEX_SIZE = 3;
const SPRITE_SIZE = 4;
const INDEX_SIZE = 6;

export class SpriteBatch {
    private gl: Context;
    private count: number = 0;
    private capacity: number = 0;
    private vertices: Float32Array;
    private vertexBuffer: WebGLBuffer;
    private indices: Uint16Array;
    private vao: VAO;

    constructor(params: { gl: Context, capacity: number }) {
        const { gl, capacity } = params;

        this.gl = gl;
        this.capacity = capacity;
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

        this.vao = new VAO(indexBuffer, { index: 0, size: VERTEX_SIZE, type: gl.FLOAT, normalized: false, stride: 0, offset: 0 });
    }

    public begin() {
        this.vao.bind(this.gl);
    }

    public drawRect(rectVertices: Float32Array) {
        if (this.count >= this.capacity) {
            throw new Error('SpriteBatch capacity reached'); // TODO
        }

        const offset = this.count * VERTEX_SIZE * SPRITE_SIZE;
        this.vertices.set(rectVertices, offset);
        this.count++;
    }

    public end() {
        this.flush();
    }

    private flush() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, this.vertices.subarray(0, this.count * VERTEX_SIZE * SPRITE_SIZE));

        this.vao.draw(this.gl, this.count * INDEX_SIZE);
        this.count = 0;
    }
}