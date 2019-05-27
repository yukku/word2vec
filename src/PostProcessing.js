import * as THREE from "three";
if (!global.THREE) global.THREE = THREE;

require("./lib/three/examples/js/postprocessing/EffectComposer.js");
require("./lib/three/examples/js/postprocessing/ShaderPass.js");
require("./lib/three/examples/js/postprocessing/RenderPass.js");
require("./lib/three/examples/js/postprocessing/SavePass.js");
require("./lib/three/examples/js/shaders/CopyShader.js");
require("./lib/three/examples/js/shaders/SepiaShader.js");
require("./lib/three/examples/js/shaders/BrightnessContrastShader.js");
require("./lib/three/examples/js/extras/shaders.js");

import "./lib/three/examples/js/shaders/HorizontalBlurShader.js";
import "./lib/three/examples/js/shaders/VerticalBlurShader.js";
import godraysFragmentShader from "./shaders/godrays.frag";
import godraysVertexShader from "./shaders/godrays.vert";

const GodraysShader = {
  uniforms: {
    tDiffuse: { type: "t", value: 0, texture: null },
    fX: { type: "f", value: 0.5 },
    fY: { type: "f", value: 0.5 },
    fExposure: { type: "f", value: 0.6 },
    fDecay: { type: "f", value: 0.93 },
    fDensity: { type: "f", value: 0.96 },
    fWeight: { type: "f", value: 0.4 },
    fClamp: { type: "f", value: 1.0 }
  },
  vertexShader: godraysVertexShader,
  fragmentShader: godraysFragmentShader
};

export default class PostProcessing {
  static setupPostprocessing(renderer, scene, camera) {
    var W = window.innerWidth;
    var H = window.innerHeight;
    var renderTargetParameters = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat,
      stencilBuffer: true
    };

    var renderTargetOcl = new THREE.WebGLRenderTarget(
      W,
      H,
      renderTargetParameters
    );

    var bluriness = 2;
    var hblur = new THREE.ShaderPass(THREE.HorizontalBlurShader);
    var vblur = new THREE.ShaderPass(THREE.VerticalBlurShader);
    hblur.uniforms.h.value = bluriness / W;
    vblur.uniforms.v.value = bluriness / H;

    var brightnessContrastShader = new THREE.ShaderPass(
      THREE.BrightnessContrastShader
    );
    brightnessContrastShader.uniforms.brightness.value = 0.06;
    brightnessContrastShader.uniforms.contrast.value = 0.3;

    var renderModel = new THREE.RenderPass(scene, camera);
    var renderModel2 = new THREE.RenderPass(scene, camera);

    var grPass = new THREE.ShaderPass(GodraysShader);

    grPass.uniforms["fClamp"].value = 1;
    grPass.uniforms["fDecay"].value = 0.63;
    grPass.uniforms["fDensity"].value = 0.96;
    grPass.uniforms["fExposure"].value = 0.6;
    grPass.uniforms["fWeight"].value = 0.4;
    grPass.uniforms["fX"].value = 0.5;
    grPass.uniforms["fY"].value = 1.4;

    grPass.needsSwap = true;
    grPass.renderToScreen = false;

    var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
    effectCopy.renderToScreen = true;

    var effectSave2 = new THREE.SavePass(
      new THREE.WebGLRenderTarget(W, H, renderTargetParameters)
    );

    var occlusionComposer = new THREE.EffectComposer(renderer, renderTargetOcl);

    // render the occlude scene
    // occlusionComposer.addPass( renderModelOcl );

    // remove color to leaver alpha only
    var effectSave1 = new THREE.SavePass(
      new THREE.WebGLRenderTarget(W, H, renderTargetParameters)
    );
    //occlusionComposer.addPass( effectSave1 );
    var removecolorPass = new THREE.ShaderPass(THREE.Extras.Shaders.Alpha);
    removecolorPass.uniforms["tAdd"].value = effectSave1.renderTarget;
    removecolorPass.needsSwap = true;
    occlusionComposer.addPass(removecolorPass);
    occlusionComposer.addPass(renderModel);
    // blur,blur,blur,blur, godrays
    occlusionComposer.addPass(hblur);
    occlusionComposer.addPass(vblur);
    // occlusionComposer.addPass(hblur);
    // occlusionComposer.addPass(vblur);

    // occlusionComposer.addPass(brightnessContrastShader);
    // occlusionComposer.addPass(grPass);

    // save god rays
    occlusionComposer.addPass(effectSave2);

    // render the actual scene
    occlusionComposer.addPass(renderModel2);

    // final pass to add godrays
    var finalPass = new THREE.ShaderPass(THREE.Extras.Shaders.Additive);
    finalPass.uniforms["tAdd"].value = effectSave2.renderTarget;
    finalPass.needsSwap = true;
    finalPass.renderToScreen = true;
    occlusionComposer.addPass(finalPass);

    return { occlusionComposer };
  }
}
