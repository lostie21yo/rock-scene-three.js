import './style.css'
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

function IronFrameGenerator(X, Y, Z, COUNT) {
    const iglength = 1
    const ironGeometry = new THREE.CylinderGeometry(0.05, 0.05, iglength, 12, 1)
    const ironMaterial = new THREE.MeshBasicMaterial({ color: 'grey' })
    
    let frame_params = [];

    for (let i = 0; i < 2; i++){
    
        const iron1 = new THREE.Mesh(ironGeometry, ironMaterial)
        iron1.rotation.set(Math.PI/4, 0, 0)
        iron1.position.set(X-iglength/2, Y, Z)
        scene.add(iron1)
        const iron2 = new THREE.Mesh(ironGeometry, ironMaterial)
        iron2.rotation.set(-Math.PI/4, 0, 0)
        iron2.position.set(X-iglength/2, Y, Z)
        scene.add(iron2)

        const iron3 = new THREE.Mesh(ironGeometry, ironMaterial)
        iron3.rotation.set(Math.PI/4, 0, 0)
        iron3.position.set(X+iglength/2, Y, Z)
        scene.add(iron3)
        const iron4 = new THREE.Mesh(ironGeometry, ironMaterial)
        iron4.rotation.set(-Math.PI/4, 0, 0)
        iron4.position.set(X+iglength/2, Y, Z)
        scene.add(iron4)

        const iron5 = new THREE.Mesh(ironGeometry, ironMaterial)
        iron5.rotation.set(Math.PI/4, 0, 0)
        iron5.position.set(X, Y, Z-iglength/2)
        scene.add(iron5)
        const iron6 = new THREE.Mesh(ironGeometry, ironMaterial)
        iron6.rotation.set(-Math.PI/4, 0, 0)
        iron6.position.set(X, Y, Z-iglength/2)
        scene.add(iron6)

        const iron7 = new THREE.Mesh(ironGeometry, ironMaterial)
        iron7.rotation.set(Math.PI/4, 0, 0)
        iron7.position.set(X, Y, Z+iglength/2)
        scene.add(iron7)
        const iron8 = new THREE.Mesh(ironGeometry, ironMaterial)
        iron8.rotation.set(-Math.PI/4, 0, 0)
        iron8.position.set(X, Y, Z+iglength/2)
        scene.add(iron8)
    }
  }


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Scene
const scene = new THREE.Scene()

// Objects

const wall = new THREE.Mesh(
    new THREE.BoxGeometry(28, 10, 1),
    new THREE.MeshBasicMaterial({ color: 'white' })
)
wall.position.set(0, 4, -4)
scene.add(wall)

const floor = new THREE.Mesh(
    new THREE.BoxGeometry(30, 1, 30),
    new THREE.MeshBasicMaterial({ color: 'grey' })
)
floor.position.set(0, -1, 0)
scene.add(floor)

const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(12, 12, 1, 64, 1),
    new THREE.MeshBasicMaterial({ color: 'brown' })
)
scene.add(platform)

IronFrameGenerator(0, 2, 0, 5)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 1000)
// camera.position.x = 2
// camera.position.y = 2
camera.position.set(0, 5, 20)
camera.lookAt(platform.position)
scene.add(camera)


/** 
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width/sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick', ()=>{

    const fullScreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if (!fullScreenElement){

        if (canvas.requestFullscreen){
            canvas.requestFullscreen()
        } else if (canvas.webkitRequestFullscreen){
            canvas.webkitRequestFullscreen()
        }

    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        } else if (document.webkitExitFullscreen){
            document.webkitExitFullscreen()
        }
    }
})

// Cursor
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = - (event.clientY / sizes.height - 0.5)
})

// Animate
const clock = new THREE.Clock()

//gsap.to(platform.rotation, {duration: 1, delay: 1, x: Math.PI})
//gsap.to(platform.position, {duration: 1, delay: 2, x: 3})

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update camera
    // mesh.rotation.y = elapsedTime;
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2
    // camera.position.y = cursor.y * 3
    // camera.lookAt(mesh.position)

    // Render
    renderer.render(scene, camera)

    // Update controls
    controls.update()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()