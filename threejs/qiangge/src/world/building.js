import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export class Building {
  resourceUrl = "models/building.gltf";

  constructor(render) {
    this.render = render;
    this.initCar();
  }

  initCar() {
    const me = this;
    const loader = new GLTFLoader();
    loader.load(this.resourceUrl, function (gltf) {
      gltf.scene.scale.set(0.9, 0.9, 0.9);
      gltf.scene.position.set(25, 0.5, -50);

      const model = gltf.scene;

      me.model = model;
      me.render.sceneController.scene.add(model);
    });
  }
}
