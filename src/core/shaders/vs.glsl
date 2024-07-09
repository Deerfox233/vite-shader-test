attribute vec3 aVertexPosition;

uniform mat4 uTransform;

void main(void) {
    gl_Position = vec4(aVertexPosition, 1.0);
}