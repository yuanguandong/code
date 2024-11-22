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

//gltf加载器
const gltfloader = new GLTFLoader();
//动画帧
let tl = gsap.timeline();

const modelName = "scene.gltf";

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

//加载gltf
gltfloader.load(modelName, (gltf) => {
  scene.add(gltf.scene);
  // initGUI({ gltf });
  gltf.scene.scale.set(0.3, 0.3, 0.3);
  gltf.scene.rotation.set(0, 4.7, 0.006);
  tl.to(gltf.scene.rotation, { y: 6.28, duration: 1 });
  tl.to(gltf.scene.scale, { x: 0.2, y: 0.2, z: 0.2, duration: 1 }, "-=1");
  tl.to(gltf.scene.position, { x: 0.5 });
  tl.to(gltf.scene.rotation, { x: 0.4, y: 5.2, duration: 1 });
  tl.to(gltf.scene.scale, { x: 0.25, y: 0.25, z: 0.25, duration: 1 }, "-=1");
});

const camera = initCamera({ scene });
const renderer = initRenderer({ canvas });
initLights({ scene });
initControls({ camera, canvas });
initResize({ camera, renderer });
initTick({ renderer, scene, camera });

setTimeout(() => {
  document.querySelector(".mymain").style.opacity = "1";
}, 3500);
