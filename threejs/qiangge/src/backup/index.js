import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

let material, controls, ground, scene, object, spotLight, dirLight, camera, renderer;
let geometryPlane, materialPlane, plane;
let clock = new THREE.Clock();
let actions = {};
let activeAction;
let actionNames = [];
let activeActionObject = { state: "Idle" };
let mixer;
let clips;
let face;
let model;
let moveState;

initScene();
initAxesHelper();
initMeshs();
initLight();
initCamera();
initRenderer();
initControls();

animate();
initMovement();

window.addEventListener("resize", onWindowResize);

function initRenderer() {
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);
}

function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe0e0e0);
  // scene.fog = new THREE.Fog(0xe0e0e0, 20, 100);
}

function initAxesHelper() {
  const axesHelper = new THREE.AxesHelper(2);
  scene.add(axesHelper);
}

function initMeshs() {
  // ground
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(2000, 2000),
    new THREE.MeshPhongMaterial({
      color: 0x999999,
    })
  );
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  const grid = new THREE.GridHelper(100, 40, 0, 0);
  scene.add(grid);

  const loader = new GLTFLoader();
  loader.load("models/gltf/RobotExpressive/RobotExpressive.glb", function (gltf) {
    model = gltf.scene;
    scene.add(model);

    // 动画
    clips = gltf.animations;
    mixer = new THREE.AnimationMixer(model);
    face = model.getObjectByName("Head_4");
    initGUI(model, clips, face);

    animate();
  });
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 100);
  camera.position.set(-5, 3, 10);
  camera.lookAt(new THREE.Vector3(0, 2, 0));
}

function initGUI() {
  let gui = new GUI();
  const actionNames = [];
  const loopMany = ["Walking", "Running", "Idle", "Dance"];
  for (let i = 0; i < clips.length; i++) {
    const clip = clips[i];
    const action = mixer.clipAction(clip);
    actions[clip.name] = action;
    if (!loopMany.includes(clip.name)) {
      action.loop = THREE.LoopOnce;
      action.clampWhenFinished = true;
    }
    actionNames.push(clip.name);
  }
  console.log(actions);
  console.log(actionNames);

  activeAction = actions[activeActionObject.state].play();

  const clipFolder = gui.addFolder("动画");
  clipFolder
    .add(activeActionObject, "state")
    .options(actionNames)
    .onChange(function () {
      const nextActionName = activeActionObject.state;
      console.log("nextActionName", nextActionName);
      fadeToAction(nextActionName, 0.5);
    });

  // 动作穿插
  const states = ["Idle", "Walking", "Running", "Dance", "Death", "Setting", "Standing"];
  const complexFolder = gui.addFolder("穿插");
  complexFolder
    .add(activeActionObject, "state")
    .options(states)
    .onChange(function () {
      const nextActionName = activeActionObject.state;
      fadeToAction(nextActionName, 0.5);
    });

  const emotes = ["Jump", "Yes", "No", "Wave", "Punch", "ThumbsUp"];
  const api = {};
  for (let i = 0; i < emotes.length; i++) {
    const name = emotes[i];
    api[name] = function () {
      fadeToAction(name, 0.2);
      mixer.addEventListener("finished", restoresState);
    };
    complexFolder.add(api, name);
  }
  function restoresState() {
    mixer.removeEventListener("finished", restoresState);
    fadeToAction(activeActionObject.state, 0.2);
  }

  const morphFolder = gui.addFolder("变形");
  const morphNames = Object.keys(face.morphTargetDictionary);
  console.log("morphNames", morphNames);
  for (let i = 0; i < morphNames.length; i++) {
    morphFolder.add(face.morphTargetInfluences, i, 0, 1, 0.01).name(morphNames[i]);
  }
}

function fadeToAction(name, duration) {
  const previousAction = activeAction;
  activeAction = actions[name];
  if (previousAction === activeAction) {
    return;
  }
  previousAction.fadeOut(duration);
  activeAction.reset().fadeIn(duration).play();
}

function initLight() {
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);
  dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(0, 30, 10);
  scene.add(dirLight);
}

function initControls() {
  controls = new OrbitControls(camera, renderer.domElement);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  const delta = clock.getDelta();
  mixer?.update(delta);
  requestAnimationFrame(animate);
  render();
}

function render() {
  const delta = clock.getDelta();
  const time = clock.getElapsedTime() * 10;

  renderer.render(scene, camera);
}

// 移动控制器
function initMovement() {
  document.addEventListener("keydown", keyMove);
  document.addEventListener("keyup", keyUp);

  // 步长
  const step = 0.1;

  function keyUp(ev) {
    if (moveState !== "jump") {
      moveState = "stand";
    }
    fadeToAction("Idle", 0.5);
  }
  // 键盘监听
  function keyMove(ev) {
    if (moveState === "jump") return;
    switch (ev.keyCode) {
      case 65:
        moveState = "left";
        moveBox();
        break;
      case 87:
        moveState = "forward";
        moveBox();
        break;
      case 68:
        moveState = "right";
        moveBox();
        break;
      case 83:
        moveState = "back";
        moveBox();
        break;
      case 32:
        moveState = "jump";
        jump();
      default:
        return;
    }
  }

  // 跳跃
  function jump() {
    fadeToAction("Jump", 0);
    // 跳跃的最大高度
    const max = 3;
    // 初始高度
    const initY = model.position.y;
    // 是否在下坠
    let down = false;
    // 递增和递减系数
    let t = 1;
    const x = 0.01;
    // 跳跃
    let interval = setInterval(() => {
      const downNumber = down ? -1 : 1;
      model.position.y += 0.2 * downNumber * t;
      camera.position.y += 0.2 * downNumber * t;
      t += downNumber * x;
      // 到最高点开始下坠
      if (model.position.y >= max) {
        down = true;
      }
      // 到最低点结束跳跃
      if (model.position.y <= initY && down) {
        model.position.y = initY;
        moveState = "stand";
        clearInterval(interval);
        fadeToAction("Idle", 0.5);
      }
      setControl(...model.position);
    }, 30);
  }

  // 移动物体
  function moveBox() {
    fadeToAction("Walking", 0.5);
    // 获取人物中心点和相机中心点
    const p1 = model.position;
    const p2 = camera.position;
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
    switch (moveState) {
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
      const temp = (dir * step * v[key]) / length;
      model.position[key] += temp;
      camera.position[key] += temp;
    }
    setControl(...model.position);
  }
  // 设置相机位置
  function setControl(x, y, z) {
    rotateModel();
    controls.target.set(x, y, z);
    controls.update();
  }
  // 选择人物方向
  function rotateModel() {
    // 获取人物中心点和相机中心点
    const p1 = model.position;
    const p2 = camera.position;
    // 计算两者连接形成的向量
    const v1 = p1.clone().sub(p2);
    v1.y = 0;
    // 人物的初始面向
    const origin = new THREE.Vector3(0, 0, 1);
    // 点乘求夹角
    const radian = Math.acos(v1.dot(origin) / (v1.length() * origin.length()));
    // 叉乘求方向
    v1.cross(origin);
    model.rotation.y = radian * (v1.z === 0 && 1 / v1.z < 0 ? -1 : 1);
  }
}
