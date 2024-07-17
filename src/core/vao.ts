import { Context } from "./webgl";

export interface Attribute {
    name?:string;
    size: number;
    type: number;
    normalized: boolean;
    stride: number;
    offset: number;
}

export default class VAO {
    private buffer: WebGLBuffer;
    private attributes: Attribute[];

    constructor(buffer: WebGLBuffer, attributes: Attribute[]) {
        this.buffer = buffer;
        this.attributes = attributes;
    }

    public bind(gl: Context) {
        VAO.bindAttributes({ gl, buffer: this.buffer, attributes: this.attributes });
    }

    public draw(gl: Context, count: number) {
        gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
    }

    private static bindAttributes(params: { gl: Context, buffer: WebGLBuffer, attributes: Attribute[] }) {
        const { gl, buffer, attributes } = params;

        for (let i = 0; i < attributes.length; i++) {
            const attribute = attributes[i];

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
            gl.vertexAttribPointer(i, attribute.size, attribute.type, attribute.normalized, attribute.stride, attribute.offset);
            gl.enableVertexAttribArray(i);
        }
    }
}