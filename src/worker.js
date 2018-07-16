import TSNE from 'tsne-js'

const isBusy = () => {
    postMessage({
        type: 'STATUS',
        data: 'BUSY'
    })
}

const isReady = () => {
    postMessage({
        type: 'STATUS',
        data: 'READY'
    })
}

isBusy();

const model = new TSNE({
    dim: 3,
    perplexity: 30.0,
    earlyExaggeration: 4.0,
    learningRate: 100.0,
    nIter: 300,
    metric: 'euclidean'
});

let firstRun = true;

self.onmessage = function (e) {
    const msg = e.data;

    switch (msg.type) {
        case 'INPUT_DATA':
        isBusy();
        model.init({
            data: msg.data,
            type: 'dense'
        });
        isReady();
        break;
        case 'RUN':
        isBusy();
        if (firstRun) {
            model.run();
            firstRun = false;
        } else {
            model.rerun();
        }
        postMessage({
            type: 'DONE',
            data: model.getOutputScaled()
        });
        isReady();
        break;
        default:
    }
};


model.on('progressIter', function (iter) {
    postMessage({
        type: 'PROGRESS_ITER',
        data: iter
    });
});

model.on('progressStatus', function (status) {
    postMessage({
        type: 'PROGRESS_STATUS',
        data: status
    });
});

model.on('progressData', function (data) {
    postMessage({
        type: 'PROGRESS_DATA',
        data: data
    });
});
