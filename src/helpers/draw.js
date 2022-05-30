import {game_wireframe} from '../vars.js'

export function drawRectangle(p1, p2, color, shader, gl) {
    var positions = [
        p1.x, p1.y, /*bl*/ p2.x, p2.y, /*tr*/ p1.x, p2.y, /*tl*/ // Triangle 1 /-
        p1.x, p1.y, /*bl*/ p2.x, p2.y, /*tr*/ p2.x, p1.y  /*br*/ // Triangle 2
    ];

    // Create vertex buffer
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

    var itemSize = 2

    gl.useProgram(shader)
    shader.uColor = gl.getUniformLocation(shader, "uColor")
    gl.uniform4fv(shader.uColor, [color.r, color.g, color.b, color.a])

    shader.aVertexPosition = gl.getAttribLocation(shader, "aVertexPosition");
    gl.enableVertexAttribArray(shader.aVertexPosition);
    gl.vertexAttribPointer(shader.aVertexPosition, itemSize, gl.FLOAT, false, 0, 0);

    if(game_wireframe) 
        gl.drawArrays(gl.LINE_LOOP, 0, 6);
    else
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);
    // gl.drawElements(gl.POINTS, 8, gl.UNSIGNED_BYTE, null);

    gl.bindBuffer(gl.ARRAY_BUFFER, null)
}

export function drawLine(p1, p2, color, shader, gl) {
    var positions = [
        p1.x,   p1.y, //p1
        p2.x,   p2.y, //p2
    ];

    // Create vertex buffer
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

    var itemSize = 2

    gl.useProgram(shader)
    shader.uColor = gl.getUniformLocation(shader, "uColor")
    gl.uniform4fv(shader.uColor, [color.r, color.g, color.b, color.a])

    shader.aVertexPosition = gl.getAttribLocation(shader, "aVertexPosition");
    gl.enableVertexAttribArray(shader.aVertexPosition);
    gl.vertexAttribPointer(shader.aVertexPosition, itemSize, gl.FLOAT, false, 0, 0);

    // Draw the line
    gl.drawArrays(gl.LINES, 0, 2);
}