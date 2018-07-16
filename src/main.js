import App from "./App.js"

const canvas = document.createElement("canvas")
document.body.appendChild(canvas);

const app = new App({
    canvas: canvas,
    width: window.innerWidth,
    height: window.innerHeight
})

const resizeEl = (el, width, height) => {
    canvas.width = width
    canvas.height = height
}

const onWindowResize = () => {
    resizeEl(canvas, window.innerWidth, window.innerHeight)
    app.resize({
        width: window.innerWidth,
        height: window.innerHeight
    })
}

window.onresize = (e) => onWindowResize()
onWindowResize()

app.process("He is the king . The king is royal . She is the royal  queen .")

