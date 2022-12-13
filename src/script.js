import './style.css'
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from 'gsap'
import * as dat from 'lil-gui'
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";
import { SpotLight } from 'three';

const a180 = Math.PI
const a90 = Math.PI / 2
const a45 = Math.PI / 4
const a30 = Math.PI / 6
const a15 = Math.PI / 12





// SCENE & CANVAS =======================================================================================================
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Scene & Creating GUI
const scene = new THREE.Scene()
const gui = new dat.GUI({ width: 300 })
var spotlightsON = confirm("Доброго времени суток!\n\nЕсли желаете открыть сцену с анимацией освещения (значительно влияет на производительность), нажмите 'OK'\n");

// Scene global light
if (spotlightsON) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.15)
    scene.add(ambientLight)
        // регулировка яркости глобального освещения
    gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01).name('AmbientLight intensity')
} else {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambientLight)
        // регулировка яркости глобального освещения
    gui.add(ambientLight, 'intensity').min(0).max(1.5).step(0.01).name('AmbientLight intensity')
}





// MATERIALS & TEXTURES =========================================================================================

const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const groupTextures = new THREE.Group()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/2/px.jpg',
    '/textures/environmentMaps/2/nx.jpg',
    '/textures/environmentMaps/2/py.jpg',
    '/textures/environmentMaps/2/ny.jpg',
    '/textures/environmentMaps/2/pz.jpg',
    '/textures/environmentMaps/2/nz.jpg'
])

//const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')

const acousticColor = new THREE.MeshStandardMaterial({ color: "grey" })
const acousticTexture = textureLoader.load('/textures/acousticTexture.jpg')
acousticColor.envMap = environmentMapTexture
acousticColor.map = acousticTexture
acousticColor.side = THREE.DoubleSide
acousticColor.metalness = 0
acousticColor.roughness = 0.8
    //gui.add(acousticColor, 'metalness').min(0).max(1).step(0.0001)
    //gui.add(acousticColor, 'roughness').min(0).max(1).step(0.0001)

const drumKitColor = new THREE.MeshStandardMaterial({ color: 0x00474d })
const drumRedTexture = textureLoader.load('/textures/drumRedTexture.jpg')
drumKitColor.envMap = environmentMapTexture
drumKitColor.map = drumRedTexture
drumKitColor.side = THREE.DoubleSide
drumKitColor.metalness = 0.2
drumKitColor.roughness = 0.05
const params = {
    color: 0x00474d
}
gui.addColor(params, 'color').onChange(() => {
    drumKitColor.color.set(params.color)
}).name('Drum kit color')

const metalicMaterial = new THREE.MeshStandardMaterial()
metalicMaterial.envMap = environmentMapTexture
metalicMaterial.side = THREE.DoubleSide
metalicMaterial.metalness = 1
metalicMaterial.roughness = 0.0

const microMaterial = new THREE.MeshStandardMaterial()
const microTexture = textureLoader.load('/textures/microTexture.jpg')
microMaterial.envMap = environmentMapTexture
microMaterial.normalScale.set(4, 4)
microMaterial.map = microTexture
microMaterial.side = THREE.DoubleSide
microMaterial.metalness = 0.4
microMaterial.roughness = 0.5

const drumKitLeather = new THREE.MeshStandardMaterial({ color: "white" })
const drumLeatherTexture = textureLoader.load('/textures/drumLeatherTexture.jpg')
drumKitLeather.envMap = environmentMapTexture
drumKitLeather.map = drumLeatherTexture
drumKitLeather.side = THREE.DoubleSide
drumKitLeather.metalness = 0.05
drumKitLeather.roughness = 0.4

const cymbalColor = new THREE.MeshStandardMaterial({ color: "#fcda72" })
const cymbalTexture = textureLoader.load('/textures/cymbalTexture.jpg')
cymbalColor.map = cymbalTexture
cymbalColor.envMap = environmentMapTexture
cymbalColor.side = THREE.DoubleSide
cymbalColor.metalness = 0.24
cymbalColor.roughness = 0.15

const blackLeather = new THREE.MeshStandardMaterial({ color: "black" })
blackLeather.envMap = environmentMapTexture
blackLeather.side = THREE.DoubleSide
blackLeather.metalness = 0.3
blackLeather.roughness = 0.15

const acousticDiffuserMaterial = new THREE.MeshStandardMaterial({ color: "white" })
const acousticDiffuserTexture = textureLoader.load('/textures/acousticDiffuserTexture.png')
acousticDiffuserMaterial.envMap = environmentMapTexture
acousticDiffuserMaterial.map = acousticDiffuserTexture
acousticDiffuserMaterial.side = THREE.DoubleSide
acousticDiffuserMaterial.metalness = 0.05
acousticDiffuserMaterial.roughness = 0.4

const settMaterial = new THREE.MeshStandardMaterial()
const settTexture = textureLoader.load('/textures/settTexture.jpg')
settMaterial.envMap = environmentMapTexture
settMaterial.map = settTexture
settMaterial.side = THREE.DoubleSide
settMaterial.metalness = 0.05
settMaterial.roughness = 0.4
settTexture.wrapS = THREE.MirroredRepeatWrapping
settTexture.wrapT = THREE.MirroredRepeatWrapping
settTexture.repeat.x = 50
settTexture.repeat.y = 50
settTexture.center.x = 0.5
settTexture.center.y = 0.5

const wallMaterial = new THREE.MeshStandardMaterial()
const wallTexture = textureLoader.load('/textures/brickWallTexture.jpg')
wallMaterial.envMap = environmentMapTexture
wallMaterial.map = wallTexture
wallMaterial.side = THREE.DoubleSide
wallMaterial.metalness = 0.05
wallMaterial.roughness = 0.4
wallTexture.wrapS = THREE.RepeatWrapping
wallTexture.wrapT = THREE.RepeatWrapping
wallTexture.repeat.x = 2
wallTexture.repeat.y = 2
wallTexture.center.x = 0.5
wallTexture.center.y = 0.5
gui.add(wallMaterial, 'wireframe')

const ruberoidMaterial = new THREE.MeshStandardMaterial()
const ruberoidTexture = textureLoader.load('/textures/ruberoidTexture.jpg')
ruberoidMaterial.envMap = environmentMapTexture
ruberoidMaterial.map = ruberoidTexture
ruberoidMaterial.side = THREE.DoubleSide
ruberoidMaterial.metalness = 0.05
ruberoidMaterial.roughness = 0.7
ruberoidTexture.wrapS = THREE.LoopRepeat
ruberoidTexture.wrapT = THREE.LoopRepeat
ruberoidTexture.repeat.x = 2
ruberoidTexture.repeat.y = 2
ruberoidTexture.center.x = 0.5
ruberoidTexture.center.y = 0.5

const laminateMaterial = new THREE.MeshStandardMaterial({ color: '#d95430' })
const laminateTexture = textureLoader.load('/textures/laminateTexture.jpg')
laminateMaterial.envMap = environmentMapTexture
laminateMaterial.map = laminateTexture
laminateMaterial.side = THREE.DoubleSide
laminateMaterial.metalness = 0.05
laminateMaterial.roughness = 0.95
laminateTexture.wrapS = THREE.LoopRepeat
laminateTexture.wrapT = THREE.LoopRepeat
laminateTexture.repeat.x = 10
laminateTexture.repeat.y = 10
laminateTexture.center.x = 0.5
laminateTexture.center.y = 0.5

groupTextures.generateMipmaps = false // разгрузка gpu
    //groupTextures.minFilter = THREE.NearestFilter
    //groupTextures.magFilter = THREE.NearestFilter




// OBJECTS =======================================================================================================


// Пол
function MakeFloor() {
    const floor = new THREE.Mesh(new THREE.BoxGeometry(160, 2, 160), settMaterial)
    floor.position.set(0, -1, 2)
    floor.receiveShadow = true
    scene.add(floor)
    gui.add(floor, 'visible')
}
MakeFloor()


// Стены + 3D текст 
function MakeWalls() {
    const wallPaper = textureLoader.load('/textures/wallpaper.jpg')
    const backWallmaterial = new THREE.MeshStandardMaterial({ map: wallPaper })
    backWallmaterial.roughness = 0.8
    const frontWall = new THREE.Mesh(
        new THREE.BoxGeometry(28, 10, 1),
        backWallmaterial
    )
    frontWall.receiveShadow = true
    frontWall.castShadow = true
    frontWall.position.set(0, 4, -3)
        // colorTexture.wrapS = THREE.MirroredRepeatWrapping
        // colorTexture.wrapT = THREE.MirroredRepeatWrapping
        // colorTexture.repeat.x = 3
        // colorTexture.repeat.y = 2
        // colorTexture.offset.x = 0.5
        // colorTexture.offset.y = 0.5
        // colorTexture.rotation= Math.PI * 0.25
        // colorTexture.center.x= 0.5
        // colorTexture.center.y= 0.5

    //colorTexture.generateMipmaps = false // разгрузка gpu
    //colorTexture.minFilter = THREE.NearestFilter
    wallPaper.magFilter = THREE.NearestFilter

    // Текст на стене
    const fontLoader = new FontLoader()

    fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
        const textGeometry = new TextGeometry('Rock Scene', {
            font: font,
            size: 1,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5,
        })

        const matcapTexture = textureLoader.load('/textures/matcaps/8.png')
        const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
        const text = new THREE.Mesh(textGeometry, material)
        textGeometry.center()
        textGeometry.receiveShadow = true
        textGeometry.castShadow = true
        text.position.set(0, frontWall.position.y + 2.5, frontWall.position.z + 0.6)
        scene.add(text)
    })

    const upperWall = new THREE.Mesh(new THREE.BoxGeometry(31, 2, 16), ruberoidMaterial)
    upperWall.position.set(0, 9, -9)
    upperWall.receiveShadow = true
    upperWall.castShadow = true

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(2, 11, 15), wallMaterial)
    leftWall.position.set(14, 4, -9)
    leftWall.receiveShadow = true
    leftWall.castShadow = true

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(2, 11, 15), wallMaterial)
    rightWall.position.set(-14, 4, -9)
    rightWall.receiveShadow = true
    rightWall.castShadow = true

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(28, 10, 1), wallMaterial)
    backWall.position.set(0, 4, -15)
    backWall.receiveShadow = true
    backWall.castShadow = true

    scene.add(frontWall, upperWall, leftWall, rightWall, backWall)
}
MakeWalls()


// Платформа сцены
const groupPlatform = new THREE.Group()

function MakePlatform(Rt, Rb, H) {
    const platform1 = new THREE.Mesh(new THREE.CylinderGeometry(Rt, Rb, H, 128, 1), laminateMaterial)
    const platform2 = new THREE.Mesh(new THREE.CylinderGeometry(Rt * 1.03, Rb * 1.03, H * 0.95, 128, 1), blackLeather)
    groupPlatform.add(platform1, platform2)
    platform1.receiveShadow = true
    platform1.castShadow = true
    platform2.receiveShadow = true
    platform2.castShadow = true

    groupPlatform.position.y = 0.5
}
MakePlatform(14.5, 14, 1)


// Создание металлической фермы
function MakeTrusses(X, Y, Z, H, W) {
    function MakeFrame(X, Y, Z, Zrot) {
        const tubelength = 1
        const fs = tubelength / 2 //frame size
        const frameGeometry1 = new THREE.CylinderGeometry(0.03, 0.03, tubelength * 1.35, 12, 1)
        const frameMaterial = metalicMaterial

        frameMaterial.metalness = 0.8
        frameMaterial.roughness = 0.25
        const groupFrame = new THREE.Group()
        groupFrame.rotateZ(Zrot)

        let frame_params1 = [
            [a45, 0, 0, X - fs, Y, Z],
            [-a45, 0, 0, X - fs, Y, Z],
            [a45, 0, 0, X + fs, Y, Z],
            [-a45, 0, 0, X + fs, Y, Z],
            [0, 0, a45, X, Y, Z - fs],
            [0, 0, -a45, X, Y, Z - fs],
            [0, 0, a45, X, Y, Z + fs],
            [0, 0, -a45, X, Y, Z + fs]
        ];

        for (let i = 0; i < frame_params1.length; i++) {

            const frame = new THREE.Mesh(frameGeometry1, frameMaterial)
            frame.castShadow = true
                //frame.geometry.setAttribute('uv2', new THREE.BufferAttribute(frame.geometry.attributes.uv.array, 2))
            frame.rotation.set(frame_params1[i][0], frame_params1[i][1], frame_params1[i][2])
            frame.position.set(frame_params1[i][3], frame_params1[i][4], frame_params1[i][5])
            groupFrame.add(frame)
        }

        const frameGeometry2 = new THREE.CylinderGeometry(0.05, 0.05, tubelength, 12, 1)
        let frame_params2 = [
            [a90, 0, 0, X - fs, Y + fs, Z],
            [a90, 0, 0, X - fs, Y - fs, Z],
            [a90, 0, 0, X + fs, Y + fs, Z],
            [a90, 0, 0, X + fs, Y - fs, Z],
            [0, 0, a90, X, Y - fs, Z + fs],
            [0, 0, a90, X, Y - fs, Z - fs],
            [0, 0, a90, X, Y + fs, Z + fs],
            [0, 0, a90, X, Y + fs, Z - fs],
            [0, 0, 0, X - fs, Y, Z + fs],
            [0, 0, 0, X - fs, Y, Z - fs],
            [0, 0, 0, X + fs, Y, Z + fs],
            [0, 0, 0, X + fs, Y, Z - fs]
        ];
        for (let i = 0; i < frame_params2.length; i++) {

            const frame = new THREE.Mesh(frameGeometry2, frameMaterial)
            frame.rotation.set(frame_params2[i][0], frame_params2[i][1], frame_params2[i][2])
            frame.position.set(frame_params2[i][3], frame_params2[i][4], frame_params2[i][5])
            groupFrame.add(frame)
        }

        scene.add(groupFrame)
    }
    const groupTrusses = new THREE.Group()
    groupTrusses.position.set(X, Y, Z)

    for (let i = 0; i < H; i++) {
        MakeFrame(X, Y + i, Z, 0)
        MakeFrame(X + W, Y + i, Z, 0)
    }
    for (let i = 0; i <= W; i++) MakeFrame(X + i, Y + H, Z, 0)
    scene.add(groupTrusses)
}
MakeTrusses(-16, 0.5, 0, 12, 32)
MakeTrusses(-16, 0.5, 10, 12, 32)


// Создание акустики
function MakeAcoustic() {
    function MakeSpeaker(X, Y, Z, Xrot, Yrot, Zrot, Sc) {
        const groupAcoustic = new THREE.Group()
        groupAcoustic.position.set(X, Y, Z)
        groupAcoustic.rotation.set(Xrot, Yrot, Zrot)
        var dynamicTimeline1 = gsap.timeline({ repeat: 1000, repeatDelay: 0.05 })
        var dynamicTimeline2 = gsap.timeline({ repeat: 5000, repeatDelay: 0.01 })

        const corob = new THREE.Mesh(new THREE.BoxGeometry(1 * Sc, 1.5 * Sc, 1 * Sc), acousticColor)
        corob.castShadow = true

        const groupDynamic1 = new THREE.Group()
        const guba1 = new THREE.Mesh(new THREE.TorusGeometry(0.35 * Sc, 0.05 * Sc, 16, 32), blackLeather)
        guba1.position.set(0, -0.25 * Sc, 0.5 * Sc)
        const diffuser1 = new THREE.Mesh(new THREE.CircleGeometry(0.35 * Sc, 16), acousticDiffuserMaterial)
        diffuser1.position.set(0, -0.25 * Sc, 0.51 * Sc)
        const cap1 = new THREE.Mesh(new THREE.SphereGeometry(0.17 * Sc, 16, 16), blackLeather)
        cap1.position.set(0, -0.25 * Sc, 0.38 * Sc)
        groupDynamic1.add(cap1, diffuser1)
        dynamicTimeline1.to(groupDynamic1.position, { z: groupDynamic1.position.z + 0.04, duration: 0.1 });
        dynamicTimeline1.to(groupDynamic1.position, { z: groupDynamic1.position.z, duration: 0.1 });

        const groupDynamic2 = new THREE.Group()
        const guba2 = new THREE.Mesh(new THREE.TorusGeometry(0.2 * Sc, 0.04 * Sc, 16, 32), blackLeather)
        guba2.position.set(-0.2 * Sc, 0.42 * Sc, 0.5 * Sc)
        const diffuser2 = new THREE.Mesh(new THREE.CircleGeometry(0.2 * Sc, 16), acousticDiffuserMaterial)
        diffuser2.position.set(-0.2 * Sc, 0.42 * Sc, 0.51 * Sc)
        const cap2 = new THREE.Mesh(new THREE.SphereGeometry(0.08 * Sc, 16, 16), blackLeather)
        cap2.position.set(-0.2 * Sc, 0.42 * Sc, 0.45 * Sc)
        groupDynamic2.add(cap2, diffuser2)
        dynamicTimeline2.to(groupDynamic2.position, { z: groupDynamic2.position.z + 0.015, duration: 0.05 });
        dynamicTimeline2.to(groupDynamic2.position, { z: groupDynamic2.position.z, duration: 0.05 });

        const guba3 = new THREE.Mesh(new THREE.TorusGeometry(0.12 * Sc, 0.03 * Sc, 16, 32), blackLeather)
        guba3.position.set(0.25 * Sc, 0.42 * Sc, 0.5 * Sc)
        const diffuser3 = new THREE.Mesh(new THREE.CircleGeometry(0.12 * Sc, 16), acousticDiffuserMaterial)
        diffuser3.position.set(0.25 * Sc, 0.42 * Sc, 0.51 * Sc)

        //tl.to("#id", { opacity: 0, duration: 1 });

        groupAcoustic.add(corob, guba1, guba2, guba3, groupDynamic1, groupDynamic2, diffuser3)
        groupPlatform.add(groupAcoustic)

        scene.add(groupPlatform)
    }

    let ap = [
        [10.95, 2, 1, 0, 0, 0, 2],
        [13, 2, 1, 0, 0, 0, 2],
        [10.8, 4.2, 1, 0, -a15, 0, 1],
        [12, 4.2, 1.3, 0, 0, 0, 1],
        [13.2, 4.2, 1, 0, a15, 0, 1],
        [-10.95, 2, 1, 0, 0, 0, 2],
        [-13, 2, 1, 0, 0, 0, 2],
        [-10.8, 4.2, 1, 0, a15, 0, 1],
        [-12, 4.2, 1.3, 0, 0, 0, 1],
        [-13.2, 4.2, 1, 0, -a15, 0, 1],
        [5, 11.35, 11, a15, 0, 0, 1],
        [-5, 11.35, 11, a15, 0, 0, 1],
        [12, 11.35, 11, a15, 0, 0, 1],
        [-12, 11.35, 11, a15, 0, 0, 1]
    ]

    for (let i = 0; i < ap.length; i++) {
        MakeSpeaker(ap[i][0], ap[i][1], ap[i][2], ap[i][3], ap[i][4], ap[i][5], ap[i][6])
    }
}

MakeAcoustic()


// Создание ударной установки
function MakeDrumKit(X, Y, Z, Yrot, Sc) {
    const groupDrumKit = new THREE.Group()
    groupDrumKit.position.set(X, Y, Z)
    groupDrumKit.scale.set(Sc, Sc, Sc)
    groupDrumKit.rotateY(Yrot)

    // Барабан
    function MakeDrum(X, Y, Z, Xrot, Yrot, Zrot, H, R) {
        const groupDrum = new THREE.Group()
        const drum = new THREE.Mesh(new THREE.CylinderGeometry(R, R, H, 64, 1), drumKitColor)
        const steelstrip = new THREE.Mesh(new THREE.CylinderGeometry(R * 1.015, R * 1.015, H, 6, 1), metalicMaterial)
        const steelcircle1 = new THREE.Mesh(new THREE.CylinderGeometry(R * 1.03, R * 1.03, H * 0.06, 64, 1), metalicMaterial)
        const steelcircle2 = new THREE.Mesh(new THREE.CylinderGeometry(R * 1.03, R * 1.03, H * 0.06, 64, 1), metalicMaterial)
        const leather = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.999, R * 0.999, H * 1.061, 64, 1), drumKitLeather)

        steelcircle1.position.y = (H / 2)
        steelcircle2.position.y = -(H / 2)

        drum.castShadow = true
        steelstrip.castShadow = true
        steelcircle1.castShadow = true
        steelcircle2.castShadow = true
        leather.castShadow = true

        groupDrum.add(drum, steelcircle1, steelcircle2, leather, steelstrip)
        groupDrum.position.set(X, Y, Z)
        groupDrum.rotation.set(Xrot, Yrot, Zrot)
        groupDrumKit.add(groupDrum)
    }

    // Тарелка
    function MakeCymbal(X, Y, Z, Xrot, Yrot, Zrot, H, R) {
        const groupCymbal = new THREE.Group()
        const cymbal = new THREE.Mesh(new THREE.ConeGeometry(R, H, 64, 1), cymbalColor)
        cymbal.castShadow = true

        groupCymbal.add(cymbal)
        groupCymbal.position.set(X, Y, Z)
        groupCymbal.rotation.set(Xrot, Yrot, Zrot)
        groupDrumKit.add(groupCymbal)
    }

    function MakeStick(X, Y, Z, Xrot, Yrot, Zrot, H) {
        const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, H, 64, 1), metalicMaterial)
        stick.position.set(X, Y, Z)
        stick.rotation.set(Xrot, Yrot, Zrot)
        stick.castShadow = true

        groupDrumKit.add(stick)
    }

    function MakeStickLegs(X, Y, Z, H) {
        MakeStick(X - 0.25, Y, Z, 0, 0, -a30 * 2, 0.7)
        MakeStick(X + 0.25, Y, Z, 0, 0, a30 * 2, 0.7)
        MakeStick(X, Y, Z - 0.25, a30 * 2, 0, 0, 0.7)
        MakeStick(X, Y, Z + 0.25, -a30 * 2, 0, 0, 0.7)
        MakeStick(X, -0.63 + H / 2, Z, 0, 0, 0, H)
    }

    // Басс-барабан
    MakeDrum(0, 0.05, 0, a90, 0, 0, 1, 1)
    MakeStick(-1, -0.8, 0.5, 0, 0, -a45, 0.6)
    MakeStick(1, -0.8, 0.5, 0, 0, a45, 0.6)

    // Напольный том-том
    MakeDrum(-1.7, 0.4, -1.2, -a15 / 1.5, 0, -a15 / 1.5, 0.9, 0.6)
    MakeStick(-1.2, -0.7, -1.2, 0, 0, 0, 1.05)
    MakeStick(-2.37, -0.47, -1.2, 0, 0, 0, 1.05)
    MakeStick(-1.7, -0.5, -0.53, 0, 0, 0, 1.05)
    MakeStick(-1.7, -0.5, -1.2 - 0.5, 0, 0, 0, 1.05)

    // Малый барабан
    MakeDrum(1.5, 0.5, -1.2, 0, 0, 0, 0.4, 0.6)
    MakeStickLegs(1.5, -0.8, -1.2, 1.2)

    // Том-том альты
    MakeDrum(0.7, 1.5, -0.2, -a30, 0, a15, 0.5, 0.4)
    MakeDrum(-0.7, 1.5, -0.2, -a30, 0, -a15, 0.5, 0.4)
    MakeStick(0, 1.3, 0.2, 0, 0, 0, 0.6)
    MakeStick(0.2, 1.6, 0.1, -a15 * 4, 0, -a15 * 4, 0.47)
    MakeStick(-0.2, 1.6, 0.1, -a15 * 4, 0, a15 * 4, 0.47)

    // Большая тарелка
    MakeCymbal(-2, 2, -0.7, -a15, 0, -a15, 0.15, 0.8)
    MakeStick(-2.15, 1.7, -0.3, -a45, 0, -a15, 1.05)
    MakeStickLegs(-2.25, -0.8, 0, 2.2)

    // Малая тарелка (хай-хэт)
    MakeCymbal(2.2, 1.5, -0.5, 0, 0, 0, 0.1, 0.5)
    MakeCymbal(2.2, 1.39, -0.5, a180, 0, 0, 0.07, 0.5)
    MakeStickLegs(2.2, -0.8, -0.5, 2.1)

    // Табурет
    const stool = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.3, 64, 1), blackLeather)
    stool.position.set(0, 0.3, -2.2)
    stool.castShadow = true
    groupDrumKit.add(stool)
    MakeStickLegs(0, -0.8, -2.2, 0.8)

    groupPlatform.add(groupDrumKit)
}

MakeDrumKit(5.5, 1.5, 4, -a45 / 2, 1)

// Создание микрофона
function MakeMicro(X, Y, Z, Yrot, Sc) {
    const groupMicro = new THREE.Group()
    const stand1 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.08, 64, 1), blackLeather)
    const stand2 = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.15, 64, 1), blackLeather)
    const stick1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2, 64), metalicMaterial)
    const stick2 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1, 64), metalicMaterial)
    const micro1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.4, 64), blackLeather)
    const micro2 = new THREE.Mesh(new THREE.SphereGeometry(0.06, 32, 32), microMaterial)

    stand1.position.set(0, -0.96, 0)
    stand1.castShadow = true
    stand2.position.set(0, -0.85, 0)
    stand2.castShadow = true
    stick1.position.set(0, 0, 0)
    stick1.castShadow = true
    stick2.position.set(0, 1.2, -0.1)
    stick2.rotation.set(-a45 / 2, 0, 0)
    stick2.castShadow = true
    micro1.position.set(0, 1.65, -0.28)
    micro1.rotation.set(-a45, 0, 0)
    micro1.castShadow = true
    micro2.position.set(0, 1.8, -0.43)
    micro2.castShadow = true

    groupMicro.add(stick1, stick2, stand1, stand2, micro1, micro2)
    groupMicro.position.set(X, Y, Z)
    groupMicro.rotation.set(0, Yrot, 0)
    groupMicro.scale.set(Sc, Sc, Sc)
    groupPlatform.add(groupMicro)
}

MakeMicro(0, 1.75, 9, 0, 1.3)

// Создание прожекторов
let spotlightColors = ['#ff0000', '#ffff00', '#00ff00', '#0000ff', '#ff00ff']

function MakeSpotlight(group, lightsON, X, Y, Z, Xrot, Yrot, Zrot, Sc) {
    const groupMainSpotlight = new THREE.Group()
    const spotlight = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.4, 32, 1), blackLeather)
    const spotlightRing = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.03, 4, 32), blackLeather)
    const holder = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 16, 1), blackLeather)

    spotlight.position.set(0, 0, 0)
    spotlightRing.position.set(0, 0.2, 0)
    spotlightRing.rotation.set(a90, 0, 0)
    holder.position.set(0, -0.1, 0.2)
    holder.rotation.set(a90 + a45, 0, 0)

    const scolor = spotlightColors[Math.floor(Math.random() * spotlightColors.length)]
    const vectorOfLooking = new THREE.Vector3(0, 1, 0)

    if (lightsON) {
        const rectAreaLight = new THREE.RectAreaLight(scolor, 1, 0.5, 0.5)
        rectAreaLight.name = 'rectALname'
        rectAreaLight.position.set(0, 0.21, 0)
        rectAreaLight.rotation.set(a180, 0, 0)
        rectAreaLight.lookAt(vectorOfLooking)
        const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)

        const spotlightLight = new THREE.SpotLight(scolor, 3, 70, a30 * 5 / 6, 0.15, 0)
        spotlightLight.name = 'SLname'
        spotlightLight.castShadow = true
        spotlightLight.shadow.mapSize.width = 1024
        spotlightLight.shadow.mapSize.height = 1024
        spotlightLight.shadow.camera.fov = 30
        spotlightLight.shadow.camera.near = 1
        spotlightLight.shadow.camera.far = 6
        spotlightLight.position.set(0, 0.21, 0)
        spotlightLight.target.position.y = 1
        group.add(spotlightLight, spotlightLight.target, rectAreaLight, rectAreaLightHelper)
    }

    group.add(spotlight, spotlightRing)
    groupMainSpotlight.add(holder, group)
    groupMainSpotlight.position.set(X, Y, Z)
    groupMainSpotlight.rotation.set(Xrot, Yrot, Zrot)
    groupMainSpotlight.scale.set(Sc, Sc, Sc)
    groupPlatform.add(groupMainSpotlight)
}

// Создание массива из групп прожекторов
let sl = []
let slparams = [
    [-12, 10.65, 9.65, -a90 - a45, 0, 0, 2],
    [12, 10.65, 9.65, -a90 - a45, 0, 0, 2],
    [-6, 10.65, 9.65, -a90 - a45, 0, 0, 2],
    [6, 10.65, 9.65, -a90 - a45, 0, 0, 2],
    [0, 10.65, 9.65, -a90 - a45, 0, 0, 2],
    [-12, 10.65, 0.65, -a90 - a45, 0, 0, 2],
    [12, 10.65, 0.65, -a90 - a45, 0, 0, 2],
    [-6, 10.65, 0.65, -a90 - a45, 0, 0, 2],
    [6, 10.65, 0.65, -a90 - a45, 0, 0, 2],
    [0, 10.65, 0.65, -a90 - a45, 0, 0, 2],
]


for (let i = 0; i < 10; i++) {
    sl.push(new THREE.Group())
    MakeSpotlight(sl[i], spotlightsON, slparams[i][0], slparams[i][1], slparams[i][2], slparams[i][3], slparams[i][4], slparams[i][5], slparams[i][6])
}

let slnew = []
for (let i = 5; i < 10; i++) {
    slnew.push(sl[i])
}
for (let i = 0; i < 5; i++) {
    slnew[i].position.set(slparams[i + 5][0], slparams[i + 5][1] + 0.3, slparams[i + 5][2] - 0.2)
    slnew[i].scale.set(2, 2, 2)
    slnew[i].rotation.set(a90 + a45, 0, 0)
    scene.add(slnew[i])
}

if (!spotlightsON) {
    const groupSceneSpotlight = new THREE.Group()
    const groupSpotlight = new THREE.Group()
    MakeSpotlight(groupSpotlight, 0, 10.65, 9.65, -a90 - a45, 0, 0, 2)
    sl[4].position.y = 1000

    const vectorOfLooking = new THREE.Vector3(0, 1, 0)
    const scenerectAreaLight = new THREE.RectAreaLight(0xffffff, 2, 0.5, 0.5)
    scenerectAreaLight.position.set(0, 0.21, 0)
    scenerectAreaLight.rotation.set(a180, 0, 0)
    scenerectAreaLight.lookAt(vectorOfLooking)
    const rectAreaLightHelper = new RectAreaLightHelper(scenerectAreaLight)

    const sceneSpotlight = new THREE.SpotLight(0xffffff, 2, 100, a30 * 2, 0.15, 0)
    sceneSpotlight.castShadow = true
    sceneSpotlight.position.set(0, 0, 0)
    sceneSpotlight.shadow.mapSize.width = 1024
    sceneSpotlight.shadow.mapSize.height = 1024
    sceneSpotlight.shadow.camera.fov = 30
    sceneSpotlight.shadow.camera.near = 1
    sceneSpotlight.shadow.camera.far = 6
    sceneSpotlight.target.position.set(0, 1, 0)

    groupSpotlight.rotation.set(-a90 - a45, 0, 0)
    groupSpotlight.scale.set(2, 2, 2)
    groupSpotlight.add(sceneSpotlight, scenerectAreaLight, sceneSpotlight.target, rectAreaLightHelper)

    groupSceneSpotlight.add(groupSpotlight)
    groupSceneSpotlight.position.set(0, 11.2, 9.65)
    scene.add(groupSceneSpotlight)

    gui.add(groupSceneSpotlight.rotation, 'y').min(-a30 * 2).max(a30 * 2).step(0.01).name('Single spotlight rotation')
}





// CAMERA & RENDER & WINDOW ==============================================================================================
// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 1000)
camera.position.set(0, 12, 25)
camera.lookAt(groupPlatform.position)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Resize Window
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Double Click Fullscreen
window.addEventListener('dblclick', () => {

    const fullScreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if (!fullScreenElement) {

        if (canvas.requestFullscreen) {
            canvas.requestFullscreen()
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen()
        }

    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        } else if (document.webkitExitFullscreen) {
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
    cursor.y = -(event.clientY / sizes.height - 0.5)
})





// ANIMATION =======================================================================================================
const clock = new THREE.Clock()

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// GUI parametres
if (spotlightsON) {
    // регулировка скорости вращения прожекторов
    var speedcontrol = new function() {
        this.rotationSpeed = 0.5;
    }
    gui.add(speedcontrol, 'rotationSpeed', 0, 1).name('Spotlight rotation speed');

    // регулировка интенсивности прожекторов
    var spotlightintensity = new function() {
        this.intensity = 3;
    }
    gui.add(spotlightintensity, 'intensity', 1, 5).name('Spotlight intensity');

}

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update camera

    // Update objecs

    if (spotlightsON) {
        const XrotationCoef = speedcontrol.rotationSpeed * Math.sin(elapsedTime)
        const ZrotationCoef = speedcontrol.rotationSpeed * Math.cos(elapsedTime)
        const SLintensity = spotlightintensity.intensity

        sl[0].rotation.x = -XrotationCoef * 0.8
        sl[0].rotation.z = -ZrotationCoef
        sl[0].getObjectByName('SLname')['intensity'] = SLintensity
        sl[0].getObjectByName('rectALname')['intensity'] = SLintensity + 1

        sl[1].rotation.x = XrotationCoef
        sl[1].rotation.z = ZrotationCoef * 0.8
        sl[1].getObjectByName('SLname')['intensity'] = SLintensity
        sl[1].getObjectByName('rectALname')['intensity'] = SLintensity + 1

        sl[2].rotation.x = -XrotationCoef
        sl[2].rotation.z = ZrotationCoef
        sl[2].getObjectByName('SLname')['intensity'] = SLintensity
        sl[2].getObjectByName('rectALname')['intensity'] = SLintensity + 1

        sl[3].rotation.x = XrotationCoef * 0.8
        sl[3].rotation.z = -ZrotationCoef
        sl[3].getObjectByName('SLname')['intensity'] = SLintensity
        sl[3].getObjectByName('rectALname')['intensity'] = SLintensity + 1

        sl[4].rotation.x = XrotationCoef
        sl[4].rotation.z = ZrotationCoef
        sl[4].getObjectByName('SLname')['intensity'] = SLintensity
        sl[4].getObjectByName('rectALname')['intensity'] = SLintensity + 1



        slnew[0].rotation.y = -XrotationCoef
        slnew[0].rotation.z = -ZrotationCoef * 0.8
        slnew[0].getObjectByName('SLname')['intensity'] = SLintensity
        slnew[0].getObjectByName('rectALname')['intensity'] = SLintensity + 1

        slnew[1].rotation.y = XrotationCoef
        slnew[1].rotation.z = ZrotationCoef
        slnew[1].getObjectByName('SLname')['intensity'] = SLintensity
        slnew[1].getObjectByName('rectALname')['intensity'] = SLintensity + 1

        slnew[2].rotation.y = -XrotationCoef
        slnew[2].rotation.z = ZrotationCoef * 0.8
        slnew[2].getObjectByName('SLname')['intensity'] = SLintensity
        slnew[2].getObjectByName('rectALname')['intensity'] = SLintensity + 1

        slnew[3].rotation.y = XrotationCoef
        slnew[3].rotation.z = -ZrotationCoef
        slnew[3].getObjectByName('SLname')['intensity'] = SLintensity
        slnew[3].getObjectByName('rectALname')['intensity'] = SLintensity + 1

        slnew[4].rotation.y = XrotationCoef
        slnew[4].rotation.z = ZrotationCoef * 0.8
        slnew[4].getObjectByName('SLname')['intensity'] = SLintensity
        slnew[4].getObjectByName('rectALname')['intensity'] = SLintensity + 1

    }

    if (!spotlightsON) {

    }

    // Render
    renderer.render(scene, camera)

    // Update controls
    controls.update()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()