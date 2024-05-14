import * as THREE from "three";

export class PickController {
  constructor(render) {
    this.render = render;
    this.init();
  }

  init() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
  }

  pick(event,target) {
    const camera = this.render.sceneController.camera
    const scene = this.render.sceneController.scene

    
    
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, camera);
    let pickTarget = target
    let allIntersects = []
    if(!pickTarget){
      pickTarget = scene.children
      allIntersects = this.raycaster.intersectObjects(pickTarget, true);
    }else{
      allIntersects = this.raycaster.intersectObject(pickTarget, true);
    }
    
    // console.log('pickTarget',pickTarget,allIntersects)
    return allIntersects;
  }
}
