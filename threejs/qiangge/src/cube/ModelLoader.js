import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

export class ModelLoader {
  constructor(scene) {
    this.scene = scene;
    this.gltfLoader = this.initGLTFLoader();
  }

  initGLTFLoader() {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    return gltfLoader;
  }

  loadEnvironmentMap() {
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load("texture/room/1.hdr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.environment = texture;
    });
  }

  loadModels() {
    this.loadBakedModel();
    this.loadSudoHeadModel();
  }

  loadBakedModel() {
    this.gltfLoader.load(
      "baked.glb",
      (gltf) => {
        const model = gltf.scene;
        this.processModel(model);
        this.positionModel(model, { x: 100, y: 0, z: 100 }, 200);
        console.log("Baked model loaded successfully");
      },
      this.onProgress,
      this.onError
    );
  }

  loadSudoHeadModel() {
    this.gltfLoader.load(
      "sudoHead.glb",
      (gltf) => {
        const model = gltf.scene;
        this.processModel(model, {
          transparent: false,
          metalness: 0.2,
          roughness: 2
        });
        this.positionModel(model, { x: 0, y: 15, z: 130 }, 50);
        console.log("SudoHead model loaded successfully");
      },
      this.onProgress,
      this.onError
    );
  }

  processModel(model, materialOptions = {
    transparent: true,
    opacity: 0.7,
    metalness: 0.1,
    roughness: 2
  }) {
    model.traverse((child) => {
      if (child.isMesh) {
        // 应用材质选项
        Object.assign(child.material, {
          side: THREE.DoubleSide,
          needsUpdate: true,
          color: new THREE.Color(0xffffff),
          ...materialOptions
        });

        // 设置阴影
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  positionModel(model, position, targetSize) {
    // 计算包围盒并居中模型
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    // 将模型移动到场景中心
    model.position.sub(center);

    // 根据模型大小自动调整缩放
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = targetSize / maxDim;
    model.scale.setScalar(scale);

    // 设置最终位置
    model.position.set(position.x, position.y, position.z);

    this.scene.add(model);
  }

  onProgress(progress) {
    console.log("Loading progress:", (progress.loaded / progress.total) * 100 + "%");
  }

  onError(error) {
    console.error("Error loading model:", error);
  }
} 