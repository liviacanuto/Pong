function main() {
    const canvas = document.querySelector("#c");
    const gl = canvas.getContext("webgl");

    if (!gl) {
        throw new Error("WebGL not supported");
    }

    const positionBuffer = gl.createBuffer();
    const colorBuffer = gl.createBuffer();

    var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
    var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    var program = createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, `position`);
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const colorLocation = gl.getAttribLocation(program, `color`);
    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    loop(gl, positionBuffer, colorBuffer);

    canvas.focus();
    canvas.addEventListener("keydown", HandleKeyPress);
}

// Eventos

function HandleKeyPress(event) {
    switch (event.key) {
        case "ArrowUp":
        //Implentar movimentação do player 1 pra cima
        case "ArrowDown":
        //Implentar movimentação do player 1 pra baixo
        case "KeyW":
        //Implentar movimentação do player 2 pra cima
        case "KeyS":
        //Implentar movimentação do player 1 pra baixo
    }
    console.log(`Tecla pressionada: ${event.key}`);
    console.log(`Código da tecla pressionada: ${event.code}`);
}

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

function drawPoint(gl, x, y, positionBuffer, colorBuffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x, y]), gl.STATIC_DRAW);
    let colorData = [];
    let color = [0.9, 0.9, 0.9];
    colorData.push(...color);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
    gl.drawArrays(gl.POINTS, 0, 1);
}

function drawCentralLine(gl, positionBuffer, colorBuffer) {
    j = 1;
    for (i = 0; i < 16; i++) {
        drawPoint(gl, 0, j, positionBuffer, colorBuffer);
        j = j - 0.1333;
    }
}

function drawPlayer1(gl, ancoraY, positionBuffer, colorBuffer) {
    for (i = 0; i < 5; i++) {
        drawPoint(gl, -0.88, ancoraY + i * 0.05, positionBuffer, colorBuffer);
    }
}

function drawPlayer2(gl, ancoraY, positionBuffer, colorBuffer) {
    for (i = 0; i < 5; i++) {
        drawPoint(gl, 0.88, ancoraY + i * 0.05, positionBuffer, colorBuffer);
    }
}

function drawHorizontalLine(gl, y, positionBuffer, colorBuffer) {
    for(i = 0; i < 41; i++) {
        drawPoint(gl, -1 + i * 0.05, y, positionBuffer, colorBuffer);
    }
}

function drawBorderLine(gl, positionBuffer, colorBuffer) {
    drawHorizontalLine(gl, -0.98, positionBuffer, colorBuffer);
    drawHorizontalLine(gl, 0.98, positionBuffer, colorBuffer);
}

function drawBall(gl, x, y, positionBuffer, colorBuffer) {
    drawPoint(gl, x, y, positionBuffer, colorBuffer);
}

function loop(gl, positionBuffer, colorBuffer) {
    //static
    drawBorderLine(gl, positionBuffer, colorBuffer);
    drawCentralLine(gl, positionBuffer, colorBuffer);
    
    //dynamic
    let p1pos = 0;
    let p2pos = 0;
    drawPlayer1(gl, p1pos, positionBuffer, colorBuffer);
    drawPlayer2(gl, p2pos, positionBuffer, colorBuffer);

    let ball_x = 0.5;
    let ball_y = 0.5;
    drawBall(gl, ball_x, ball_y, positionBuffer, colorBuffer);
}
main();
