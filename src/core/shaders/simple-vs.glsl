attribute vec2 aVertexPosition;
attribute vec4 aVertexColor;

varying vec4 vColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 0.0, 1.0);
    vColor = aVertexColor;
}