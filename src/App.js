import * as tf from '@tensorflow/tfjs';

const corpus = "He is the king . The king is royal . She is the royal  queen "

export default class App {

    toOneHot(data_point_index, vocab_size) {
        const oneHot = new Uint8Array(vocab_size)
        oneHot[data_point_index] = 1
        return oneHot
    }


    constructor() {

        const corpus_raw = corpus.toLowerCase()

        const words = corpus_raw
            .split(" ")
            .reduce((accu, curr) => {
                if(curr != "." & curr != "") accu.push(curr)
                return accu
            }, [])

        const word2int = {}
        const int2word = {}

        for(var i=0; i < words.length; i++) {
            word2int[words[i]] = i
            int2word[i] = words[i]
        }

        const sentences = [words]

        const data = []
        const WINDOW_SIZE = 2

        for(var j=0; j < sentences.length; j++) {
            for(var k=0; k < sentences[j].length; k++) {

                const startInt = Math.max(k - WINDOW_SIZE, 0)
                const endInt = Math.min(k + WINDOW_SIZE, sentences[j].length)

                for(var s=startInt; s < endInt; s++) {
                    if(sentences[j][k] != sentences[j][s]) {
                        data.push([sentences[j][k], sentences[j][s]])
                    }

                }

            }
        }

        const xTrain = new Uint8Array(data.length * words.length);
        const yTrain = new Uint8Array(data.length * words.length);

        for(var l=0; l < data.length; l++) {
            xTrain.set(this.toOneHot(word2int[ data[l][0] ], words.length), words.length * l)
            yTrain.set(this.toOneHot(word2int[ data[l][1] ], words.length), words.length * l)
        }

        // console.log(xTrain.length * words.length)
        const xTrainTensor = tf.tensor2d(xTrain, [data.length, words.length]);
        const yTrainTensor = tf.tensor2d(yTrain, [data.length, words.length]);

        const EMBEDDING_DIM = 5
        // const inputX = tf.input({shape: [words.length]})
        // const y_label = tf.input({shape: [words.length]})

        // const x = tf.placeholder(tf.float32, shape=(None, vocab_size))
        // const y_label = tf.placeholder(tf.float32, shape=(None, vocab_size))

        const W1 = tf.variable(tf.randomNormal([words.length, EMBEDDING_DIM]))
        const b1 = tf.variable(tf.randomNormal([EMBEDDING_DIM]))

        const xTrainW1 = tf.matMul(xTrainTensor, W1)
        const hidden_representation = tf.add(xTrainW1, b1)


        const W2 = tf.variable(tf.randomNormal([EMBEDDING_DIM, words.length]))
        const b2 = tf.variable(tf.randomNormal([words.length]))
        const prediction = tf.softmax(tf.add( tf.matMul(hidden_representation, W2), b2))



/*



        // Define a model for linear regression.
        const model = tf.sequential();
        model.add(tf.layers.dense({units: 1, inputShape: [1]}));

        // Prepare the model for training: Specify the loss and the optimizer.
        model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

        // Generate some synthetic data for training.
        const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
        const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

        // Train the model using the data.
        model.fit(xs, ys, {epochs: 10}).then(() => {
          // Use the model to do inference on a data point the model hasn't seen before:
          model.predict(tf.tensor2d([5], [1, 1])).print();
        });
*/
    }
}




