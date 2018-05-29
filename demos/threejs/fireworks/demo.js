/*eslint-disable*/
"use strict";

// SETTINGS of this demo :
const SETTINGS = {
    rotationOffsetX: 0, // negative -> look upper. in radians
    cameraFOV: 40,      // in degrees, 3D camera FOV
    pivotOffsetYZ: [0.2,0.2], // XYZ of the distance between the center of the cube and the pivot
    detectionThreshold: 0.75, // sensibility, between 0 and 1. Less -> more sensitive
    detectionHysteresis: 0.05,
    scale: 1 // scale of the 3D cube
};

// some globalz :
let THREEVIDEOTEXTURE
let THREERENDERER
let THREEFACEOBJ3D
let THREEFACEOBJ3DPIVOTED
let THREESCENE
let THREECAMERA;
let ISDETECTED = false;
let ROCKETS = [];
let PARTICLES = [];

let ROCKETSOBJ3D = false;
let PARTICLESOBJ3D = new THREE.Object3D();
let PARTCONTOBJ3D = new THREE.Object3D();
let FIREWORKOBJ3D;

let numberRockets = 9;

// callback : launched if a face is detected or lost. TODO : add a cool particle effect WoW !
function detect_callback(isDetected) {
    if (isDetected) {
        console.log('INFO in detect_callback() : DETECTED');
    } else {
        console.log('INFO in detect_callback() : LOST');
    }
}

// build the 3D. called once when Jeeliz Face Filter is OK
function init_threeScene(spec) {
    // INIT THE THREE.JS context
    THREERENDERER = new THREE.WebGLRenderer({
        context: spec.GL,
        canvas: spec.canvasElement
    });

    // COMPOSITE OBJECT WHICH WILL FOLLOW THE HEAD
    // in fact we create 2 objects to be able to shift the pivot point
    THREEFACEOBJ3D = new THREE.Object3D();
    THREEFACEOBJ3D.frustumCulled = false;
    THREEFACEOBJ3DPIVOTED = new THREE.Object3D();
    THREEFACEOBJ3DPIVOTED.frustumCulled = false;
    THREEFACEOBJ3DPIVOTED.position.set(0, -SETTINGS.pivotOffsetYZ[0], -SETTINGS.pivotOffsetYZ[1]);
    THREEFACEOBJ3DPIVOTED.scale.set(SETTINGS.scale, SETTINGS.scale, SETTINGS.scale);
    THREEFACEOBJ3D.add(THREEFACEOBJ3DPIVOTED);


    // CREATE THE SCENE
    THREESCENE = new THREE.Scene();
    THREESCENE.add(THREEFACEOBJ3D);


    FIREWORKOBJ3D = new THREE.Object3D()

    // CREATE ROCKETS
    THREEFACEOBJ3DPIVOTED.add(FIREWORKOBJ3D)

    let particleMaterial = new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(generateSprite()),
        blending: THREE.AdditiveBlending
    });

    if (!ROCKETSOBJ3D) {
        ROCKETSOBJ3D = new THREE.Object3D()
        ROCKETS = []
        let rocket
        for (let i = 0; i <= numberRockets; i++) {
            rocket = new THREE.Sprite(particleMaterial)
            rocket.position.x = Math.random()*1.5 - 0.75
            rocket.position.y = -2
            rocket.renderOrder = 100000
            rocket.scale.multiplyScalar(0.08)
            rocket.visible = false
            ROCKETSOBJ3D.add(rocket)
            ROCKETS.push(rocket)
        }
    }

    ROCKETS.forEach((r, index) => {
        r.position.y = -4
        r.visible = false
        setTimeout(() => {
            const positive = Math.random()*2 - 1 > 0 ? 1 : -1
            r.position.x = ((Math.random()*0.5) + 0.5) *  positive

            animateRocket(r, index)
        }, 1200*index)
    })

    FIREWORKOBJ3D.add(ROCKETSOBJ3D)

    // CREATE PARTICLES

    let particle;
    PARTICLES = [];
    let PARTICLESINSTANCE;
    const colors = ['red', 'yellow', 'green', 'blue', 'pink', 'red', 'yellow', 'green', 'blue', 'yellow'];
    
    PARTCONTOBJ3D = new THREE.Object3D()

    colors.forEach((color) => {
        PARTICLESINSTANCE = [];
        PARTICLESOBJ3D = new THREE.Object3D();

        particleMaterial = new THREE.SpriteMaterial({
            map: new THREE.CanvasTexture(generateSprite(color)),
            blending: THREE.AdditiveBlending
        });

        for (let i = 0; i <= 100; i++) {
            particle = new THREE.Sprite(particleMaterial);

            particle.renderOrder = 100000
            particle.scale.multiplyScalar(3)
            particle.visible = false
            PARTICLESINSTANCE.push(particle);
            
            PARTICLESOBJ3D.add(particle);
        }
        PARTICLES.push(PARTICLESINSTANCE)
        PARTCONTOBJ3D.add(PARTICLESOBJ3D)
    })
    FIREWORKOBJ3D.add(PARTCONTOBJ3D)  

    THREEFACEOBJ3DPIVOTED.add(FIREWORKOBJ3D)

    // init video texture with red
    THREEVIDEOTEXTURE = new THREE.DataTexture(new Uint8Array([255,0,0]), 1, 1, THREE.RGBFormat);
    THREEVIDEOTEXTURE.needsUpdate = true;

    // CREATE THE VIDEO BACKGROUND
    const videoMaterial = new THREE.RawShaderMaterial({
        depthWrite: false,
        depthTest: false,
        vertexShader: "attribute vec2 position;\n\
            varying vec2 vUV;\n\
            void main(void){\n\
                gl_Position=vec4(position, 0., 1.);\n\
                vUV=0.5+0.5*position;\n\
            }",
        fragmentShader: "precision lowp float;\n\
            uniform sampler2D samplerVideo;\n\
            varying vec2 vUV;\n\
            void main(void){\n\
                gl_FragColor=texture2D(samplerVideo, vUV);\n\
            }",
         uniforms:{
            samplerVideo: { value: THREEVIDEOTEXTURE }
         }
    });
    const videoGeometry = new THREE.BufferGeometry()
    const videoScreenCorners = new Float32Array([-1,-1,   1,-1,   1,1,   -1,1]);
    videoGeometry.addAttribute('position', new THREE.BufferAttribute( videoScreenCorners, 2));
    videoGeometry.setIndex(new THREE.BufferAttribute(new Uint16Array([0,1,2, 0,2,3]), 1));
    const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
    videoMesh.onAfterRender = function () {
        // replace THREEVIDEOTEXTURE.__webglTexture by the real video texture
        THREERENDERER.properties.update(THREEVIDEOTEXTURE, '__webglTexture', spec.videoTexture);
        THREEVIDEOTEXTURE.magFilter = THREE.LinearFilter;
        THREEVIDEOTEXTURE.minFilter = THREE.LinearFilter;
        delete(videoMesh.onAfterRender);
    };
    videoMesh.renderOrder = -1000; // render first
    videoMesh.frustumCulled = false;
    THREESCENE.add(videoMesh);

    // CREATE THE CAMERA
    const aspecRatio = spec.canvasElement.width / spec.canvasElement.height;
    THREECAMERA = new THREE.PerspectiveCamera(SETTINGS.cameraFOV, aspecRatio, 0.1, 100);
} // end init_threeScene()

// Generates a canvas which we'll use as particles
function generateSprite(color) {
    var canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    var context = canvas.getContext('2d');
    var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    gradient.addColorStop(0.5, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
    gradient.addColorStop(0.5, color ? color : 'blue');
    gradient.addColorStop(1, 'rgba(0,0,0,0.1)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    return canvas;
}

// Animates our rockets
function animateRocket(rocket, index) {
    rocket.visible = true
    new TWEEN.Tween(rocket.position)
        .to({ y: 1 }, 2000)
        .onComplete(() => {
            PARTICLES[index].forEach((part, ind) => {
                part.position.set(rocket.position.x, rocket.position.y, rocket.position.z)
                animateParticle(part, rocket, ind)
            })

            rocket.visible = false
            setTimeout(() => {
                const positive = Math.random()*2 - 1 > 0 ? 1 : -1
                rocket.position.x = ((Math.random()*0.5) + 0.5) *  positive
                rocket.position.y = -4
                animateRocket(rocket, index)
            }, 3000)
        })
        .start();
}


function animateParticle( particle, rocket, index ) {
    particle.visible = true;
    var radiusEnd = 100;


    // var theta = Math.clz32(Math.random()*2*Math.PI); //angle in the plane XY
    var theta = Math.log10(Math.random()*2*Math.PI); //angle in the plane XY
    // var theta = Math.imul(Math.random()*2*Math.PI); //angle in the plane XY
    // var theta = Math.sign(Math.random()*2*Math.PI); //angle in the plane XY
    // var theta = Math.cbrt(Math.random()*2*Math.PI); //angle in the plane XY
    var phi = (Math.random()*2-1)*Math.PI/4 //angle between plane XY and the particle. 0-> in the plane XY

    particle.rotation._z = particle.rotation.z*Math.random()

    new TWEEN.Tween( particle.position )
        .to( {x: 0.04*radiusEnd*Math.cos(theta)*Math.sin(phi),
              y: 0.04*radiusEnd*Math.sin(theta)*Math.cos(phi),
              /*z: 0.01*radiusEnd*Math.sin(phi)*/ }, 2000)
        .start();

    //tween scale :
    particle.scale.x = particle.scale.y = Math.random() * 0.1
    new TWEEN.Tween( particle.scale )
        .to( {x: 0.0001, y: 0.0001}, 2000)
        .start();
}

//launched by body.onload() :
function main(){
    JeelizResizer.size_canvas({
        canvasId: 'jeeFaceFilterCanvas',
        callback: function(isError, bestVideoSettings){
            init_faceFilter(bestVideoSettings);
        }
    })
} //end main()

function init_faceFilter(videoSettings){
    JEEFACEFILTERAPI.init({
        canvasId: 'jeeFaceFilterCanvas',
        NNCpath: '../../../dist/', // root of NNC.json file
        videoSettings: videoSettings,
        callbackReady: function (errCode, spec) {
            if (errCode) {
                console.log('AN ERROR HAPPENS. SORRY BRO :( . ERR =', errCode);
                return;
            }

            console.log('INFO : JEEFACEFILTERAPI IS READY');
            init_threeScene(spec);
        }, // end callbackReady()

        // called at each render iteration (drawing loop)
        callbackTrack: function (detectState) {
            if (ISDETECTED && detectState.detected < SETTINGS.detectionThreshold - SETTINGS.detectionHysteresis) {
                // DETECTION LOST
                detect_callback(false);
                ISDETECTED = false;
            } else if (!ISDETECTED && detectState.detected > SETTINGS.detectionThreshold + SETTINGS.detectionHysteresis) {
                // FACE DETECTED
                detect_callback(true);
                ISDETECTED = true;
            }

            if (ISDETECTED) {
                // move the cube in order to fit the head
                const tanFOV = Math.tan(THREECAMERA.aspect * THREECAMERA.fov * Math.PI / 360); // tan(FOV/2), in radians
                const W = detectState.s;  // relative width of the detection window (1-> whole width of the detection window)
                const D = 1 / (2 * W * tanFOV); // distance between the front face of the cube and the camera
                
                // coords in 2D of the center of the detection window in the viewport :
                const xv = detectState.x;
                const yv = detectState.y;
                
                // coords in 3D of the center of the cube (in the view coordinates system)
                const z = -D - 0.5;   // minus because view coordinate system Z goes backward. -0.5 because z is the coord of the center of the cube (not the front face)
                const x = xv * D * tanFOV;
                const y = yv * D * tanFOV / THREECAMERA.aspect;

                // move and rotate the cube
                THREEFACEOBJ3D.position.set(x, y + SETTINGS.pivotOffsetYZ[0], z + SETTINGS.pivotOffsetYZ[1]);
                THREEFACEOBJ3D.rotation.set(detectState.rx + SETTINGS.rotationOffsetX, detectState.ry, detectState.rz, "XYZ");
            }
            TWEEN.update()
            // reinitialize the state of THREE.JS because JEEFACEFILTER have changed stuffs
            THREERENDERER.state.reset();

            // trigger the render of the THREE.JS SCENE
            THREERENDERER.render(THREESCENE, THREECAMERA);
        } // end callbackTrack()
    }); // end JEEFACEFILTERAPI.init call
} // end main()

