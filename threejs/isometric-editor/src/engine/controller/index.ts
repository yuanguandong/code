import { ElementData } from "../interface";
import { Render } from '../render';
import { Action } from "./action";
import { Elements } from "./element";
import { Area, AreaOptions } from "./element/area";
import { Cube, CubeOptions } from "./element/cube";
import { Cylinder, CylinderOptions } from "./element/cylinder";
import { Text, TextOptions } from "./element/text";
import { Events } from "./event";
import { Post } from "./post";
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
          this.elements?.addElement(new Cube(this.engine, options as CubeOptions))
          break;
        case 'cylinder':
          this.elements?.addElement(new Cylinder(this.engine, options as CylinderOptions))
          break;
        case 'text':
          this.elements?.addElement(new Text(this.engine, options as TextOptions))
          break;
        case 'area':
          this.elements?.addElement(new Area(this.engine, options as AreaOptions))
          break;
      }
    }


  }



}
