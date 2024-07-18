attribute vec2 aVertexPosition;
attribute vec4 aVertexColor;

varying vec4 vColor;

uniform mat4 uModelViewMatrix;

void main(void) {
    gl_Position = uModelViewMatrix * vec4(aVertexPosition, 0.0, 1.0);
    vColor = aVertexColor;
}