/*
 * @Descripttion:
 * @MainAuthor:
 */
import * as THREE from "three";

function createShape(width, height, radius) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;

  // 移动到左上角的起点，预留圆角空间
  shape.moveTo(x + radius, y);

  // 右上角
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);

  // 右下角
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);

  // 左下角
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);

  // 左上角
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);

  return shape;
}

export class Demo {
  constructor(render, scene) {
    this.render = render;
    this.scene = scene;
    this.init();
  }

  init() {
    const me = this;
    // 创建圆角矩形形状

    // 创建 ExtrudeGeometry，支持 bevel、extrude 和 border
    function createExtrudedShape(bevelThickness, bevelSize, extrudeDepth, borderWidth) {
      const shape = createShape(1, 1, 0.3);

      // 设置拉伸几何体的参数
      const extrudeSettings = {
        steps: 1, // 拉伸细分步数
        depth: extrudeDepth, // 拉伸深度
        bevelEnabled: true, // 开启斜角
        bevelThickness: bevelThickness, // 斜角厚度
        bevelSize: bevelSize, // 斜角尺寸
        bevelSegments: 20, // 斜角的细分数量
      };

      // 创建几何体
      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

      // 创建材质
      const material = new THREE.MeshNormalMaterial({ wireframe: false });

      return new THREE.Mesh(geometry, material);
    }

    // 创建一个带有 bevel、extrude 和 border 的物体
    const bevelThickness = 0.3; // 斜角厚度
    const bevelSize = 0.3; // 斜角尺寸
    const extrudeDepth = 1; // 拉伸深度
    const borderWidth = 0; // 边框宽度

    const shapeMesh = createExtrudedShape(bevelThickness, bevelSize, extrudeDepth, borderWidth);
    me.scene.add(shapeMesh);
  }
}
