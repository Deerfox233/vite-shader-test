import { mat3, mat4 } from "gl-matrix";
import { WebGLEssentials, getWebGLContext, initWebGLResources } from "./webgl";
import { SpriteBatch } from "./sprite-batch";

const rect1 = new Float32Array([
    -0.5, 0.5,
    0.5, 0.5,
    0.5, -0.5,
    -0.5, -0.5,
]);

const rect2 = new Float32Array([
    -0.2, 0.2,
    0.2, 0.2,
    0.2, -0.3,
    -0.2, -0.3,
]);

const rect3 = new Float32Array([
    -0.25, 0.25,
    0.25, 0.25,
    0.25, -0.25,
    -0.25, -0.25,
]);

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
        const { gl, simpleShader } = this.webGLEssentials;

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.useProgram(simpleShader.program);

        gl.uniformMatrix4fv(simpleShader.uniformLocations["uModelViewMatrix"], false, mat4.create());

        const spriteBatch = new SpriteBatch({ gl, capacity: 3 });

        spriteBatch.begin();
        spriteBatch.drawRect({
            rectVertices: rect1,
            transform: mat3.translate(mat3.create(), mat3.create(), [-0.25, 0.0]),
            color: 0xc586c0ff
        });
        spriteBatch.drawRect({
            rectVertices: rect2,
            color: 0x4ec9b0ff,
            transform: mat3.translate(mat3.create(), mat3.create(), [0.8, 0.8]),
        });
        spriteBatch.drawRect({
            rectVertices: rect3,
            color: 0xdcdcaaff,
            transform: mat3.translate(mat3.create(), mat3.create(), [0.25, 0.0]),
        })
        spriteBatch.end();
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