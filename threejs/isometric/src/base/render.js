import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { Scene } from "./scene";

export class Render {
  renderer;

  sceneController;

  clock = new THREE.Clock();

  // 动画帧更新函数注册表
  updates = {};

  constructor() {
    this.initRenderer();
    this.sceneController = new Scene(this);
    this.animate();
    this.initEvent();
  }

  // 初始化渲染器
  initRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    // renderer.physicallyCorrectLights = true;
    this.renderer = renderer;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement);
    return renderer;
  }

  // 初始化事件
  initEvent() {
    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  // 窗口改变大小
  onWindowResize() {
    const camera = this.sceneController.camera;
    const aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;
    var d = 7;

    camera.left = -d * aspect;
    camera.right = d * aspect;
    camera.top = d;
    camera.bottom = -d;

    camera.updateProjectionMatrix();
    // camera.rotation.y = -Math.PI / 4;
    // camera.rotation.x = Math.atan(-1 / Math.sqrt(2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // 动画帧
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.render();
    const delta = this.clock.getDelta();
    const fns = Object.values(this.updates);
    for (let i = 0; i < fns.length; i++) {
      const fn = fns[i];
      fn(this);
    }
  }

  // 重新渲染
  render() {
    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime() * 10;
    this.renderer.render(this.sceneController.scene, this.sceneController.camera);
  }

  registerUpdate(key, fn) {
    this.updates[key] = fn;
  }
}
