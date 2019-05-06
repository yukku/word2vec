import Renderer from "./Renderer.js";
import * as dat from "dat.gui";

const ENABLE_RENDER = true;
const GuiData = function() {
  this["word2vec-model"] = 0;
};

export default class App {
  constructor({ canvas, width, height }) {
    this.positions = [];
    this.gui = new dat.GUI({ name: "Controller" });
    this.gui.domElement.style.cssText =
      "position: absolute; top: 2px; left: 2px";
    this.guiData = new GuiData();
    this.controller = this.gui.add(this.guiData, "word2vec-model", {
      wiki: 0,
      "google-news": 1,
      gigaword: 2
    });
    this.controller.onChange(this.onModelChange.bind(this));
    this.controller.onFinishChange(this.onModelFinishChange.bind(this));

    if (!ENABLE_RENDER) return;
    this.renderer = new Renderer({
      canvas: canvas,
      width: width,
      height: height
    });
  }

  onModelChange(value) {
    if (!ENABLE_RENDER) return;
    this.renderer.update(this.positions[value]);
  }

  onModelFinishChange(value) {
    if (!ENABLE_RENDER) return;
  }

  async setLabels(labels) {
    if (!ENABLE_RENDER) return;

    await this.renderer.setup(labels);
  }

  addPosition(position) {
    if (!ENABLE_RENDER) return;
    this.positions.push(position);
  }

  async start() {
    if (!ENABLE_RENDER) return;
    this.renderer.update(this.positions[0]);
  }

  onMouseMove(x, y) {
    if (!ENABLE_RENDER) return;
    this.renderer.setMousePositions(x, y);
  }

  resize({ width, height }) {
    if (!ENABLE_RENDER) return;
    this.renderer.resize({ width, height });
  }
}
