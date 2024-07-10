import { mat3, vec3 } from "gl-matrix";
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

    public drawRect(rectVertices: Float32Array, transform: mat3 = mat3.create()) {
        if (this.count >= this.capacity) {
            throw new Error('SpriteBatch capacity reached'); // TODO
        }
        
        console.log('transform', transform);

        const [v1, v2, v3, v4] = [vec3.create(), vec3.create(), vec3.create(), vec3.create()];
        vec3.transformMat3(v1, rectVertices.subarray(0, 3), transform);
        vec3.transformMat3(v2, rectVertices.subarray(3, 6), transform);
        vec3.transformMat3(v3, rectVertices.subarray(6, 9), transform);
        vec3.transformMat3(v4, rectVertices.subarray(9, 12), transform);

        const offset = this.count * VERTEX_SIZE * SPRITE_SIZE;
        this.vertices.set(v1, offset);
        this.vertices.set(v2, offset + 3);
        this.vertices.set(v3, offset + 6);
        this.vertices.set(v4, offset + 9);

        console.log('this.vertices', this.vertices);
        console.log(v1, v2, v3, v4)

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