import Shader, { ShaderData } from "./shader";
import vertexSource from "./shaders/vs.glsl";
import fragmentSource from "./shaders/fs.glsl";

export interface WebGLEssentials {
    gl: WebGL2RenderingContext;
    shader: ShaderData;
}

export function getWebGLContext(canvas: HTMLCanvasElement) {
    const option: WebGLContextAttributes = {
        alpha: false,
        antialias: true,
        depth: true,
        stencil: true,
        premultipliedAlpha: true,
        preserveDrawingBuffer: true,
        failIfMajorPerformanceCaveat: true
    }

    const gl = canvas.getContext('webgl2', option);
    if (!gl) {
        throw new Error('WebGL2 not supported');
    }

    return gl;
}

export function initWebGLResources(gl: WebGL2RenderingContext): WebGLEssentials {
    const rawShader = new Shader({ vertexSource, fragmentSource });

    const shader = rawShader.compile({ gl });

    return {
        gl,
        shader
    }
}