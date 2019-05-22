import Renderer from "./Renderer.js";
import * as dat from "dat.gui";
import similarity from "compute-cosine-similarity";

const ENABLE_RENDER = true;
const ENABLE_GUI = true;

export default class App {
  constructor({ canvas, width, height }) {
    this.labels = [];
    this.positions = [];
    this.weights = [];

    if (ENABLE_GUI) {
      this.gui = new dat.GUI({ name: "Controller" });
      this.gui.domElement.style.cssText =
        "position: absolute; top: 2px; left: 2px";
      this.guiData = {
        "word2vec-model": 0,
        reset: this.reset.bind(this)
      };
      this.controller = this.gui.add(this.guiData, "word2vec-model", {
        wiki: 0,
        "google-news": 1,
        gigaword: 2
      });
      this.gui.add(this.guiData, "reset");
      this.controller.onChange(this.onModelChange.bind(this));
      this.controller.onFinishChange(this.onModelFinishChange.bind(this));
    }

    if (!ENABLE_RENDER) return;
    this.renderer = new Renderer({
      canvas: canvas,
      width: width,
      height: height
    });
    this.renderer.on("object-click", this.onObjectClick.bind(this));
    this.currentDatasetIndex = 0;
    this.currentSelectedObjectIndex = undefined;
  }

  reset() {
    this.currentSelectedObjectIndex = undefined;
    this.renderer.resetIntensity();
  }

  onObjectClick({ index }) {
    if (!index) return;

    this.currentSelectedObjectIndex = index;
    const targetVec = this.weights[this.currentDatasetIndex][index];
    const dotProducts = this.weights[this.currentDatasetIndex]
      .map((vector, currentIndex) => {
        return {
          index: currentIndex,
          label: this.labels[currentIndex],
          distance: similarity(vector, targetVec)
        };
      })
      .sort((a, b) => b.distance - a.distance);

    const threshold = 0.4;

    const targetObjects = dotProducts
      .filter(item => item.distance > threshold)
      .map(item => {
        return {
          ...item,
          intensity: (item.distance - threshold) / threshold
          // intensity: item.distance
        };
      });
    console.log(
      targetObjects.filter(item => item.distance > 0.55).map(item => item.label)
    );
    this.renderer.setObjectIntensity(
      targetObjects.map(item => [item.index, item.intensity])
    );
  }

  onModelChange(value) {
    if (!ENABLE_RENDER) return;
    this.currentDatasetIndex = value;
    this.renderer.update(this.positions[this.currentDatasetIndex]);
    this.onObjectClick({ index: this.currentSelectedObjectIndex });
  }

  onModelFinishChange(value) {
    if (!ENABLE_RENDER) return;
  }

  async setLabels(labels) {
    this.labels = labels;
    // console.log(this.labels);
    if (!ENABLE_RENDER) return;
    await this.renderer.setup(labels);
  }

  addPosition(position) {
    if (!ENABLE_RENDER) return;
    this.positions.push(position);
  }

  addWeight(weight) {
    if (!ENABLE_RENDER) return;
    this.weights.push(weight);
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
