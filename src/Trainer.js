import * as tf from '@tensorflow/tfjs'
import _ from 'lodash'
import TSNE from 'tsne-js'
import TrainUtil from "./TrainUtil.js"
import EventEmitter from "eventemitter3"

const EMBEDDING_DIM = 2

export default class Train extends EventEmitter{

    constructor() {
        super()
    }

    async preprocess(corpus, modelPath = false) {

        const words = TrainUtil.getUniqueWords(corpus)
        const sentences = TrainUtil.getSentences(corpus)
        const {word2int, int2word} = TrainUtil.getDictionary(words)
        this.word2int = word2int
        this.int2word = int2word

        const data = TrainUtil.getTrainData(sentences)
        const xTrainData = TrainUtil.getOneHotData(data, words, word2int, 0)
        const yTrainData = TrainUtil.getOneHotData(data, words, word2int, 1)

        this.xs = tf.tensor2d(xTrainData, [data.length, words.length]);
        this.ys = tf.tensor2d(yTrainData, [data.length, words.length]);

        if(modelPath) {
            console.log("existing model loading")
            this.model = await tf.loadModel(modelPath);
            this.model.compile({loss: 'meanSquaredError', optimizer: 'adam'});
            this.emitHiddenLayer()
        }else{
            this.model = tf.sequential();
            this.model.add(tf.layers.dense({units: EMBEDDING_DIM, inputShape: [words.length]}));
            this.model.add(tf.layers.dense({units: EMBEDDING_DIM, activation: 'relu'}))
            this.model.add(tf.layers.dense({units: words.length, activation: 'sigmoid'}))
            this.model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});
        }

        this.emit("PREPROCESSED", words)
        this.emitHiddenLayer()
    }

    async train(emit = false) {

        const history =  await this.model.fit(this.xs, this.ys, {epochs: 1})
        console.log("loss", history.history.loss[0])

        if(emit) this.emitHiddenLayer()
        await tf.nextFrame()
    }

    async save(path) {
        const result = await this.model.save(path)
        console.log(result)
    }

    emitHiddenLayer() {
        this.emit("UPDATE", this.getHiddenLayerAsArray2d())
    }

    getHiddenLayerAsArray2d() {
        const vectors = this.getHiddenLayerVector()
        return TrainUtil.convertTo2dArray(vectors.dataSync(), vectors.shape)
    }

    getHiddenLayerVector() {
        return tf.add(this.model.layers[0].weights[0].val, this.model.layers[0].weights[1].val)
    }

    findClosest(word) {
        const vectors = this.getHiddenLayerVector()
        const closestIndex = TrainUtil.findClosest(this.word2int[word], vectors.shape, vectors.dataSync())
        const closestWord = this.int2word[closestIndex]
        return closestWord
    }

    findCloser(word) {
        const vectors = this.getHiddenLayerVector()
        const closerArray = TrainUtil.findCloser(this.word2int[word], vectors.shape, vectors.dataSync())
        const closestWords = closerArray.map(wordObj => {
            return this.int2word[wordObj.index]
        })
        return closestWords
    }

    timeout() {
        return new Promise(resolve => setTimeout(resolve, 60));
    }

}
