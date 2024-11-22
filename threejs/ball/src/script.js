import "./style.css";
import * as THREE from "three";
import {
  initControls,
  initCamera,
  initResize,
  initRenderer,
  initTick,
  initLights,
  initGUI,
} from "../utils/utils";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";
// import * as THREE from "three/examples/js/utils/SceneUtils.js";



var container;
var camera, scene, renderer;
var mesh,group1, group2, group3, light;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {
    container = document.getElementById('icosahedron');

    camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 2000;

    scene = new THREE.Scene();

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 1);
    scene.add(light);

    var faceIndices = ['a', 'b', 'c', 'd'];
    var color, f, f2, f3, p, n, vertexIndex, 

    radius = 200,
    geometry = new THREE.IcosahedronGeometry(radius, 1);

    var materials = [
        new THREE.MeshLambertMaterial({
            color: 0x000000,
            shading: THREE.FlatShading,
            vertexColors: THREE.VertexColors
        }),
        new THREE.MeshBasicMaterial({
            color: 0xffffff,
            shading: THREE.FlatShading,
            wireframe: true,
            transparent: true
        })
    ];
    console.log('THREE.SceneUtils',THREE.SceneUtils)
    console.log('geometry',geometry)
    console.log('materials',materials)
    let group = THREE.SceneUtils.createMultiMaterialObject(geometry, materials);
    
    // group.position.x = 0;
    // group.rotation.x = 0;
    scene.add(group);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}