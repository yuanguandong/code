import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

export class Demo {
  PARTICLE = 10;

  pointer = new THREE.Vector2();

  raycaster = new THREE.Raycaster();

  constructor(render, scene) { 
    this.render = render;
    this.scene = scene;
    this.init();
    this.initActive();
  }

  init() {
    // 创建几何体并合并定点
    const boxGeometry = new THREE.BoxGeometry(200, 200, 200, 16, 16, 16);
    boxGeometry.deleteAttribute("uv");
    boxGeometry.deleteAttribute("normal");
    const mergeBoxGeometry = BufferGeometryUtils.mergeVertices(boxGeometry);
    const position = mergeBoxGeometry.getAttribute("position");

    const geometry = new THREE.BufferGeometry();

    // 生成每个定点的颜色和大小
    const colors = [];
    const sizes = [];
    const color = new THREE.Color();

    for (let i = 0; i < position.count; i++) {
      color.setHSL(0.01 + 0.1 * (i / position.count), 1.0, 0.5);
      color.toArray(colors, i * 3);
      sizes[i] = this.PARTICLE;
    }

    // 给几何体设置颜色和大小属性
    geometry.setAttribute("position", position);
    geometry.setAttribute("customColor", new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));

    // 在shader里进行颜色和大小的设置
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0xffffff) },
        pointTexture: { value: new THREE.TextureLoader().load("textures/sprites/disc.png") },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 customColor;
        varying vec3 vColor;
        void main(){
          vColor = customColor;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform sampler2D pointTexture;
        varying vec3 vColor;
        void main(){
          gl_FragColor = vec4(color * vColor,1.0);
          gl_FragColor = gl_FragColor * texture2D(pointTexture,gl_PointCoord);
          if(gl_FragColor.a < 0.9) discard;
        }
      `,
    });
    this.particles = new THREE.Points(geometry, this.material);
    this.scene.add(this.particles);

    this.render.registerUpdate("rotation", () => {
      this.particles.rotation.x += 0.0005;
      this.particles.rotation.y += 0.0005;
    });
  }

  onPointerMove(event) {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.render.registerUpdate("onPointerMove", () => {
      this.raycaster.setFromCamera(this.pointer, this.render.sceneController.camera);
      this.intersets = this.raycaster.intersectObject(this.particles);
      const attributes = this.particles.geometry.attributes;
      if (this.intersets.length > 0) {
        if (this.activeIndex != this.intersets[0].index) {
          this.activeIndex = this.intersets[0].index;
          attributes.size.array[this.activeIndex] = this.PARTICLE * 1.5;
        }
      } else {
        attributes.size.array[this.activeIndex] = this.PARTICLE;
        this.activeIndex = null;
      }
      attributes.size.needsUpdate = true;
    });
  }

  initActive() {
    document.addEventListener("pointermove", this.onPointerMove.bind(this));
  }
}
