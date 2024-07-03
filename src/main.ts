import './style.css'

const vertices = new Float32Array([
    0.5, 0.5, 0.0,
    -0.5, 0.5, 0.0,
    0.5, -0.5, 0.0,
    -0.5, -0.5, 0.0
]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const vertexPosition = gl.getAttribLocation(shader.program, 'aVertexPosition');
gl.enableVertexAttribArray(vertexPosition);
gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(shader.program);
gl.uniform4fv(shader.uniformLocations.uPixelColor, [1.0, 0.0, 0.0, 1.0]);

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);