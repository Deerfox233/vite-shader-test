export interface Attribute {
    index: number;
    size: number;
    type: number;
    normalized: boolean;
    stride: number;
    offset: number;
}

export default class VAO {
    private buffer: WebGLBuffer;
    private attribute: Attribute;


    constructor(params: { buffer: WebGLBuffer, attribute: Attribute }) {
        this.buffer = params.buffer;
        this.attribute = params.attribute;
    }

    public bind(gl: WebGL2RenderingContext) {
        VAO.bindAttribute({ gl, buffer: this.buffer, attribute: this.attribute });
    }

    public draw(gl: WebGL2RenderingContext) {
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    private static bindAttribute(params: { gl: WebGL2RenderingContext, buffer: WebGLBuffer, attribute: Attribute }) {
        const { gl, buffer, attribute } = params;

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(attribute.index, attribute.size, attribute.type, attribute.normalized, attribute.stride, attribute.offset);
        gl.enableVertexAttribArray(attribute.index);
    }
}