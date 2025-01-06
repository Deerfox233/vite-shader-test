import { mat4 } from "gl-matrix";
import { WebGLEssentials, getWebGLContext, initWebGLResources } from "./webgl";
import { SpriteBatch } from "./sprite-batch";
import { Key, KeyboardInput, registerDirectionKeys } from "./input";
import { Entity } from "./entity";

export default class Game {
    private canvas?: HTMLCanvasElement;
    private webGLEssentials?: WebGLEssentials;
    private keyboardInput?: KeyboardInput;

    private entities: Entity[] = [];

    public init() {
        this.initCanvas({ width: 1280, ratio: 16 / 9 });
        this.initWebGLEssentials();

        this.keyboardInput = new KeyboardInput();
        this.keyboardInput.init();
        registerDirectionKeys(this.keyboardInput);

        // this.keyboardInput.onPressed(Key.RIGHT, () => {

        // });

        return this;
    }

    public update(delta: number) {
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
            color: 0xc586c0ff,
            w: 1,
            h: 0.3,
            x: 0,
            y: 0,
        });
        spriteBatch.drawRect({
            color: 0x4ec9b0ff,
            w: 0.4,
            h: 0.5,
            x: 0.8,
            y: 0.6,
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