// VERTEX
attribute vec3 aVertexPosition;

uniform mat4 uTransform;

void main(void) {
    gl_Position = uTransform * vec4(aVertexPosition, 1.0);
}