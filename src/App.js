 import Trainer from "./Trainer.js"
 import Renderer from "./Renderer.js"
 import Tsne from "./Tsne.js"

 export default class App {

    constructor({ canvas, width, height}) {

        this.trainer = new Trainer()
        this.trainer.on("PREPROCESSED", this.onTrainingPreprocessed.bind(this))
        this.trainer.on("UPDATE", this.onTrainingProgressData.bind(this))
        this.renderer = new Renderer({
            canvas: canvas,
            width: width,
            height: height
        })

        this.tsne = new Tsne()
        this.tsne.on("PROGRESS_DATA", this.onProgressData.bind(this))
    }

    async process(text) {
        await this.trainer.preprocess(text)
        this.trainer.train(true)
    }

    onTrainingPreprocessed(words) {
        this.renderer.setup(words)
    }

    onTrainingProgressData(vectors) {
        this.tsne.process(vectors)
    }

    async onProgressData(progressData) {
        this.renderer.update(progressData)
        await this.timeout()
        this.trainer.train(true)

    }

    resize({ width, height }) {
        this.renderer.resize({ width, height })
    }

    timeout() {
        return new Promise(resolve => setTimeout(resolve, 500));
    }
}




