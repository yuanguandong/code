import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
/**
 * 
 *  path:存放模型父路径
 *  modelName:模型名
 *  setCenter:是否居中
 *  scale:模型的缩放比设定
 *  position:模型的位置
 *  rotation:模型的局部旋转
 */
export function loadModuleByDRACOLoader(
  path,
  modelName,
  setCenter,
  scale,
  position,
  rotation
) {
  let scaleVec3, positionVec3;
  if (typeof scale == "number") {
    scaleVec3 = new THREE.Vector3(scale, scale, scale);
  } else {
    scaleVec3 = new THREE.Vector3(scale.x, scale.y, scale.z);
  }
  if (typeof position == "number") {
    positionVec3 = new THREE.Vector3(position, position, position);
  } else {
    positionVec3 = new THREE.Vector3(position.x, position.y, position.z);
  }
  let dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(path); // 设置public下的解码路径，注意最后面的/
  dracoLoader.setDecoderConfig({ type: "js" }); //使用兼容性强的draco_decoder.js解码器
  dracoLoader.preload();

  const loader = new GLTFLoader().setPath(path);
  loader.setDRACOLoader(dracoLoader);
  return new Promise((res, rj) => {
    loader.load(modelName, (gltf) => {
      if (setCenter) {
        gltf.scene.traverse(function (child) {
          if (setCenter && child.isMesh) {
            child.geometry.center();
          }
        });
      }

      gltf.scene.scale.copy(scaleVec3);
      gltf.scene.position.copy(positionVec3);
      if (rotation) {
        gltf.scene.rotation.copy(rotation);
      }
      scene.add(gltf.scene);
      res(gltf.scene);
      gltf = null;
    });
  });
}
