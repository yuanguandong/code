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
    // 开启渲染器阴影
    this.render.renderer.shadowMap.enabled = true;
    this.render.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 使用PCFSoft阴影算法
    this.initScene((scene) => {
      this.DemoController = new Demo(render, scene);
    });
    this.initCamera();
    // this.initAxesHelper();
    // this.initGridHelper();
    // this.initGround();
    // this.initLight();
    this.initControls();
  }

  initScene(cb) {
    const scene = new THREE.Scene();
    this.scene = scene;
    // scene.background = new THREE.Color(0x000000);
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
    const aspectRatio = window.innerWidth / window.innerHeight;
    const cameraSize = 200; // 将相机视口大小从400减小到200
    const camera = new THREE.OrthographicCamera(
      -cameraSize * aspectRatio,
      cameraSize * aspectRatio,
      cameraSize,
      -cameraSize,
      0.1,
      100000
    );
    this.camera = camera;
    // 减小相机位置坐标，使其更靠近模型
    camera.position.set(300, 300, 300);
    camera.lookAt(0, 0, 0);
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
    // 调整相机距离限制
    // this.controls.maxDistance = 600;
    // this.controls.minDistance = 50;
    // this.controls.enableDamping = true;
    // this.controls.dampingFactor = 0.05;
  }
}
