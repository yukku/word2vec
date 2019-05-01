import Model from "./Model.js";
import Renderer from "./Renderer.js";
import Tsne from "./Tsne.js";

const ENABLE_RENDER = true;

export default class App {
  constructor({ canvas, width, height }) {
    // this.model = new Model()
    // this.model.on("PREPROCESSED", this.onTrainingPreprocessed.bind(this))
    // this.model.on("UPDATE", this.onTrainingProgressData.bind(this))
    //
    if (ENABLE_RENDER) {
      this.renderer = new Renderer({
        canvas: canvas,
        width: width,
        height: height
      });
    }

    this.tsne = new Tsne();
    this.tsne.on("PROGRESS_DATA", this.onProgressData.bind(this));
  }

  async process(dataset) {
    this.renderer.setup(dataset.map(item => item.label));
    this.tsne.process(dataset.map(item => item.weight));

    // await this.model.preprocess(text, "http://localhost:4000/my-model-1/model.json")
    // await this.model.preprocess( words, modelPath)
    // await this.model.preprocess(modelPath, words)
    // this.model.train()
  }

  /* onTrainingPreprocessed(words) {
        if(ENABLE_RENDER) {
          // this.renderer.setup(words);
          const capped = words.splice(0, 400)
          this.renderer.setup(capped)
        }
    }

    onTrainingProgressData(vectors) {
        // const capped = vectors.splice(0, 100)
        // console.log(capped)
        // this.tsne.process(capped)
        this.tsne.process(vectors)
    } 

    async onProgressData(progressData) {
        if(ENABLE_RENDER) this.renderer.update(progressData)
        await this.timeout()
        // this.model.train(true)
    }
    */

  async onProgressData(progressData) {
    if (ENABLE_RENDER) this.renderer.update(progressData);
    // await this.timeout()
  }

  resize({ width, height }) {
    if (ENABLE_RENDER) this.renderer.resize({ width, height });
  }

  timeout() {
    return new Promise(resolve => setTimeout(resolve, 5500));
  }
}
