import gsap from "gsap";
import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
import * as dat from "dat.gui";
import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls";
import TWEEN from '@tweenjs/tween.js';
// import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';

const gui = new dat.GUI();
const world = {
  plane: {
    width: 400,
    height: 400,
    widthSegments: 50,
    heightSegments: 50,
  },
};

gui.add(world.plane, "width", 1, 500).onChange(generatePlane);

gui.add(world.plane, "height", 1, 500).onChange(generatePlane);

gui.add(world.plane, "widthSegments", 1, 100).onChange(generatePlane);

gui.add(world.plane, "heightSegments", 1, 100).onChange(generatePlane);

function generatePlane() {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  );
  
  //add vertice randomization
const { array } = planeMesh.geometry.attributes.position;
const randomValues = [];
for (let i = 0; i < array.length; i++) {
  if (i % 3 === 0) {
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];

    array[i] = x + (Math.random() - 0.5)* 3;
    array[i + 1] = y + (Math.random() - 0.5)* 3;
    array[i + 2] = z + (Math.random() - 0.5) * 3;
  }
  randomValues.push(Math.random() * Math.PI * 2);
}

  console.log(randomValues);
  planeMesh.geometry.attributes.position.randomValues = randomValues;

  console.log(planeMesh.geometry.attributes.position);
  planeMesh.geometry.attributes.position.originalPosition =
  planeMesh.geometry.attributes.position.array;

  const colors = [];
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0, 0.19, 0.4);
  }
  console.log(colors);
  planeMesh.geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  );
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

//add orbits controls
new OrbitControls(camera, renderer.domElement);
camera.position.z = 50;

const planeGeometry = new THREE.PlaneGeometry(400, 400, 50, 50);
const planeMaterial = new THREE.MeshPhongMaterial({
  // color: 0xFF69B4,
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
  vertexColors: true,
  // transparent: true,
  // opacity: 0.5,
});

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

generatePlane();

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1);
scene.add(light);

const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, -1, -1);
scene.add(backLight);

const mouse = {
  x: undefined,
  y: undefined,
};




let frame = 0;
function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
  TWEEN.update();

  raycaster.setFromCamera(mouse, camera);
  frame += 0.01;
  const { array, originalPosition, randomValues } =
    planeMesh.geometry.attributes.position;

  for (let i = 0; i < array.length; i += 3) {
    array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.01;
    array[i + 1] = originalPosition[i+1] + Math.sin(frame + randomValues[i+1]) * 0.01;
  }

  planeMesh.geometry.attributes.position.needsUpdate = true;

  const intersects = raycaster.intersectObject(planeMesh);
  if (intersects.length > 0) {
    const { color } = intersects[0].object.geometry.attributes;
    color.setX(intersects[0].face.a, 0.1);
    color.setY(intersects[0].face.a, 0.5);
    color.setZ(intersects[0].face.a, 1);

    color.setX(intersects[0].face.b, 0.1);
    color.setY(intersects[0].face.b, 0.5);
    color.setZ(intersects[0].face.b, 1);

    color.setX(intersects[0].face.c, 0.1);
    color.setY(intersects[0].face.c, 0.5);
    color.setZ(intersects[0].face.c, 1);

    intersects[0].object.geometry.attributes.color.needsUpdate = true;

    const initialColor = {
      r: 0,
      g: 0.19,
      b: 0.4,
    };

    const hoverColor = {
      r: 0.1,
      g: 0.5,
      b: 1,
    };

    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      onUpdate: () => {
        color.setX(intersects[0].face.a, hoverColor.r);
        color.setY(intersects[0].face.a, hoverColor.g);
        color.setZ(intersects[0].face.a, hoverColor.b);

        color.setX(intersects[0].face.b, hoverColor.r);
        color.setY(intersects[0].face.b, hoverColor.g);
        color.setZ(intersects[0].face.b, hoverColor.b);

        color.setX(intersects[0].face.c, hoverColor.r);
        color.setY(intersects[0].face.c, hoverColor.g);
        color.setZ(intersects[0].face.c, hoverColor.b);

        color.needsUpdate = true;
      },
    });
  }
}


animate();

var btn = document.getElementById("button");
btn.onclick = function(){
//   const { array } =
//   planeMesh.geometry.attributes.position;

// for (let i = 0; i < array.length; i += 3) {
//   planeMesh.rotation.x = 0.1;
// }
// Tween.js Tweening
new TWEEN.Tween(planeMesh.position)
  .to( { y:1.5 }, 2000)
  .yoyo(true)
  .repeat(Infinity)
  .easing(TWEEN.Easing.Cubic.InOut)
  .start()
;
new TWEEN.Tween(planeMesh.rotation)
  .to({ y: "-" + (Math.PI/2) * 8}, 6000) // Math.PI/2 = 360degrees x8 rotations
  .delay(1000)
  .repeat(Infinity)
  .easing(TWEEN.Easing.Cubic.InOut)
  .start()
;
new TWEEN.Tween(planeMesh.rotation)
  .to({ x: "-" + (Math.PI/2) * 9}, 14000)
  .repeat(Infinity)
  .easing(TWEEN.Easing.Cubic.InOut)
  .start()
;
new TWEEN.Tween(planeMesh.scale)
  .to( { x:1.25, y:1.25, z:1.25 }, 5000)
  .yoyo(true)
  .repeat(Infinity)
  .easing(TWEEN.Easing.Cubic.InOut)
  .start()
;
}

addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / innerWidth) * 2 + 1;
});

window.addEventListener('resize', () => {
  // update display width and height
  width = window.innerWidth
  height = window.innerHeight
  // update camera aspect
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  // update renderer
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.render(scene, camera)
})
