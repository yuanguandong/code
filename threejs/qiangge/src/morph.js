import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
let material, controls, ground, scene, object, spotLight, dirLight, camera, renderer;
let geometryPlane, materialPlane, plane;
let clock = new THREE.Clock();
let actions = {};
let activeAction;
let activeActionObject = { state: "Walking" };

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
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);
}

function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe0e0e0);
  scene.fog = new THREE.Fog(0xe0e0e0, 20, 100);
}

function initAxesHelper() {
  const axesHelper = new THREE.AxesHelper(2);
  scene.add(axesHelper);
}

function initMeshs() {
  // ground
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(2000, 2000),
    new THREE.MeshPhongMaterial({
      color: 0x999999,
    })
  );
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  const grid = new THREE.GridHelper(100, 40, 0, 0);
  scene.add(grid);

  const loader = new GLTFLoader();
  loader.load("models/gltf/RobotExpressive/RobotExpressive.glb", function (gltf) {
    console.log(gltf);
    const model = gltf.scene;
    scene.add(model);
    const clips = gltf.animations;
    mixer = new THREE.AnimationMixer(model);
    activeAction = mixer.clipAction(clips[0]);
    activeAction.play();

    animate();
  });
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 100);
  camera.position.set(-5, 3, 10);
  camera.lookAt(new THREE.Vector3(0, 2, 0));
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
  // controls = new OrbitControls(camera, renderer.domElement);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  const delta = clock.getDelta();
  mixer.update(delta);
  requestAnimationFrame(animate);
  render();
}

function render() {
  const delta = clock.getDelta();
  const time = clock.getElapsedTime() * 10;

  renderer.render(scene, camera);
}
