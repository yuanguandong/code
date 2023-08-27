import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import * as dat from "lil-gui";
import gsap from "gsap";
import * as dat from "dat.gui";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.set(0, 0, 10);
scene.add(camera);

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });

const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const params = {
  move: () => {
    gsap.to(cube.position, { duration: 5, x: 5 });
    gsap.to(cube.rotation, { duration: 5, x: 2 * Math.PI, ease: "power1.inOut" });
  },
};

const gui = new dat.GUI();
gui.add(cube.position, "x").min(0).max(5).step(0.01).name("x");
gui.add(params, "move").name("动画");
// const control = new OrbitControls();
// scene.add(control);

const canvas = document.querySelector("canvas.webgl");
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

const controls = new OrbitControls(camera, canvas);

function animate() {
  requestAnimationFrame(animate);
  //   controls.update();
  renderer.render(scene, camera);
}

animate();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});
