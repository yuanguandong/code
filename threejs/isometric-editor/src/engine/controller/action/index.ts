import { Render } from "@/engine/render";
import { Cube, CubeOptions } from "../element/cube";

export class Action {

  constructor(private engine: Render) {


  }

  // 添加立方体
  addCube(data: CubeOptions) {
    const me = this;
    const cube = new Cube(this.engine, {
      ...data
    });
    this.engine.sceneController.addElement(cube);
    return
  }


}