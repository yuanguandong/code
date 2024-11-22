import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GLBs } from "../constants";
import { loadGLTFModel } from "../lib/model";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
export class Demo {
  color = 0xff0000
  models = [];

  isMouseDown = false;
  mousePos = { x: 0, y: 0 };

  tweenCollection = {
    LBDoor: {
      tween: null,
      from: { value: null },
      to: { value: null },
    },
    RBDoor: {
      tween: null,
      from: { value: null },
      to: { value: null },
    },
    LFDoor: {
      tween: null,
      from: { value: null },
      to: { value: null },
    },
    RFDoor: {
      tween: null,
      from: { value: null },
      to: { value: null },
    },
    Trunk: {
      tween: null,
      from: { value: null },
      to: { value: null },
    },
  };

  constructor(render, scene) {
    this.render = render;
    this.scene = scene;

    this.init();
  }

  init() {
    this.loadCarModel();
    this.initLight();
    this.initEvents();
    this.registerTween();
    this.initCameraPosition();
    this.initGUI();
  }

  // 改变颜色
  handleColorChange(color) {
    this.models[0].traverse(function (node) {
      if (node.isMesh) {
        // 对于包含几何体的物体（isObject3D为true），再次遍历其子对象
        node.traverse(function (child) {
          if (child.isMesh && child.name === "EXT_51") {
            // 在这里改变子对象的材质颜色
            child.material.color.set(color); // 设置为红色
          }
        });
      }
    });
  }

  // 初始化GUI
  initGUI() {
    const me = this;
    this.gui = new GUI();
    const complexFolder = this.gui.addFolder("外观");
    complexFolder
      .addColor(me, "color")
      .onChange(function (value) {
        me.handleColorChange(value);
      });
  }

  initCameraPosition() {
    const me = this;
    queueMicrotask(function () {
      const controls = me.render.sceneController.controls;
      const camera = me.render.sceneController.camera;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.2;
      controls.target.set(0, 0, 0);

      const target = new THREE.Vector3(-0.5, 0.5, 0);
      const initialCameraPosition = new THREE.Vector3(
        5 * Math.sin(0.2 * Math.PI),
        2.5,
        5 * Math.cos(0.2 * Math.PI)
      );
      camera.position.copy(initialCameraPosition);
      camera.lookAt(target);
    });
  }

  // 加载模型
  async loadCarModel() {
    const me = this
    const res = await Promise.all(
      GLBs.map((item) =>
        loadGLTFModel(this.scene, item, this.render.renderer, {
          receiveShadow: false,
          castShadow: false,
        })
      )
    );
    this.models = res;
    // 改变子对象的材质颜色
    res[0].traverse(function (node) {
      if (node.isMesh) {
        // 对于包含几何体的物体（isObject3D为true），再次遍历其子对象
        node.traverse(function (child) {
          if (child.isMesh && child.name === "EXT_51") {
            // 在这里改变子对象的材质颜色
            child.material.color.set(me.color); // 设置为红色
          }
        });
      }
    });
  }

  // 加载灯光
  initLight() {
    const scene = this.scene;
    // 添加灯光
    const light1 = new THREE.DirectionalLight(0xffffff, 0.2);
    light1.position.set(0, 0, 10);
    scene.add(light1);
    const light2 = new THREE.DirectionalLight(0xffffff, 0.2);
    light2.position.set(0, 0, -10);
    scene.add(light2);
    const light3 = new THREE.DirectionalLight(0xffffff, 0.2);
    light3.position.set(10, 0, 0);
    scene.add(light3);
    const light4 = new THREE.DirectionalLight(0xffffff, 0.2);
    light4.position.set(-10, 0, 0);
    scene.add(light4);

    const light5 = new THREE.DirectionalLight(0xffffff, 0.2);
    light5.position.set(0, 10, 0);
    scene.add(light5);
    const light6 = new THREE.DirectionalLight(0xffffff, 0.2);
    light6.position.set(5, 10, 0);
    scene.add(light6);
    const light7 = new THREE.DirectionalLight(0xffffff, 0.2);
    light7.position.set(0, 10, 5);
    scene.add(light7);
    const light8 = new THREE.DirectionalLight(0xffffff, 0.2);
    light8.position.set(0, 10, -5);
    scene.add(light8);
    const light9 = new THREE.DirectionalLight(0xffffff, 0.2);
    light9.position.set(-5, 10, 0);
    scene.add(light9);
  }

  onMouseDown(event) {
    this.isMouseDown = true;
    // 更新鼠标位置
    this.mousePos = { x: event.clientX, y: event.clientY };
  }

  onMouseUp(event) {
    this.isMouseDown = false;
    // 检查是否为点击（鼠标按下后没有移动或移动距离很小）
    if (
      Math.abs(event.clientX - this.mousePos.x) < 5 &&
      Math.abs(event.clientY - this.mousePos.y) < 5
    ) {
      // 处理点击事件
      this.pickupObjects(event);
    }
  }

  onMouseMove(event) {
    if (this.isMouseDown) {
      // 处理拖动事件
    }
  }

  // 初始化事件
  initEvents() {
    const container = this.render.renderer.domElement;
    container.addEventListener("mousedown", this.onMouseDown.bind(this), false);
    container.addEventListener("mouseup", this.onMouseUp.bind(this), false);
    container.addEventListener("mousemove", this.onMouseMove.bind(this), false);

    // window.addEventListener("click", this.pickupObjects.bind(this), false);
  }

  // 点击事件
  pickupObjects(event) {
    const container = this.render.renderer.domElement;
    const controls = this.render.sceneController.controls;
    if (container) {
      const scW = container.clientWidth;
      const scH = container.clientHeight;
      const offsetLeft = container.offsetLeft;
      const offsetTop = container.offsetTop;

      let mouse = new THREE.Vector2();
      mouse.x = ((event.clientX - offsetLeft) / scW) * 2 - 1;
      mouse.y = -((event.clientY - offsetTop) / scH) * 2 + 1;
      //使用射线
      let raycaster = new THREE.Raycaster();

      raycaster.setFromCamera(mouse, this.render.sceneController.camera);

      let intersects = raycaster.intersectObjects(this.render.sceneController.scene.children);
      if (intersects.length > 0) {
        if (
          intersects[0].object.name.includes("Door") ||
          intersects[0].object.name.includes("Trunk")
        ) {
          let doorName = intersects[0].object.name.split("_")[0];
          let door = this.models.find((item) => item.name === doorName);
          if (door && door.outer && door.status) {
            this.setupTweenDoor(door, door.status);
          }
        }
        if (intersects[0].object.name.includes("INT")) {
          controls.autoRotate = false;
          let INT = this.models.find((item) => item.name === "INT");
          this.setupTweenCarIn(INT);
        }
      }
    }
  }

  // 开关门
  setupTweenDoor(door, status) {
    const { from, to } = door.rotateDirection[status];
    if (status == "open") {
      door.status = "close";
    }
    if (status == "close") {
      door.status = "open";
    }
    // TWEEN.removeAll()
    let lastLocation = null;
    const tweenCollection = this.tweenCollection;
    if (tweenCollection[door.name].tween) {
      lastLocation = { value: tweenCollection[door.name].from.value };
      tweenCollection[door.name].tween.stop();
    } else {
      lastLocation = { value: from.value };
    }
    tweenCollection[door.name].tween = new TWEEN.Tween(lastLocation)
      .to(to, 1000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate(function (lastLocation) {
        door.outer.rotation[door.rotateDirection.rotateAxis] = THREE.MathUtils.degToRad(
          lastLocation.value
        );
        tweenCollection[door.name].from.value = lastLocation.value;
      })
      .onComplete(() => {
        tweenCollection[door.name] = {
          tween: null,
          from: { value: null },
          to: { value: null },
        };
      })
      .start();
    console.log("setupTweenDoor");
  }

  // 进入车内
  setupTweenCarIn(model) {
    const { camera, controls } = this.render.sceneController;
    const { x: cx, y: cy, z: cz } = camera.position;
    const { x: tocx, y: tocy, z: tocz } = model.carInCameraPosition;

    setupTweenCamera(
      { cx, cy, cz, ox: 0, oy: 0, oz: 0 },
      { cx: tocx, cy: tocy, cz: tocz, ox: 0, oy: tocy, oz: 0 }
    );

    function setupTweenCamera(source, target) {
      const carTween = new TWEEN.Tween(source).to(target, 2000).easing(TWEEN.Easing.Quadratic.Out);
      carTween.onUpdate(function (that) {
        camera.position.set(that.cx, that.cy, that.cz);
        controls.target.set(that.ox, that.oy, that.oz);
      });
      carTween.start();
    }
    console.log("setupTweenCarIn");
  }

  // 注册 Tween
  registerTween() {
    this.render.registerUpdate("tween", () => {
      TWEEN.update(); // 更新 Tween
    });
  }
}
