import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import * as TWEEN from "@tweenjs/tween.js";

export class Action {
  // 步长
  step = 0.1;

  moveState;

  tweenRotation;

  constructor(render, { person }) {
    this.render = render;
    this.initMovement();
    this.personController = person;
  }

  // 移动控制器
  initMovement() {
    document.addEventListener("keydown", this.keyMove.bind(this));
    document.addEventListener("keyup", this.keyUp.bind(this));
    document.addEventListener("click", this.click.bind(this));
  }

  keyUp(ev) {
    if (this.moveState !== "jump") {
      this.moveState = "stand";
    }
    this.personController.fadeToAction("Idle", 0.5);
  }

  click() {
    this.personController.fadeToAction("Punch", 0);
  }

  // 键盘监听
  keyMove(ev) {
    if (this.moveState === "jump") return;
    switch (ev.keyCode) {
      case 65:
        this.moveState = "left";
        this.moveBox();
        break;
      case 87:
        this.moveState = "forward";
        this.moveBox();
        break;
      case 68:
        this.moveState = "right";
        this.moveBox();
        break;
      case 83:
        this.moveState = "back";
        this.moveBox();
        break;
      case 32:
        this.moveState = "jump";
        this.jump();
      default:
        return;
    }
  }

  // 跳跃
  jump() {
    const me = this;
    this.personController.fadeToAction("Jump", 0);
    // 跳跃的最大高度
    const max = 3;
    // 初始高度
    const initY = this.personController.model.position.y;
    // 是否在下坠
    let down = false;
    // 递增和递减系数
    let t = 1;
    const x = 0.01;
    // 跳跃
    let interval = setInterval(() => {
      const downNumber = down ? -1 : 1;
      this.personController.model.position.y += 0.2 * downNumber * t;
      this.render.sceneController.camera.position.y += 0.2 * downNumber * t;
      t += downNumber * x;
      // 到最高点开始下坠
      if (this.personController.model.position.y >= max) {
        down = true;
      }
      // 到最低点结束跳跃
      if (this.personController.model.position.y <= initY && down) {
        this.personController.model.position.y = initY;
        this.moveState = "stand";
        clearInterval(interval);
        this.personController.fadeToAction("Idle", 0.5);
      }
      me.setControl(...this.personController.model.position);
    }, 30);
  }

  // 移动物体
  moveBox() {
    this.personController.fadeToAction("Walking", 0.5);
    // 获取人物中心点和相机中心点
    const p1 = this.personController.model.position;
    const p2 = this.render.sceneController.camera.position;
    // 计算两者连接形成的向量
    const v1 = p1.clone().sub(p2);
    // 去掉y轴，变成xz的两位向量
    v1.y = 0;
    const length = v1.length();
    // 获取垂直向量
    const v2 = new THREE.Vector3(v1.z, 0, -v1.x);
    // 移动的方向
    let dir = 1;
    let v = v1;
    switch (this.moveState) {
      case "forward":
        dir = 1;
        break;
      case "left":
        dir = 1;
        v = v2;
        break;
      case "right":
        dir = -1;
        v = v2;
        break;
      case "back":
        dir = -1;
        break;
      default:
        return;
    }
    // 移动位置
    for (const key in v) {
      if (key === "y") continue;
      const temp = (dir * this.step * v[key]) / length;
      this.personController.model.position[key] += temp;
      this.render.sceneController.camera.position[key] += temp;
    }
    this.setControl(...this.personController.model.position);
    this.rotateModel();
  }

  // 设置相机位置
  setControl(x, y, z) {
    this.render.sceneController.controls.target.set(x, y, z);
    this.render.sceneController.controls.update();
  }

  // 选择人物方向
  rotateModel() {
    const me = this;
    // 获取人物中心点和相机中心点
    const p1 = this.personController.model.position;
    const p2 = this.render.sceneController.camera.position;
    // 计算两者连接形成的向量
    const v1 = p1.clone().sub(p2);
    v1.y = 0;
    // 人物的初始面向
    const origin = new THREE.Vector3(0, 0, 1);
    // 点乘求夹角
    const radian = Math.acos(v1.dot(origin) / (v1.length() * origin.length()));
    // 叉乘求方向
    v1.cross(origin);

    const oldRotation = this.personController.model.rotation;
    let rotationY = radian * (v1.z === 0 && 1 / v1.z < 0 ? -1 : 1);

    if (this.moveState === "left") {
      rotationY += Math.PI / 2;
    }
    if (this.moveState === "right") {
      rotationY -= Math.PI / 2;
    }
    if (this.moveState === "forward") {
      rotationY = rotationY;
    }
    if (this.moveState === "back") {
      rotationY += Math.PI;
    }

    const isAnimating = me.tweenRotation.update();
    if (!isAnimating && Math.abs(oldRotation.y - rotationY) > 0.1) {
      this.tweenRotation._valuesStart = this.personController.model.rotation;
      this.tweenRotation
        .to({ x: oldRotation.x, y: rotationY, z: oldRotation.z }, 500) // 目标值，毫秒数
        .start();
    }
  }

  initTween() {
    const me = this;
    this.tweenRotation = new TWEEN.Tween(this.personController.model.rotation);
    me.render.registerUpdate("tweenRotation", (delta) => {
      me.tweenRotation.update();
    });
  }
}
