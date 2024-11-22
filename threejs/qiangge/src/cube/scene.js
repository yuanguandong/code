/*
 * @Descripttion: 
 * @MainAuthor: 
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Demo } from "./demo";
export class Scene {
  scene;

  camera;

  controls;

  personController;

  constructor(render) {
    this.render = render;
    this.initScene((scene) => {
      this.DemoController = new Demo(render, scene);
    });
    this.initCamera();
    this.initAxesHelper();
    // this.initGridHelper();
    // this.initGround();
    // this.initLight();
    this.initControls();
  }

  initScene(cb) {
    const scene = new THREE.Scene();
    this.scene = scene;
    scene.background = new THREE.Color(0x000000);
    // scene.fog = new THREE.Fog(0xe0e0e0, 10, 1000);
    if (cb) {
      cb(scene);
    }
  }

  initAxesHelper() {
    const axesHelper = new THREE.AxesHelper(2);
    this.scene.add(axesHelper);
  }

  initGround() {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(2000, 2000),
      // new THREE.MeshPhongMaterial({
      //   color: 0x999999,
      // })
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
      })
    );
    plane.rotation.x = -Math.PI / 2;
    this.scene.add(plane);
  }

  initGridHelper() {
    const grid = new THREE.GridHelper(2000, 400, 0, 0);
    this.scene.add(grid);
  }

  initCamera() {
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.25,
      10000
    );
    this.camera = camera;
    camera.position.set(5, 5, 5);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  }

  initLight() {
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x0000ff, 1);
    hemiLight.position.set(0, 20, 0);
    this.scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(300, 300, 300);
    this.scene.add(dirLight);

    // 创建环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // 光的颜色，例如 0x404040
    this.scene.add(ambientLight);
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.render.renderer.domElement);
    // this.controls.maxPolarAngle = Math.PI / 2.5;
  }
}
