import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";

export class Demo {
  color = 0xff0000;
  models = [];

  isMouseDown = false;
  mousePos = { x: 0, y: 0 };
  dragDelta = new THREE.Vector3();

  constructor(render, scene) {
    this.render = render;
    this.scene = scene;

    this.init();
  }

  init() {
    const me = this;
    queueMicrotask(function () {
      const camera = me.render.sceneController.camera;
      me.addCube();
      me.initPostRender();
      me.initEvents();
    });
  }

  // 鼠标按下
  pointdown(event) {
    const me = this;
    const scene = me.scene;
    const camera = me.render.sceneController.camera;
    const plane = me.render.sceneController.plane;
    const outlinePass = this.outlinePass;
    const composer = this.composer;
    event.preventDefault();

    const intersects = me.render.sceneController.pickController.pick(event, plane);

    const allIntersects = me.render.sceneController.pickController.pick(event);
    const allObjects = allIntersects.filter((item) => item.object.userData.pickable);

    if (allObjects.length > 0) {
      const object = allObjects[0].object;
      var intersectPoint = intersects[0]?.point;
      if (intersectPoint) {
        me.dragDelta.subVectors(intersectPoint, object.position);
      }

      me.dragObject = object;
      // 更新当前选中的物体
      if (!object.userData.hasOutline) {
        object.userData.hasOutline = true;
        outlinePass.selectedObjects = scene.children.filter((item) => item.userData.hasOutline);
        composer.addPass(outlinePass);
      } else {
        // object.userData.hasOutline = false;
        // outlinePass.selectedObjects = scene.children.filter((item) => item.userData.hasOutline);
        // composer.removePass(outlinePass);
        // me.dragObject = null;
      }
    } else {
      outlinePass.selectedObjects = [];
      composer.removePass(outlinePass);
      scene.children.forEach(function (obj) {
        obj.userData.hasOutline = false;
      });
      me.dragObject = null;
    }
  }

  // 鼠标移动
  pointerMove(event) {
    const me = this;
    const plane = me.render.sceneController.plane;
    if (me.dragObject) {
      const intersects = me.render.sceneController.pickController.pick(event, plane);
      if (intersects.length > 0) {
        var intersectPoint = intersects[0].point;
        me.dragObject.position.x = intersectPoint.x - me.dragDelta.x;
        me.dragObject.position.z = intersectPoint.z - me.dragDelta.z;
        me.dragObject.position.y = 0;
      }
    }
  }

  // 鼠标松开
  pointerup() {
    const me = this;
    me.dragObject = null;
  }

  // 绑定事件
  initEvents() {
    document.addEventListener("pointerdown", this.pointdown.bind(this), false);
    document.addEventListener("pointermove", this.pointerMove.bind(this), false);
    document.addEventListener("pointerup", this.pointerup.bind(this), false);
  }

  // 后处理效果
  initPostRender() {
    const me = this;
    const scene = me.scene;
    const camera = me.render.sceneController.camera;
    // 创建渲染通道
    const composer = new EffectComposer(this.render.renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    // 创建轮廓效果
    const outlinePass = new OutlinePass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
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

    this.render.registerUpdate("composer", (render) => {
      var scaleFactor = camera.zoom; // 根据相机距离调整
      outlinePass.edgeStrength = scaleFactor;
      // outlinePass.edgeThickness = scaleFactor / 100; // 边缘厚度
      composer.render();
    });
  }

  // 添加立方体
  addCube() {
    const me = this;
    const scene = me.scene;
    const camera = me.render.sceneController.camera;
    const length = 1;
    const width = 1;
    const height = 0.5;
    const geometry = new THREE.BoxGeometry(length, height, width);

    var material = [
      new THREE.MeshBasicMaterial({ color: 0xECECED }), // 前面
      new THREE.MeshBasicMaterial({ color: 0xD2D2D4 }), // 后面
      new THREE.MeshBasicMaterial({ color: 0xffffff }), // 顶面
      new THREE.MeshBasicMaterial({ color: 0xECECED }), // 底面
      new THREE.MeshBasicMaterial({ color: 0xD2D2D4 }), // 左面
      new THREE.MeshBasicMaterial({ color: 0xB8B8BB }), // 右面
    ];

    // var material = new THREE.MeshBasicMaterial({
    //   color: 0xedebe9,
    //   map: new THREE.CanvasTexture(this.getTextCanvas({text:'T2',width:200,height:200})),
    // }); // 白色材质
    const textTexture = new THREE.CanvasTexture(
      this.getTextCanvas({ text: "T2", width: 200, height: 200 })
    );

    material[2] = new THREE.MeshBasicMaterial({ map: textTexture }); // 将纹理应用到前面

    const cube = new THREE.Mesh(geometry, material);
    cube.userData.pickable = true;
    geometry.translate(0, height / 2, 0);
    cube.position.x = 0.5;
    cube.position.z = 0.5;

    var edges = new THREE.EdgesGeometry(geometry);
    var lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 20 });

    var lines = new THREE.LineSegments(edges, lineMaterial);
    lines.userData.pickable = false;
    cube.add(lines);
    this.scene.add(cube);
  }

  // 生成文字
  getTextCanvas({ text, height, width }) {
    var width = 256,
      height = 256;
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.font = 100 + 'px " bold';
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, width / 2, height / 2);
    return canvas;
  }
}
