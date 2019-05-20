import App from "./App.js";

import wikiData from "./datasets/processed-word2vec-wiki-out.json";
import googleNewsData from "./datasets/processed-word2vec-google-news-out.json";
import gigawordData from "./datasets/processed-word2vec-gigaword-out.json";

import wikiTsneData from "./datasets/processed-wiki-tsne-out.json";
import googleNewsTsneData from "./datasets/processed-google-news-tsne-out.json";
import gigawordTsneData from "./datasets/processed-gigaword-tsne-out.json";

const canvas = document.createElement("canvas");
document.body.style.cssText =
  "margin:0; padding: 0; position: absolute; width: 100%; height: 100%;";
document.body.appendChild(canvas);

const app = new App({
  canvas: canvas,
  width: window.innerWidth,
  height: window.innerHeight
});

const resizeEl = (el, width, height) => {
  canvas.width = width;
  canvas.height = height;
};

const onWindowResize = e => {
  resizeEl(canvas, window.innerWidth, window.innerHeight);
  app.resize({
    width: window.innerWidth,
    height: window.innerHeight
  });
};

const onDocumentMouseMove = e => {
  e.preventDefault();
  app.onMouseMove(
    (e.clientX / window.innerWidth) * 2 - 1,
    -(e.clientY / window.innerHeight) * 2 + 1
  );
};

const preprocessData = data => {
  const dataset = [];
  for (let key in data) {
    dataset.push({
      label: Object.keys(data[key])[0],
      weight: Object.values(data[key])[0].map(value => Number(value))
    });
  }
  return dataset.slice(0, 100);
};

const dataset1 = preprocessData(wikiTsneData);
const dataset2 = preprocessData(googleNewsTsneData);
const dataset3 = preprocessData(gigawordTsneData);

const datasetFull1 = preprocessData(wikiData);
const datasetFull2 = preprocessData(googleNewsData);
const datasetFull3 = preprocessData(gigawordData);

app.setLabels(dataset1.map(item => item.label)).then(() => {
  app.addPosition(dataset1.map(item => item.weight));
  app.addPosition(dataset2.map(item => item.weight));
  app.addPosition(dataset3.map(item => item.weight));

  app.addWeight(datasetFull1.map(item => item.weight));
  app.addWeight(datasetFull2.map(item => item.weight));
  app.addWeight(datasetFull3.map(item => item.weight));

  app.start();
});

window.onresize = onWindowResize;
document.addEventListener("mousemove", onDocumentMouseMove, false);
onWindowResize();
