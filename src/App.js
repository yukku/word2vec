import * as tf from '@tensorflow/tfjs'
import euclideanDistance from 'euclidean-distance'
import _ from 'lodash'
import * as tsne from '@tensorflow/tfjs-tsne';

const corpus = "He is the king . The king is royal . She is the royal  queen "

export default class App {

    toOneHot(dataPointIndex, vocabSize) {
        const oneHot = new Uint8Array(vocabSize)
        oneHot[dataPointIndex] = 1
        return oneHot
    }

    findClosest(wordIndex, shape, vectors) {
        let minDist = 10000
        let minIndex = -1
        const queryVector = vectors.slice(wordIndex*shape[1], wordIndex*shape[1] + shape[1])
        for(var i=0; i<shape[0]; i++) {
            const vector = vectors.slice(i*shape[1], i*shape[1] + shape[1])
            const distance = euclideanDistance(vector, queryVector)
            if(distance < minDist && !_.isEqual(vector.sort(), queryVector.sort())) {
                minDist = distance
                minIndex = i
            }
        }
        return minIndex
    }

    constructor() {

        const corpus_raw = corpus.toLowerCase()

        const words = corpus_raw
            .split(" ")
            .reduce((accu, curr) => {
                if(curr != "." & curr != "") accu.push(curr)
                return accu
            }, [])
            .filter(function(elem, pos,arr) {
                return arr.indexOf(elem) == pos;
              })

            // console.log(words)
        const word2int = {}
        const int2word = {}
        for(var i=0; i < words.length; i++) {
            word2int[words[i]] = i
            int2word[i] = words[i]
        }
        // console.log(word2int['queen'])
        const sentences = []
        const rowSentences = corpus_raw.split(".")

        for(var ss=0; ss < rowSentences.length; ss++) {
            const word = rowSentences[ss]
                .split(" ")
                .reduce((accu, curr) => {
                if(curr != "." & curr != "") accu.push(curr)
                return accu
            }, [])

            sentences.push(word)
        }
        // console.log(sentences)
        const data = []
        const WINDOW_SIZE = 2

        for(var j=0; j < sentences.length; j++) {
            for(var k=0; k < sentences[j].length; k++) {

                const startInt = Math.max(k - WINDOW_SIZE, 0)
                const endInt = Math.min(k + WINDOW_SIZE, sentences[j].length) + 1
                for(var s=startInt; s < endInt; s++) {
                    if(sentences[j][k] != sentences[j][s] && sentences[j][s] != undefined) {
                        data.push([sentences[j][k], sentences[j][s]])
                    }

                }

            }
        }

        const xTrain = new Uint8Array(data.length * words.length);
        const yTrain = new Uint8Array(data.length * words.length);

        for(var l=0; l < data.length; l++) {
             // console.log(word2int[ data[l][0]])
            xTrain.set(this.toOneHot(word2int[ data[l][0] ], words.length), words.length * l)
            yTrain.set(this.toOneHot(word2int[ data[l][1] ], words.length), words.length * l)
        }
        // console.log(xTrain)
        // console.log(yTrain)

        const xs = tf.tensor2d(xTrain, [data.length, words.length]);
        const ys = tf.tensor2d(yTrain, [data.length, words.length]);


        const EMBEDDING_DIM = 5
        const W1 = tf.variable(tf.randomNormal([words.length, EMBEDDING_DIM]))
        const b1 = tf.variable(tf.randomNormal([EMBEDDING_DIM]))
        const W2 = tf.variable(tf.randomNormal([EMBEDDING_DIM, words.length]))
        const b2 = tf.variable(tf.randomNormal([words.length]))

        const predict = x => {
            const hidden_representation = tf.add(tf.matMul(x, W1), b1)
            return tf.softmax(tf.add( tf.matMul(hidden_representation, W2), b2))
        }

        const loss = (pred, label) => pred.sub(label).square().mean();
        const optimizer = tf.train.adam();

        for (let i = 0; i < 20; i++) {
            optimizer.minimize(() => {
                const result = loss(predict(xs), ys)
                // console.log(result.dataSync()[0])
                return result
            });
         }

        const vectors = tf.add(W1, b1)
        const closestIndex = this.findClosest(word2int['romeo'], vectors.shape, vectors.dataSync())
        // console.log(closestIndex)
        const closest = int2word[closestIndex]

        // Initialize the tsne optimizer
        this.tsneShow(vectors)


    }


    async tsneShow(vectors) {
        const tsneOpt = tsne.tsne(vectors);
        tsneOpt.compute(10)
            .then(() => {
                return tsneOpt.coordsArray();
            })
            .then(coordinates => {
                console.log(coordinates)

            })

    }
}




