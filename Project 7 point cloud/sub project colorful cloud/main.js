//Setup
const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

//Check for compatability
if(!gl){
    alert("WebGL is not supported! ):");
    throw new Error("WebGL not supported! ):");
}

//Save vertex data and color data
function spherePointCloud(pointCount){
    let points = [];
    for(let i=0; i<pointCount; i++){
        const r = () => Math.random() - 0.5;
        const inputPoint = [r(),r(),r()];
        const outputPoint = vec3.normalize(vec3.create(), inputPoint);
        points.push(...outputPoint);
    }
    return points;
}
function spherePointCloudColor(pointCount){
    let points = [];
    for(let i=0; i<pointCount; i++){
        const r = () => Math.random();
        const inputPoint = [r(),r(),r()];
        points.push(...inputPoint);
    }
    return points;
}
const vertexData = spherePointCloud(1e5);
const colorData = spherePointCloudColor(1e5);
console.log(colorData.slice(0, 28))
//Create buffers
const positionBuffer = gl.createBuffer();
const colorBuffer = gl.createBuffer();

//Load vertex data into buffer
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
//Load color data into buffer
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);


//Create veretx shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER);

//Program shader
gl.shaderSource(vertexShader, `
precision mediump float;

attribute vec3 position;
attribute vec3 color;

varying vec3 vColor;

uniform mat4 matrix;

void main() {
    vColor = vec3(color);
    
    gl_Position = matrix * vec4(position, 1);
    gl_PointSize = 0.1;
}
`);
gl.compileShader(vertexShader);

//Create fragment shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
precision mediump float;

varying vec3 vColor;

void main() {
    gl_FragColor = vec4(vColor, 1);
}
`);
gl.compileShader(fragmentShader);

//Create program
const program = gl.createProgram();

//Attach shaders to program
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

//Enable vertex attributes
const positionLocation = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

//Enable color attributes
const colorLocation = gl.getAttribLocation(program, 'color');
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);


//Draw
gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);

const uniformLocation = {
    matrix: gl.getUniformLocation(program, 'matrix'),
}
  

//Create perspective matrix
const modelMatrix = mat4.create();
const viewMatrix = mat4.create();
const projectionMatrix = mat4.create();

// ARGS:         Matrix,          FOV (angle/radians),    Aspect ratio,       Near cull, far cull
mat4.perspective(projectionMatrix, 75*(Math.PI/180), canvas.width/canvas.height, 1e-4, 1e4)

const modleViewMatrix = mat4.create();
const mvpMatrix = mat4.create();

mat4.translate(modelMatrix, modelMatrix, [0, 0, 0]);
mat4.translate(viewMatrix, viewMatrix, [0, 0.1, 2]);
mat4.invert(viewMatrix, viewMatrix);

function animate(){
    requestAnimationFrame(animate);
    
    mat4.rotateY(modelMatrix, modelMatrix, 0.03);
    // mat4.rotateZ(modelMatrix, modelMatrix, 0.05);
    mat4.rotateX(modelMatrix, modelMatrix, 0.01);

    mat4.multiply(modleViewMatrix, viewMatrix, modelMatrix);
    mat4.multiply(mvpMatrix, projectionMatrix, modleViewMatrix);
    
    gl.uniformMatrix4fv(uniformLocation.matrix, false, mvpMatrix);
    gl.drawArrays(gl.POINTS, 0, vertexData.length/3);
}

animate();