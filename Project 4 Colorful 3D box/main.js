// Setup
const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

// Check for compatability
if(!gl){
    alert("WebGL is not supported! ):");
    throw new Error("WebGL not supported! ):");
}
// Save vertex data
const vertexData = [

    // Front
    0.5, 0.5, 0.5,
    0.5, -.5, 0.5,
    -.5, 0.5, 0.5,
    -.5, 0.5, 0.5,
    0.5, -.5, 0.5,
    -.5, -.5, 0.5,

    // Left
    -.5, 0.5, 0.5,
    -.5, -.5, 0.5,
    -.5, 0.5, -.5,
    -.5, 0.5, -.5,
    -.5, -.5, 0.5,
    -.5, -.5, -.5,

    // Back
    -.5, 0.5, -.5,
    -.5, -.5, -.5,
    0.5, 0.5, -.5,
    0.5, 0.5, -.5,
    -.5, -.5, -.5,
    0.5, -.5, -.5,

    // Right
    0.5, 0.5, -.5,
    0.5, -.5, -.5,
    0.5, 0.5, 0.5,
    0.5, 0.5, 0.5,
    0.5, -.5, 0.5,
    0.5, -.5, -.5,

    // Top
    0.5, 0.5, 0.5,
    0.5, 0.5, -.5,
    -.5, 0.5, 0.5,
    -.5, 0.5, 0.5,
    0.5, 0.5, -.5,
    -.5, 0.5, -.5,

    // Bottom
    0.5, -.5, 0.5,
    0.5, -.5, -.5,
    -.5, -.5, 0.5,
    -.5, -.5, 0.5,
    0.5, -.5, -.5,
    -.5, -.5, -.5,
];

// const colorData = [
//     1,0,0,
//     0,1,0,
//     0,0,1,
// ]

function randomColor(){
    return [Math.random(),Math.random(),Math.random()];
}

let colorData = [];
for(let face=0; face<6; face++){
    let faceColor = randomColor();
    for(let vertex=0; vertex < 6; vertex++){
        colorData.push(...faceColor);
    }
}


// Create buffer
const positionBuffer = gl.createBuffer();
const colorBuffer = gl.createBuffer();

// Load vertex data into buffer
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

// Create veretx shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER);

// Program shader
gl.shaderSource(vertexShader, `
precision mediump float;

attribute vec3 position;
attribute vec3 color;
varying vec3 vColor;

uniform mat4 matrix;

void main(){
    vColor = color;
    gl_Position = matrix * vec4(position, 1);
}
`);
gl.compileShader(vertexShader);

// Create fragment shader
const fragmentSahder = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentSahder, `
precision mediump float;

varying vec3 vColor;

void main(){
    gl_FragColor = vec4(vColor,1);
}
`);
gl.compileShader(fragmentSahder);

// Create program
const program = gl.createProgram();

// Attach shaders to program
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentSahder);
gl.linkProgram(program);

// Enable vertext attributes
const positionLocation = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

const colorLocation = gl.getAttribLocation(program, 'color');
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);


// Draw
gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);

const uniformLocation = {
    matrix: gl.getUniformLocation(program, 'matrix'),
}

// Create matrix
const matrix = mat4.create();
mat4.translate(matrix, matrix, [.2,.5,0]);
mat4.scale(matrix, matrix, [0.25,0.25,0.25]);

function animate(){
    requestAnimationFrame(animate);
    mat4.rotateZ(matrix, matrix, Math.PI /170);
    mat4.rotateX(matrix, matrix, Math.PI /120);
    mat4.rotateY(matrix, matrix, Math.PI /70);
    gl.uniformMatrix4fv(uniformLocation.matrix, false, matrix);
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);
}

animate();