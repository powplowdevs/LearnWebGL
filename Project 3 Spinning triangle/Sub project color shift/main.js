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
    0,1,0,
    1,-1,0,
    -1,-1,0,
];

let colorData = [
    1,0,0,
    0,1,0,
    0,0,1,
]


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

const uniformLocation = {
    matrix: gl.getUniformLocation(program, 'matrix'),
}

// Create matrix
const matrix = mat4.create();
mat4.translate(matrix, matrix, [.2,.5,0]);
mat4.scale(matrix, matrix, [0.25,0.25,0.25]);

// Animate
function animate(){
    requestAnimationFrame(animate);
    mat4.rotateZ(matrix, matrix, Math.PI/70);
    gl.uniformMatrix4fv(uniformLocation.matrix, false, matrix);
    

    for (let i = 0; i < colorData.length; i++) {
        colorData[i] = Math.floor(Math.random() * (1 - 0 + 1) + 0)
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

animate();