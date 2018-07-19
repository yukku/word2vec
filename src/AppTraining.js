 import Train from "./Train.js"
 import Renderer from "./Renderer.js"
 import Tsne from "./Tsne.js"

 export default class App {

    constructor({ canvas, width, height}) {

        this.train = new Train()

        this.renderer = new Renderer({
            canvas: canvas,
            width: width,
            height: height
        })

        this.tsne = new Tsne()
        this.tsne.on("PROGRESS_DATA", this.onProgressData.bind(this))
    }

    onProgressData(progressData) {
        this.renderer.update(progressData)
    }

    process(text) {
        this.train.setText(text)
        const {vectors, words} = this.train.train()
        this.tsne.start(vectors)
        this.renderer.setup(words)
    }

    resize({ width, height }) {
        this.renderer.resize({ width, height })
    }
}




