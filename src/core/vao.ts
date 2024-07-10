import { Context } from "./webgl";

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

    constructor(buffer: WebGLBuffer, attribute: Attribute) {
        this.buffer = buffer;
        this.attribute = attribute;
    }

    public bind(gl: Context) {
        VAO.bindAttribute({ gl, buffer: this.buffer, attribute: this.attribute });
    }

    public draw(gl: Context, count: number) {
        gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
    }

    private static bindAttribute(params: { gl: Context, buffer: WebGLBuffer, attribute: Attribute }) {
        const { gl, buffer, attribute } = params;

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(0/* test */, attribute.size, attribute.type, attribute.normalized, attribute.stride, attribute.offset);
        gl.enableVertexAttribArray(0/* test */);
    }
}