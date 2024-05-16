import * as THREE from "three";
import { RenderPass, EffectComposer, OutlinePass, LineGeometry, LineMaterial, Line2 } from "three/addons";
import { Render } from '../render'
import { Action } from "./action";
import { Events } from "./event";
import { Post } from "./post";
import { Cube } from "./element/cube";
import { Elements } from "./element";
import { ElementData } from "../interface";
import { Cylinder } from "./element/cylinder";

export class Controller {

  elements?: Elements

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
      const scene = me.engine.sceneController.scene;
      me.elements = new Elements(me.engine);
      scene.add(me.elements)
    });
  }

  initData(data: ElementData[]) {
    const me = this;
    const scene = me.engine.sceneController.scene;


    console.log('data', data)
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const { type, options } = item
      switch (type) {
        case 'cube':
          this.elements?.addElement(new Cube(this.engine, options))
          break;
        case 'cylinder':
          this.elements?.addElement(new Cylinder(this.engine, options))
          break;
      }
    }


    

  }



}
