import * as THREE from "three";
import { Render } from "./render";

export class PickController {

  mouse = new THREE.Vector2();

  raycaster = new THREE.Raycaster();

  constructor(private engine: Render) {

  }

  intersectPlane(event: MouseEvent) {
    const camera = this.engine.sceneController.camera
    const scene = this.engine.sceneController.scene
    const intersectionPoint = new THREE.Vector3();

    if (!camera) { return intersectionPoint }
    var rect = this.engine.renderer.domElement.getBoundingClientRect();

    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, camera);

    if (!this.engine.sceneController.plane) {
      return intersectionPoint
    }
    // 找到射线和平面的交点
    this.raycaster.ray.intersectPlane(this.engine.sceneController.plane, intersectionPoint);

    return intersectionPoint
    // const intersects = this.raycaster.intersectObject(this.engine.sceneController.plane, true);
    // return intersects[0].point;
  }

  pick(event: MouseEvent, target?: THREE.Object3D) {
    const camera = this.engine.sceneController.camera
    const scene = this.engine.sceneController.scene
    if (!camera) { return [] }
    var rect = this.engine.renderer.domElement.getBoundingClientRect();

    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, camera);
    let pickTarget: THREE.Object3D | THREE.Object3D[] | undefined = target
    let allIntersects = []
    if (!pickTarget) {
      pickTarget = scene.children
      allIntersects = this.raycaster.intersectObjects(pickTarget, true);
    } else {
      allIntersects = this.raycaster.intersectObject(pickTarget, true);
    }
    return allIntersects || [];
  }
}
