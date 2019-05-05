import Renderer from "./Renderer.js";
import * as dat from 'dat.gui';

const ENABLE_RENDER = true;
const GuiData = function() {
  this["word2vec-model"] = 0;
};

export default class App {
  constructor({ canvas, width, height }) {
    this.weights = [];
    this.gui = new dat.GUI({name: 'Controller'});    
    this.gui.domElement.style.cssText = "position: absolute; top: 2px; left: 2px"
    this.guiData = new GuiData();
    this.controller = this.gui.add(this.guiData, "word2vec-model", { "wiki": 0, "google-news" : 1, "gigaword" : 2} );
    this.controller.onChange(this.onModelChange.bind(this))
    this.controller.onFinishChange(this.onModelFinishChange.bind(this))

    if (!ENABLE_RENDER) return;
    this.renderer = new Renderer({
      canvas: canvas,
      width: width,
      height: height
    });
    
  }

  onModelChange(value) {
    this.renderer.update(this.weights[value]);
  }

  onModelFinishChange(value) {

  }

  async setLabels(labels) {
    if (!ENABLE_RENDER) return;
    await this.renderer.setup(labels);
  }
  
  addWeight(weight) {
    if (!ENABLE_RENDER) return;
    this.weights.push(weight)
  }

  async start() {
    if (!ENABLE_RENDER) return;
    this.renderer.update(this.weights[0]);
  }

  resize({ width, height }) {
    if (ENABLE_RENDER) this.renderer.resize({ width, height });
  }

}
