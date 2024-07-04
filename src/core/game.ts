import { mat4 } from "gl-matrix";
import VAO from "./vao";
import { WebGLEssentials, getWebGLContext, initWebGLResources } from "./webgl";

export default class Game {
    private canvas?: HTMLCanvasElement;
    private webGLEssentials?: WebGLEssentials;

    public init() {
        this.initCanvas();
        this.initWebGLEssentials();

        return this;
    }

    public draw() {
        if (!this.webGLEssentials) {
            throw new Error('WebGL essentials not found. Did you forget to call init()?');
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
        const vertexPosition = gl.getAttribLocation(shader.program, 'aVertexPosition');

        const vao1 = new VAO({ buffer, attribute: { index: vertexPosition, size: 3, type: gl.FLOAT, normalized: false, stride: 0, offset: 0 } });
        gl.uniform4fv(shader.uniformLocations.uPixelColor, [1.0, 0.0, 0.0, 1.0]);

        const modelMatrix1 = mat4.create();
        gl.uniformMatrix4fv(shader.uniformLocations.uTransform, false, modelMatrix1);

        vao1.bind(gl);
        vao1.draw(gl);

        const vao2 = new VAO({ buffer, attribute: { index: vertexPosition, size: 3, type: gl.FLOAT, normalized: false, stride: 0, offset: 0 } });
        gl.uniform4fv(shader.uniformLocations.uPixelColor, [0.0, 1.0, 0.0, 1.0]);

        const modelMatrix2 = mat4.create();
        mat4.translate(modelMatrix2, modelMatrix2, [0.5, 0.5, 0.0]);
        gl.uniformMatrix4fv(shader.uniformLocations.uTransform, false, modelMatrix2);
        
        vao2.bind(gl);
        vao2.draw(gl);
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