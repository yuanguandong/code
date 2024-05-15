import * as THREE from "three";
import { RenderPass, EffectComposer, OutlinePass } from "three/addons";
import { Render } from "@/engine/render";
import { Base3DObject } from "../base";
import { Utils } from "@/engine/utils";

export interface CubeOptions {
  x: number,
  z: number
}

export class Cube extends Base3DObject {

  object3D?: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial[], THREE.Object3DEventMap>;

  constructor(engine: Render, private options:CubeOptions) {
    super(engine);
    this.init();
  }

  init() {
    const length = 1;
    const width = 1;
    const height = 0.5;
    const geometry = new THREE.BoxGeometry(length, height, width);

    var material = [
      new THREE.MeshBasicMaterial({ color: 0xECECED }), // 前面
      new THREE.MeshBasicMaterial({ color: 0xD2D2D4 }), // 后面
      new THREE.MeshBasicMaterial({ color: 0xffffff }), // 顶面
      new THREE.MeshBasicMaterial({ color: 0xECECED }), // 底面
      new THREE.MeshBasicMaterial({ color: 0xD2D2D4 }), // 左面
      new THREE.MeshBasicMaterial({ color: 0xB8B8BB }), // 右面
    ];

    // var material = new THREE.MeshBasicMaterial({
    //   color: 0xedebe9,
    //   map: new THREE.CanvasTexture(this.getTextCanvas({text:'T2',width:200,height:200})),
    // }); // 白色材质
    const textTexture = new THREE.CanvasTexture(
      Utils.getTextCanvas({ text: "T2", width: 1000, height: 1000 })
    );

    material[2] = new THREE.MeshBasicMaterial({ map: textTexture }); // 将纹理应用到前面

    const cube = new THREE.Mesh(geometry, material);
    cube.userData.pickable = true;
    geometry.translate(0, height / 2, 0);
    cube.position.x = this.options.x;
    cube.position.z = this.options.z;

    var edges = new THREE.EdgesGeometry(geometry);
    var lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 20 });

    var lines = new THREE.LineSegments(edges, lineMaterial);
    lines.userData.pickable = false;
    cube.add(lines);

    this.object3D = cube;
  }

}