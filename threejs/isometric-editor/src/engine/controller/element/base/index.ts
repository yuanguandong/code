import { Render } from "@/engine/render";
import { nanoid } from "nanoid";
import * as THREE from "three";

export interface IBase3DObject extends THREE.Group {
  key: string;
  isElement: boolean;
}

export class Base3DObject extends THREE.Group {
  isElement: boolean = true;
  key: string;

  constructor(public engine: Render) {
    super();
    this.key = nanoid()

  }

  destroy(){
    this.parent?.remove(this)
  }

}