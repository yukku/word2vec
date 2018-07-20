import * as tf from '@tensorflow/tfjs'
import _ from 'lodash'
import TSNE from 'tsne-js'
import TrainUtil from "./TrainUtil.js"
import Model from "./Model.js"
import EventEmitter from "eventemitter3"

const TRAINING_STEPS = 10

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

        this.emit("PREPROCESSED", words)

        const EMBEDDING_DIM = 5
        this.model = tf.sequential();
        this.model.add(tf.layers.dense({units: EMBEDDING_DIM, inputShape: [words.length]}));
        this.model.add(tf.layers.dense({units: words.length}))
        this.model.compile({loss: 'meanSquaredError', optimizer: 'adam'});

        for(let i=0; i < TRAINING_STEPS; i++) {
            await this.trainOneStep(false)
        }

    }

    async trainOneStep(emit = true) {
        const history =  await this.model.fit(this.xs, this.ys, {epochs: 1})
        const vectors = tf.add(this.model.layers[0].weights[0].val, this.model.layers[0].weights[1].val)
        if(emit) this.emit("UPDATE", TrainUtil.convertTo2dArray(vectors.dataSync(), vectors.shape))
        console.log("loss", history.history.loss[0])
        await tf.nextFrame()
        // await this.timeout()

    }

}
