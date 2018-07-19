import * as tf from '@tensorflow/tfjs'
import _ from 'lodash'


export default class PreTrained {

    constructor() {
        this.loadModel()
    }

    async loadModel() {
        await tf.loadModel('http://model-server.domain/download/model.json')


    }

}


