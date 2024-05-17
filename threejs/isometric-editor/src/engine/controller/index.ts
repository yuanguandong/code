import { Render } from '../render';
import { Action } from "./action";
import { Data } from "./data";
import { Elements } from "./element";
import { Events } from "./event";
import { Post } from "./post";
export class Controller {
  // 元素管理器
  elements?: Elements

  // 动作管理器
  action?: Action;

  // 事件管理器
  event?: Events;

  // 数据管理器
  data?: Data;

  // 后处理管理器
  post?: Post;

  constructor(private engine: Render) {
    this.action = new Action(engine);
    this.event = new Events(engine);
    this.post = new Post(engine);
    this.data = new Data(engine);

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

  



}
