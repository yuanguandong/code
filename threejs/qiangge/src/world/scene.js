import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { Person } from "./person";
import { Car } from "./car";
import {Building} from './building'
export class Scene {
  scene;

  camera;

  controls;

  personController;

  constructor(render) {
    this.render = render;
    this.personController = new Person(render);
    this.carController = new Car(render);
    this.buildingController = new Building(render);
    this.initScene();
    this.initCamera();
    this.initAxesHelper();
    // this.initGridHelper();
    this.initGround();
    this.initLight();
    this.initControls();
  }

  initScene() {
    const scene = new THREE.Scene();
    this.scene = scene;
    scene.background = new THREE.Color(0xcdf0f4);

    scene.fog = new THREE.Fog(0xe0e0e0, 10, 1000);
  }

  initAxesHelper() {
    const axesHelper = new THREE.AxesHelper(2);
    this.scene.add(axesHelper);
  }

  initGround() {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(2000, 2000),
      new THREE.MeshPhongMaterial({
        color: 0x999999,
      })
    );
    plane.rotation.x = -Math.PI / 2;
    this.scene.add(plane);
  }

  initGridHelper(){
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
    camera.position.set(30, 30, 10);
    camera.lookAt(new THREE.Vector3(0, 2, 0));
  }

  initLight() {
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x0000ff, 1);
    hemiLight.position.set(0, 20, 0);
    this.scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(300, 300, 300);
    this.scene.add(dirLight);

    // 创建环境光
    const ambientLight = new THREE.AmbientLight(0xffffff,1); // 光的颜色，例如 0x404040
    this.scene.add(ambientLight);
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.render.renderer.domElement);
    this.controls.maxPolarAngle = Math.PI / 2.5;
  }
}
