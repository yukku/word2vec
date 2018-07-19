import * as tf from '@tensorflow/tfjs'
import _ from 'lodash'
import TSNE from 'tsne-js'
import TrainUtil from "./TrainUtil.js"
import Model from "./Model.js"
import EventEmitter from "eventemitter3"

const TRAINING_STEPS = 500

export default class Train extends EventEmitter{

    constructor() {
        super()

        this.model = new Model()
        this.corpus = ""
    }

    setText(corpus) {
        this.corpus = corpus
    }

    async preprocess() {

        const words = TrainUtil.getUniqueWords(this.corpus)
        const sentences = TrainUtil.getSentences(this.corpus)
        const {word2int, int2word} = TrainUtil.getDictionary(words)
        const data = TrainUtil.getTrainData(sentences)
        const xTrainData = TrainUtil.getOneHotData(data, words, word2int, 0)
        const yTrainData = TrainUtil.getOneHotData(data, words, word2int, 1)

        this.model.setupNetwork(words.length)

        this.xs = tf.tensor2d(xTrainData, [data.length, words.length]);
        this.ys = tf.tensor2d(yTrainData, [data.length, words.length]);

        // const loss = (pred, label) => pred.sub(label).square().mean();
        this.loss = (pred, label) => tf.losses.softmaxCrossEntropy(label, pred).mean();

        this.emit("PREPROCESSED", words)

        // this.optimizer = tf.train.sgd(0.01);
        this.optimizer = tf.train.adam();


        for(let i=0; i < TRAINING_STEPS; i++) {
            await this.trainOneStep(false)
        }
        // const loss = (pred, label) => tf.softmax(label);
        // const optimizer = tf.train.sgd(1.0);

        // const {W1, b1} = this.model.getLayers()
        // const vectors = tf.add(W1, b1)

        // const closestIndex = TrainUtil.findClosest(word2int['king'], vectors.shape, vectors.dataSync())
        // // console.log(closestIndex)
        // const closest = int2word[closestIndex]
        // console.log(closest)

        // return {
        //     vectors: TrainUtil.convertTo2dArray(vectors.dataSync(), vectors.shape),
        //     words: words
        // }
    }

    async trainOneStep(emit = true) {

        this.optimizer.minimize(() => {
            const result = this.loss(this.model.predict(this.xs), this.ys)

            const {W1, b1} = this.model.getLayers()
            const vectors = tf.add(W1, b1)

            if(emit) this.emit("UPDATE", TrainUtil.convertTo2dArray(vectors.dataSync(), vectors.shape))

            console.log("loss", result.dataSync()[0])
            return result
        });
        await tf.nextFrame()
        // await this.timeout()

    }



    timeout() {
        return new Promise(resolve => setTimeout(resolve, 1500));
    }
}



// Initialize the tsne optimizer

