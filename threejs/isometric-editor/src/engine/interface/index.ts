import { Cube } from "../controller/element/cube";
import { Cylinder } from "../controller/element/cylinder";

export type Element3D = Cube | Cylinder

export interface ElementData {
  type: string,
  options: {
    x: number,
    z: number,
  }
}