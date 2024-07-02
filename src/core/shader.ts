export interface ShaderData {
    program: WebGLProgram;
    uniformLocations: { [key: string]: WebGLUniformLocation };
}

export default class Shader {
    private vertexSource: string;
    private fragmentSource: string;

    constructor(config: { vertexSource: string, fragmentSource: string }) {
        const { vertexSource, fragmentSource } = config;

        this.vertexSource = vertexSource;
        this.fragmentSource = fragmentSource;
    }

    public compile(config: { gl: WebGL2RenderingContext }) {
        const { gl } = config;

        const vertexShader = Shader.createShader({ gl, shaderSource: this.vertexSource, shaderType: gl.VERTEX_SHADER });
        const fragmentShader = Shader.createShader({ gl, shaderSource: this.fragmentSource, shaderType: gl.FRAGMENT_SHADER });

        return Shader.compileShader({ gl, vertexShader, fragmentShader });
    }

    private static createShader(config: { gl: WebGL2RenderingContext, shaderSource: string, shaderType: number }) {
        const { gl, shaderSource, shaderType } = config;

        const shader = gl.createShader(shaderType);
        if (!shader) {
            throw new Error('Failed to create shader');
        }

        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);

        return shader;
    }

    private static compileShader(config: { gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader }): ShaderData {
        const { gl, vertexShader, fragmentShader } = config;

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