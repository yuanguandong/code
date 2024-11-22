import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let material, controls, ground, scene, object, spotLight, dirLight, camera, renderer;

initRenderer();

initScene();
initAxesHelper();
initMeshs();
initLight();

initCamera();
initControls();

enableShadow();
enableClipping();
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
  scene.background = new THREE.Color(0x999999);
}

function initAxesHelper() {
  const axesHelper = new THREE.AxesHelper(100);
  scene.add(axesHelper);
}

function initMeshs() {
  ground = new THREE.Mesh(
    new THREE.PlaneGeometry(9, 9, 1, 1),
    new THREE.MeshPhongMaterial({ color: 0xa0adaf, shininess: 150 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1;
  scene.add(ground);

  material = new THREE.MeshPhongMaterial({
    color: 0x80ee10,
    shininess: 100,
  });
  const geometry = new THREE.TorusKnotGeometry(0.4, 0.08, 95, 20);
  object = new THREE.Mesh(geometry, material);
  console.log("object", object);
  scene.add(object);
}

function initLight() {
  scene.add(new THREE.AmbientLight(0x505050));

  spotLight = new THREE.SpotLight(0xffffff);
  spotLight.angle = Math.PI / 5;
  spotLight.penumbra = 0.3;
  spotLight.position.set(2, 3, 3);
  scene.add(spotLight);

  dirLight = new THREE.DirectionalLight(0x55505a, 1);
  dirLight.position.set(0, 3, 0);
  scene.add(dirLight);
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
  camera.position.set(0, 0, 4);
}

function initControls() {
  controls = new OrbitControls(camera, renderer.domElement);
}

function enableShadow() {
  renderer.shadowMap.enabled = true;

  spotLight.castShadow = true;
  spotLight.shadow.camera.near = 3;
  spotLight.shadow.camera.far = 10;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;

  dirLight.castShadow = true;
  dirLight.shadow.camera.near = 1;
  dirLight.shadow.camera.far = 10;
  dirLight.shadow.camera.right = 1;
  dirLight.shadow.camera.left = -1;
  dirLight.shadow.camera.top = 1;
  dirLight.shadow.camera.bottom = -1;
  dirLight.shadow.camera.width = 1024;
  dirLight.shadow.camera.height = 1024;

  ground.receiveShadow = true;
  object.castShadow = true;
}

function enableClipping() {
  const plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0.2);
  const plane1 = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0.2);

  material.clippingPlanes = [plane, plane1];
  material.side = THREE.DoubleSide;
  renderer.localClippingEnabled = true;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
