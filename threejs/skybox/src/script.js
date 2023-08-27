import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const canvas = document.querySelector("canvas.webgl");

const initEnv = () => {
  const scene = new THREE.Scene();

  const axesHelper = new THREE.AxesHelper();
  scene.add(axesHelper);

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
  camera.position.z = 3;
  camera.lookAt(new THREE.Vector3());
  const controls = new OrbitControls(camera, canvas);
  // controls.enableDamping = true;
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
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

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };

  tick();
  return { scene, camera, renderer };
};

const { scene, camera, renderer } = initEnv();

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
};
initScene();
