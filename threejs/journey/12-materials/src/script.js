import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

const gui = new dat.GUI();

const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load("/textures/door/ambientOcclusion.jpg");
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const matcapTexture = textureLoader.load("/textures/matcaps/7.png");
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");

gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

const folder = 3;
const sufix = "jpg";
const environmentTexture = cubeTextureLoader.load([
  `/textures/environmentMaps/${folder}/px.${sufix}`,
  `/textures/environmentMaps/${folder}/nx.${sufix}`,
  `/textures/environmentMaps/${folder}/py.${sufix}`,
  `/textures/environmentMaps/${folder}/pz.${sufix}`,
  `/textures/environmentMaps/${folder}/ny.${sufix}`,
  `/textures/environmentMaps/${folder}/nz.${sufix}`,
]);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// const material = new THREE.MeshBasicMaterial({
//   // map: doorColorTexture,
//   color: new THREE.Color("green"),
//   wireframe: true,
//   // opacity: 0.5,
//   transparent: true,
//   // alphaMap: doorAlphaTexture,
//   side: THREE.DoubleSide,
// });

// const material = new THREE.MeshNormalMaterial({
//   // flatShading: true,
// });

// const material = new THREE.MeshMatcapMaterial({
//   // matcap: matcapTexture,
// });

// const material = new THREE.MeshDepthMaterial();

// const material = new THREE.MeshLambertMaterial();

// const material = new THREE.MeshPhongMaterial({
//   shininess: 1000,
//   specular: new THREE.Color(0xff0000),
// });

// const material = new THREE.MeshToonMaterial({
//   gradientMap: gradientTexture,
// });

const material = new THREE.MeshStandardMaterial({
  metalness: 0.7,
  roughness: 0.2,
  //   map: doorColorTexture,
  //   aoMap: doorAmbientOcclusionTexture,
  //   aoMapIntensity: 1,
  //   displacementMap: doorHeightTexture,
  //   displacementScale: 0.05,
  //   metalnessMap: doorMetalnessTexture,
  //   roughnessMap: doorRoughnessTexture,
  //   normalMap: doorNormalTexture,
  //   transparent: true,
  //   alphaMap: doorAlphaTexture,
  //   normalScale: [0.5, 0.5],
  envMap: environmentTexture,
});

// gui.add(material, "metalness").min(0).max(1).step(0.0001);
// gui.add(material, "roughness").min(0).max(1).step(0.0001);
// gui.add(material, "aoMapIntensity").min(0).max(10).step(0.0001);
// gui.add(material, "displacementScale").min(0).max(10).step(0.0001);

const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 16, 16), material);

sphere.position.x = -1.5;

sphere.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);

const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1, 100, 100), material);
plane.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);
const torus = new THREE.Mesh(new THREE.TorusBufferGeometry(0.3, 0.2, 16, 32), material);
torus.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);
torus.position.x = 1.5;

scene.add(sphere, plane, torus);

const ambientLight = new THREE.AmbientLight(0xfffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xfffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.z = 0.1 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
