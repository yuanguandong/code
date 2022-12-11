import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as THREE from "three";


const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// 初始化控制器
export const initControls = ({ camera, canvas }) => {
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
};

// 初始化响应式
export const initResize = ({ camera, renderer }) => {
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
};

// 初始化相机
export const initCamera = ({ scene }) => {
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 1;
  scene.add(camera);
  return camera;
};

//初始化渲染器
export const initRenderer = ({ canvas }) => {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  return renderer;
};

//初始化动画帧任务
export const initTick = ({ renderer, scene, camera }) => {
  const tick = () => {
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };
  tick();
};

//初始化灯光
export const initLights = ({ scene, helper }) => {
  const ambientLight = new THREE.AmbientLight("#fff", 1);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight("#fff", 1);
  pointLight1.position.x = -1;
  pointLight1.position.y = 2;
  pointLight1.position.z = -1;

  const pointLight2 = new THREE.PointLight("#fff", 1);
  pointLight2.position.x = 3;
  pointLight2.position.y = 3;
  pointLight2.position.z = -2;

  const pointLight3 = new THREE.PointLight("#fff", 1);
  pointLight3.position.x = 4;
  pointLight3.position.y = 2;
  pointLight3.position.z = -0.5;

  const pointLight4 = new THREE.PointLight("#f00", 1);
  pointLight4.position.x = 3;
  pointLight4.position.y = 1;
  pointLight4.position.z = 2;

  //光源助手
  const lightHelper1 = new THREE.PointLightHelper(pointLight1);
  const lightHelper2 = new THREE.PointLightHelper(pointLight2);
  const lightHelper3 = new THREE.PointLightHelper(pointLight3);
  const lightHelper4 = new THREE.PointLightHelper(pointLight4);

  scene.add(pointLight1, pointLight2, pointLight3, pointLight4);
  if (helper) {
    scene.add(lightHelper1, lightHelper2, lightHelper3, lightHelper4);
  }
};

//网格助手
const initGrid = ({ scene }) => {
  const gridHelper = new THREE.GridHelper(200, 50);
  scene.add(gridHelper);
  return gridHelper;
};

// 图形数据用户界面
export const initGUI = ({ gltf }) => {
  const gui = new dat.GUI();
  gui.add(gltf.scene.rotation, "x").min(0).max(9);
  gui.add(gltf.scene.rotation, "y").min(0).max(9);
  gui.add(gltf.scene.rotation, "z").min(0).max(9);
};
