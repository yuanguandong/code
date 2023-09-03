import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";

let material, controls, ground, scene, object, spotLight, dirLight, camera, renderer;
let geometryPlane, materialPlane, plane;
let clock = new THREE.Clock();
let firstControls;

initScene();
initAxesHelper();
initMeshs();
// initLight();
initCamera();
initRenderer();
initControls();

animate();

window.addEventListener("resize", onWindowResize);

function initRenderer() {
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xaaccff);
  scene.fog = new THREE.FogExp2(0xaaccff, 0.0014);
}

function initAxesHelper() {
  const axesHelper = new THREE.AxesHelper(100);
  scene.add(axesHelper);
}

function initMeshs() {
  geometryPlane = new THREE.PlaneGeometry(20000, 20000, 31, 31);
  geometryPlane.rotateX(-Math.PI / 2);

  const positions = geometryPlane.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const y = 35 * Math.sin(i / 2);
    positions.setY(i, y);
  }

  const texture = new THREE.TextureLoader().load("textures/water.jpg");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 5);
  materialPlane = new THREE.MeshBasicMaterial({
    map: texture,
    color: 0x33ccff,
  });
  plane = new THREE.Mesh(geometryPlane, materialPlane);
  scene.add(plane);
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1000);
  camera.position.set(0, 100, 300);
  camera.lookAt(0, 0, 0);
}

function initControls() {
  // controls = new OrbitControls(camera, renderer.domElement);
  firstControls = new FirstPersonControls(camera, renderer.domElement);
  firstControls.movementSpeed = 500;
  firstControls.lookSpeed = 0.1;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  firstControls.handleResize();
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  const delta = clock.getDelta();
  const time = clock.getElapsedTime() * 10;
  const positions = geometryPlane.attributes.position;
  positions.usage = THREE.DynamicCopyUsage;

  for (let i = 0; i < positions.count; i++) {
    const y = 35 * Math.sin(i / 5 + (time + i) / 7);
    positions.setY(i, y);
  }
  positions.needsUpdate = true;
  firstControls.update(delta);

  renderer.render(scene, camera);
}
