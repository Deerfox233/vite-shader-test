import Shader, { ShaderData } from "./shader";
import simpleVs from "./shaders/simple-vs.glsl";
import simpleFs from "./shaders/simple-fs.glsl";

export type Context = WebGL2RenderingContext | WebGLRenderingContext;

export interface WebGLEssentials {
    gl: Context;
    simpleShader: ShaderData;
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
    const rawSampleShader = new Shader({ vertexSource: simpleVs, fragmentSource: simpleFs });

    const simpleShader = rawSampleShader.compile(gl);

    return {
        gl,
        simpleShader
    }
}