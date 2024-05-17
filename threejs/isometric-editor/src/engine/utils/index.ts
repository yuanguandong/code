import { Mesh, Object3D, Object3DEventMap } from "three";
import { TOP_COLOR } from "../constant";
import { Element3D } from "../interface";

export interface MeshElement extends Mesh {
  isElement: boolean;
  parent: MeshElement;
}

export class Utils {
  // 生成文字canvas
  static getTextCanvas({ text, height, width }: { text: string, height: number, width: number }) {
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = TOP_COLOR;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = 'destination-out';

      // 填充一个矩形背景
      ctx.fillStyle = '#333'; // 画布背景颜色

      ctx.font = height / 2 + 'px " bold';
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, width / 2, height / 2);
    }
    return canvas;
  }

  static lookUpElement(_mesh: Object3D<Object3DEventMap>): Element3D | undefined {
    const mesh = _mesh as MeshElement
    if (!mesh) { return }
    if (mesh?.['isElement']) {
      return mesh as unknown as Element3D
    }
    return Utils.lookUpElement(mesh?.parent)
  }

}


