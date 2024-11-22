import * as THREE from "three";

export class Box {
  constructor(render, scene) {
    this.render = render;
    this.scene = scene;
    this.init();
  }

  init() {
    const textures = this.getTexture("textures/sun_temple_stripe.jpeg", 6);
    const materials = []
    for(let i=0;i<textures.length;i++){
      materials.push(
        new THREE.MeshBasicMaterial({
          map:textures[i]
        })
      )
    }
    const skyBox = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), materials);
    skyBox.geometry.scale(1,1,-1)
    this.scene.add(skyBox);
  }

  getTexture(file, tilesNum) {
    const textures = [];
    for (let i = 0; i < tilesNum; i++) {
      textures[i] = new THREE.Texture();
    }
    new THREE.ImageLoader().load(file, function (image) {
      const width = image.height;
      let canvas, context;
      for (let i = 0; i < tilesNum; i++) {
        canvas = document.createElement("canvas");
        context = canvas.getContext("2d");
        canvas.height = width;
        canvas.width = width;
        context.drawImage(image, width * i, 0, width, width, 0, 0, width, width);
        textures[i].image = canvas;
        textures[i].needsUpdate = true
      }
    });
    return textures
  }
}
