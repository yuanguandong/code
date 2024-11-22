import * as THREE from "three";

export class Demo {
  constructor(render, scene) {
    this.render = render;
    this.scene = scene;
    this.init();
  }

  init() {
    const geometry = new THREE.TorusGeometry(0.5, 0.2, 80, 80);
    const material = new THREE.ShaderMaterial();
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh)
  }
}
