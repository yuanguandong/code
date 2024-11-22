import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
export class Demo {
  sunParams = {
    elevation: 2,
    azimuth: -180,
  };

  constructor(render, scene) {
    this.render = render;
    this.scene = scene;
    this.init();
    this.initEnv();
    this.initCube();
    this.initGUI();
  }

  init() {
    this.sun = new THREE.Vector3(20, 2, 0);
    this.water = new Water(new THREE.PlaneGeometry(10000, 10000), {
      waterNormals: new THREE.TextureLoader().load(
        "textures/water/waternormals.jpg",
        function (texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }
      ),
      sunDirection: this.sun,
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale:3.7
    });
    this.water.rotation.x = -Math.PI / 2;
    this.scene.add(this.water);
    this.render.registerUpdate("water", () => {
      this.water.material.uniforms["time"].value += 1 / 60;
    });

    this.sky = new Sky();
    this.sky.scale.setScalar(10000);
    this.scene.add(this.sky);

    this.sky.material.uniforms["sunPosition"].value.copy(this.sun);
  }

  initEnv() {
    const renderTarget = this.render.pmremGenerator.fromScene(this.sky);
    this.scene.environment = renderTarget.texture;
  }

  initCube() {
    this.cube = new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30), new THREE.MeshStandardMaterial());
    this.scene.add(this.cube);
    this.render.registerUpdate("cube", () => {
      const time = window.performance.now() * 0.001;
      this.cube.position.y = Math.sin(time) * 20 + 5;
      this.cube.rotation.x = time * 0.5;
      this.cube.rotation.z = time * 0.2;
    });
  }

  initGUI() {
    this.gui = new GUI();
    const folderSun = this.gui.addFolder("太阳");
    folderSun.add(this.sunParams, "elevation", 0, 90, 0.05).onChange(this.updateSun.bind(this));
    folderSun.add(this.sunParams, "azimuth", -180, 180, 0.1).onChange(this.updateSun.bind(this));
    
    this.waterParams = this.water.material.uniforms;
    const folderWater = this.gui.addFolder("水");
    folderWater.add(this.waterParams.distortionScale, "value", 0, 200, 0.1).name('distortionScale')
    folderWater.add(this.waterParams.size, "value", 0.1, 20, 0.1).name('size')

    this.skyParams = this.sky.material.uniforms;
    const folderSky = this.gui.addFolder("天空");
    folderSky.add(this.skyParams.turbidity, "value", 0, 200, 0.1).name('浑浊度') 
    folderSky.add(this.skyParams.rayleigh, "value", 0.1, 20, 0.1).name('瑞丽值') 
    folderSky.add(this.skyParams.mieCoefficient, "value", 0.1, 1, 0.1).name('米氏系数') 
    folderSky.add(this.skyParams.mieDirectionalG, "value", 0.1, 1, 0.1).name('米氏方向') 
  }

  updateSun() {
    const theta = THREE.MathUtils.degToRad(90 - this.sunParams.elevation);
    const phi = THREE.MathUtils.degToRad(this.sunParams.azimuth);
    this.sun.setFromSphericalCoords(1, theta, phi);
    this.sky.material.uniforms["sunPosition"].value.copy(this.sun);
  }
}
