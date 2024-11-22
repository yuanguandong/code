import * as THREE from "three";
import { SVGRenderer, SVGObject } from 'three/addons/renderers/SVGRenderer.js';
function resetMeshRotation(mesh, rotation) {
  mesh.rotation.x = rotation.x;
  mesh.rotation.y = rotation.y;
  mesh.rotation.z = rotation.z;
  // 创建一个四维矩阵
  const matrix = new THREE.Matrix4();
  mesh.updateMatrix();
  matrix.copy(mesh.matrix);
  mesh.geometry.applyMatrix4(matrix);
  mesh.rotation.set(0, 0, 0);
}

export class Demo {
  constructor(render, scene) {
    this.render = render;
    this.scene = scene;
    this.init();
  }

  init() {
    const me = this;
    // const length = 1;
    // const width = 1;
    // const geometry = new THREE.PlaneGeometry(length, width);

    // const material = new THREE.MeshBasicMaterial({
    //   transparent: true,
    //   side: THREE.DoubleSide,
    //   opacity: 1,
    //   color: 0xffffff,
    // });

    // // 创建对象
    // const image = new THREE.Mesh(geometry, material);
    // resetMeshRotation(image, { x: -Math.PI / 2, y: 0, z: 0 });
    // this.scene.add(image);

    // image.rotation.x = -Math.PI / 2;
    // image.rotation.z = -Math.PI / 2;

    const fileLoader = new THREE.FileLoader();
    fileLoader.load("svg/tiger.svg", function (svg) {
      const node = document.createElementNS("http://www.w3.org/2000/svg", "g");
      const parser = new DOMParser();
      const doc = parser.parseFromString(svg, "image/svg+xml");

      node.appendChild(doc.documentElement);

      const object = new SVGObject(node);
      // object.position.x = 0;
      console.log('SVGObject',object)
      // console.log(me.render.svgrenderer)
      me.scene.add(object);
    });
  }
}
