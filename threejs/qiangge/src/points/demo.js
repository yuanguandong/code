import * as THREE from "three";

export class Demo {

  constructor(render,scene) {
    this.render = render;
    this.scene = scene;
    this.init();
  }

  init(){
    const geometry = new THREE.BufferGeometry();
    const vertices = []
    for(let i =0; i<1000; i++){
      const x = 2000 * Math.random() - 1000
      const y = 2000 * Math.random() - 1000
      const z = 2000 * Math.random() - 1000
      vertices.push(x,y,z)
    }
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices,3)
    )

    const texture = new THREE.TextureLoader().load('textures/sprites/ball.png')
    const material = new THREE.PointsMaterial({
      size:50,
      map:texture,
      alphaTest:0.5,
      transparent:true
    })

    const particles = new THREE.Points(geometry, material)
    this.scene.add(particles)
  }


  
}
