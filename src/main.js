import App from "./App.js";
import wordsData from "../public/out.json";

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

window.onresize = e => onWindowResize();
onWindowResize();

// const dataset = Object.values(wordsData).map(item => {
//   const values = Object.values(item)[0].split(" ");
//   return {
//     label: values[0].split("_")[0],
//     weight: values.slice(1, values.length)
//   };
// });
const dataset = Object.values(wordsData).map(item => {
  return {
    label: Object.keys(item)[0],
    weight: Object.values(item)[0]
  };
});
app.process(dataset);

// app.process("He is the king . The king is royal . She is the royal  queen ")
// app.process("my-model-1/model.json", words)

// app.process("Words are flowing out like endless rain into a paper cup, They slither while they pass, they slip away across the universe. Pools of sorrow waves of joy are drifting through my opened mind, Possessing and caressing me.  Jai guru deva om Nothing's gonna change my world Nothing's gonna change my world. Nothing's gonna change my world Nothing's gonna change my world.  Images of broken light which dance before me like a million eyes, They call me on and on across the universe, Thoughts meander like a restless wind Inside a letter box they Stumble blindly as they make their way Across the universe  Jai guru deva om Nothing's gonna change my world Nothing's gonna change my world. Nothing's gonna change my world Nothing's gonna change my world.  Sounds of laughter shades of life are ringing Through my open mind inciting and inviting me. Limitless undying love which shines around me like a million suns, And calls me on and on across the universe  Jai guru deva om Nothing's gonna change my world Nothing's gonna change my world. Nothing's gonna change my world Nothing's gonna change my world.  Jai guru deva Jai guru deva Jai guru deva Jai guru deva  They're gonna put me in the movies They're gonna make a big star out of me We'll make a film about a man that's sad and lonely And all I gotta say is act naturally  Well, I'll bet you I'm gonna be a big star Might win an Oscar you can never tell The movies gonna make me a big star 'Cause I can play the part so well  Well I hope you come and see me in the movies Then I know that you will plainly see The biggest fool that ever hit the big time And all I gotta do is act naturally")
