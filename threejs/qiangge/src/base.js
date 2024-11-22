import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let material, controls, ground, scene, object, spotLight, dirLight, camera, renderer;
let geometryPlane, materialPlane, plane;
let clock = new THREE.Clock();

initScene();
initAxesHelper();
initMeshs();
initLight();
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
  scene.background = new THREE.Color(0x000000);
  // scene.fog = new THREE.FogExp2(0xaaccff, 0.0014);
}

function initAxesHelper() {
  const axesHelper = new THREE.AxesHelper(100);
  scene.add(axesHelper);
}

function initMeshs() {}

function initCamera() {
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1000);
  camera.position.set(0, 100, 300);
  camera.lookAt(0, 0, 0);
}

function initLight() {
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(0, 30, 10);
  scene.add(dirLight); 
  // scene.add(new THREE.AmbientLight(0x505050));

  // spotLight = new THREE.SpotLight(0xffffff);
  // spotLight.angle = Math.PI / 5;
  // spotLight.penumbra = 0.3;
  // spotLight.position.set(2, 3, 3);
  // scene.add(spotLight);

  // dirLight = new THREE.DirectionalLight(0x55505a, 1);
  // dirLight.position.set(0, 3, 0);
  // scene.add(dirLight);
}

function initControls() {
  controls = new OrbitControls(camera, renderer.domElement);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  const delta = clock.getDelta();
  const time = clock.getElapsedTime() * 10;

  renderer.render(scene, camera);
}
