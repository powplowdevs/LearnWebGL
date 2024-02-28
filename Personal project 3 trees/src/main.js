import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

//Creater renderer (like the canvas)
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Set up our scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, //FOV
    window.innerWidth/window.innerHeight, //Aspect ratio
    0.1, //NCP
    1000 //FCP
);

//Show 3 axis
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

//Set position
camera.position.set(1,2,5)

//Create box
const boxGeo = new THREE.BoxGeometry();
const boxMat = new THREE.MeshBasicMaterial({color: 0x00FF00});
const box = new THREE.Mesh(boxGeo, boxMat);
scene.add(box);

//Rotate
box.rotation.x = 5;
box.rotation.y = 5;

//Animate
function animate(time){
    // box.rotation.x += time/10000;
    // box.rotation.y += time/1000;

    //Link scene and camera
    renderer.render(scene, camera);
}


//Animate
renderer.setAnimationLoop(animate);