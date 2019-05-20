import * as THREE from "three"
if(!global.THREE) global.THREE = THREE

export default class RendererUtil{
    static loadFont(url) {
        return new Promise((resolve, reject) => {
            const loader = new THREE.FontLoader();
            loader.load(url, font => {
                resolve(font)
            })
        })
    }

}
