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

// Create buffer
const positionBuffer = gl.createBuffer();

// Load vertex data into buffer
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

// Create veretx shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER);

// Program shader
gl.shaderSource(vertexShader, `
attribute vec3 position;
void main(){
    gl_Position = vec4(position, 1);
}
`);
gl.compileShader(vertexShader);

// Create fragment shader
const fragmentSahder = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentSahder, `
precision mediump float;

void main(){
    gl_FragColor = vec4(1,0,0,1);
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

// Draw
gl.useProgram(program);
gl.drawArrays(gl.TRIANGLES, 0, 3);