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

// app.process("He is the king . The king is royal . She is the royal  queen ")
app.process("I am happy to join with you today in what will go down in history as the greatest demonstration for freedom in the history of our nation. Five score years ago, a great American, in whose symbolic shadow we stand today, signed the Emancipation Proclamation. This momentous decree came as a great beacon light of hope to millions of Negro slaves who had been seared in the flames of withering injustice. It came as a joyous daybreak to end the long night of captivity. But one hundred years later, the Negro still is not free. One hundred years later, the life of the Negro is still sadly crippled by the manacles of segregation and the chains of discrimination. One hundred years later, the Negro lives on a lonely island of poverty in the midst of a vast ocean of material prosperity. One hundred years later, the Negro is still languished in the corners of American society and finds himself in exile in his own land. So we have come here today to dramatize an shameful condition. In a sense we've come to our nation's Capital to cash a check. When the architects of our republic wrote the magnificent words of the Constitution and the Declaration of Independence, they were signing a promissory note to which every American was to fall heir. This note was a promise that all men, yes, black men as well as white men, would be guaranteed the unalienable rights of life, liberty, and the pursuit of happiness. It is obvious today that America has defaulted on this promissory note insofar as her citizens of color are concerned. Instead of honoring this sacred obligation, America has given the Negro people a bad check; a check which has come back marked insufficient funds.But we refuse to believe that the bank of justice is bankrupt. We refuse to believe that there are insufficient funds in the great vaults of opportunity of this nation. So we have come to cash this check- a check that will give us upon demand the riches of freedom and the security of justice.")
