import * as THREE from "three";
if (!global.THREE) global.THREE = THREE;
import TweenLite from "gsap";
import RendererUtil from "./RendererUtil.js";
require("./lib/three/examples/js/controls/OrbitControls.js");

export default class Renderer {
  constructor({ canvas, width, height }) {
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      // alpha: true,
      antialias: false
    });
    // document.body.appendChild( this.renderer.domElement );
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(2);

    this.scene = new THREE.Scene();
    const fogColor = new THREE.Color(0x000000);
    this.scene.background = fogColor;
    this.scene.fog = new THREE.Fog(fogColor, 1, 300);

    this.camera = new THREE.PerspectiveCamera(70, width / height, 1, 100000);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.camera.position.z = 200;
    this.controls = new THREE.OrbitControls(this.camera);
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.1;
    this.controls.zoomSpeed = 0.5;
    this.controls.maxDistance = 550;
  }

  async setup(words) {
    const font = await RendererUtil.loadFont(
      "fonts/droid/droid_sans_regular.typeface.json"
    );

    this.meshes = words.map(word => {
      const geometry = new THREE.TextGeometry(word, {
        font: font,
        size: 1.7,
        height: 0,
        curveSegments: 1,
        bevelEnabled: false,
        bevelThickness: 0,
        bevelSize: 0,
        bevelSegments: 1
      });
      geometry.center();
      const material = new THREE.MeshPhongMaterial({
        color: 0xffffff
      });
      const mesh = new THREE.Mesh(geometry, material);

      return mesh;
    });

    this.meshes.forEach(mesh => {
      this.scene.add(mesh);
    });

    this.scene.add(new THREE.AmbientLight(0xffffff, 1));
    // this.render()
    this.animate();
  }

  update(data) {
    // console.log(data)
    const scale = 180;
    this.meshes.forEach((mesh, index) => {
      // console.log(data[index])
      if (data[index]) {
        TweenLite.to(mesh.position, 0.6, {
          x: data[index][0] * scale,
          y: data[index][1] * scale,
          z: data[index][2] * scale,
          ease: Power2.easeOut
          // onUpdate: this.render.bind(this),
          // onComplete: () => {
          //     this.endAnimateExtreme()
          // }
        });
      }

      // mesh.position.x = data[index][0] * scale
      // mesh.position.y = data[index][1] * scale
      // mesh.position.z = data[index][2] * scale
    });
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    this.meshes.forEach((mesh, index) => {
      mesh.rotation.x = this.camera.rotation.x;
      mesh.rotation.y = this.camera.rotation.y;
      mesh.rotation.z = this.camera.rotation.z;
    });
    this.controls.update();
  }

  resize({ width, height }) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}
