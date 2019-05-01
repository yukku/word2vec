import TSNE from "tsne-js";

const isBusy = () => {
  postMessage({
    type: "STATUS",
    data: "BUSY"
  });
};

const isReady = () => {
  postMessage({
    type: "STATUS",
    data: "READY"
  });
};

isBusy();

// const model = new TSNE({
//     dim: 3,
//     perplexity: 15.0,
//     earlyExaggeration: 2.0,
//     learningRate: 180.0,
//     nIter: 50,
//     metric: 'euclidean'
// });
const model = new TSNE({
  dim: 3,
  perplexity: 15.0,
  earlyExaggeration: 2.0,
  learningRate: 180.0,
  nIter: 1000,
  metric: "euclidean"
});
// console.log(model)
let firstRun = true;

self.onmessage = function(e) {
  const msg = e.data;

  switch (msg.type) {
    case "INPUT_DATA":
      isBusy();
      model.init({
        data: msg.data,
        type: "dense"
      });
      isReady();
      break;
    case "RUN":
      isBusy();
      if (firstRun) {
        model.run();
        firstRun = false;
      } else {
        model.rerun();
      }
      postMessage({
        type: "DONE",
        data: model.getOutputScaled()
      });
      isReady();
      break;
    default:
  }
};

model.on("progressIter", function(iter) {
  postMessage({
    type: "PROGRESS_ITER",
    data: iter
  });
  // console.log(iter[0])
});

model.on("progressStatus", function(status) {
  postMessage({
    type: "PROGRESS_STATUS",
    data: status
  });
});

model.on("progressData", function(data) {
  postMessage({
    type: "PROGRESS_DATA",
    data: data
  });
});
