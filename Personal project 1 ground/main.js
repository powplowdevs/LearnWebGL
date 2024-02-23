// Setup
document.onkeydown = moveCamera; 
const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');
function calculateColor(y){
    return [Math.random(),Math.random(),Math.random()]
}
function makeFace(x,y,z,size, arr){
    let facePoints = [];
    let faceColor = calculateColor();
    
    
    let newY = getyOfxzPair(x,y,z,arr);
    facePoints.push(...[x,newY,z]) //P1
    faceColor = calculateColor(newY);
    colorData.push(...faceColor);

    newY = getyOfxzPair(x+size,y,z,arr);
    facePoints.push(...[x+size,newY,z]) //P2
    faceColor = calculateColor(newY);
    colorData.push(...faceColor);
    
    newY = getyOfxzPair(x,y,z+size,arr);
    facePoints.push(...[x,newY,z+size]) //P3
    faceColor = calculateColor(newY);
    colorData.push(...faceColor);
    
    newY = getyOfxzPair(x+size,y,z+size,arr);
    facePoints.push(...[x+size,newY,z+size]) //P4
    faceColor = calculateColor(newY);
    colorData.push(...faceColor);
    
    newY = getyOfxzPair(x,y,z+size,arr);
    facePoints.push(...[x,newY,z+size]) //P5
    faceColor = calculateColor(newY);
    colorData.push(...faceColor);

    newY = getyOfxzPair(x+size,y,z,arr);
    facePoints.push(...[x+size,newY,z]) //P6
    faceColor = calculateColor(newY);
    colorData.push(...faceColor);
    

    return facePoints;
}
function getyOfxzPair(x,y,z,arr){
    for(let i=0; i<arr.length; i+=3){
        if(arr[i] == x && arr[i+2] == z){
            return arr[i+1];                                                         
        }
        
    }
    return y;
}



function createGround(row,col,size){
    let points = [];
    let x = 0;
    let y = 0;
    let z = -1;

    //Loop for faces
    for(let c=0; c<col; c++){
        for(let r=0; r<row; r++){
            //Make 6 points of face
            let facePoints = makeFace(x, y, z, size, points);
            points.push(...facePoints);
            if(x >= row/10){
                z -= size;
                x=0;
            }
            else{
                x+=size;
            }
            y=Math.random()-1;
        }
    }

    return points;
}



// Check for compatability
if(!gl){
    alert("WebGL is not supported! ):");
    throw new Error("WebGL not supported! ):");
}

// Save vertex data
// const vertexData = [

//     // Front
//     0.5, 0.5, 0.5,
//     0.5, -.5, 0.5,
//     -.5, 0.5, 0.5,
//     -.5, 0.5, 0.5,
//     0.5, -.5, 0.5,
//     -.5, -.5, 0.5,

//     // Left
//     -.5, 0.5, 0.5,
//     -.5, -.5, 0.5,
//     -.5, 0.5, -.5,
//     -.5, 0.5, -.5,
//     -.5, -.5, 0.5,
//     -.5, -.5, -.5,

//     // Back
//     -.5, 0.5, -.5,
//     -.5, -.5, -.5,
//     0.5, 0.5, -.5,
//     0.5, 0.5, -.5,
//     -.5, -.5, -.5,
//     0.5, -.5, -.5,

//     // Right
//     0.5, 0.5, -.5,
//     0.5, -.5, -.5,
//     0.5, 0.5, 0.5,
//     0.5, 0.5, 0.5,
//     0.5, -.5, 0.5,
//     0.5, -.5, -.5,

//     // Top
//     0.5, 0.5, 0.5,
//     0.5, 0.5, -.5,
//     -.5, 0.5, 0.5,
//     -.5, 0.5, 0.5,
//     0.5, 0.5, -.5,
//     -.5, 0.5, -.5,

//     // Bottom
//     0.5, -.5, 0.5,
//     0.5, -.5, -.5,
//     -.5, -.5, 0.5,
//     -.5, -.5, 0.5,
//     0.5, -.5, -.5,
//     -.5, -.5, -.5,
// ];
let colorData = [];
const vertexData = createGround(100,50,0.1);
console.log(vertexData);




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
    gl_PointSize = 1.1;
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

// mat4.translate(modleMatrix, modleMatrix, [0 , 0, -1]);
// mat4.translate(viewMatrix, viewMatrix, [0, 0, 1]);
mat4.invert(viewMatrix, viewMatrix);

// ARGS:         Matrix,          FOV (angle/radians),    Aspect ratio,       Near cull, far cull
mat4.perspective(projectionMatrix, 75*(Math.PI/180), canvas.width/canvas.height, 1e-4, 1e4)

mat4.identity(viewMatrix); // Reset view matrix
mat4.translate(viewMatrix, viewMatrix, [-4.7, -5, -7]); // Move the camera back along the z-axis
mat4.rotateX(viewMatrix, viewMatrix, Math.PI / 4); // Rotate the camera to look downwards


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