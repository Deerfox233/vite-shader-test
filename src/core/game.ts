import { mat3 } from "gl-matrix";
import { WebGLEssentials, getWebGLContext, initWebGLResources } from "./webgl";
import { SpriteBatch } from "./sprite-batch";

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

        const rect1 = new Float32Array([
            -0.5, 0.5,
            0.5, 0.5,
            0.5, -0.5,
            -0.5, -0.5,
        ]);
        const rect2 = new Float32Array([
            0.6, 1.0,
            1.0, 1.0,
            1.0, 0.5,
            0.6, 0.5,
        ]);

        gl.useProgram(simpleShader.program);
        gl.uniform4fv(simpleShader.uniformLocations["uPixelColor"], [1.0, 0.0, 0.0, 1.0]);

        const spriteBatch = new SpriteBatch({ gl, capacity: 2 });

        console.log(simpleShader.attributeLocations);

        spriteBatch.begin();

        spriteBatch.drawRect({
            rectVertices: rect1,
            transform: mat3.translate(mat3.create(), mat3.create(), [-0.5, 0.0]),
            color: 0xff0000
        });
        spriteBatch.drawRect({ rectVertices: rect2 });
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