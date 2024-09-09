import { mat3, mat4 } from "gl-matrix";
import { WebGLEssentials, getWebGLContext, initWebGLResources } from "./webgl";
import { SpriteBatch } from "./sprite-batch";
import { KeyboardInput, registerDirectionKeys } from "./input";

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
    private keyboardInput?: KeyboardInput;

    private rectTransforms = [
        { translation: [-0.25, 0.0], rotation: 0 },
        { translation: [0.8, 0.8], rotation: 0 },
        { translation: [0.0, 0.0], rotation: Math.PI / 4 },
    ];

    public init() {
        this.initCanvas({ width: 1280, ratio: 16 / 9 });
        this.initWebGLEssentials();

        this.keyboardInput = new KeyboardInput();
        this.keyboardInput.init();
        registerDirectionKeys(this.keyboardInput);

        return this;
    }

    public update(delta: number) {
        this.rectTransforms[0].translation[0] += delta * 1;
        this.rectTransforms[2].rotation += delta * 1;
    }

    public draw() {
        if (!this.webGLEssentials) {
            throw new Error('WebGL essentials not found. Did you forget to call init()?');
        }
        const { gl, simpleShader } = this.webGLEssentials;

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(simpleShader.program);

        const fieldOfView = (45 * Math.PI) / 180;
        const aspect = gl.canvas.width / gl.canvas.height;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

        const modelViewMatrix = mat4.create();
        mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);

        gl.uniformMatrix4fv(simpleShader.uniformLocations["uModelViewMatrix"], false, modelViewMatrix);
        gl.uniformMatrix4fv(simpleShader.uniformLocations["uProjectionMatrix"], false, projectionMatrix);

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        const spriteBatch = new SpriteBatch({ gl, capacity: 3 });

        spriteBatch.begin();
        spriteBatch.drawRect({
            rectVertices: rect1,
            transform: mat3.translate(mat3.create(), mat3.create(), new Float32Array(this.rectTransforms[0].translation)),
            color: 0xc586c0ff
        });
        spriteBatch.drawRect({
            rectVertices: rect2,
            color: 0x4ec9b0ff,
            transform: mat3.translate(mat3.create(), mat3.create(), new Float32Array(this.rectTransforms[1].translation)),
        });
        spriteBatch.drawRect({
            rectVertices: rect3,
            color: 0xdcdcaaff,
            transform: mat3.rotate(mat3.create(), mat3.create(), this.rectTransforms[2].rotation),
        });
        spriteBatch.end();
    }

    private initCanvas(params: { width?: number, height?: number, ratio?: number }) {
        const { width, height, ratio } = params;

        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        if (!this.canvas) {
            throw new Error('Canvas not found');
        }

        if (width != null && height != null) {
            this.canvas.width = width;
            this.canvas.height = height;
        } else if (width == null && height != null) {
            if (ratio != null) {
                this.canvas.width = height * ratio;
                this.canvas.height = height;
            } else {
                throw new Error('Ratio not found');
            }
        } else if (width != null && height == null) {
            if (ratio != null) {
                this.canvas.width = width;
                this.canvas.height = width / ratio;
            } else {
                throw new Error('Ratio not found');
            }
        }
    }

    private initWebGLEssentials() {
        if (!this.canvas) {
            throw new Error('Canvas not found');
        }

        const gl = getWebGLContext(this.canvas);

        this.webGLEssentials = initWebGLResources(gl);
    }
}