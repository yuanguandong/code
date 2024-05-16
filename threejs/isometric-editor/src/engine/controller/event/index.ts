import { Element3D } from "@/engine/interface";
import { Render } from "@/engine/render";
import { Utils } from "@/engine/utils";
import * as THREE from "three";
import { RenderPass, EffectComposer, OutlinePass } from "three/addons";

export class Events {

  dragDelta = new THREE.Vector3();

  dragObject?: Element3D;

  activeObject?: Element3D;

  constructor(private engine: Render) {

    this.initEvents();
  }

  // 鼠标按下
  pointdown(event: MouseEvent) {
    const me = this;
    // const scene = me.engine.sceneController.scene;
    // const camera = me.engine.sceneController.camera;

    // const outlinePass = me.engine.sceneController.controller.post?.outlinePass;
    // const composer = me.engine.sceneController.controller.post?.composer;
    event.preventDefault();
    if (!me.engine.sceneController?.pickController) { return }

    const allIntersects = me.engine.sceneController?.pickController?.pick(event);
    const allObjects = allIntersects?.filter((item) => item.object.userData.pickable);
    if (allObjects.length > 0) {
      const object = allObjects[0].object;
      const target = Utils.lookUpElement(object)

      var intersectPoint = me.engine.sceneController.pickController.intersectPlane(event);

      if (intersectPoint) {
        me.dragDelta.subVectors(intersectPoint, target.position);
      }

      me.dragObject = target;
      me.activeObject?.disActive();
      me.activeObject = target;
      me.activeObject?.active();
      // 更新当前选中的物体
      // if (!object.userData.hasOutline) {
      //   object.userData.hasOutline = true;
      //   if (outlinePass && composer) {
      //     outlinePass.selectedObjects = [object]
      //     composer.addPass(outlinePass);
      //   }
      // } else {
        // object.userData.hasOutline = false;
        // outlinePass.selectedObjects = scene.children.filter((item) => item.userData.hasOutline);
        // composer.removePass(outlinePass);
        // me.dragObject = null;
      // }
    } else {
      me.activeObject?.disActive();
      // if (outlinePass && composer) {
      //   outlinePass.selectedObjects = [];
      //   composer.removePass(outlinePass);
      // }

      // const elements = me.engine.sceneController.controller.elements
      // elements?.traverse(function (node) {
      //   if (node instanceof THREE.Mesh) {
      //     node.userData.hasOutline = false;
      //   }
      // });

      me.dragObject = undefined;
      me.activeObject = undefined;
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
      me.dragObject.position.y = me.dragObject?.groundGap || 0;
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