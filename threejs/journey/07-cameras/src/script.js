import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  initControls,
  initCamera,
  initResize,
  initRenderer,
  initTick,
  initLights,
  initGUI,
} from "../utils/utils";
//gltf加载器
const gltfloader = new GLTFLoader();

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = -(e.clientY / sizes.height - 0.5);
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
// scene.add(mesh);

gltfloader.load("pen.gltf", (gltf) => {
  gltf.scene.scale.set(0.3, 0.3, 0.3);
  gltf.scene.rotation.set(0, 4.7, 0.006);
  scene.add(gltf.scene);
  //   gui.add(gltf.scene.rotation, "x").min(0).max(9);
  //   gui.add(gltf.scene.rotation, "y").min(0).max(9);
  //   gui.add(gltf.scene.rotation, "z").min(0).max(9);

  // tl.to(gltf.scene.rotation, { y: 6.28, duration: 1 });
  // tl.to(gltf.scene.scale, { x: 0.2, y: 0.2, z: 0.2, duration: 1 }, "-=1");
  // tl.to(gltf.scene.position, { x: 0.5 });
  // tl.to(gltf.scene.rotation, { y: 5.2, duration: 1 });
  // tl.to(gltf.scene.scale, { x: 0.25, y: 0.25, z: 0.25, duration: 1 }, "-=1");
});

initLights({ scene });

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// const aspectRatio = sizes.width / sizes.height;

// const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100);

// camera.position.x = 2;
// camera.position.y = 2;
camera.position.z = 3;
camera.lookAt(new THREE.Vector3());
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  // mesh.rotation.y = elapsedTime;

  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  // camera.position.y = cursor.y * 5;
  // camera.lookAt(mesh.position);

  controls.update();
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
