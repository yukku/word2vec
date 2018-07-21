import tf from '@tensorflow/tfjs'
import "@tensorflow/tfjs-node"
import Trainer from "./src/Trainer.mjs"
import fs from "fs"

const TRAINING_STEPS = 1
const MODEL_SYSTEM_PATH = "file:///Users/yukik/Projects/word2vec/public/my-model-1"
const MODEL_FILE_PATH = "/Users/yukik/Projects/word2vec/public/my-model-1"

export default class NodeTrain{
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

        for(let i=0; i < TRAINING_STEPS; i++) {
            console.log("training steps", i)
            await this.trainer.train()
        }

        this.trainer.save(MODEL_SYSTEM_PATH)
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


const nodeTrain = new NodeTrain()
nodeTrain.start()

