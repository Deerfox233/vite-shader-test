const int8 = new Int8Array(4);
const int32 = new Int32Array(int8.buffer, 0, 1);
const float32 = new Float32Array(int8.buffer, 0, 1);

export function getR(color: number) {
    return (color >> 24) & 0xff;
}

export function getG(color: number) {
    return (color >> 16) & 0xff;
}

export function getB(color: number) {
    return (color >> 8) & 0xff;
}

export function getAlpha(color: number) {
    return color & 0xff;
}

export function colorToFloat(color: number): number {
    const int = (getAlpha(color) << 24) | (getB(color) << 16) | (getG(color) << 8) | getR(color);
    int32[0] = int & 0xfeffffff;
    return float32[0];
}