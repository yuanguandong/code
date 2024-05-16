import * as THREE from "three";
import { OrbitControls } from "three/addons";
import { Controller } from "./controller";
import { PickController } from "./pick";
import { Render } from "./render";
import { Element3D } from "./interface";

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
    this.initCamera();
    // this.initAxesHelper();
    this.initGridHelper();
    this.initGround();
    this.initPicker();
    // this.initLight();
    this.initControls();
    // this.initGrid();
  }

  initPicker() {
    this.pickController = new PickController(this.engine)
  }

  initGrid() {
    const geometry = new THREE.PlaneGeometry(100, 100, 10, 10);
    const material = new THREE.MeshBasicMaterial({
      wireframe: true,
      opacity: 0.5,
      transparent: true,
    });
    const grid = new THREE.Mesh(geometry, material);
    grid.rotation.order = "YXZ";
    grid.rotation.y = -Math.PI / 2;
    grid.rotation.x = -Math.PI / 2;
    this.scene.add(grid);
  }


  initAxesHelper() {
    const axesHelper = new THREE.AxesHelper(2);
    this.scene.add(axesHelper);
  }

  initGround() {
    // const plane = new THREE.Mesh(
    //   new THREE.PlaneGeometry(16.2, 16.2),
    //   // new THREE.MeshPhongMaterial({
    //   //   color: 0x999999,
    //   // })
    //   new THREE.MeshBasicMaterial({
    //     color: 0xffffff,
    //   })
    // );
    // plane.rotation.x = -Math.PI / 2;
    // plane.position.y = -0.1;
    // plane.userData.isGround = true;
    // var planeFace = new THREE.Plane(new THREE.Vector3(0, 1, 0));
    // // this.ground = planeFace;
    // this.plane = planeFace
    // this.scene.add(plane);

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
    // var size = 10;
    // var divisions = 10;
    // var colorCenterLine = 0x000000;
    // var colorGrid = 0x000000;
    // var gridHelper = new THREE.GridHelper(size, divisions, colorCenterLine, colorGrid);

    // 将材质从虚线改为实线
    // gridHelper.material = new THREE.LineBasicMaterial({ color: colorGrid });
    // gridHelper.children.forEach((child) => {
    //   if (child instanceof THREE.LineSegments) {
    //     child.material = new THREE.LineBasicMaterial({ color: colorGrid });
    //   }
    // });

    // gridHelper.computeLineDistances();
    // gridHelper.material = new THREE.LineDashedMaterial({
    //   dashSize: 0,
    //   gapSize: 0,
    //   vertexColors: true,
    // });

    // const grid = new THREE.GridHelper(10, 10, 0, 0);

    const gridHelper = new THREE.GridHelper(16, 16, 0x000000, 0x000000);
    // gridHelper.position.y = -150;
    // gridHelper.position.x = -150;
    this.scene.add(gridHelper);

    // this.scene.add(gridHelper);
  }

  initCamera() {
    const me = this;

    const rect = this.engine.domContainer?.getBoundingClientRect();
    const domContainerWidth = rect?.width
    const domContainerHeight = rect?.height

    const width = domContainerWidth || this.engine.width
    const height = domContainerHeight || this.engine.width

    const aspect = width / height;
    const d = 7;
    const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 10000);
    this.camera = camera;
    camera.position.set(10, 10, 10);

    camera.updateProjectionMatrix();

    // camera.rotation.order = "YXZ";
    // camera.rotation.y = -Math.PI / 4;
    // camera.rotation.x = Math.atan(-1 / Math.sqrt(2));
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
    const camera = this.camera;
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
