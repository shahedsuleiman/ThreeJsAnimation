import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
import * as dat from "dat.gui";
import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls';


const gui = new dat.GUI();
const world = {
  plane: {
    width: 10,
    height:10,
    widthSegments:10, 
    heightSegments:10,
  },
};
gui.add(world.plane, "width", 1, 20)
.onChange(generatePlane);

gui.add(world.plane, "height", 1, 20)
.onChange(generatePlane);

gui.add(world.plane, "widthSegments", 1, 50)
.onChange(generatePlane);

gui.add(world.plane, "heightSegments", 1, 50)
.onChange(generatePlane);


function generatePlane() {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry
  (world.plane.width, 
  world.plane.height, 
  world.plane.widthSegments, 
  world.plane.heightSegments);
  const { array } = planeMesh.geometry.attributes.position;
  for (let i = 0; i < array.length; i += 3) {
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];

    array[i + 2] = z + Math.random();
  }
}

const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
); //4 arguments [field of view in degrees,aspect ratio of the scene,clipping planes (how close the object is to the camera before its clipped),far clippping planes]

const renderer = new THREE.WebGLRenderer();

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);
//boxgeometry[width,length,height]

//add orbits controls
new OrbitControls(camera, renderer.domElement);
camera.position.z = 5;

const planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const planeMaterial = new THREE.MeshPhongMaterial({
  color: 0x4682B4,
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);
const { array } = planeMesh.geometry.attributes.position;
for (let i = 0; i < array.length; i += 3) {
  const x = array[i];
  const y = array[i + 1];
  const z = array[i + 2];

  array[i + 2] = z + Math.random();
}
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);
scene.add(light);

const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, 0, -1);
scene.add(backLight);

const mouse = {
  x: undefined,
  y: undefined,
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  raycaster.setFromCamera(mouse, camera);
 const intersects = raycaster.intersectObject(planeMesh);
 if (intersects.length > 0) {
  
 }
  // planeMesh.rotation.x += 0.01;
}

animate();


addEventListener('mousemove', () => {
    mouse.x = (event.clientX/ innerWidth) *2 -1;
    mouse.y = -(event.clientY/ innerWidth) *2 +1

    
})
