import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import { Vector3 } from "three";
import MeshReflectorMaterial from "./MeshReflectorMaterial";
import { Pane } from "tweakpane";

export class Demo {
  constructor(render, scene) {
    this.render = render;
    this.scene = scene;
    setTimeout(() => {
      this.init();
    }, 200);
  }

  init() {
    // alert(1)
    let cameraControls;

    let sphereGroup, smallSphere;

    let groundMirror, verticalMirror;
    let geometry, material;

    const renderer = this.render.renderer;
    const camera = this.render.sceneController.camera;
    const scene = this.scene;
    console.log("renderer", renderer);
    console.log("camera", camera);
    console.log("scene", scene);
    // 创建几何体
    geometry = new THREE.PlaneGeometry(4000, 6000);
    // 创建反射材质
    const reflectorMaterial = new MeshReflectorMaterial(renderer, camera, scene, null, {
      // mixBlur: 2,
      // mixStrength: 1.5,
      // resolution: 2048, // 材質圖的解析度
      // blur: [0, 0], // 高斯模糊的材質解析度為何
      // minDepthThreshold: 0.7, // 從多遠的地方開始淡出
      // maxDepthThreshold: 2, // 到多遠的地方會淡出到沒畫面
      // depthScale: 2,
      // depthToBlurRatioBias: 2,
      // mirror: 0,
      // distortion: 2,
      // mixContrast: 2,
      // reflectorOffset: 0, // 鏡面跟物理中間是否要留一段距離才開始反射
      // bufferSamples: 8,

      color: 0xff0000,
      transparent:true,
      opacity:0.6,
      mixBlur: 10,
      mixStrength: 1.7,
      resolution: 256,
      blur: [0, 0],
      minDepthThreshold: 0.9,
      maxDepthThreshold: 1,
      depthScale: 0,
      depthToBlurRatioBias: 0.25,
      mirror: 1,
      distortion: 1,
      mixContrast: 1,
      distortionMap: null,
      reflectorOffset: 0,
      bufferSamples: 8,
      planeNormal: new Vector3(0, 0, 1)
    });

    // 创建反射平面
    const reflectorMesh = new THREE.Mesh(geometry, reflectorMaterial);
    reflectorMaterial.parent = reflectorMesh;
    reflectorMesh.position.y = 0.5;
    reflectorMesh.rotateX(-Math.PI / 2);
    this.scene.add(reflectorMesh);
    this.render.registerUpdate('updateGround',()=>{
      reflectorMaterial.update();
    })

    sphereGroup = new THREE.Object3D();
    this.scene.add(sphereGroup);

    geometry = new THREE.CylinderGeometry(0.1, 15 * Math.cos((Math.PI / 180) * 30), 0.1, 24, 1);
    material = new THREE.MeshPhongMaterial({ color: 0xffffff, emissive: 0x8d8d8d });
    const sphereCap = new THREE.Mesh(geometry, material);
    sphereCap.position.y = -15 * Math.sin((Math.PI / 180) * 30) - 0.05;
    sphereCap.rotateX(-Math.PI);

    geometry = new THREE.SphereGeometry(
      15,
      24,
      24,
      Math.PI / 2,
      Math.PI * 2,
      0,
      (Math.PI / 180) * 120
    );
    const halfSphere = new THREE.Mesh(geometry, material);
    halfSphere.add(sphereCap);
    halfSphere.rotateX((-Math.PI / 180) * 135);
    halfSphere.rotateZ((-Math.PI / 180) * 20);
    halfSphere.position.y = 7.5 + 15 * Math.sin((Math.PI / 180) * 30);

    sphereGroup.add(halfSphere);

    // lights
    const mainLight = new THREE.PointLight(0xe7e7e7, 2.5, 250, 0);
    mainLight.position.y = 60;
    this.scene.add(mainLight);

    const greenLight = new THREE.PointLight(0x00ff00, 0.5, 1000, 0);
    greenLight.position.set(550, 50, 0);
    this.scene.add(greenLight);

    const redLight = new THREE.PointLight(0xff0000, 0.5, 1000, 0);
    redLight.position.set(-550, 50, 0);
    this.scene.add(redLight);

    const blueLight = new THREE.PointLight(0xbbbbfe, 0.5, 1000, 0);
    blueLight.position.set(0, 50, 550);
    this.scene.add(blueLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    this.scene.add(ambientLight);

    // 性能优化建议：
    // 1. 移动端参考配置
    const mobileConfig = {
      resolution: 1024,
      blur: [0.5, 1],
      bufferSamples: 4,
      mixBlur: 0.2,
      depthScale: 1,
    };

    // 2. 高性能设备配置
    const highEndConfig = {
      resolution: 2048,
      blur: [1, 2],
      bufferSamples: 8,
      mixBlur: 0.1,
      depthScale: 2,
    };

    // 3. 极致效果配置（注意性能消耗）
    const ultraConfig = {
      resolution: 4096,
      blur: [2, 4],
      bufferSamples: 16,
      mixBlur: 0.05,
      depthScale: 3,
    };
  }
}
