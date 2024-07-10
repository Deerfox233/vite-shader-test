import Shader, { ShaderData } from "./shader";
import vertexSource from "./shaders/vs.glsl";
import fragmentSource from "./shaders/fs.glsl";

export type Context = WebGL2RenderingContext | WebGLRenderingContext;

export interface WebGLEssentials {
    gl: Context;
    shader: ShaderData;
}

export function getWebGLContext(canvas: HTMLCanvasElement): Context {
    const option: WebGLContextAttributes = {
        alpha: false,
        antialias: true,
        depth: true,
        stencil: true,
        premultipliedAlpha: true,
        preserveDrawingBuffer: true,
        failIfMajorPerformanceCaveat: true
    }

    const gl = canvas.getContext('webgl2', option) || canvas.getContext('webgl', option);
    if (!gl) {
        throw new Error('WebGL not supported');
    }

    return gl;
}

export function initWebGLResources(gl: Context): WebGLEssentials {
    const rawShader = new Shader({ vertexSource, fragmentSource });

    const shader = rawShader.compile(gl);

    return {
        gl,
        shader
    }
}