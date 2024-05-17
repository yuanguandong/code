import { Area, AreaOptions } from "../controller/element/area";
import { Cube, CubeOptions } from "../controller/element/cube";
import { Cylinder, CylinderOptions } from "../controller/element/cylinder";
import { Icon, IconOptions } from "../controller/element/icon";
import { Text, TextOptions } from "../controller/element/text";


export interface BaseOptions {
  x?: number,
  z?: number,
}

export type Element3D = Cube | Cylinder | Text | Area | Icon

export interface ElementData {
  type: string,
  options: CubeOptions | CylinderOptions | TextOptions | AreaOptions | IconOptions
}