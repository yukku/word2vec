import * as THREE from "three"
if(!global.THREE) global.THREE = THREE
import TweenLite from "gsap"
console.log(TweenLite)
import RendererUtil from "./RendererUtil.js"
require("./lib/three/examples/js/controls/OrbitControls.js")

export default class Renderer{

    constructor({ canvas, width, height }) {

        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            // alpha: true,
            antialias: false,
        })
        // document.body.appendChild( this.renderer.domElement );
        this.renderer.setClearColor( 0x000000, 0 )
        this.renderer.setPixelRatio(2);

        this.scene = new THREE.Scene()
        const fogColor = new THREE.Color(0x000000);
        this.scene.background = fogColor;
        this.scene.fog = new THREE.Fog(fogColor, 10, 1000);


        this.camera = new THREE.PerspectiveCamera( 45, width / height, 1, 100000)
        this.camera.lookAt(new THREE.Vector3(0, 0, 0))
        this.camera.position.z = 300;
        this.controls = new THREE.OrbitControls( this.camera );
        this.controls.autoRotate = true

    }

    async setup(words) {

        const font = await RendererUtil.loadFont('fonts/droid/droid_sans_regular.typeface.json')

        this.meshes = words.map(word => {

            const geometry = new THREE.TextGeometry(word, {
                font: font,
                size: 4,
                height: 0,
                curveSegments: 5,
                bevelEnabled: false,
                bevelThickness: 0,
                bevelSize: 0,
                bevelSegments: 2
            });
            geometry.center()
            const material = new THREE.MeshPhongMaterial({
                color: 0xdddddd
            })
            const mesh = new THREE.Mesh(geometry, material)

            return mesh
        })

        this.meshes.forEach(mesh => {
            this.scene.add(mesh)
        })

        this.scene.add(new THREE.AmbientLight(0xffffff, 1));

        this.animate()
    }

    update(data) {
        // console.log(data)
        const scale = 180
        this.meshes.forEach((mesh, index) => {
            TweenLite.to(mesh.position, 0.6, {
                x: data[index][0] * scale,
                y: data[index][1] * scale,
                z: data[index][2] * scale,
                ease: Power2.easeOut,
                // onUpdate: this.update.bind(this),
                // onComplete: () => {
                //     this.endAnimateExtreme()
                // }
            })

            // mesh.position.x = data[index][0] * scale
            // mesh.position.y = data[index][1] * scale
            // mesh.position.z = data[index][2] * scale
        })
    }

    animate() {
        requestAnimationFrame( this.animate.bind(this) );
        this.render()
    }

    render() {
        this.renderer.render(this.scene, this.camera)

        this.meshes.forEach((mesh, index) => {
            mesh.rotation.x = this.camera.rotation.x
            mesh.rotation.y = this.camera.rotation.y
            mesh.rotation.z = this.camera.rotation.z
        })
        this.controls.update()
    }

    resize({ width, height }) {
        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(width, height)
    }

}
