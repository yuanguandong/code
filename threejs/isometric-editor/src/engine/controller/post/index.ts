import { Render } from "@/engine/render";
import * as THREE from "three";
import { RenderPass, EffectComposer, OutlinePass } from "three/addons";

export class Post {

  outlinePass?: OutlinePass;

  composer?: EffectComposer;

  
  constructor(private engine: Render) {

    this.init();
  }

  init() {

  }

  // 后处理效果
  initPostRender() {
    const me = this;
    const scene = me.engine.sceneController.scene;
    const camera = me.engine.sceneController.camera;
    if (!camera) { return }
    // 创建渲染通道
    const composer = new EffectComposer(this.engine.renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    // 创建轮廓效果
    const outlinePass = new OutlinePass(
      new THREE.Vector2(me.engine.width, me.engine.height),
      scene,
      camera
    );
    outlinePass.visibleEdgeColor.set(0x000000); // 可见边缘颜色
    outlinePass.hiddenEdgeColor.set(0x000000); // 隐藏边缘颜色
    outlinePass.edgeStrength = 3; // 边缘强度
    outlinePass.edgeThickness = 0.001; // 边缘厚度
    outlinePass.edgeGlow = 0.0;
    outlinePass.pulsePeriod = 0; // 不脉动

    outlinePass.overlayMaterial.blending = THREE.CustomBlending;
    composer.addPass(outlinePass);

    this.composer = composer;
    this.outlinePass = outlinePass;

    this.engine.registerUpdate("composer", () => {
      var scaleFactor = camera.zoom; // 根据相机距离调整
      outlinePass.edgeStrength = scaleFactor;
      // outlinePass.edgeThickness = scaleFactor / 100; // 边缘厚度
      composer.render();
    });
  }

}