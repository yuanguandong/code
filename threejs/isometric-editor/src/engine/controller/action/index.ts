import { Render } from "@/engine/render";
import { Cube, CubeOptions } from "../element/cube";
import { Element3D } from "@/engine/interface";
import { message } from "antd";
import { Cylinder } from "../element/cylinder";

export class Action {

  constructor(private engine: Render) {


  }

  // 添加立方体
  addCube(data: CubeOptions) {
    const element = new Cube(this.engine, {
      ...data
    });
    this.engine.sceneController.controller.elements?.addElement(element);
  }

  // 添加立方体
  addCylinder(data: CubeOptions) {
    const element = new Cylinder(this.engine, {
      ...data
    });
    this.engine.sceneController.controller.elements?.addElement(element);
  }

  save(){
    const me = this;
    const data = this.engine.sceneController.controller.elements?.getData();
    console.log('data',data)
    localStorage.setItem('elements',JSON.stringify(data))
    message.success("保存成功");
  }


}