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

    canvas.focus();
    window.addEventListener("keydown", HandleKeyPress);

    requestAnimationFrame(() => loop(gl, positionBuffer, colorBuffer));
}

// Global variations
let p1pos = 0.0;
let p2pos = 0.0;
let ball_x = 0.0;
let ball_y = 0.0;
let initialSpeedX = 0.01;
let initialSpeedY = 0.01;
let ball_dx = initialSpeedX;
let ball_dy = initialSpeedY;
let speed = 1;
let player1Score = 0;
let player2Score = 0;

function HandleKeyPress(event) {
    switch (event.key) {
        case "w":
            p1pos = Math.min(0.75, p1pos + 0.1);
            break;
        case "s":
            p1pos = Math.max(-0.95, p1pos - 0.1);
            break;
        case "ArrowUp":
            p2pos = Math.min(0.75, p2pos + 0.1);
            break;
        case "ArrowDown":
            p2pos = Math.max(-0.95, p2pos - 0.1);
            break;
    }
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
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0.9, 0.9, 0.9]), gl.STATIC_DRAW);
    gl.drawArrays(gl.POINTS, 0, 1);
}

function drawCentralLine(gl, positionBuffer, colorBuffer) {
    for (let i = -0.9; i < 1; i += 0.2) {
        drawPoint(gl, 0, i, positionBuffer, colorBuffer);
    }
}

function drawPlayer1(gl, x, y, positionBuffer, colorBuffer) {
    for (let i = 0; i < 5; i++) {
        drawPoint(gl, x, y + i * 0.05, positionBuffer, colorBuffer);
    }
}

function drawPlayer2(gl, x, y, positionBuffer, colorBuffer) {
    for (let i = 0; i < 5; i++) {
        drawPoint(gl, x, y + i * 0.05, positionBuffer, colorBuffer);
    }
}

function drawPlayers(gl, positionBuffer, colorBuffer) {
    drawPlayer1(gl, -0.9, p1pos, positionBuffer, colorBuffer);
    drawPlayer2(gl, 0.9, p2pos, positionBuffer, colorBuffer);
}

function drawBorderLine(gl, positionBuffer, colorBuffer) {
    for (let i = -1; i <= 1; i += 0.05) {
        drawPoint(gl, i, -0.98, positionBuffer, colorBuffer);
        drawPoint(gl, i, 0.98, positionBuffer, colorBuffer);
    }
}

function drawBall(gl, positionBuffer, colorBuffer) {
    drawPoint(gl, ball_x, ball_y, positionBuffer, colorBuffer);
}

function updateBallPosition() {
    ball_x += ball_dx;
    ball_y += ball_dy;
}

function handleBorderCollision() {
    if (ball_y > 0.95 || ball_y < -0.95) {
        ball_dy = -ball_dy;
    }
}

function increaseBallSpeedOnPlayerCollision(speed) {
    ball_dx *= speed;
    ball_dy *= speed;
}

function handlePlayerCollision() {
    if (
        (ball_x < -0.85 && ball_y > p1pos - 0.1 && ball_y < p1pos + 0.25) ||
        (ball_x > 0.85 && ball_y > p2pos - 0.1 && ball_y < p2pos + 0.25)
    ) {
        ball_dx = -ball_dx;
        increaseBallSpeedOnPlayerCollision(1.3);
    }
}

function resetBallPosition() {
    if (ball_x > 1 || ball_x < -1) {
        updateScore();
        ball_x = 0;
        ball_y = 0;
        ball_dx = initialSpeedX;
        ball_dy = initialSpeedY;
    }
}

function updateScore() {
    if (ball_x > 1) {
        player1Score++;
    }
    if (ball_x < -1) {
        player2Score++;
    }
}

function loop(gl, positionBuffer, colorBuffer) {
    gl.clear(gl.COLOR_BUFFER_BIT);

    updateBallPosition();
    handleBorderCollision();
    handlePlayerCollision();
    resetBallPosition();

    drawBorderLine(gl, positionBuffer, colorBuffer);
    drawCentralLine(gl, positionBuffer, colorBuffer);
    drawPlayers(gl, positionBuffer, colorBuffer);
    drawBall(gl, positionBuffer, colorBuffer);

    requestAnimationFrame(() => loop(gl, positionBuffer, colorBuffer));
}

main();
