import { Render } from "@/engine/render";
import * as THREE from "three";

export class Base3DObject extends THREE.Group {



  constructor(public engine: Render) {
    super();
  }



}