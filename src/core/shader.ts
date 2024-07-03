export interface ShaderData {
    program: WebGLProgram;
    uniformLocations: { [key: string]: WebGLUniformLocation };
}

export default class Shader {
    private vertexSource: string;
    private fragmentSource: string;

    constructor(params: { vertexSource: string, fragmentSource: string }) {
        const { vertexSource, fragmentSource } = params;

        this.vertexSource = vertexSource;
        this.fragmentSource = fragmentSource;
    }

    public compile(gl: WebGL2RenderingContext) {
        const vertexShader = Shader.createShader({ gl, shaderSource: this.vertexSource, shaderType: gl.VERTEX_SHADER });
        const fragmentShader = Shader.createShader({ gl, shaderSource: this.fragmentSource, shaderType: gl.FRAGMENT_SHADER });

        return Shader.compileShader({ gl, vertexShader, fragmentShader });
    }

    private static createShader(params: { gl: WebGL2RenderingContext, shaderSource: string, shaderType: number }) {
        const { gl, shaderSource, shaderType } = params;

        const shader = gl.createShader(shaderType);
        if (!shader) {
            throw new Error('Failed to create shader');
        }

        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);

        return shader;
    }

    private static compileShader(params: { gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader }): ShaderData {
        const { gl, vertexShader, fragmentShader } = params;

        const program = gl.createProgram();
        if (!program) {
            throw new Error('Failed to create program');
        }

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error('Failed to link program');
        }

        const uniformLocations: { [key: string]: WebGLUniformLocation } = {};
        for (let i = 0; i < gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS); i++) {
            const info = gl.getActiveUniform(program, i);
            if (!info) {
                console.warn('Failed to get uniform info');
                continue;
            }

            const location = gl.getUniformLocation(program, info.name);
            if (!location) {
                console.warn('Failed to get uniform location');
                continue;
            }

            uniformLocations[info.name] = location;
        }

        return { program, uniformLocations };
    }
}