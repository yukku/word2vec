import App from "./App.js";
import wikiTsneData from "./datasets/processed-wiki-tsne-out.json";
import googleNewsTsneData from "./datasets/processed-google-news-tsne-out.json";
import gigawordTsneData from "./datasets/processed-gigaword-tsne-out.json";

const canvas = document.createElement("canvas");
document.body.style.cssText = "margin:0; padding: 0;";
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

const onWindowResize = () => {
  resizeEl(canvas, window.innerWidth, window.innerHeight);
  app.resize({
    width: window.innerWidth,
    height: window.innerHeight
  });
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
  app.addWeight(dataset1.map(item => item.weight));
  app.addWeight(dataset2.map(item => item.weight));
  app.addWeight(dataset3.map(item => item.weight));
  app.start();
});

window.onresize = e => onWindowResize();
onWindowResize();
