import * as THREE from "three";
import { OrbitControls } from "three/addons";
import { Controller } from "./controller";
import { PickController } from "./pick";
import { Render } from "./render";

export class Scene {
  scene: THREE.Scene = new THREE.Scene();

  camera?: THREE.OrthographicCamera;

  controls?: OrbitControls;

  controller: Controller;

  pickController?: PickController;

  plane?: THREE.Plane;

  constructor(private engine: Render) {
    // this.scene.background = new THREE.Color(0x000000);
    this.controller = new Controller(engine);
    // this.initCamera();
    this.initGridHelper();
    this.initGround();
    this.initPicker();
    this.initControls();
    // this.initAxesHelper();
    // this.initLight();
  }

  initPicker() {
    this.pickController = new PickController(this.engine)
  }

  initAxesHelper() {
    const axesHelper = new THREE.AxesHelper(2);
    this.scene.add(axesHelper);
  }

  initGround() {
    var width = 16;
    var height = 16;
    var thickness = 0.1; // 厚度

    var material = [
      new THREE.MeshBasicMaterial({ color: 0xECECED }), // 前面
      new THREE.MeshBasicMaterial({ color: 0xD2D2D4 }), // 后面
      new THREE.MeshBasicMaterial({ color: 0xECECED }), // 底面
      new THREE.MeshBasicMaterial({ color: 0xD2D2D4 }), // 左面
      new THREE.MeshBasicMaterial({ color: 0xffffff }), // 顶面
      new THREE.MeshBasicMaterial({ color: 0xB8B8BB }), // 右面
    ];

    const plane = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, thickness),
      // new THREE.MeshPhongMaterial({
      //   color: 0x999999,
      // })
      material
    );
    plane.name = "plane"
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.06
    plane.userData.isGround = true;
    var planeFace = new THREE.Plane(new THREE.Vector3(0, 1, 0));
    // this.ground = planeFace;
    this.plane = planeFace;
    this.scene.add(plane);
  }

  initGridHelper() {
    const gridHelper = new THREE.GridHelper(16, 16, 0x54626F, 0x54626F);
    this.scene.add(gridHelper);
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
    const camera = this.engine.cameraController.camera;
    if (!camera) {
      return;
    }
    this.controls = new OrbitControls(camera, this.engine.renderer.domElement);
    this.controls.enableRotate = false;
    this.engine.registerUpdate("updateControls", () => {
      this.controls?.update();
    });
    // this.controls.maxPolarAngle = Math.PI / 2.5;
  }



}
