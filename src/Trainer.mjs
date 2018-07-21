import tf from '@tensorflow/tfjs'
import _ from 'lodash'
import TSNE from 'tsne-js'
import TrainUtil from "./TrainUtil.mjs"
import EventEmitter from "eventemitter3"

const EMBEDDING_DIM = 5

export default class Train extends EventEmitter{

    constructor() {
        super()
    }

    async preprocess(corpus, modelPath) {

        const words = TrainUtil.getUniqueWords(corpus)
        const sentences = TrainUtil.getSentences(corpus)
        const {word2int, int2word} = TrainUtil.getDictionary(words)
        const data = TrainUtil.getTrainData(sentences)
        const xTrainData = TrainUtil.getOneHotData(data, words, word2int, 0)
        const yTrainData = TrainUtil.getOneHotData(data, words, word2int, 1)

        this.xs = tf.tensor2d(xTrainData, [data.length, words.length]);
        this.ys = tf.tensor2d(yTrainData, [data.length, words.length]);

        this.emit("PREPROCESSED", words)

        if(modelPath) {
            this.model = await tf.loadModel(modelPath);
            this.model.compile({loss: 'categoricalCrossentropy', optimizer: 'adam'});
        }else{
            this.model = tf.sequential();
            this.model.add(tf.layers.dense({units: EMBEDDING_DIM, inputShape: [words.length]}));
            this.model.add(tf.layers.dense({units: words.length, activation: 'softmax'}))
            this.model.compile({loss: 'categoricalCrossentropy', optimizer: 'adam'});
        }
    }

    async train(emit = false) {

        const history =  await this.model.fit(this.xs, this.ys, {epochs: 1})
        console.log("loss", history.history.loss[0])

        if(emit) {
            const vectors = tf.add(this.model.layers[0].weights[0].val, this.model.layers[0].weights[1].val)
            this.emit("UPDATE", TrainUtil.convertTo2dArray(vectors.dataSync(), vectors.shape))
        }

        await tf.nextFrame()
    }

    async save(path) {
        const result = await this.model.save(path)
        console.log(result)
    }

    timeout() {
        return new Promise(resolve => setTimeout(resolve, 60));
    }

}