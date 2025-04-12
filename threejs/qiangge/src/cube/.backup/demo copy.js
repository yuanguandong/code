/*
 * @Descripttion: 等距房间场景
 * @MainAuthor:
 */
import * as THREE from "three";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { Pane } from 'tweakpane';
import MeshReflectorMaterial from '../../../utils/MeshReflectorMaterial.js'

export class Demo {
  constructor(render, scene) {
    this.render = render;
    this.scene = scene;
    this.composer = null;
    this.lights = {}; // 存储灯光对象
    this.lightHelpers = {}; // 存储灯光辅助对象
    this.pane = null; // tweakpane 实例
    this.STORAGE_KEY = 'scene_light_params'; // localStorage 的 key
    this.helpersVisible = true; // 辅助显示器的显示状态
    this.mainAndWarmLightsVisible = true; // 主光和氛围光的显示状态
    setTimeout(() => {
      this.initGround();
    },200)
    // this.loadEnvironmentMap();
    this.loadModel();
    this.initLight();
    this.initTweakPane();
  }


  loadEnvironmentMap() {
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('texture/room/1.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.environment = texture;
    });
  }

  loadModel() {
    // 创建 DRACOLoader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load(
      'baked.glb',
      (gltf) => {
        const model = gltf.scene;
        
        model.traverse((child) => {
          if (child.isMesh) {
            child.material.transparent = true;
            child.material.opacity = 0.7;
            child.material.side = THREE.DoubleSide;
            child.material.needsUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.color.set(0xffffff); // 更柔和的浅灰色
            // 添加一点金属感和粗糙度，使材质更真实
            child.material.metalness = 0.1;
            child.material.roughness = 2;
          }
        });

        // 计算包围盒并居中模型
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // 将模型移动到场景中心
        model.position.sub(center);

        // 根据模型大小自动调整缩放
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 200 / maxDim; // 假设我们想要模型最大尺寸为200单位
        model.scale.setScalar(scale);

        this.scene.add(model);
        model.position.set(100, 0, 100);
        
        console.log('Model loaded successfully');
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Error loading model:', error);
      }
    );

    gltfLoader.load(
      'sudoHead.glb',
      (gltf) => {
        const model = gltf.scene;
        
        model.traverse((child) => {
          if (child.isMesh) {
            // child.material.transparent = true;
            // child.material.opacity = 0.7;
            child.material.side = THREE.DoubleSide;
            child.material.needsUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.color.set(0xffffff); // 更柔和的浅灰色
            // 添加一点金属感和粗糙度，使材质更真实
            child.material.metalness = 0.2;
            child.material.roughness = 2;
          }
        });

        // 计算包围盒并居中模型
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // 将模型移动到场景中心
        model.position.sub(center);

        // 根据模型大小自动调整缩放
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 50 / maxDim; // 假设我们想要模型最大尺寸为200单位
        model.scale.setScalar(scale);

        this.scene.add(model);
        model.position.set(0, 15, 130);
      
        console.log('Model loaded successfully');
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Error loading model:', error);
      }
    );
  }

  initGround() {
    const scene = this.scene;
    // 创建地面
    const floorGeometry = new THREE.BoxGeometry(300, 10, 300); // 宽度1000，厚度10，深度1000
    const floorMaterial = new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 0.5,
      color: 0xf0f0f0,  // 浅灰色
      metalness: 0.2,    // 轻微金属感
      roughness: 0.8,    // 较粗糙
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -5; // 将地面向下移动半个厚度，使其上表面在y=0平面
    floor.position.x = 100;
    floor.position.z = 100;
    floor.receiveShadow = true; // 接收阴影
    this.scene.add(floor);
  }

  initLight() {
    // ----------------------------------------
    // 主光源 - 白色点光源
    // ----------------------------------------
    const mainLight = new THREE.PointLight(0xff7f00, 2, 1000, 5);
    mainLight.position.set(200, 150, 200); // 调整到右上角
    this.scene.add(mainLight);
    
    // 添加主光源的辅助显示器
    const mainLightHelper = new THREE.PointLightHelper(mainLight, 10);
    this.scene.add(mainLightHelper);
    
    // ----------------------------------------
    // 顶光 - 聚光灯
    // ----------------------------------------
    const warmLight = new THREE.SpotLight(0xff7f00, 0.6);
    warmLight.position.set(-150, 100, -150); // 调整到左后方
    warmLight.angle = Math.PI / 4; // 45度角
    warmLight.penumbra = 0.2; // 聚光锥的半影衰减百分比
    warmLight.decay = 2;
    warmLight.distance = 800;
    warmLight.castShadow = true;
    this.scene.add(warmLight);
    
    // 添加顶光的辅助显示器
    const warmLightHelper = new THREE.SpotLightHelper(warmLight);
    this.scene.add(warmLightHelper);
    
    // ----------------------------------------
    // 第二个橘黄色氛围光源，用于补光
    // ----------------------------------------
    const warmLight2 = new THREE.PointLight(0xff0000, 2, 100, 1);
    warmLight2.position.set(100, 50, 200); // 放置在左前方
    this.scene.add(warmLight2);
    
    // 添加第二个暖光源的辅助显示器
    const warmLight2Helper = new THREE.PointLightHelper(warmLight2, 10);
    this.scene.add(warmLight2Helper);

    // ----------------------------------------
    // 聚光灯
    // ----------------------------------------
    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(0, 100, 0);
    spotLight.angle = Math.PI / 6; // 30度角
    spotLight.penumbra = 0.1; // 聚光锥的半影衰减百分比
    spotLight.decay = 1;
    spotLight.distance = 500;
    spotLight.castShadow = true;
    this.scene.add(spotLight);

    // 添加聚光灯辅助显示器
    const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    this.scene.add(spotLightHelper);

    // ----------------------------------------
    // 第二个聚光灯
    // ----------------------------------------
    const spotLight2 = new THREE.SpotLight(0x00ffff, 1); // 使用青色
    spotLight2.position.set(200, 150, 0);
    spotLight2.angle = Math.PI / 4; // 45度角
    spotLight2.penumbra = 0.2;
    spotLight2.decay = 1.5;
    spotLight2.distance = 600;
    spotLight2.castShadow = true;
    this.scene.add(spotLight2);

    // 添加第二个聚光灯辅助显示器
    const spotLight2Helper = new THREE.SpotLightHelper(spotLight2);
    this.scene.add(spotLight2Helper);

    // ----------------------------------------
    // 环境光
    // ----------------------------------------
    const ambientLight = new THREE.AmbientLight(0xFFD7B5, 0.2);
    this.scene.add(ambientLight);

    // ----------------------------------------
    // 保存所有灯光和辅助对象引用
    // ----------------------------------------
    this.lights = {
      mainLight,
      warmLight,
      warmLight2,
      spotLight,
      spotLight2,
      ambientLight
    };

    this.lightHelpers = {
      mainLightHelper,
      warmLightHelper,
      warmLight2Helper,
      spotLightHelper,
      spotLight2Helper
    };
  }

  /**
   * 更新灯光位置
   * @param {string} lightName - 灯光名称 ('mainLight', 'warmLight', 'warmLight2')
   * @param {Object} position - 新位置 {x, y, z}
   */
  updateLightPosition(lightName, position) {
    const light = this.lights[lightName];
    if (light) {
      light.position.set(position.x, position.y, position.z);
      
      // 更新对应的辅助显示器
      const helper = this.lightHelpers[lightName + 'Helper'];
      if (helper) {
        helper.update();
      }
    }
  }

  /**
   * 获取灯光当前位置
   * @param {string} lightName - 灯光名称
   * @returns {Object|null} - 返回位置对象 {x, y, z} 或 null
   */
  getLightPosition(lightName) {
    const light = this.lights[lightName];
    if (light) {
      return {
        x: light.position.x,
        y: light.position.y,
        z: light.position.z
      };
    }
    return null;
  }

  initTweakPane() {
    // 创建容器样式
    const style = document.createElement('style');
    style.textContent = `
      .tp-scroll {
        position: absolute;
        right: 8px;
        top: 8px;
        max-height: 98vh;
        overflow-y: auto;
        overflow-x: hidden;
      }
      .tp-scroll::-webkit-scrollbar {
        width: 4px;
      }
      .tp-scroll::-webkit-scrollbar-track {
        background: rgba(0,0,0,0.1);
        border-radius: 2px;
      }
      .tp-scroll::-webkit-scrollbar-thumb {
        background: rgba(0,0,0,0.2);
        border-radius: 2px;
      }
      .tp-scroll::-webkit-scrollbar-thumb:hover {
        background: rgba(0,0,0,0.3);
      }
    `;
    document.head.appendChild(style);

    // 创建容器
    const container = document.createElement('div');
    container.className = 'tp-scroll';
    document.body.appendChild(container);

    // 创建 Tweakpane 实例
    this.pane = new Pane({
      title: '灯光控制面板',
      container: container
    });

    // 从 localStorage 获取保存的参数
    const savedParams = this.loadParams();

    // 添加辅助显示器开关
    const helperParams = {
      showHelpers: savedParams?.helperSettings?.showHelpers ?? true
    };

    this.pane.addBinding(helperParams, 'showHelpers', {
      label: '显示辅助器'
    }).on('change', ({value}) => {
      this.toggleHelpers(value);
      this.saveParams();
    });

    // 添加主光和氛围光的显示控制
    const lightVisibilityParams = {
      showMainAndWarmLights: savedParams?.lightVisibilitySettings?.showMainAndWarmLights ?? true
    };

    this.pane.addBinding(lightVisibilityParams, 'showMainAndWarmLights', {
      label: '显示主光和氛围光'
    }).on('change', ({value}) => {
      this.toggleMainAndWarmLights(value);
      this.saveParams();
    });

    // 如果有保存的显示状态，应用它们
    if (savedParams?.helperSettings) {
      this.toggleHelpers(helperParams.showHelpers);
    }
    if (savedParams?.lightVisibilitySettings) {
      this.toggleMainAndWarmLights(lightVisibilityParams.showMainAndWarmLights);
    }

    // 为每个点光源创建控制面板
    const lightConfigs = [
      { name: 'mainLight', title: '主光源', color: '#ff7f00' },
      { name: 'warmLight', title: '顶光', color: '#ff7f00', isSpotLight: true },
      { name: 'warmLight2', title: '氛围光2', color: '#ff0000' },
      { name: 'spotLight', title: '太阳光', color: '#ffffff' },
      { name: 'spotLight2', title: '太阳光2', color: '#00ffff' }
    ];

    lightConfigs.forEach(config => {
      const light = this.lights[config.name];
      if (!light) return;

      const folder = this.pane.addFolder({
        title: config.title,
      });

      // 位置控制
      const positionFolder = folder.addFolder({
        title: '位置',
      });

      // 创建 PARAMS 对象，优先使用保存的参数
      const PARAMS = {
        x: light.position.x,
        y: light.position.y,
        z: light.position.z,
        intensity: light.intensity,
        distance: light.distance,
        decay: light.decay,
        color: config.color,
        ...(config.isSpotLight && {
          angle: (light.angle * 180) / Math.PI,
          penumbra: light.penumbra || 0
        })
      };

      // 如果有保存的参数，使用保存的参数
      if (savedParams?.[config.name]) {
        Object.assign(PARAMS, savedParams[config.name]);
        light.position.set(PARAMS.x, PARAMS.y, PARAMS.z);
        light.intensity = PARAMS.intensity;
        light.distance = PARAMS.distance;
        light.decay = PARAMS.decay;
        light.color.set(PARAMS.color);
        if (config.isSpotLight) {
          light.angle = (PARAMS.angle * Math.PI) / 180;
          light.penumbra = PARAMS.penumbra;
        }
      }

      // 位置控制
      positionFolder.addBinding(PARAMS, 'x', {
        min: -500,
        max: 500,
        step: 1,
        label: 'X'
      }).on('change', ({value}) => {
        light.position.x = value;
        this.updateHelper(config.name);
        this.saveParams();
      });

      positionFolder.addBinding(PARAMS, 'y', {
        min: -500,
        max: config.isSpotLight ? 2000 : 500, // 聚光灯的Y轴范围更大
        step: config.isSpotLight ? 10 : 1, // 聚光灯的步进值也相应增加
        label: 'Y'
      }).on('change', ({value}) => {
        light.position.y = value;
        this.updateHelper(config.name);
        this.saveParams();
      });

      positionFolder.addBinding(PARAMS, 'z', {
        min: -500,
        max: 500,
        step: 1,
        label: 'Z'
      }).on('change', ({value}) => {
        light.position.z = value;
        this.updateHelper(config.name);
        this.saveParams();
      });

      // 光照参数控制
      folder.addBinding(PARAMS, 'intensity', {
        min: 0,
        max: 10,
        step: 0.1,
        label: '强度'
      }).on('change', ({value}) => {
        light.intensity = value;
        this.saveParams();
      });

      folder.addBinding(PARAMS, 'distance', {
        min: 0,
        max: 2000,
        step: 10,
        label: '照射距离'
      }).on('change', ({value}) => {
        light.distance = value;
        this.saveParams();
      });

      folder.addBinding(PARAMS, 'decay', {
        min: 0,
        max: 10,
        step: 0.1,
        label: '衰减'
      }).on('change', ({value}) => {
        light.decay = value;
        this.saveParams();
      });

      // 聚光灯特有参数
      if (config.isSpotLight) {
        folder.addBinding(PARAMS, 'angle', {
          min: 0,
          max: 90,
          step: 1,
          label: '张角(度)'
        }).on('change', ({value}) => {
          light.angle = value * Math.PI / 180;
          this.updateHelper(config.name);
          this.saveParams();
        });

        folder.addBinding(PARAMS, 'penumbra', {
          min: 0,
          max: 1,
          step: 0.01,
          label: '半影'
        }).on('change', ({value}) => {
          light.penumbra = value;
          this.saveParams();
        });
      }

      // 颜色控制
      folder.addBinding(PARAMS, 'color', {
        label: '颜色'
      }).on('change', ({value}) => {
        light.color.set(value);
        this.saveParams();
      });
    });

    // 环境光控制
    const ambientFolder = this.pane.addFolder({
      title: '环境光',
    });

    const ambientLight = this.lights.ambientLight;
    if (ambientLight) {
      const AMBIENT_PARAMS = savedParams?.ambient || {
        intensity: ambientLight.intensity,
        color: '#FFD7B5'
      };

      // 如果有保存的参数，先应用它们
      if (savedParams?.ambient) {
        ambientLight.intensity = AMBIENT_PARAMS.intensity;
        ambientLight.color.set(AMBIENT_PARAMS.color);
      }

      ambientFolder.addBinding(AMBIENT_PARAMS, 'intensity', {
        min: 0,
        max: 1,
        step: 0.01,
        label: '强度'
      }).on('change', ({value}) => {
        ambientLight.intensity = value;
        this.saveParams();
      });

      ambientFolder.addBinding(AMBIENT_PARAMS, 'color', {
        label: '颜色'
      }).on('change', ({value}) => {
        ambientLight.color.set(value);
        this.saveParams();
      });
    }

    // 添加重置按钮
    this.pane.addButton({
      title: '重置为默认值',
      label: '重置'
    }).on('click', () => {
      this.resetToDefault();
    });
  }

  // 切换所有辅助显示器的显示状态
  toggleHelpers(visible) {
    this.helpersVisible = visible;
    Object.values(this.lightHelpers).forEach(helper => {
      if (helper) {
        helper.visible = visible;
      }
    });
  }

  // 切换主光和氛围光的显示状态
  toggleMainAndWarmLights(visible) {
    this.mainAndWarmLightsVisible = visible;
    const lightsToToggle = ['mainLight', 'warmLight', 'warmLight2'];
    
    lightsToToggle.forEach(name => {
      const light = this.lights[name];
      if (light) {
        light.visible = visible;
        // 同时更新对应的辅助显示器
        const helper = this.lightHelpers[name + 'Helper'];
        if (helper) {
          helper.visible = visible && this.helpersVisible;
        }
      }
    });
  }

  // 保存参数到 localStorage
  saveParams() {
    const params = {};
    
    // 保存所有光源参数
    ['mainLight', 'warmLight', 'warmLight2', 'spotLight', 'spotLight2'].forEach(name => {
      const light = this.lights[name];
      if (light) {
        params[name] = {
          x: light.position.x,
          y: light.position.y,
          z: light.position.z,
          intensity: light.intensity,
          distance: light.distance,
          decay: light.decay,
          color: '#' + light.color.getHexString(),
          ...(light.isSpotLight ? {
            angle: light.angle * 180 / Math.PI,
            penumbra: light.penumbra
          } : {})
        };
      }
    });

    // 保存辅助显示器设置
    params.helperSettings = {
      showHelpers: this.helpersVisible
    };

    // 保存主光和氛围光的显示状态
    params.lightVisibilitySettings = {
      showMainAndWarmLights: this.mainAndWarmLightsVisible
    };

    // 保存环境光参数
    if (this.lights.ambientLight) {
      params.ambient = {
        intensity: this.lights.ambientLight.intensity,
        color: '#' + this.lights.ambientLight.color.getHexString()
      };
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(params));
  }

  // 从 localStorage 加载参数
  loadParams() {
    try {
      const savedParams = localStorage.getItem(this.STORAGE_KEY);
      return savedParams ? JSON.parse(savedParams) : null;
    } catch (error) {
      console.error('加载保存的参数失败:', error);
      return null;
    }
  }

  // 重置为默认值
  resetToDefault() {
    // 清除保存的参数
    localStorage.removeItem(this.STORAGE_KEY);
    
    // 重新加载页面以应用默认值
    window.location.reload();
  }

  // 更新辅助显示器
  updateHelper(lightName) {
    const helper = this.lightHelpers[lightName + 'Helper'];
    if (helper) {
      helper.update();
    }
  }

  // 销毁方法
  dispose() {
    if (this.pane) {
      this.pane.dispose();
    }
  }
}
