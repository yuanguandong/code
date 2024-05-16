import { Area, AreaOptions } from "../controller/element/area";
import { Cube, CubeOptions } from "../controller/element/cube";
import { Cylinder, CylinderOptions } from "../controller/element/cylinder";
import { Text, TextOptions } from "../controller/element/text";

export type Element3D = Cube | Cylinder | Text | Area

export interface ElementData {
  type: string,
  options: CubeOptions | CylinderOptions | TextOptions | AreaOptions
}