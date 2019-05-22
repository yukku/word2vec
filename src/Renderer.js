import * as THREE from "three";
if (!global.THREE) global.THREE = THREE;
import TweenLite from "gsap";
import RendererUtil from "./RendererUtil.js";
import _ from "lodash";
import EventEmitter from "eventemitter3";

import "./lib/three/examples/js/controls/OrbitControls.js";
import PostProcessing from "./PostProcessing";

import fragmentShader from "./shaders/word.frag";
import vertexShader from "./shaders/word.vert";

export default class Renderer extends EventEmitter {
  constructor({ canvas, width, height }) {
    super();
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas
      // minFilter: THREE.LinearFilter,
      // magFilter: THREE.LinearFilter,
      // // format: THREE.RGBFormat,
      // // format: THREE.RGBAFormat,
      // stencilBuffer: true,
      // depthBuffer: true
      // preserveDrawingBuffer: true,
      // alpha: false
      // antialias: true
    });
    // document.body.appendChild(this.renderer.domElement);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(2);

    this.scene = new THREE.Scene();
    const fogColor = new THREE.Color(0x000000);
    this.scene.background = fogColor;
    this.scene.fog = new THREE.Fog(fogColor, 1, 450);

    const ambientLight = new THREE.AmbientLight(0x2c3e50);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff);
    this.scene.add(pointLight);

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
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.2;
    this.controls.rotateSpeed = 0.2;

    this.render = _.throttle(this.render.bind(this), 1000 / 30);
    // this.animate = _.throttle(this.animate.bind(this), 1000 / 30);
    //
    // this.render = this.render.bind(this);
    this.animate = this.animate.bind(this);

    this.intersected = undefined;

    this.mouseDownPosition = new THREE.Vector2();

    canvas.addEventListener("mousedown", this.onMouseDown.bind(this), false);
    canvas.addEventListener("mouseup", this.onMouseUp.bind(this), false);
    // canvas.addEventListener("mousemove", this.render, false);
    canvas.addEventListener("wheel", this.render, false);
    canvas.addEventListener("touchmove", this.render, false);

    const {
      occlusionComposer,
      composer,
      pass2
    } = PostProcessing.setupPostprocessing(
      this.renderer,
      this.scene,
      this.camera
    );

    this.occlusionComposer = occlusionComposer;
    this.composer = composer;
    this.pass2 = pass2;
  }

  createCanvasTexture(text, width, height) {
    const textCtx = document.createElement("canvas").getContext("2d");
    textCtx.canvas.width = width;
    textCtx.canvas.height = height;
    textCtx.font = "40px DroidSans";
    textCtx.textAlign = "center";
    textCtx.textBaseline = "middle";
    textCtx.fillStyle = "white";
    textCtx.clearRect(0, 0, textCtx.canvas.width, textCtx.canvas.height);
    textCtx.fillText(text, width / 2, height / 2);
    const metrics = textCtx.measureText(text);
    const canvasTexture = new THREE.Texture(textCtx.canvas);
    canvasTexture.needsUpdate = true;
    return [canvasTexture, metrics];
  }

  async setup(labels) {
    const font = new FontFace("DroidSans", "url(fonts/DroidSans.ttf)");
    await font.load();
    document.fonts.add(font);

    this.meshes = labels.map((label, index) => {
      const ratio = 1024 / 64;
      const textureSize = 1024;
      const [texture, metrics] = this.createCanvasTexture(
        label,
        textureSize,
        textureSize / ratio
      );

      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(
          80 * (metrics.width / textureSize),
          80 / ratio,
          1,
          1
        ),
        new THREE.ShaderMaterial({
          transparent: true,
          side: THREE.FrontSide,
          depthTest: true,
          uniforms: {
            wordTexture: {
              type: "t",
              value: texture
            },
            textureRatio: { type: "float", value: metrics.width },
            fogNear: { type: "float", value: this.scene.fog.near },
            fogFar: { type: "float", value: this.scene.fog.far },
            fogIntensity: { type: "float", value: 1.0 },
            highlightIntensity: { type: "float", value: 1.0 }
          },
          fragmentShader: fragmentShader,
          vertexShader: vertexShader
        })
        // new THREE.MeshPhongMaterial({ color: 0x0033ff })
      );
      mesh.name = index;
      return mesh;
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
        });
      }
    });
    TweenLite.to({ test: 0 }, 1, {
      onUpdate: this.render
    });
  }

  animate() {
    this.raf = requestAnimationFrame(this.animate);
    this.render();
  }

  stopAnimate() {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = undefined;
    }
  }

  render() {
    if (!this.meshes) return;
    this.meshes.forEach((mesh, index) => {
      mesh.rotation.x = this.camera.rotation.x;
      mesh.rotation.y = this.camera.rotation.y;
      mesh.rotation.z = this.camera.rotation.z;
    });
    this.controls.update();

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.meshes);
    this.onIntersect(intersects[0]);

    // this.renderer.clear();

    // this.renderer.render(this.scene, this.camera);
    //
    // this.camera.layers.set(0);
    // this.renderer.setClearColor(0x222222);
    this.occlusionComposer.render();
    // this.camera.layers.set(1);
    // this.renderer.setClearColor(0x000000);
    // this.composer.render();
  }

  onIntersect(intersect) {
    this.intersected = intersect;
    document.body.style.cursor = intersect ? "pointer" : "default";
  }

  onMouseOver(object) {
    TweenLite.to(object.material.uniforms.highlightIntensity, 0.3, {
      value: 1.0,
      onUpdate: this.render
    });

    this.meshes.forEach((mesh, index) => {
      if (
        mesh.name !== object.name &&
        mesh.material.uniforms.highlightIntensity.value !== 0
      ) {
        TweenLite.to(mesh.material.uniforms.highlightIntensity, 0.2, {
          value: 0.0
        });
      }
    });
  }

  onMouseDown() {
    this.mouseDownPosition.x = this.mouse.x;
    this.mouseDownPosition.y = this.mouse.y;
    this.animate();
  }

  async onMouseUp() {
    if (
      this.intersected &&
      this.mouse.x === this.mouseDownPosition.x &&
      this.mouse.y === this.mouseDownPosition.y
    ) {
      this.emit("object-click", { index: this.intersected.object.name });
    }

    await new Promise((resolve, reject) => {
      setTimeout(() => resolve, 200);
    });
    this.stopAnimate();
  }

  setObjectIntensity(targets) {
    const targetIndices = targets.map(item => item[0]);
    this.meshes.forEach((mesh, index) => {
      if (targetIndices.includes(index)) {
        TweenLite.to(mesh.material.uniforms.highlightIntensity, 0.2, {
          value: targets.find(item => item[0] === index)[1],
          onUpdate: this.render
        });
      } else {
        TweenLite.to(mesh.material.uniforms.highlightIntensity, 0.2, {
          value: 0.0,
          ease: Power3.easeOut
        });
      }
      TweenLite.to(mesh.material.uniforms.fogIntensity, 0.2, {
        value: 0.0
      });
    });
  }

  resetIntensity() {
    this.meshes.forEach((mesh, index) => {
      mesh.material.uniforms.highlightIntensity.value = 1.0;
      mesh.material.uniforms.fogIntensity.value = 1.0;
    });
    this.render();
  }

  resize({ width, height }) {
    const pixelRatio = 2;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.occlusionComposer.setSize(width * pixelRatio, height * pixelRatio);
  }
}
