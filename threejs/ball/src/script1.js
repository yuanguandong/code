import "./style.css";
import * as THREE from "three";
import {
  initControls,
  initCamera,
  initResize,
  initRenderer,
  initTick,
  initLights,
  initGUI,
} from "../utils/utils";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";
import * as dat from "dat.gui";
//gltf加载器
const gltfloader = new GLTFLoader();
//动画帧
let tl = gsap.timeline();
// const gui = new dat.GUI();
const modelName = "scene.gltf";

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

//加载gltf
// gltfloader.load(modelName, (gltf) => {
//   scene.add(gltf.scene);
//   // initGUI({ gltf });
//   gltf.scene.scale.set(0.3, 0.3, 0.3);
//   gltf.scene.rotation.set(0, 4.7, 0.006);
//   tl.to(gltf.scene.rotation, { y: 6.28, duration: 1 });
//   tl.to(gltf.scene.scale, { x: 0.2, y: 0.2, z: 0.2, duration: 1 }, "-=1");
//   tl.to(gltf.scene.position, { x: 0.5 });
//   tl.to(gltf.scene.rotation, { x: 0.4, y: 5.2, duration: 1 });
//   tl.to(gltf.scene.scale, { x: 0.25, y: 0.25, z: 0.25, duration: 1 }, "-=1");
// });
const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load("/3.jpg");
const geometry = new THREE.SphereBufferGeometry(0.2, 40, 40);
const material = new THREE.MeshStandardMaterial();

material.metalness = 0.7;
material.roughness = 0.2;
material.normalMap = normalTexture;
material.color = new THREE.Color("#000");

const sphere = new THREE.Mesh(geometry, material);

scene.add(sphere);
const camera = initCamera({ scene });
const renderer = initRenderer({ canvas });
const pointLight1 = new THREE.PointLight("#fff", 1);
pointLight1.position.x = 1;
pointLight1.position.y = 3;
pointLight1.position.z = 4;
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight("#f00", 2);
pointLight2.position.x = 1.67;
pointLight2.position.y = -3;
pointLight2.position.z = -3;
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0x96ff, 2);
pointLight3.position.x = -3;
pointLight3.position.y = 3;
pointLight3.position.z = -3;
scene.add(pointLight3);

// const light3 = gui.addFolder("Light 3");
// light3.add(pointLight3.position, "x").min(-3).max(3).step(0.01);
// light3.add(pointLight3.position, "y").min(-3).max(3).step(0.01);
// light3.add(pointLight3.position, "z").min(-3).max(3).step(0.01);
// light3.add(pointLight3, "intensity").min(-3).max(3).step(0.01);

// const light3Color = {
//   color: 0x96ff,
// };

// light3.addColor(light3Color, "color").onChange(() => {
//   pointLight3.color.set(light3Color.color);
// });

document.addEventListener("mousemove", onDocumentMouseMove);

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowX = window.innerWidth / 2;
const windowY = window.innerHeight / 2;

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowX;
  mouseY = event.clienyY - windowY;
}

const updateSphere = (event) => {
  sphere.position.y = window.scrollY * 0.001;
};

window.addEventListener("scroll", updateSphere);

const clock = new THREE.Clock();
// initLights({ scene });
// initControls({ camera, canvas });
initResize({ camera, renderer });
initTick({
  renderer,
  scene,
  camera,
  animate: () => {
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    const elapsedTime = clock.getElapsedTime();
    sphere.rotation.y += 0.5 * elapsedTime;
    sphere.rotation.y += 0.5 * (targetX - sphere.rotation.y);
    sphere.rotation.x += 0.05 * (targetX - sphere.rotation.x);
    sphere.position.z += -0.05 * (targetX - sphere.rotation.x);
  },
});

// setTimeout(() => {
//   document.querySelector(".mymain").style.opacity = "1";
// }, 1500);
















