precision mediump float;

uniform vec4 uPixelColor;

varying vec4 vColor;

void main() {
    gl_FragColor = vColor;
}