import App from "./App.js";
import wordsData from "../public/wiki-tsne-out.json";

const canvas = document.createElement("canvas");
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
  for(let key in data){
    dataset.push({
      label: key,
      weight: data[key].map(value => Number(value))
    })
  }
  return dataset;
}

const dataset = preprocessData(wordsData);
app.process(dataset);
window.onresize = e => onWindowResize();
onWindowResize();

