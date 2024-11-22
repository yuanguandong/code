import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";

//gltf加载器
const gltfloader = new GLTFLoader();

// 图形数据用户界面
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

//光源助手
// const lightHelper = new THREE.PointLightHelper(pointLight);
//网格助手
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(gridHelper);

//动画帧
let tl = gsap.timeline();

//加载gltf
gltfloader.load("3.gltf", (gltf) => {
  gltf.scene.scale.set(0.3, 0.3, 0.3);
  gltf.scene.rotation.set(0, 4.7, 0.006);
  scene.add(gltf.scene);
  //   gui.add(gltf.scene.rotation, "x").min(0).max(9);
  //   gui.add(gltf.scene.rotation, "y").min(0).max(9);
  //   gui.add(gltf.scene.rotation, "z").min(0).max(9);

  tl.to(gltf.scene.rotation, { y: 6.28, duration: 1 });
  tl.to(gltf.scene.scale, { x: 0.2, y: 0.2, z: 0.2, duration: 1 }, "-=1");
  tl.to(gltf.scene.position, { x: 0.5 });
  tl.to(gltf.scene.rotation, { y: 5.2, duration: 1 });
  tl.to(gltf.scene.scale, { x: 0.25, y: 0.25, z: 0.25, duration: 1 }, "-=1");
});

// Lights

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const pointLight = new THREE.PointLight("#fff", 1.5);
pointLight.position.x = -1;
pointLight.position.y = -0.5;
pointLight.position.z = 2;
scene.add(pointLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 1;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects

  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();


setTimeout(()=>{
    document.querySelector('.main').style.opacity = '1';
},1500)