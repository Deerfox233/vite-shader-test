import VAO from "./vao";
import { WebGLEssentials, getWebGLContext, initWebGLResources } from "./webgl";

export default class Game {
    private canvas?: HTMLCanvasElement;
    private webGLEssentials?: WebGLEssentials;

    public init() {
        this.initCanvas();
        this.initWebGLEssentials();
    }

    public draw() {
        if (!this.webGLEssentials) {
            throw new Error('WebGL essentials not found');
        }
        const { gl, shader } = this.webGLEssentials;

        const vertices = new Float32Array([
            0.5, 0.5, 0.0,
            -0.5, 0.5, 0.0,
            0.5, -0.5, 0.0,
            -0.5, -0.5, 0.0
        ]);

        const buffer = gl.createBuffer();
        if (!buffer) {
            throw new Error('Failed to create buffer');
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.useProgram(shader.program);
        gl.uniform4fv(shader.uniformLocations.uPixelColor, [1.0, 0.0, 0.0, 1.0]);
        const vertexPosition = gl.getAttribLocation(shader.program, 'aVertexPosition');
        const vao = new VAO({ buffer, attribute: { index: vertexPosition, size: 3, type: gl.FLOAT, normalized: false, stride: 0, offset: 0 } });

        vao.bind(gl);
        vao.draw(gl);
    }

    private initCanvas() {
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.canvas.width = 1280;
        this.canvas.height = 720;
    }

    private initWebGLEssentials() {
        if (!this.canvas) {
            throw new Error('Canvas not found');
        }

        const gl = getWebGLContext(this.canvas);

        this.webGLEssentials = initWebGLResources(gl);
    }
}