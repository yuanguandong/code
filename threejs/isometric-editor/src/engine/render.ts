import * as THREE from "three";
import { Scene } from "./scene";

export class Render {
  renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true });

  sceneController;

  clock = new THREE.Clock();

  // 动画帧更新函数注册表
  updates: Record<string, Function> = {};

  domContainer?: HTMLDivElement;

  domInited = false;
  width: number = 500;
  height: number = 500;

  constructor() {
    this.initRenderer();
    this.sceneController = new Scene(this);
    this.animate();
    this.initEvent();
  }

  // 初始化渲染器
  initRenderer() {
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.outputEncoding = THREE.sRGBEncoding;
  }

  initDom(dom: HTMLDivElement) {
    if (this.domInited) {
      return
    }
    this.domContainer = dom;
    const width = dom.clientWidth;
    const height = dom.clientHeight;
    this.width = width;
    this.height = height;

    this.renderer.setSize(width, height);
    dom.appendChild(this.renderer.domElement);
    this.domInited = true
  }

  // 初始化事件
  initEvent() {
    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  // 窗口改变大小
  onWindowResize() {
    const me = this;

    const rect = this.domContainer?.getBoundingClientRect();
    const domContainerWidth = rect?.width || this.width;
    const domContainerHeight = rect?.height || this.height;
    this.width = domContainerWidth;
    this.height = domContainerHeight;

    const width = window.innerWidth
    const height = window.innerHeight

    const camera = this.sceneController.camera;
    if (camera) {
      const aspect = width / height;
      // camera.aspect = aspect;
      var d = 7;
      camera.left = -d * aspect;
      camera.right = d * aspect;
      camera.top = d;
      camera.bottom = -d;

      camera.updateProjectionMatrix();
    }

    // camera.rotation.y = -Math.PI / 4;
    // camera.rotation.x = Math.atan(-1 / Math.sqrt(2));
    this.renderer.setSize(domContainerWidth, domContainerHeight);
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
    const camera = this.sceneController.camera;
    if (!camera) {
      return
    }
    this.renderer.render(this.sceneController.scene, camera);
  }

  registerUpdate(key: string, fn: Function) {
    this.updates[key] = fn;
  }
}
