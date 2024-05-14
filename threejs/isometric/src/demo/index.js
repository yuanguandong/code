import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';

// 创建场景、相机、渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);







// 添加方向光
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(1, 1, 1);
scene.add(light);
// 创建立方体并添加到场景中
const geometry = new THREE.BoxGeometry();
const material1 = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const material2 = new THREE.MeshPhongMaterial({ color: 0x0000ff });
const cube1 = new THREE.Mesh(geometry, material1);
const cube2 = new THREE.Mesh(geometry, material2);
cube1.position.x = 1;
cube2.position.x = -1;
scene.add(cube1);
scene.add(cube2);
// 监听窗口大小变化事件
// window.addEventListener('resize', () => {
//     // 更新相机宽高比
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     // 更新渲染器尺寸
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     // 更新轮廓效果尺寸
//     outlinePass.setSize(window.innerWidth, window.innerHeight);
// });



// 创建渲染通道
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
// 创建轮廓效果
const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
outlinePass.visibleEdgeColor.set(0xff0000);
outlinePass.hiddenEdgeColor.set(0xffffff);
outlinePass.edgeStrength = 5;
outlinePass.edgeThickness = 1;



// 渲染循环
function animate() {
    requestAnimationFrame(animate);
    cube1.rotation.x += 0.01;
    cube1.rotation.y += 0.01;
    cube2.rotation.x += 0.01;
    cube2.rotation.y += 0.01;
    composer.render();
}
animate();
// 添加点击事件监听
// document.addEventListener('click', onMouseClick, false);
console.log(scene.children)
outlinePass.selectedObjects = [scene.children[1]]
composer.addPass(outlinePass);
// 点击事件处理函数
// function onMouseClick(event) {
//     event.preventDefault();
//     const mouse = new THREE.Vector2();
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//     const raycaster = new THREE.Raycaster();
//     raycaster.setFromCamera(mouse, camera);
//     const intersects = raycaster.intersectObjects(scene.children);
//     if (intersects.length > 0) {
//         const object = intersects[0].object;
//         if (!object.userData.hasOutline) {
//             object.userData.hasOutline = true;
//             const mesh = scene.children.filter(item => item.userData.hasOutline);
//             console.log('mesh',mesh)
//             outlinePass.selectedObjects = mesh
//             composer.addPass(outlinePass);
//         } else {
//             object.userData.hasOutline = false;
//             outlinePass.selectedObjects = scene.children.filter(item => item.userData.hasOutline);
//         }
//     } else {
//         outlinePass.selectedObjects = [];
//         composer.removePass(outlinePass);
//         scene.children.forEach(function(obj) {
//             obj.userData.hasOutline = false;
//         });
//     }
// }