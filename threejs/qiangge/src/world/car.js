import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export class Car {
  resourceUrl = "car/scene.gltf";

  constructor(render) {
    this.render = render;
    this.initCar();
  }

  initCar() {
    const me = this;
    const loader = new GLTFLoader();
    loader.load(this.resourceUrl, function (gltf) {
      gltf.scene.scale.set(3.5, 3.5, 3.5);
      gltf.scene.position.set(10, 2.6, 0);

      const model = gltf.scene;

      me.model = model;
      me.render.sceneController.scene.add(model);
    });
  }
}
