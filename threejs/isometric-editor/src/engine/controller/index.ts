import * as THREE from "three";
import { RenderPass, EffectComposer, OutlinePass } from "three/addons";
import { Render } from '../render'
import { Action } from "./action";
import { Events } from "./event";
import { Post } from "./post";
import { Cube } from "./element/cube";

export class Controller {
  color = 0xff0000;

  models = [];

  isMouseDown = false;

  mousePos = { x: 0, y: 0 };

  dragDelta = new THREE.Vector3();

  dragObject?: THREE.Object3D<THREE.Object3DEventMap>;

  outlinePass?: OutlinePass;

  composer?: EffectComposer;

  action?: Action;

  event?: Events;

  post?: Post;

  constructor(private engine: Render) {
    this.action = new Action(engine);
    this.event = new Events(engine);
    this.post = new Post(engine);
    this.init();
  }

  init() {
    const me = this;
    queueMicrotask(function () {
      const camera = me.engine.sceneController.camera;
      // me.action?.addCube();
    });
  }




}
