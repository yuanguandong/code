import { Element3D } from "@/engine/interface";
import { Render } from "@/engine/render";
import * as THREE from "three";
import { RenderPass, EffectComposer, OutlinePass } from "three/addons";

export class Elements extends THREE.Group {

  elementMap: Map<string, Element3D> = new Map();

  constructor(private engine: Render) {
    super();
    this.init();
  }

  init() {

  }

  addElement(element3D: Element3D) {
    this.elementMap.set(element3D.key, element3D);
    this.add(element3D);
  }

  // 移除元素
  removeElement(elementKey: string) {
    const target = this.elementMap.get(elementKey);
    console.log('target',target)
    if (target) {
      this.remove(target);
      target?.destroy();
    }
  }

  // 获取数据
  getData(){
    return Array.from(this.elementMap.values()).map(element => element.getData());
  }

}