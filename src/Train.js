import * as tf from '@tensorflow/tfjs'
import _ from 'lodash'
import TSNE from 'tsne-js'
import TrainUtil from "./TrainUtil.js"
import Model from "./Model.js"

const TRAINING_STEPS = 500

export default class Train {

    constructor() {
        this.model = new Model()
        this.corpus = ""
    }

    setText(corpus) {
        this.corpus = corpus
    }

    train() {

        const words = TrainUtil.getUniqueWords(this.corpus)
        const sentences = TrainUtil.getSentences(this.corpus)
        const {word2int, int2word} = TrainUtil.getDictionary(words)
        const data = TrainUtil.getTrainData(sentences)
        const xTrainData = TrainUtil.getOneHotData(data, words, word2int, 0)
        const yTrainData = TrainUtil.getOneHotData(data, words, word2int, 1)

        this.model.setupNetwork(words.length)

        const xs = tf.tensor2d(xTrainData, [data.length, words.length]);
        const ys = tf.tensor2d(yTrainData, [data.length, words.length]);

        // const loss = (pred, label) => pred.sub(label).square().mean();
        const loss = (pred, label) => tf.losses.softmaxCrossEntropy(label, pred).mean();



        // const loss = (pred, label) => tf.softmax(label);
        // const optimizer = tf.train.sgd(1.0);
        const optimizer = tf.train.adam(1.2);

        for (let i = 0; i < TRAINING_STEPS; i++) {
            optimizer.minimize(() => {
                const result = loss(this.model.predict(xs), ys)
                console.log(result.dataSync()[0])
                return result
            });
        }

        const {W1, b1} = this.model.getLayers()
        const vectors = tf.add(W1, b1)

        // const closestIndex = TrainUtil.findClosest(word2int['king'], vectors.shape, vectors.dataSync())
        // // console.log(closestIndex)
        // const closest = int2word[closestIndex]
        // console.log(closest)

        return {
            vectors: TrainUtil.convertTo2dArray(vectors.dataSync(), vectors.shape),
            words: words
        }
    }
}



// Initialize the tsne optimizer

