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
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      toneMapping: THREE.ACESFilmicToneMapping,
      toneMappingExposure: 1.0,
      alpha: true,
    });
    this.renderer = renderer;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;

    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    // 设置透明背景
    // renderer.setClearColor(0x000000, 0);
    document.body.appendChild(renderer.domElement);
    return renderer;
  }

  // 初始化事件
  initEvent() {
    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  // 窗口改变大小
  onWindowResize() {
    this.sceneController.camera.aspect = window.innerWidth / window.innerHeight;
    this.sceneController.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // 动画帧
  animate() {
    const delta = this.clock.getDelta();
    const fns = Object.values(this.updates);
    for (let i = 0; i < fns.length; i++) {
      const fn = fns[i];
      fn(delta);
    }
    requestAnimationFrame(this.animate.bind(this));
    this.render();
  }

  // 重新渲染
  render() {
    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime() * 10;
    if (this.sceneController.demo && this.sceneController.demo.composer) {
      this.sceneController.demo.composer.render();
    } else {
      this.renderer.render(this.sceneController.scene, this.sceneController.camera);
    }
  }

  registerUpdate(key, fn) {
    this.updates[key] = fn;
  }
}
