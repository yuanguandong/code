import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { Person } from "./person";
import { Car } from "./car";

export class Scene {
  scene;

  camera;

  controls;

  personController;

  constructor(render) {
    this.render = render;
    this.personController = new Person(render);
    this.carController = new Car(render);
    this.initScene();
    this.initCamera();
    this.initAxesHelper();
    this.initGround();
    this.initLight();
    this.initControls();
  }

  initScene() {
    const scene = new THREE.Scene();
    this.scene = scene;
    scene.background = new THREE.Color(0xcdf0f4);

    // scene.fog = new THREE.Fog(0xe0e0e0, 20, 100);
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

    const grid = new THREE.GridHelper(2000, 400, 0, 0);
    this.scene.add(grid);
  }

  initCamera() {
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.25,
      100
    );
    this.camera = camera;
    camera.position.set(-5, 3, 10);
    camera.lookAt(new THREE.Vector3(0, 2, 0));
  }

  initLight() {
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 20, 0);
    this.scene.add(hemiLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(0, 30, 10);
    this.scene.add(dirLight);
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.render.renderer.domElement);
  }
}
