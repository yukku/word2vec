import * as THREE from "three";
if (!global.THREE) global.THREE = THREE;
import TweenLite from "gsap";
import RendererUtil from "./RendererUtil.js";

require("./lib/three/examples/js/controls/OrbitControls.js");

import fragmentShader from "./shaders/word.frag";
import vertexShader from "./shaders/word.vert";

export default class Renderer {
  constructor({ canvas, width, height }) {
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      // alpha: true,
      antialias: true
    });
    // document.body.appendChild( this.renderer.domElement );
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(2);

    this.scene = new THREE.Scene();
    const fogColor = new THREE.Color(0x000000);
    this.scene.background = fogColor;
    this.scene.fog = new THREE.Fog(fogColor, 1, 500);

    this.camera = new THREE.PerspectiveCamera(70, width / height, 1, 100000);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.camera.position.z = 200;
    this.controls = new THREE.OrbitControls(
      this.camera,
      this.renderer.domElement
    );

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.mouse.x = 999;
    this.mouse.y = 999;
    // this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.1;
    this.controls.zoomSpeed = 0.5;
    this.controls.maxDistance = 360;

    this.render = this.render.bind(this);

    // canvas.addEventListener("mousemove", this.render, false);
    // canvas.addEventListener("wheel", this.render, false);
  }

  createCanvasTexture(text, width, height) {
    const textCtx = document.createElement("canvas").getContext("2d");
    textCtx.canvas.width = width;
    textCtx.canvas.height = height;
    textCtx.font = "60px DroidSans";
    textCtx.textAlign = "center";
    textCtx.textBaseline = "middle";
    textCtx.fillStyle = "white";
    textCtx.clearRect(0, 0, textCtx.canvas.width, textCtx.canvas.height);
    textCtx.fillText(text, width / 2, height / 2);

    const metrics = textCtx.measureText(text);
    // console.log(metrics);
    const canvasTexture = new THREE.Texture(textCtx.canvas);
    canvasTexture.needsUpdate = true;

    return canvasTexture;
  }

  async setup(labels) {
    const font = new FontFace("DroidSans", "url(fonts/DroidSans.ttf)");
    await font.load();
    document.fonts.add(font);

    this.meshes = labels.map(label => {
      const ratio = 1024 / 64;
      const textureSize = 1024;
      return new THREE.Mesh(
        new THREE.PlaneGeometry(60, 60 / ratio, 1, 1),
        new THREE.ShaderMaterial({
          transparent: true,
          // color: 0xffffff,
          side: THREE.FrontSide,
          // blendEquation: THREE.SubtractEquation,
          // blending: THREE.CustomBlending,
          // blendSrc: THREE.OneFactor,
          // blendDst: THREE.OneFactor,
          depthTest: true,
          uniforms: {
            wordTexture: {
              type: "t",
              value: this.createCanvasTexture(
                label,
                textureSize,
                textureSize / ratio
              )
            },
            fogNear: { type: "f", value: this.scene.fog.near },
            fogFar: { type: "f", value: this.scene.fog.far }
          },
          fragmentShader: fragmentShader,
          vertexShader: vertexShader
        })
        // new THREE.MeshPhongMaterial({
        //   map: this.createCanvasTexture(label, textureSize, textureSize / ratio)
        // })
      );
      //       const group = new THREE.Group();
      //
      //       const geometry = new THREE.TextGeometry(label, {
      //         font: font,
      //         size: 1.7,
      //         height: 0,
      //         curveSegments: 1,
      //         bevelEnabled: false,
      //         bevelThickness: 0,
      //         bevelSize: 0,
      //         bevelSegments: 1
      //       });
      //       geometry.center();
      //
      //
      //       const material = new THREE.MeshPhongMaterial({
      //         color: 0xffffff
      //       });
      //       const typo = new THREE.Mesh(geometry, material);
      //
      //       group.add(typo);
      //
      //       return typo;
    });

    this.meshes.forEach(mesh => {
      this.scene.add(mesh);
    });

    this.scene.add(new THREE.AmbientLight(0xffffff, 1));
    this.animate();
  }

  setMousePositions(x, y) {
    this.mouse.x = x;
    this.mouse.y = y;
  }

  update(data) {
    const scale = 10;
    this.meshes.forEach((mesh, index) => {
      if (data[index]) {
        TweenLite.to(mesh.position, 1, {
          x: data[index][0] * scale,
          y: data[index][1] * scale,
          z: data[index][2] * scale,
          ease: Power2.easeInOut
          // onUpdate: this.render
          // onComplete: () => {
          //     this.endAnimateExtreme()
          // }
        });
      }
    });
    TweenLite.to({ test: 0 }, 1, {
      onUpdate: this.render
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

    // this.raycaster.setFromCamera(this.mouse, this.camera);
    // const intersects = this.raycaster.intersectObjects(this.scene.children);
    // for (let i = 0; i < intersects.length; i++) {
    //   intersects[i].object.material.color.set(0xff0000);
    // }
  }

  resize({ width, height }) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}
