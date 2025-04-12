/*
 * @Descripttion: 等距房间场景
 * @MainAuthor:
 */
import { BaseScene } from './BaseScene';

export class Demo extends BaseScene {
  constructor(render, scene) {
    super(render, scene);
    this.composer = null;
    this.lights = {}; // 存储灯光对象
    this.lightHelpers = {}; // 存储灯光辅助对象
    this.pane = null; // tweakpane 实例
    this.STORAGE_KEY = "scene_light_params"; // localStorage 的 key
    this.helpersVisible = true; // 辅助显示器的显示状态
    this.mainAndWarmLightsVisible = true; // 主光和氛围光的显示状态

  }

  
}
