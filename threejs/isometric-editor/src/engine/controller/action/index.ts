import { Render } from "@/engine/render";
import { Cube, CubeOptions } from "../element/cube";
import { Element3D } from "@/engine/interface";
import { message } from "antd";
import { Cylinder, CylinderOptions } from "../element/cylinder";
import { Text, TextOptions } from "../element/text";
import { Area, AreaOptions } from "../element/area";
import { Icon, IconOptions } from "../element/icon";
export class Action {

  constructor(private engine: Render) {

  }



  // 添加立方体
  addCube(data: Omit<CubeOptions, 'x' | 'z'>) {
    const centerPoint = this.engine.sceneController.pickController?.getViewportCenterPoint();
    if (!centerPoint) { return }
    const { x, z } = centerPoint
    const element = new Cube(this.engine, {
      x,
      z,
      ...data
    });
    this.engine.sceneController.controller.elements?.addElement(element);
  }

  // 添加棱柱体
  addCylinder(data: Omit<CylinderOptions, 'x' | 'z'>) {
    const centerPoint = this.engine.sceneController.pickController?.getViewportCenterPoint();
    if (!centerPoint) { return }
    const { x, z } = centerPoint
    const element = new Cylinder(this.engine, {
      x,
      z,
      ...data
    });
    this.engine.sceneController.controller.elements?.addElement(element);
  }

  // 添加文字
  addText(data: Omit<TextOptions, 'x' | 'z'>) {
    const centerPoint = this.engine.sceneController.pickController?.getViewportCenterPoint();
    if (!centerPoint) { return }
    const { x, z } = centerPoint
    const element = new Text(this.engine, {
      x,
      z,
      ...data
    });
    this.engine.sceneController.controller.elements?.addElement(element);
  }

  // 添加文字
  addArea(data: Omit<AreaOptions, 'x' | 'z'>) {
    const centerPoint = this.engine.sceneController.pickController?.getViewportCenterPoint();
    if (!centerPoint) { return }
    const { x, z } = centerPoint
    const element = new Area(this.engine, {
      x,
      z,
      ...data
    });
    this.engine.sceneController.controller.elements?.addElement(element);
  }

  // 添加图标
  addIcon(data: Omit<IconOptions, 'x' | 'z'>) {
    const centerPoint = this.engine.sceneController.pickController?.getViewportCenterPoint();
    if (!centerPoint) { return }
    const { x, z } = centerPoint
    const element = new Icon(this.engine, {
      x,
      z,
      ...data
    });
    this.engine.sceneController.controller.elements?.addElement(element);
  }


  save() {
    const me = this;
    const data = this.engine.sceneController.controller.elements?.getData();
    console.log('data', data)
    localStorage.setItem('elements', JSON.stringify(data))
    message.success("保存成功");
  }


}