import Renderer from "./Renderer.js";

const ENABLE_RENDER = true;

export default class App {
  constructor({ canvas, width, height }) {
    if (ENABLE_RENDER) {
      this.renderer = new Renderer({
        canvas: canvas,
        width: width,
        height: height
      });
    }
  }

  async process(dataset) {
    await this.renderer.setup(dataset.map(item => item.label));
    this.renderer.update(dataset.map(item => item.weight));
  }

  resize({ width, height }) {
    if (ENABLE_RENDER) this.renderer.resize({ width, height });
  }

}
