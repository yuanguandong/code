import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader.js";
import { ColorCorrectionShader } from "three/examples/jsm/shaders/ColorCorrectionShader.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js";
import { DotScreenPass } from "three/examples/jsm/postprocessing/DotScreenPass.js";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";
import { HalftonePass } from "three/examples/jsm/postprocessing/HalftonePass.js";
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass.js";
import { Pane } from "tweakpane";

// 添加移轴效果的 Shader
const TiltShiftShader = {
  uniforms: {
    tDiffuse: { value: null },
    focusPosition: { value: 0.5 },
    blurAmount: { value: 1.0 },
    windowSize: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float focusPosition;
    uniform float blurAmount;
    uniform vec2 windowSize;
    varying vec2 vUv;

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      float distance = abs(vUv.y - focusPosition);
      float blur = smoothstep(0.0, blurAmount * 0.5, distance);
      
      vec4 sum = vec4(0.0);
      float total = 0.0;
      
      for(float x = -4.0; x <= 4.0; x += 1.0) {
        for(float y = -4.0; y <= 4.0; y += 1.0) {
          vec2 offset = vec2(x, y) * blur * 0.001;
          sum += texture2D(tDiffuse, vUv + offset);
          total += 1.0;
        }
      }
      
      gl_FragColor = mix(color, sum / total, blur);
    }
  `,
};

// 添加卡通渲染的 Shader
const ToonShader = {
  uniforms: {
    tDiffuse: { value: null },
    numColors: { value: 4.0 },
    threshold: { value: 0.3 },
    edgeStrength: { value: 0.5 },
    resolution: { value: new THREE.Vector2(1, 1) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float numColors;
    uniform float threshold;
    uniform float edgeStrength;
    uniform vec2 resolution;
    varying vec2 vUv;

    vec4 findClosestColor(vec4 color) {
      vec3 c = color.rgb * numColors;
      c = floor(c + 0.5);
      return vec4(c / numColors, color.a);
    }

    float getLuminance(vec3 color) {
      return dot(color, vec3(0.299, 0.587, 0.114));
    }

    void main() {
      vec2 texel = vec2(1.0 / resolution.x, 1.0 / resolution.y);
      vec4 color = texture2D(tDiffuse, vUv);
      
      // 边缘检测
      vec4 up = texture2D(tDiffuse, vUv + vec2(0.0, texel.y));
      vec4 down = texture2D(tDiffuse, vUv - vec2(0.0, texel.y));
      vec4 left = texture2D(tDiffuse, vUv - vec2(texel.x, 0.0));
      vec4 right = texture2D(tDiffuse, vUv + vec2(texel.x, 0.0));
      
      float edge = abs(getLuminance(up.rgb) - getLuminance(down.rgb)) +
                   abs(getLuminance(left.rgb) - getLuminance(right.rgb));
      edge = smoothstep(threshold, threshold + 0.1, edge * edgeStrength);
      
      // 色彩量化
      vec4 quantizedColor = findClosestColor(color);
      
      // 混合边缘和量化后的颜色
      gl_FragColor = mix(quantizedColor, vec4(0.0, 0.0, 0.0, 1.0), edge);
    }
  `,
};

export class PostProcessingController {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.composer = null;
    this.pane = null;

    this.initPostProcessing();
    this.initResizeHandler();
  }

  initPostProcessing() {
    if (!this.camera) {
      console.error("Camera not initialized");
      return;
    }

    // 创建后处理合成器
    this.composer = new EffectComposer(this.renderer);

    // 添加基础渲染通道
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    try {
      // 创建容器样式
      const style = document.createElement("style");
      style.textContent = `
        .post-scroll {
          width:300px;
          position: absolute;
          left: 8px;
          top: 8px;
          max-height: 98vh;
          overflow-y: auto;
          overflow-x: hidden;
        }
        .post-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .post-scroll::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
          border-radius: 2px;
        }
        .post-scroll::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.2);
          border-radius: 2px;
        }
        .post-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.3);
        }
      `;
      document.head.appendChild(style);

      const container = document.createElement("div");
      container.className = "post-scroll";
      document.body.appendChild(container);

      // 创建后处理控制面板
      this.pane = new Pane({
        title: "后处理效果",
        container: container,
      });

      const postProcessingFolder = this.pane.addFolder({
        title: "后处理效果",
        expanded: true,
      });

      // 初始化各种后处理效果
      this.initSSAO(postProcessingFolder);
      this.initBloom(postProcessingFolder);
      this.initColorCorrection(postProcessingFolder);
      this.initBokeh(postProcessingFolder);
      this.initRGBShift(postProcessingFolder);
      this.initSMAA(postProcessingFolder);

      // 新增的后处理效果
      this.initOutline(postProcessingFolder);
      this.initFilm(postProcessingFolder);
      this.initDotScreen(postProcessingFolder);
      this.initGlitch(postProcessingFolder);
      this.initHalftone(postProcessingFolder);
      this.initAfterimage(postProcessingFolder);
      this.initTiltShift(postProcessingFolder);
      this.initToon(postProcessingFolder);

      // 添加Gamma校正通道（放在最后）
      const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
      this.composer.addPass(gammaCorrectionPass);
    } catch (error) {
      console.error("Error initializing post-processing:", error);
      this.composer = null;
    }
  }

  initSSAO(folder) {
    const ssaoPass = new SSAOPass(this.scene, this.camera, window.innerWidth, window.innerHeight);
    ssaoPass.kernelRadius = 16;
    ssaoPass.minDistance = 0.005;
    ssaoPass.maxDistance = 0.1;
    ssaoPass.enabled = false;
    this.composer.addPass(ssaoPass);

    const ssaoFolder = folder.addFolder({ title: "SSAO 环境光遮蔽" });
    const ssaoParams = {
      enabled: false,
      kernelRadius: ssaoPass.kernelRadius,
      minDistance: ssaoPass.minDistance,
      maxDistance: ssaoPass.maxDistance,
    };

    this.addEffectControls(ssaoFolder, ssaoPass, ssaoParams, {
      kernelRadius: { min: 0, max: 32, step: 1, label: "范围" },
      minDistance: { min: 0, max: 0.02, step: 0.001, label: "最小距离" },
      maxDistance: { min: 0, max: 0.3, step: 0.01, label: "最大距离" },
    });
  }

  initBloom(folder) {
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.5,
      0.4,
      0.85
    );
    bloomPass.enabled = false;
    this.composer.addPass(bloomPass);

    const bloomFolder = folder.addFolder({ title: "Bloom 泛光" });
    const bloomParams = {
      enabled: false,
      strength: bloomPass.strength,
      radius: bloomPass.radius,
      threshold: bloomPass.threshold,
    };

    this.addEffectControls(bloomFolder, bloomPass, bloomParams, {
      strength: { min: 0, max: 3, step: 0.1, label: "强度" },
      radius: { min: 0, max: 1, step: 0.01, label: "半径" },
      threshold: { min: 0, max: 1, step: 0.01, label: "阈值" },
    });
  }

  initColorCorrection(folder) {
    const colorCorrectionPass = new ShaderPass(ColorCorrectionShader);
    colorCorrectionPass.enabled = false;
    this.composer.addPass(colorCorrectionPass);

    const colorFolder = folder.addFolder({ title: "色彩校正" });
    const colorParams = {
      enabled: false,
      powerR: 1.0,
      powerG: 1.0,
      powerB: 1.0,
      mulR: 1.0,
      mulG: 1.0,
      mulB: 1.0,
    };

    const updateColorCorrection = () => {
      colorCorrectionPass.uniforms.powRGB.value.set(
        colorParams.powerR,
        colorParams.powerG,
        colorParams.powerB
      );
      colorCorrectionPass.uniforms.mulRGB.value.set(
        colorParams.mulR,
        colorParams.mulG,
        colorParams.mulB
      );
    };

    colorFolder
      .addBinding(colorParams, "enabled", { label: "启用" })
      .on("change", ({ value }) => (colorCorrectionPass.enabled = value));

    const colorControls = {
      powerR: { min: 0.5, max: 2.0, step: 0.1, label: "红色强度" },
      powerG: { min: 0.5, max: 2.0, step: 0.1, label: "绿色强度" },
      powerB: { min: 0.5, max: 2.0, step: 0.1, label: "蓝色强度" },
    };

    Object.entries(colorControls).forEach(([param, config]) => {
      colorFolder.addBinding(colorParams, param, config).on("change", updateColorCorrection);
    });
  }

  initBokeh(folder) {
    const bokehPass = new BokehPass(this.scene, this.camera, {
      focus: 500,
      aperture: 5,
      maxblur: 1.0,
      width: window.innerWidth,
      height: window.innerHeight,
    });
    bokehPass.enabled = false;
    this.composer.addPass(bokehPass);

    const bokehFolder = folder.addFolder({ title: "景深效果" });
    const bokehParams = {
      enabled: false,
      focus: 500,
      aperture: 5,
      maxblur: 1.0,
    };

    this.addEffectControls(bokehFolder, bokehPass, bokehParams, {
      focus: { min: 10, max: 3000, step: 10, label: "焦点距离" },
      aperture: { min: 0, max: 10, step: 0.1, label: "光圈大小" },
      maxblur: { min: 0, max: 3, step: 0.1, label: "最大模糊" },
    });
  }

  initRGBShift(folder) {
    const rgbShiftPass = new ShaderPass(RGBShiftShader);
    rgbShiftPass.enabled = false;
    this.composer.addPass(rgbShiftPass);

    const rgbShiftFolder = folder.addFolder({ title: "色差效果" });
    const rgbShiftParams = {
      enabled: false,
      amount: 0.003,
    };

    this.addEffectControls(rgbShiftFolder, rgbShiftPass, rgbShiftParams, {
      amount: { min: 0, max: 0.01, step: 0.001, label: "强度" },
    });
  }

  initSMAA(folder) {
    const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);
    smaaPass.enabled = false;
    this.composer.addPass(smaaPass);

    const smaaFolder = folder.addFolder({ title: "SMAA 抗锯齿" });
    const smaaParams = {
      enabled: false,
    };

    smaaFolder
      .addBinding(smaaParams, "enabled", { label: "启用" })
      .on("change", ({ value }) => (smaaPass.enabled = value));
  }

  initOutline(folder) {
    const outlinePass = new OutlinePass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      this.scene,
      this.camera
    );
    outlinePass.enabled = false;
    this.composer.addPass(outlinePass);

    const outlineFolder = folder.addFolder({ title: "描边效果" });
    const outlineParams = {
      enabled: false,
      edgeStrength: 3.0,
      edgeGlow: 0.0,
      edgeThickness: 1.0,
      pulsePeriod: 0,
    };

    this.addEffectControls(outlineFolder, outlinePass, outlineParams, {
      edgeStrength: { min: 0, max: 10, step: 0.1, label: "边缘强度" },
      edgeGlow: { min: 0, max: 1, step: 0.1, label: "边缘发光" },
      edgeThickness: { min: 0, max: 4, step: 0.1, label: "边缘厚度" },
      pulsePeriod: { min: 0, max: 5, step: 0.1, label: "脉冲周期" },
    });
  }

  initFilm(folder) {
    const filmPass = new FilmPass(
      0.35, // noise intensity
      0.025, // scanline intensity
      648, // scanline count
      false // grayscale
    );
    filmPass.enabled = false;
    this.composer.addPass(filmPass);

    const filmFolder = folder.addFolder({ title: "电影效果" });
    const filmParams = {
      enabled: false,
      noiseIntensity: 0.35,
      scanlinesIntensity: 0.025,
      scanlinesCount: 648,
      grayscale: false,
    };

    this.addEffectControls(filmFolder, filmPass, filmParams, {
      noiseIntensity: { min: 0, max: 1, step: 0.01, label: "噪点强度" },
      scanlinesIntensity: { min: 0, max: 1, step: 0.01, label: "扫描线强度" },
      scanlinesCount: { min: 0, max: 2048, step: 1, label: "扫描线数量" },
      grayscale: { label: "灰度模式" },
    });
  }

  initDotScreen(folder) {
    const dotScreenPass = new DotScreenPass();
    dotScreenPass.enabled = false;
    this.composer.addPass(dotScreenPass);

    const dotScreenFolder = folder.addFolder({ title: "点阵效果" });
    const dotScreenParams = {
      enabled: false,
      scale: 1.0,
      angle: 1.57,
    };

    this.addEffectControls(dotScreenFolder, dotScreenPass, dotScreenParams, {
      scale: { min: 0.1, max: 10, step: 0.1, label: "点阵大小" },
      angle: { min: 0, max: 6.28, step: 0.01, label: "点阵角度" },
    });
  }

  initGlitch(folder) {
    const glitchPass = new GlitchPass();
    glitchPass.enabled = false;
    this.composer.addPass(glitchPass);

    const glitchFolder = folder.addFolder({ title: "故障效果" });
    const glitchParams = {
      enabled: false,
      goWild: false,
    };

    this.addEffectControls(glitchFolder, glitchPass, glitchParams, {
      goWild: { label: "狂野模式" },
    });
  }

  initHalftone(folder) {
    const params = {
      shape: 1,
      radius: 4,
      rotateR: Math.PI / 12,
      rotateG: (Math.PI / 12) * 2,
      rotateB: (Math.PI / 12) * 3,
      scatter: 0,
    };

    const halftonePass = new HalftonePass(window.innerWidth, window.innerHeight, params);
    halftonePass.enabled = false;
    this.composer.addPass(halftonePass);

    const halftoneFolder = folder.addFolder({ title: "半色调效果" });
    const halftoneParams = {
      enabled: false,
      ...params,
    };

    this.addEffectControls(halftoneFolder, halftonePass, halftoneParams, {
      shape: { min: 1, max: 5, step: 1, label: "形状" },
      radius: { min: 1, max: 25, step: 1, label: "半径" },
      rotateR: { min: 0, max: Math.PI * 2, step: 0.1, label: "红色旋转" },
      rotateG: { min: 0, max: Math.PI * 2, step: 0.1, label: "绿色旋转" },
      rotateB: { min: 0, max: Math.PI * 2, step: 0.1, label: "蓝色旋转" },
      scatter: { min: 0, max: 1, step: 0.01, label: "散射" },
    });
  }

  initAfterimage(folder) {
    const afterimagePass = new AfterimagePass();
    afterimagePass.enabled = false;
    this.composer.addPass(afterimagePass);

    const afterimageFolder = folder.addFolder({ title: "残影效果" });
    const afterimageParams = {
      enabled: false,
      damp: 0.85,
    };

    this.addEffectControls(afterimageFolder, afterimagePass, afterimageParams, {
      damp: { min: 0, max: 1, step: 0.01, label: "残影持续度" },
    });
  }

  initTiltShift(folder) {
    const tiltShiftPass = new ShaderPass(TiltShiftShader);
    tiltShiftPass.enabled = false;
    this.composer.addPass(tiltShiftPass);

    const tiltShiftFolder = folder.addFolder({ title: "移轴效果" });
    const tiltShiftParams = {
      enabled: false,
      focusPosition: 0.5,
      blurAmount: 1.0,
    };

    tiltShiftFolder
      .addBinding(tiltShiftParams, "enabled", { label: "启用" })
      .on("change", ({ value }) => {
        tiltShiftPass.enabled = value;
      });

    tiltShiftFolder
      .addBinding(tiltShiftParams, "focusPosition", {
        min: 0,
        max: 1,
        step: 0.01,
        label: "聚焦位置",
      })
      .on("change", ({ value }) => {
        tiltShiftPass.uniforms.focusPosition.value = value;
      });

    tiltShiftFolder
      .addBinding(tiltShiftParams, "blurAmount", {
        min: 0,
        max: 3,
        step: 0.1,
        label: "模糊程度",
      })
      .on("change", ({ value }) => {
        tiltShiftPass.uniforms.blurAmount.value = value;
      });

    // 监听窗口大小变化
    window.addEventListener("resize", () => {
      tiltShiftPass.uniforms.windowSize.value.set(window.innerWidth, window.innerHeight);
    });
  }

  initToon(folder) {
    const toonPass = new ShaderPass(ToonShader);
    toonPass.enabled = false;

    // 设置分辨率
    toonPass.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);

    this.composer.addPass(toonPass);

    const toonFolder = folder.addFolder({ title: "卡通渲染" });
    const toonParams = {
      enabled: false,
      numColors: 4.0,
      threshold: 0.3,
      edgeStrength: 0.5,
    };

    toonFolder.addBinding(toonParams, "enabled", { label: "启用" }).on("change", ({ value }) => {
      toonPass.enabled = value;
    });

    toonFolder
      .addBinding(toonParams, "numColors", {
        min: 2,
        max: 8,
        step: 1,
        label: "色阶数量",
      })
      .on("change", ({ value }) => {
        toonPass.uniforms.numColors.value = value;
      });

    toonFolder
      .addBinding(toonParams, "threshold", {
        min: 0,
        max: 1,
        step: 0.01,
        label: "边缘阈值",
      })
      .on("change", ({ value }) => {
        toonPass.uniforms.threshold.value = value;
      });

    toonFolder
      .addBinding(toonParams, "edgeStrength", {
        min: 0,
        max: 1,
        step: 0.01,
        label: "边缘强度",
      })
      .on("change", ({ value }) => {
        toonPass.uniforms.edgeStrength.value = value;
      });

    // 监听窗口大小变化
    window.addEventListener("resize", () => {
      toonPass.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    });
  }

  addEffectControls(folder, pass, params, controls) {
    folder
      .addBinding(params, "enabled", { label: "启用" })
      .on("change", ({ value }) => (pass.enabled = value));

    Object.entries(controls).forEach(([param, config]) => {
      folder.addBinding(params, param, config).on("change", ({ value }) => {
        if (pass.uniforms && pass.uniforms[param]) {
          pass.uniforms[param].value = value;
        } else {
          pass[param] = value;
        }
      });
    });
  }

  initResizeHandler() {
    window.addEventListener("resize", () => {
      if (this.composer) {
        this.composer.setSize(window.innerWidth, window.innerHeight);
      }

      if (this.camera instanceof THREE.OrthographicCamera) {
        const aspectRatio = window.innerWidth / window.innerHeight;
        const cameraSize = 200;
        this.camera.left = -cameraSize * aspectRatio;
        this.camera.right = cameraSize * aspectRatio;
        this.camera.top = cameraSize;
        this.camera.bottom = -cameraSize;
        this.camera.updateProjectionMatrix();
      }
    });
  }

  dispose() {
    if (this.pane) {
      this.pane.dispose();
    }
    // 清理其他资源...
  }
}
