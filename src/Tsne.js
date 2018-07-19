import EventEmitter from "eventemitter3"

export default class Tsne extends EventEmitter{

    constructor() {
        super()
        this.worker = new Worker('worker.js')
        this.worker.onmessage = this.onMessage.bind(this)
    }

    start(vectors, words) {
        this.words = words
        this.worker.postMessage({
            type: 'INPUT_DATA',
            data: vectors
        });
        this.worker.postMessage({
            type: 'RUN'
        });
    }

    onMessage(e) {
        var msg = e.data
        switch (msg.type) {
            case 'PROGRESS_STATUS':
                // msg.data
                break;
            case 'PROGRESS_ITER':
                // msg.data[0] + 1
                break;
            case 'PROGRESS_DATA':
                // this.emit("PROGRESS_DATA", msg.data)
                // msg.data
                break;
            case 'STATUS':
                if (msg.data === 'READY') {
                } else {
                }
                break;
            case 'DONE':
                this.emit("PROGRESS_DATA", msg.data)


                // drawUpdate(msg.data);
                break;
            default:
        }
    }

}




