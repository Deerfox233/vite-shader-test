import VAO from "./vao";

const VERTEX_SIZE = 3;
const SPRITE_SIZE = 4;

export class SpriteBatch {
    count: number = 0;
    capacity: number = 0;
    vertices: Float32Array;
    vao: VAO;

    constructor(params: { gl: WebGL2RenderingContext, capacity: number }) {
        const { gl, capacity } = params;

        this.capacity = capacity;
        this.vertices = new Float32Array(capacity * VERTEX_SIZE * SPRITE_SIZE);

        const buffer = gl.createBuffer();
        if (!buffer) {
            throw new Error('Failed to create buffer');
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

        this.vao = new VAO({ buffer, attribute: { index: vertexPosition, size: 3, type: gl.FLOAT, normalized: false, stride: 0, offset: 0 } });

    }

    public begin(gl: WebGL2RenderingContext) {
        this.vao.bind(gl);
    }

    public drawRect(rectVertices: Float32Array) {
        if (this.count >= this.capacity) {
            // throw new Error('SpriteBatch capacity reached');
            this.flush();
        }

        const offset = this.count * VERTEX_SIZE * SPRITE_SIZE;
        this.vertices.set(rectVertices, offset);
        this.count++;
    }

    public end(): void {

    }

    public flush() {

    }
}