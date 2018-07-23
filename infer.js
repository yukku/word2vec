import * as tf from '@tensorflow/tfjs'
import "@tensorflow/tfjs-node"
import Trainer from "./src/Trainer.js"
import fs from "fs"

const TRAINING_STEPS = 1
const MODEL_SYSTEM_PATH = "file:///Users/yukik/Projects/word2vec/public/my-model-1"
const MODEL_FILE_PATH = "/Users/yukik/Projects/word2vec/public/my-model-1"

export default class NodeInfer{
    constructor() {
        this.trainer = new Trainer()
        // this.train.on("PREPROCESSED", this.onTrainingPreprocessed.bind(this))
        // this.train.on("UPDATE", this.onTrainingProgressData.bind(this))
    }

    async start() {
        const corpus = await this.readSampleText("./sample.txt")
        let modelPath = null
        if (fs.existsSync(MODEL_FILE_PATH)) modelPath = MODEL_SYSTEM_PATH + "/model.json"
        await this.trainer.preprocess(corpus, modelPath)

        console.log("girl", this.trainer.findCloser("girl"))
        console.log("happiness", this.trainer.findCloser("happiness"))
        console.log("love", this.trainer.findCloser("love"))
        console.log("baby", this.trainer.findCloser("baby"))
        console.log("money", this.trainer.findCloser("money"))
        console.log("dog", this.trainer.findCloser("dog"))
    }

    readSampleText(path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf8', (err, text) => {
                if (err) reject(err);
                resolve(text)
            });
        })
    }
}


const nodeInfer = new NodeInfer()
nodeInfer.start()

