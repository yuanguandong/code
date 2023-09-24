import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { Action } from "./action";

export class Person {
  resourceUrl =
    "/resources-api/code/threejs/qiangge/static/models/gltf/RobotExpressive/RobotExpressive.glb";

  clips;

  mixer;

  face;

  model;

  actions = {};

  activeAction;

  activeActionObject = { state: "Idle" };

  actionController;

  constructor(render) {
    this.render = render;
    this.initMeshs();
    this.actionController = new Action(render, { person: this });
  }

  initMeshs() {
    const me = this;
    const loader = new GLTFLoader();
    loader.load(this.resourceUrl, function (gltf) {
      const model = gltf.scene;
      me.model = model;
      me.render.sceneController.scene.add(model);
      me.actionController.initTween();

      // 动画
      me.clips = gltf.animations;
      me.mixer = new THREE.AnimationMixer(model);
      me.face = model.getObjectByName("Head_4");

      me.render.registerUpdate("mixer", (delta) => {
        me.mixer?.update(delta);
      });
      me.initGUI();
    });
  }

  initGUI() {
    const me = this;
    let gui = new GUI();
    const actionNames = [];
    const loopMany = ["Walking", "Running", "Idle", "Dance"];
    for (let i = 0; i < me.clips.length; i++) {
      const clip = me.clips[i];
      const action = me.mixer.clipAction(clip);
      me.actions[clip.name] = action;
      if (!loopMany.includes(clip.name)) {
        action.loop = THREE.LoopOnce;
        action.clampWhenFinished = true;
      }
      actionNames.push(clip.name);
    }

    me.activeAction = me.actions[me.activeActionObject.state].play();

    const clipFolder = gui.addFolder("动画");
    clipFolder
      .add(me.activeActionObject, "state")
      .options(actionNames)
      .onChange(function () {
        const nextActionName = me.activeActionObject.state;
        me.fadeToAction(nextActionName, 0.5);
      });

    // 动作穿插
    const states = ["Idle", "Walking", "Running", "Dance", "Death", "Setting", "Standing"];
    const complexFolder = gui.addFolder("穿插");
    complexFolder
      .add(me.activeActionObject, "state")
      .options(states)
      .onChange(function () {
        const nextActionName = me.activeActionObject.state;
        me.fadeToAction(nextActionName, 0.5);
      });

    const emotes = ["Jump", "Yes", "No", "Wave", "Punch", "ThumbsUp"];
    const api = {};
    for (let i = 0; i < emotes.length; i++) {
      const name = emotes[i];
      api[name] = function () {
        me.fadeToAction(name, 0.2);
        me.mixer.addEventListener("finished", restoresState);
      };
      complexFolder.add(api, name);
    }
    function restoresState() {
      me.mixer.removeEventListener("finished", restoresState);
      me.fadeToAction(me.activeActionObject.state, 0.2);
    }

    const morphFolder = gui.addFolder("变形");
    const morphNames = Object.keys(me.face.morphTargetDictionary);

    for (let i = 0; i < morphNames.length; i++) {
      morphFolder.add(me.face.morphTargetInfluences, i, 0, 1, 0.01).name(morphNames[i]);
    }
  }

  fadeToAction(name, duration, fadeOut = true) {
    const previousAction = this.activeAction;
    this.activeAction = this.actions[name];
    if (previousAction === this.activeAction) {
      return;
    }
    if (fadeOut) {
      previousAction.fadeOut(duration);
    }
    this.activeAction.reset().fadeIn(duration).play();
  }
}
