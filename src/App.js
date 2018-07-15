import * as tf from '@tensorflow/tfjs';

const corpus = "He is the king . The king is royal . She is the royal  queen "

export default class App {

    toOneHot(data_point_index, vocab_size) {
        const oneHot = new Uint8Array(vocab_size)
        oneHot[data_point_index] = 1
        return oneHot
    }

    loss(predictions, labels) {
        const meanSquareError = predictions.sub(labels).square().mean();
        return meanSquareError;
    }

    // async function train(xs, ys, numIterations) {
    //     for (let iter = 0; iter < numIterations; iter++) {
    //         optimizer.minimize(() => {
    //             const pred = predict(xs);
    //             return loss(pred, ys);
    //             return dl.losses.softmaxCrossEntropy(trainingWebcamTensor, resultTensor).mean()

    //         });

    //         await tf.nextFrame();
    //     }
    // }


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


        const xs = tf.tensor2d(xTrain, [data.length, words.length]);
        const ys = tf.tensor2d(yTrain, [data.length, words.length]);



        const EMBEDDING_DIM = 5
        const W1 = tf.variable(tf.randomNormal([words.length, EMBEDDING_DIM]))
        const b1 = tf.variable(tf.randomNormal([EMBEDDING_DIM]))
        const W2 = tf.variable(tf.randomNormal([EMBEDDING_DIM, words.length]))
        const b2 = tf.variable(tf.randomNormal([words.length]))

        const f = x => {
            const xTrainW1 = tf.matMul(x, W1)
            const hidden_representation = tf.add(xTrainW1, b1)
            return tf.softmax(tf.add( tf.matMul(hidden_representation, W2), b2))
        }

        const loss = (pred, label) => pred.sub(label).square().mean();
        // const loss = (pred, label) => pred.sub(label).square().mean();
        const learningRate = 0.1;
        const optimizer = tf.train.sgd(learningRate);

        // Train the model.
        for (let i = 0; i < 20; i++) {
            optimizer.minimize(() => {
                const result = loss(f(xs), ys)
                console.log(result.dataSync()[0])
                return result
            });
        }

        // Make predictions.
        // console.log(`a: ${a.dataSync()}, b: ${b.dataSync()}, c: ${c.dataSync()}`);
        const preds = f(xs).dataSync();
        preds.forEach((pred, i) => {
           // console.log(`x: ${i}, pred: ${pred}`);
        });


        // const axis = 1;
        // const crossEntropyLoss = tf.mean(tf.logSumExp(tf.mul(label, tf.log(pred)), axis))
        // const loss = (pred, label) => tf.mean(tf.logSumExp(tf.mul(label, tf.log(pred)), axis));
        // const loss = (pred, label) => pred.sub(label).square().mean();
        // console.log(loss(pred, label))
        // const trainStep = tf.train.sgd(0.1).minimize(loss)

        // await train(trainingData.xs, trainingData.ys, numIterations);

        /*
        sess = tf.Session()
        init = tf.global_variables_initializer()
        sess.run(init) #make sure you do this!
        # define the loss function:
        cross_entropy_loss = tf.reduce_mean(-tf.reduce_sum(y_label * tf.log(prediction), reduction_indices=[1]))
        # define the training step:
        train_step = tf.train.GradientDescentOptimizer(0.1).minimize(cross_entropy_loss)
        n_iters = 10000
        # train for n_iter iterations
        for _ in range(n_iters):
            sess.run(train_step, feed_dict={x: x_train, y_label: y_train})
            print('loss is : ', sess.run(cross_entropy_loss, feed_dict={x: x_train, y_label: y_train}))
            */
    }
}




