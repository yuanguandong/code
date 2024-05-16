import { Mesh } from "three";
import { TOP_COLOR } from "../constant";

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

  static lookUpElement(mesh: any) {
    if (!mesh?.parent) { return }
    if (mesh?.parent?.['isElement']) {
      return mesh.parent
    }
    Utils.lookUpElement(mesh.parent)
  }

}


