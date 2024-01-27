import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let canvas;

const initEnv = () => {
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  
  const renderer = new THREE.WebGLRenderer();
  
  canvas = renderer.domElement;
  document.body.appendChild(canvas);
  renderer.setSize(sizes.width, sizes.height);

  const scene = new THREE.Scene();

  const axesHelper = new THREE.AxesHelper();
  scene.add(axesHelper);



  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
  camera.position.z = 3;
  camera.lookAt(new THREE.Vector3());
  const controls = new OrbitControls(camera, canvas);
  // controls.enableDamping = true;
  scene.add(camera);

  renderer.render(scene, camera);

  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  const clock = new THREE.Clock();

  return { scene, camera, renderer, controls };
};

const initScene = () => {
  const urls = [
    "textures/pisa/px.png",
    "textures/pisa/nx.png",
    "textures/pisa/py.png",
    "textures/pisa/ny.png",
    "textures/pisa/pz.png",
    "textures/pisa/nz.png",
  ];
  const textureCube = new THREE.CubeTextureLoader().load(urls);
  scene.background = textureCube;
  return { textureCube };
};

const initMeshes = () => {
  const geometry = new THREE.SphereGeometry(0.1, 64, 64);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    envMap: textureCube,
  });
  for (let i = 0; i < 500; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = Math.random() * 10 - 5;
    mesh.position.y = Math.random() * 10 - 5;
    mesh.position.z = Math.random() * 10 - 5;
    mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;
    scene.add(mesh);
  }
};

const { scene, camera, renderer, controls } = initEnv();
const { textureCube } = initScene();
initMeshes();

const update = () => {};
const tick = () => {
  update();
  // const elapsedTime = clock.getElapsedTime();
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
