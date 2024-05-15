import { Render } from "@/engine/render";
import * as THREE from "three";
import { RenderPass, EffectComposer, OutlinePass } from "three/addons";

export class Events {

  dragDelta = new THREE.Vector3();
  dragObject?: THREE.Object3D<THREE.Object3DEventMap>;

  constructor(private engine: Render) {

    this.initEvents();
  }

  // 鼠标按下
  pointdown(event: MouseEvent) {
    const me = this;
    const scene = me.engine.sceneController.scene;
    const camera = me.engine.sceneController.camera;

    const outlinePass = me.engine.sceneController.controller.post?.outlinePass;
    const composer = me.engine.sceneController.controller.post?.composer;
    event.preventDefault();
    if (!me.engine.sceneController?.pickController) { return }

    const allIntersects = me.engine.sceneController?.pickController?.pick(event);
    const allObjects = allIntersects?.filter((item) => item.object.userData.pickable);

    if (allObjects.length > 0) {
      const object = allObjects[0].object;
      var intersectPoint = me.engine.sceneController.pickController.intersectPlane(event);

      if (intersectPoint) {
        me.dragDelta.subVectors(intersectPoint, object.position);
      }

      me.dragObject = object;
      // 更新当前选中的物体
      if (!object.userData.hasOutline) {
        object.userData.hasOutline = true;
        if (outlinePass && composer) {
          outlinePass.selectedObjects = scene.children.filter((item) => item.userData.hasOutline);
          composer.addPass(outlinePass);
        }
      } else {
        // object.userData.hasOutline = false;
        // outlinePass.selectedObjects = scene.children.filter((item) => item.userData.hasOutline);
        // composer.removePass(outlinePass);
        // me.dragObject = null;
      }
    } else {
      if (outlinePass && composer) {
        outlinePass.selectedObjects = [];
        composer.removePass(outlinePass);
      }
      scene.children.forEach(function (obj) {
        obj.userData.hasOutline = false;
      });
      me.dragObject = undefined;
    }
  }

  // 鼠标移动
  pointerMove(event: MouseEvent) {
    const me = this;

    if (me.dragObject && me.engine.sceneController.pickController) {
      var intersectPoint = me.engine.sceneController.pickController.intersectPlane(event);
      if (!intersectPoint) { return }
      me.dragObject.position.x = intersectPoint.x - me.dragDelta.x;
      me.dragObject.position.z = intersectPoint.z - me.dragDelta.z;
      me.dragObject.position.y = 0;
    }
  }

  // 鼠标松开
  pointerup() {
    const me = this;
    me.dragObject = undefined;
  }

  // 绑定事件
  initEvents() {
    const me = this
    const domElement = me.engine.renderer.domElement;
    domElement.addEventListener("pointerdown", this.pointdown.bind(this), false);
    domElement.addEventListener("pointermove", this.pointerMove.bind(this), false);
    domElement.addEventListener("pointerup", this.pointerup.bind(this), false);
  }

}