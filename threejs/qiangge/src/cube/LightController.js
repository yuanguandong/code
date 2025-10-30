import * as THREE from "three";
import { Pane } from "tweakpane";
import defaultLightData from './.backup/lightData.json';

export class LightController {
  constructor(scene) {
    this.scene = scene;
    this.lights = {};
    this.lightHelpers = {};
    this.pane = null;
    this.STORAGE_KEY = "scene_light_params";
    this.helpersVisible = defaultLightData.helperSettings.showHelpers;
    this.mainAndWarmLightsVisible = true;

    this.initLight();
    this.initTweakPane();
  }

  initLight() {
    // 主光源 - 白色点光源
    const mainLight = new THREE.PointLight(
      defaultLightData.mainLight.color,
      defaultLightData.mainLight.intensity,
      defaultLightData.mainLight.distance,
      defaultLightData.mainLight.decay
    );
    mainLight.position.set(
      defaultLightData.mainLight.x,
      defaultLightData.mainLight.y,
      defaultLightData.mainLight.z
    );
    this.scene.add(mainLight);
    const mainLightHelper = new THREE.PointLightHelper(mainLight, 10);
    mainLightHelper.visible = this.helpersVisible;
    this.scene.add(mainLightHelper);

    // 顶光 - 聚光灯
    const warmLight = new THREE.SpotLight(
      defaultLightData.warmLight.color,
      defaultLightData.warmLight.intensity,
      defaultLightData.warmLight.distance,
      defaultLightData.warmLight.angle * Math.PI / 180,
      defaultLightData.warmLight.penumbra,
      defaultLightData.warmLight.decay
    );
    warmLight.position.set(
      defaultLightData.warmLight.x,
      defaultLightData.warmLight.y,
      defaultLightData.warmLight.z
    );
    warmLight.castShadow = true;
    this.scene.add(warmLight);
    const warmLightHelper = new THREE.SpotLightHelper(warmLight);
    warmLightHelper.visible = this.helpersVisible;
    this.scene.add(warmLightHelper);

    // 第二个橘黄色氛围光源
    const warmLight2 = new THREE.PointLight(
      defaultLightData.warmLight2.color,
      defaultLightData.warmLight2.intensity,
      defaultLightData.warmLight2.distance,
      defaultLightData.warmLight2.decay
    );
    warmLight2.position.set(
      defaultLightData.warmLight2.x,
      defaultLightData.warmLight2.y,
      defaultLightData.warmLight2.z
    );
    this.scene.add(warmLight2);
    const warmLight2Helper = new THREE.PointLightHelper(warmLight2, 10);
    warmLight2Helper.visible = this.helpersVisible;
    this.scene.add(warmLight2Helper);

    // 聚光灯
    const spotLight = new THREE.SpotLight(
      defaultLightData.spotLight.color,
      defaultLightData.spotLight.intensity,
      defaultLightData.spotLight.distance,
      defaultLightData.spotLight.angle * Math.PI / 180,
      defaultLightData.spotLight.penumbra,
      defaultLightData.spotLight.decay
    );
    spotLight.position.set(
      defaultLightData.spotLight.x,
      defaultLightData.spotLight.y,
      defaultLightData.spotLight.z
    );
    spotLight.castShadow = true;
    this.scene.add(spotLight);
    const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    spotLightHelper.visible = this.helpersVisible;
    this.scene.add(spotLightHelper);

    // 第二个聚光灯
    const spotLight2 = new THREE.SpotLight(
      defaultLightData.spotLight2.color,
      defaultLightData.spotLight2.intensity,
      defaultLightData.spotLight2.distance,
      defaultLightData.spotLight2.angle * Math.PI / 180,
      defaultLightData.spotLight2.penumbra,
      defaultLightData.spotLight2.decay
    );
    spotLight2.position.set(
      defaultLightData.spotLight2.x,
      defaultLightData.spotLight2.y,
      defaultLightData.spotLight2.z
    );
    spotLight2.castShadow = true;
    this.scene.add(spotLight2);
    const spotLight2Helper = new THREE.SpotLightHelper(spotLight2);
    spotLight2Helper.visible = this.helpersVisible;
    this.scene.add(spotLight2Helper);

    // 环境光
    const ambientLight = new THREE.AmbientLight(
      defaultLightData.ambient.color,
      defaultLightData.ambient.intensity
    );
    this.scene.add(ambientLight);

    // 保存所有灯光和辅助对象引用
    this.lights = {
      mainLight,
      warmLight,
      warmLight2,
      spotLight,
      spotLight2,
      ambientLight,
    };

    this.lightHelpers = {
      mainLightHelper,
      warmLightHelper,
      warmLight2Helper,
      spotLightHelper,
      spotLight2Helper,
    };
  }

  initTweakPane() {
    // 创建容器样式
    const style = document.createElement("style");
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

    const container = document.createElement("div");
    container.className = "tp-scroll";
    document.body.appendChild(container);

    this.pane = new Pane({
      title: "灯光控制面板",
      container: container,
    });

    this.initLightControls();
  }

  initLightControls() {
    const savedParams = this.loadParams();

    // 辅助显示器开关
    const helperParams = {
      showHelpers: savedParams?.helperSettings?.showHelpers ?? true,
    };

    this.pane
      .addBinding(helperParams, "showHelpers", {
        label: "显示辅助器",
      })
      .on("change", ({ value }) => {
        this.toggleHelpers(value);
        this.saveParams();
      });

    // 主光和氛围光显示控制
    const lightVisibilityParams = {
      showMainAndWarmLights: savedParams?.lightVisibilitySettings?.showMainAndWarmLights ?? true,
    };

    this.pane
      .addBinding(lightVisibilityParams, "showMainAndWarmLights", {
        label: "显示主光和氛围光",
      })
      .on("change", ({ value }) => {
        this.toggleMainAndWarmLights(value);
        this.saveParams();
      });

    // 为每个光源创建控制面板
    this.createLightControlPanels(savedParams);

    // 添加重置按钮
    this.pane
      .addButton({
        title: "重置为默认值",
        label: "重置",
      })
      .on("click", () => {
        this.resetToDefault();
      });
  }

  createLightControlPanels(savedParams) {
    const lightConfigs = [
      { name: "mainLight", title: "主光源", color: "#ff7f00" },
      { name: "warmLight", title: "顶光", color: "#ff7f00", isSpotLight: true },
      { name: "warmLight2", title: "氛围光2", color: "#ff0000" },
      { name: "spotLight", title: "太阳光", color: "#ffffff" },
      { name: "spotLight2", title: "太阳光2", color: "#00ffff" },
    ];

    lightConfigs.forEach((config) => this.createSingleLightPanel(config, savedParams));
  }

  createSingleLightPanel(config, savedParams) {
    const light = this.lights[config.name];
    if (!light) return;

    const folder = this.pane.addFolder({ title: config.title });
    const PARAMS = this.createLightParams(light, config, savedParams);
    this.addLightControls(folder, light, PARAMS, config);
  }

  createLightParams(light, config, savedParams) {
    const baseParams = {
      x: light.position.x,
      y: light.position.y,
      z: light.position.z,
      intensity: light.intensity,
      distance: light.distance,
      decay: light.decay,
      color: config.color,
    };

    if (config.isSpotLight) {
      baseParams.angle = (light.angle * 180) / Math.PI;
      baseParams.penumbra = light.penumbra || 0;
    }

    return savedParams?.[config.name] ? { ...baseParams, ...savedParams[config.name] } : baseParams;
  }

  addLightControls(folder, light, PARAMS, config) {
    const positionFolder = folder.addFolder({ title: "位置" });
    
    // 位置控制
    ["x", "y", "z"].forEach(axis => {
      positionFolder
        .addBinding(PARAMS, axis, {
          min: -500,
          max: axis === "y" && config.isSpotLight ? 2000 : 500,
          step: axis === "y" && config.isSpotLight ? 10 : 1,
          label: axis.toUpperCase(),
        })
        .on("change", ({ value }) => {
          light.position[axis] = value;
          this.updateHelper(config.name);
          this.saveParams();
        });
    });

    // 基本参数控制
    this.addBasicLightControls(folder, light, PARAMS);

    // 聚光灯特有参数
    if (config.isSpotLight) {
      this.addSpotLightControls(folder, light, PARAMS);
    }

    // 颜色控制
    folder
      .addBinding(PARAMS, "color", { label: "颜色" })
      .on("change", ({ value }) => {
        light.color.set(value);
        this.saveParams();
      });
  }

  addBasicLightControls(folder, light, PARAMS) {
    const controls = [
      { name: "intensity", label: "强度", min: 0, max: 10, step: 0.1 },
      { name: "distance", label: "照射距离", min: 0, max: 2000, step: 10 },
      { name: "decay", label: "衰减", min: 0, max: 10, step: 0.1 },
    ];

    controls.forEach(control => {
      folder
        .addBinding(PARAMS, control.name, {
          min: control.min,
          max: control.max,
          step: control.step,
          label: control.label,
        })
        .on("change", ({ value }) => {
          light[control.name] = value;
          this.saveParams();
        });
    });
  }

  addSpotLightControls(folder, light, PARAMS) {
    folder
      .addBinding(PARAMS, "angle", {
        min: 0,
        max: 90,
        step: 1,
        label: "张角(度)",
      })
      .on("change", ({ value }) => {
        light.angle = (value * Math.PI) / 180;
        this.updateHelper(config.name);
        this.saveParams();
      });

    folder
      .addBinding(PARAMS, "penumbra", {
        min: 0,
        max: 1,
        step: 0.01,
        label: "半影",
      })
      .on("change", ({ value }) => {
        light.penumbra = value;
        this.saveParams();
      });
  }

  toggleHelpers(visible) {
    this.helpersVisible = visible;
    Object.values(this.lightHelpers).forEach((helper) => {
      if (helper) {
        helper.visible = visible;
      }
    });
  }

  toggleMainAndWarmLights(visible) {
    this.mainAndWarmLightsVisible = visible;
    const lightsToToggle = ["mainLight", "warmLight", "warmLight2"];

    lightsToToggle.forEach((name) => {
      const light = this.lights[name];
      if (light) {
        light.visible = visible;
        const helper = this.lightHelpers[name + "Helper"];
        if (helper) {
          helper.visible = visible && this.helpersVisible;
        }
      }
    });
  }

  saveParams() {
    const params = {
      helperSettings: { showHelpers: this.helpersVisible },
      lightVisibilitySettings: { showMainAndWarmLights: this.mainAndWarmLightsVisible },
    };

    // 保存所有光源参数
    Object.entries(this.lights).forEach(([name, light]) => {
      if (name !== "ambientLight") {
        params[name] = {
          x: light.position.x,
          y: light.position.y,
          z: light.position.z,
          intensity: light.intensity,
          distance: light.distance,
          decay: light.decay,
          color: "#" + light.color.getHexString(),
          ...(light.isSpotLight ? {
            angle: (light.angle * 180) / Math.PI,
            penumbra: light.penumbra,
          } : {}),
        };
      }
    });

    // 保存环境光参数
    if (this.lights.ambientLight) {
      params.ambient = {
        intensity: this.lights.ambientLight.intensity,
        color: "#" + this.lights.ambientLight.color.getHexString(),
      };
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(params));
  }

  loadParams() {
    try {
      const savedParams = localStorage.getItem(this.STORAGE_KEY);
      return savedParams ? JSON.parse(savedParams) : null;
    } catch (error) {
      console.error("加载保存的参数失败:", error);
      return null;
    }
  }

  resetToDefault() {
    localStorage.removeItem(this.STORAGE_KEY);
    window.location.reload();
  }

  updateHelper(lightName) {
    const helper = this.lightHelpers[lightName + "Helper"];
    if (helper) {
      helper.update();
    }
  }

  dispose() {
    if (this.pane) {
      this.pane.dispose();
    }
  }
} 