import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); //4 arguments [field of view in degrees,aspect ratio of the scene,clipping planes (how close the object is to the camera before its clipped),far clippping planes]

const renderer = new THREE.WebGLRenderer();

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);
const boxGeometry = new THREE.BoxGeometry(1,1,1); //[width,length,height]
const material = new THREE.MeshBasicMaterial({color:0x00FF00});
const mesh = new THREE.Mesh(boxGeometry,material)

scene.add(mesh);
camera.position.z= 5;

const planeGeometry = new THREE.PlaneGeometry(5,5,10,10);
const planeMaterial = new THREE.MeshBasicMaterial({color:0xff0000});
const planeMesh = new THREE.Mesh(planeGeometry,planeMaterial);
scene.add(planeMesh);

function animate(){
    requestAnimationFrame(animate)
    renderer.render(scene,camera);
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
    planeMesh.rotation.x += 0.01;
    planeMesh.rotation.y += 0.01;
}

animate();



