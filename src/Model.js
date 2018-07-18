import * as tf from '@tensorflow/tfjs'

const EMBEDDING_DIM = 5
const STDEV = 0.9

export default class Model {

    constructor() {

    }

    setupNetwork(inputDim) {
        this.W1 = tf.variable(tf.randomNormal([inputDim, EMBEDDING_DIM]))
        this.b1 = tf.variable(tf.randomNormal([EMBEDDING_DIM]))
        this.W2 = tf.variable(tf.randomNormal([EMBEDDING_DIM, inputDim]))
        this.b2 = tf.variable(tf.randomNormal([inputDim]))
    }

    predict(x) {
        return tf.tidy(() => {
            const hidden_representation = tf.add(tf.matMul(x, this.W1), this.b1)
            return tf.add( tf.matMul(hidden_representation, this.W2), this.b2)
        })
    }

    getLayers() {
        return {
            W1: this.W1,
            b1: this.b1
        }
    }

}




