import App from "./App.js";

import wikiData from "./datasets/word2vec-gigaword-out.json";
import googleNewsData from "./datasets/word2vec-google-news-out.json";
import gigawordData from "./datasets/word2vec-wiki-out.json";

import wikiTsneData from "./datasets/processed-wiki-tsne-out.json";
import googleNewsTsneData from "./datasets/processed-google-news-tsne-out.json";
import gigawordTsneData from "./datasets/processed-gigaword-tsne-out.json";

import math from "mathjs";

// var targetVec = Object.values(wikiData[0])[0];
//
// const dotProducts = wikiData
//   .map(data => {
//     const vec = Object.values(data)[0];
//     return math.dot(targetVec, vec);
//   })
//   .sort((a, b) => a - b);
// console.log(dotProducts);
// console.log(math.dot(vec1, vec2));
// console.log(math.dot(vec1, vec3));

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
  return dataset;
};

const dataset1 = preprocessData(wikiTsneData);
const dataset2 = preprocessData(googleNewsTsneData);
const dataset3 = preprocessData(gigawordTsneData);

app.setLabels(dataset1.map(item => item.label)).then(() => {
  app.addPosition(dataset1.map(item => item.weight));
  app.addPosition(dataset2.map(item => item.weight));
  app.addPosition(dataset3.map(item => item.weight));
  app.start();
});

window.onresize = onWindowResize;
document.addEventListener("mousemove", onDocumentMouseMove, false);
onWindowResize();
