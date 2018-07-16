import * as THREE from "three"

export default class TrainUtil{
    static getUniqueWords(corpus) {
        return corpus.toLowerCase()
            .split(" ")
            .reduce((accu, curr) => {
                if(curr != "." & curr != "") accu.push(curr)
                return accu
            }, [])
            .filter(function(elem, pos,arr) {
                return arr.indexOf(elem) == pos;
            })
    }

    static getSentences(corpus) {
        const rowSentences = corpus.toLowerCase().split(".")
        const sentences = []
        for(var ss=0; ss < rowSentences.length; ss++) {
            const word = rowSentences[ss]
                .split(" ")
                .reduce((accu, curr) => {
                if(curr != "." & curr != "") accu.push(curr)
                return accu
            }, [])

            sentences.push(word)
        }
        return sentences
    }

    static getDictionary(words) {
        const word2int = {}
        const int2word = {}
        for(var i=0; i < words.length; i++) {
            word2int[words[i]] = i
            int2word[i] = words[i]
        }
        return {word2int, int2word}
    }

    static getTrainData(sentences) {
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
        return data
    }

    static getOneHotData(data, words, word2int, index) {
        const trainData = new Uint8Array(data.length * words.length);
        for(var l=0; l < data.length; l++) {
            trainData.set(this.toOneHot(word2int[ data[l][index] ], words.length), words.length * l)
        }
        return trainData
    }

    static convertTo2dArray(typedArray, shape) {
        const result = []
        for(let i=0; i<shape[0]; i++){
            const row = []
            for(let j=0; j<shape[1]; j++){
                row.push(typedArray[i*shape[1] + j])
            }
            result.push(row)
        }
        return result
    }

    static toOneHot(dataPointIndex, vocabSize) {
        const oneHot = new Uint8Array(vocabSize)
        oneHot[dataPointIndex] = 1
        return oneHot
    }

    static findClosest(wordIndex, shape, vectors) {
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

}
