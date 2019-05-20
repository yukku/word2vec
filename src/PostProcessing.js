import * as THREE from "three";
if (!global.THREE) global.THREE = THREE;

require("./lib/three/examples/js/postprocessing/EffectComposer.js");
require("./lib/three/examples/js/postprocessing/ShaderPass.js");
require("./lib/three/examples/js/postprocessing/RenderPass.js");
require("./lib/three/examples/js/shaders/CopyShader.js");
require("./lib/three/examples/js/shaders/SepiaShader.js");

import volumetricLightFragmentShader from "./shaders/volumetricLight.frag";
import volumetricLightVertexShader from "./shaders/volumetricLight.vert";

const VolumetericLightShader = {
  uniforms: {
    tDiffuse: { type: "t", value: null },
    lightPosition: { value: new THREE.Vector2(0.5, 0.5) },
    exposure: { value: 0.28 },
    decay: { value: 0.95 },
    density: { value: 0.5 },
    weight: { value: 0.3 },
    samples: { value: 80 }
  },
  vertexShader: volumetricLightVertexShader,
  fragmentShader: volumetricLightFragmentShader
};

const AdditiveBlendingShader = {
  uniforms: {
    tDiffuse: { value: null },
    tAdd: { value: null }
  },
  vertexShader: [
    "varying vec2 vUv;",
    "void main() {",
    "vUv = uv;",
    "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    "}"
  ].join("\n"),

  fragmentShader: [
    "uniform sampler2D tDiffuse;",
    "uniform sampler2D tAdd;",
    "varying vec2 vUv;",
    "void main() {",
    "vec4 color = texture2D( tDiffuse, vUv );",
    "vec4 add = texture2D( tAdd, vUv );",
    "gl_FragColor = color + add;",
    "}"
  ].join("\n")
};

const PassThroughShader = {
  uniforms: {
    tDiffuse: { value: null }
  },

  vertexShader: [
    "varying vec2 vUv;",
    "void main() {",
    "vUv = uv;",
    "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    "}"
  ].join("\n"),

  fragmentShader: [
    "uniform sampler2D tDiffuse;",
    "varying vec2 vUv;",
    "void main() {",
    "gl_FragColor = texture2D( tDiffuse, vec2( vUv.x, vUv.y ) );",
    "}"
  ].join("\n")
};

export default class PostProcessing {
  static setupPostprocessing(renderer, scene, camera) {
    const occlusionRenderTarget = new THREE.WebGLRenderTarget(
      window.innerWidth * 0.5,
      window.innerHeight * 0.5
    );

    const occlusionComposer = new THREE.EffectComposer(
      renderer,
      occlusionRenderTarget
    );

    const scenePass = new THREE.RenderPass(scene, camera);
    occlusionComposer.addPass(scenePass);

    const pass = new THREE.ShaderPass(VolumetericLightShader);
    pass.renderToScreen = true;
    occlusionComposer.addPass(pass);

    const composer = new THREE.EffectComposer(renderer);
    composer.addPass(new THREE.RenderPass(scene, camera));
    const pass2 = new THREE.ShaderPass(AdditiveBlendingShader);
    pass2.uniforms.tAdd.value = occlusionRenderTarget.texture;
    composer.addPass(pass2);

    return { occlusionComposer, composer };
  }
}
