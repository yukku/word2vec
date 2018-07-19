 import Train from "./Train.js"
 import Renderer from "./Renderer.js"
 import Tsne from "./Tsne.js"

 export default class App {

    constructor({ canvas, width, height}) {

        this.train = new Train()
        this.train.on("PREPROCESSED", this.onTrainingPreprocessed.bind(this))
        this.train.on("UPDATE", this.onTrainingProgressData.bind(this))
        this.renderer = new Renderer({
            canvas: canvas,
            width: width,
            height: height
        })

        this.tsne = new Tsne()
        this.tsne.on("PROGRESS_DATA", this.onProgressData.bind(this))
    }
    onTrainingPreprocessed(words) {
        this.renderer.setup(words)
    }

    onTrainingProgressData(vectors) {
        this.tsne.start(vectors)
    }

    onProgressData(progressData) {
        // console.log(progressData)
        // console.log(progressData)
        this.renderer.update(progressData)
    }

    async process(text) {
        this.train.setText(text)
        const {vectors, words} = await this.train.train()
    }

    resize({ width, height }) {
        this.renderer.resize({ width, height })
    }
}




