//Setup
document.onkeydown = moveCamera;
const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth-100;
canvas.height = window.innerHeight-100;
const gl = canvas.getContext('webgl');
function randomColor(){
    return [Math.random(),Math.random(),Math.random()];
}
function poulateColorMatrix(){
    let colorData = [];
    for(let face=0; face<6; face++){
        let faceColor = randomColor();
        for(let vertex=0; vertex < 6; vertex++){
            colorData.push(...faceColor);
        }
    }
    return colorData;
}

//Check for compatability
if(!gl){
    alert("WebGL is not supported! ):");
    throw new Error("WebGL not supported! ):");
}

//Save vertex data
const vertexData = [

    //Front
    0.5, 0.5, 0.5,
    0.5, -.5, 0.5,
    -.5, 0.5, 0.5,
    -.5, 0.5, 0.5,
    0.5, -.5, 0.5,
    -.5, -.5, 0.5,

    //Left
    -.5, 0.5, 0.5,
    -.5, -.5, 0.5,
    -.5, 0.5, -.5,
    -.5, 0.5, -.5,
    -.5, -.5, 0.5,
    -.5, -.5, -.5,

    //Back
    -.5, 0.5, -.5,
    -.5, -.5, -.5,
    0.5, 0.5, -.5,
    0.5, 0.5, -.5,
    -.5, -.5, -.5,
    0.5, -.5, -.5,

    //Right
    0.5, 0.5, -.5,
    0.5, -.5, -.5,
    0.5, 0.5, 0.5,
    0.5, 0.5, 0.5,
    0.5, -.5, 0.5,
    0.5, -.5, -.5,

    //Top
    0.5, 0.5, 0.5,
    0.5, 0.5, -.5,
    -.5, 0.5, 0.5,
    -.5, 0.5, 0.5,
    0.5, 0.5, -.5,
    -.5, 0.5, -.5,

    //Bottom
    0.5, -.5, 0.5,
    0.5, -.5, -.5,
    -.5, -.5, 0.5,
    -.5, -.5, 0.5,
    0.5, -.5, -.5,
    -.5, -.5, -.5,
    
];

//Save color data
let colorData = poulateColorMatrix();

//Create buffer
const positionBuffer = gl.createBuffer();
const colorBuffer = gl.createBuffer();

//Load vertex data into buffer
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

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

void main(){
    vColor = color;
    gl_Position = matrix * vec4(position, 1);
}
`);
gl.compileShader(vertexShader);

//Create fragment shader
const fragmentSahder = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentSahder, `
precision mediump float;

varying vec3 vColor;

void main(){
    gl_FragColor = vec4(vColor,1);
}
`);
gl.compileShader(fragmentSahder);

//Create program
const program = gl.createProgram();

//Attach shaders to program
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentSahder);
gl.linkProgram(program);

//Enable vertex attributes
const positionLocation = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

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
const modleMatrix = mat4.create();
const viewMatrix = mat4.create();
const projectionMatrix = mat4.create();

const modleViewMatrix = mat4.create();
const mvpMatrix = mat4.create();

mat4.translate(modleMatrix, modleMatrix, [0 , 0, -2]);
mat4.translate(viewMatrix, viewMatrix, [0, 0, 1]);
mat4.invert(viewMatrix, viewMatrix);

// ARGS:         Matrix,          FOV (angle/radians),    Aspect ratio,       Near cull, far cull
mat4.perspective(projectionMatrix, 75*(Math.PI/180), canvas.width/canvas.height, 1e-4, 1e4)

let yPan=0;
const Sense = 0.05;

function animate(){
    requestAnimationFrame(animate);
    //mat4.rotateZ(modleMatrix, modleMatrix, Math.PI /170);
    //mat4.rotateX(modleMatrix, modleMatrix, Math.PI /120);
    //mat4.rotateY(modleMatrix, modleMatrix, Math.PI /70);

    mat4.multiply(modleViewMatrix, viewMatrix, modleMatrix)
    mat4.multiply(mvpMatrix, projectionMatrix, modleViewMatrix)
    
    gl.uniformMatrix4fv(uniformLocation.matrix, false, mvpMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);

}

animate();

//Track mouse
function moveCamera(e) {

    e = e || window.event;

    
    // ***PLAYER MOVEMENT***
    //Move forward
    if (e.keyCode == '87') {
        //MOVE BOX AWAY
        mat4.scale(viewMatrix, viewMatrix, [2,2,2]);
    }
    //Move f
    if (e.keyCode == '83') {
        //MOVE BOX AWAY
        mat4.scale(viewMatrix, viewMatrix, [0.1,0.1,-0.1]);
    }

    // ***CAMERA MOVEMENT***
    //Pan up
    if (e.keyCode == '38' && yPan < 2) {
        mat4.rotateX(viewMatrix, viewMatrix, Sense);
        yPan+=Sense;
    }
    //Pan down
    else if (e.keyCode == '40' && yPan > -1) {
        mat4.rotateX(viewMatrix, viewMatrix, -Sense);
        yPan-=Sense;
    }
    //Pan left
    else if (e.keyCode == '37') {
        mat4.rotateY(viewMatrix, viewMatrix, Sense);
    }
    //Pan right
    else if (e.keyCode == '39') {
        mat4.rotateY(viewMatrix, viewMatrix, -Sense);
    }

}