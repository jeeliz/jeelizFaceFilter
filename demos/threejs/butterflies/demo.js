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
let BUTTERFLYMESH;
let BUTTERFLYOBJ3D = false;
let NUMBERBUTTERFLIES = 10;
let MIXERS = [];
let ACTIONS = [];
let ISANIMATED = false;


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

    // ADD OUR BUTTERFLY
    const butterflyLoader = new THREE.JSONLoader()

    butterflyLoader.load(
        './models/butterfly/butterfly.json',
        (geometry) => {
            const materialBody = new THREE.MeshBasicMaterial({
                color: 0x000000,
                depthWrite: false,
                opacity: 0
            });

            // let butterFlyInstance
            // let action;
            let clips;
            let clip;
            let xRand;
            let yRand;
            let zRand;
            let indexTexture;
            let sign;

            BUTTERFLYOBJ3D = new THREE.Object3D();

            for (let i = 2; i <= NUMBERBUTTERFLIES; i++) {
                const indexTexture = i % 6 === 0 ? 1 : i % 6;

                const materialWings = new THREE.MeshLambertMaterial({
                    map: new THREE.TextureLoader().load(`./models/butterfly/Wing_Diffuse_${indexTexture}.jpg`),
                    alphaMap: new THREE.TextureLoader().load('./models/butterfly/Wing_Alpha.jpg'),
                    transparent: true,
                    morphTargets: true,
                    opacity: 0
                });
                const butterFlyInstance = new THREE.Mesh(geometry, [materialWings, materialBody]);

                xRand = Math.random() * 2 - 1;
                yRand = Math.random() * 1 + 0.1;
                zRand = Math.random() * 1 + 0.5;

                sign = i % 2 === 0 ? -1 : 1;

                butterFlyInstance.position.set(xRand, yRand, zRand);
                butterFlyInstance.scale.multiplyScalar(0.55);
                butterFlyInstance.visible = false;
                let BUTTERFLYINSTANCEOBJ3D = new THREE.Object3D();
                setTimeout(() => {
                    animateFly(butterFlyInstance, 0.01*(i + 3)*0.1 + 0.002, i)
                    butterFlyInstance.material[0].opacity = 1;
                    butterFlyInstance.material[1].opacity = 1;
                    butterFlyInstance.visible = true
                    BUTTERFLYINSTANCEOBJ3D.add(butterFlyInstance)
                }, 600*i);


                // CREATE BATTEMENT D'AILE ANIMATION
                if (!ISANIMATED) {
                    // This is where adding our animation begins
                    const mixer = new THREE.AnimationMixer(butterFlyInstance);       

                    clips = butterFlyInstance.geometry.animations;

                    clip = clips[0];


                    const action = mixer.clipAction(clip);


                    ACTIONS.push(action);
                    MIXERS.push(mixer);
                }


                // ADD OUR LIGHTS INSIDE THE BUTTERFLY TO CREATE A GLOWING EFFECT
                let pointLight = new THREE.PointLight(0x77ffff, 1, 1, 0.1);
                pointLight.position.set(xRand, yRand, zRand);


                setTimeout(() => {
                    animatePointLightButterfly(pointLight);
                    animateFly(pointLight, 0.01*(i + 3)*0.1 + 0.002, i);
                }, 600*i);

                // Helps visualise the pointlights added
                // uncomment to display
                var sphereSize = 1;
                var pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
                // THREESCENE.add( pointLightHelper )

                BUTTERFLYINSTANCEOBJ3D.add(pointLight);


                BUTTERFLYOBJ3D.add(BUTTERFLYINSTANCEOBJ3D);
            }

            // We play the animation for each butterfly and shift their cycles
            // by adding a small timeout
            ACTIONS.forEach((a, index) => {
                setTimeout(() => {
                    a.play();
                }, index*33)
            })

            
            THREEFACEOBJ3DPIVOTED.add(BUTTERFLYOBJ3D);
        }
    )

    // CREATE THE SCENE
    THREESCENE = new THREE.Scene();
    THREESCENE.add(THREEFACEOBJ3D);

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

    // CREATE A LIGHT
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    THREESCENE.add(ambient);

    // CREATE A SPOTLIGHT
    var dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(100, 1000, 100);

    THREESCENE.add(dirLight);
} // end init_threeScene()

function animateFly(mesh, theta, index) {
    let count = 0
    const x = mesh.position.x//(Math.random() + 0.5) * 1.5
    const y = mesh.position.y// Math.random()*0.2 + 0.1
    const z = mesh.position.z// Math.random()*0.2 + 0.1
    
    setInterval(() => {
        count += 0.01

        const rotY = mesh.rotation._y

        mesh.position.set(
            (x + (index*0.01)) * Math.cos(count), // - 1 * Math.sin(count/100+(Math.PI/40)),
            (y*0.5 + (index*0.01)) * Math.sin(count*0.2*index) + 1,
            (z + (index*0.01)) * Math.sin(count) // - 1 * Math.sin(count/100+(Math.PI/40))
        ) 
        mesh.rotation.y = (1.5 * Math.cos(count+0.05)) + 0.3;
        mesh.rotation.z = 0.2 * Math.sin(count)
    }, 16)
}

function animatePointLightButterfly (light) {
    const opacityUp = new TWEEN.Tween(light)
    .to({ intensity: 0.6 }, 2000)

    const opacityDown = new TWEEN.Tween(light)
    .to({ intensity: 0 }, 2000)

    opacityUp.chain(opacityDown)

    opacityDown.onComplete(() => {
        opacityUp.start()
    })

    opacityUp.start()
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

            // reinitialize the state of THREE.JS because JEEFACEFILTER have changed stuffs
            THREERENDERER.state.reset();


            TWEEN.update()
            if (MIXERS.length > 1) {
                MIXERS.forEach((m) => {
                    m.update(0.13);
                })
            }

            // trigger the render of the THREE.JS SCENE
            THREERENDERER.render(THREESCENE, THREECAMERA);
        } // end callbackTrack()
    }); // end JEEFACEFILTERAPI.init call
} // end main()

