import * as THREE from "three";
import { LightController } from "./LightController";
import { PostProcessingController } from "./PostProcessingController";
import { ModelLoader } from "./ModelLoader";

export class BaseScene {
  constructor(render, scene) {
    this.render = render;
    this.renderer = render.renderer;
    this.scene = scene;
    this.composer = null;

    setTimeout(() => {
      this.camera = render.sceneController.camera;
      this.initControllers();
      this.initGround();
      
      // 覆盖原有的渲染方法
      const originalRender = this.render.render.bind(this.render);
      this.render.render = () => {
        if (this.composer) {
          this.composer.render();
        } else {
          originalRender();
        }
      };
    }, 200);
  }

  initControllers() {
    // 初始化灯光控制器
    this.lightController = new LightController(this.scene);
    
    // 初始化后处理控制器
    this.postProcessingController = new PostProcessingController(
      this.renderer,
      this.scene,
      this.camera
    );
    this.composer = this.postProcessingController.composer;

    // 初始化模型加载器并加载环境贴图
    this.modelLoader = new ModelLoader(this.scene);
    // this.modelLoader.loadEnvironmentMap();
    this.modelLoader.loadModels();
  }

  initGround() {
    // 创建地面
    const floorGeometry = new THREE.BoxGeometry(300, 10, 300);
    const floorMaterial = new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 0.5,
      color: 0xf0f0f0,
      metalness: 0.2,
      roughness: 0.8,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -5;
    floor.position.x = 100;
    floor.position.z = 100;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  dispose() {
    if (this.lightController) {
      this.lightController.dispose();
    }
    if (this.postProcessingController) {
      this.postProcessingController.dispose();
    }
  }
} 