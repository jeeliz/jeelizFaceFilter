"use strict";

// SETTINGS of this demo :
const SETTINGS = {
    rotationOffsetX: 0, // negative -> look upper. in radians
    cameraFOV: 40,      // in degrees, 3D camera FOV
    pivotOffsetYZ: [0.1,-0.25], // XYZ of the distance between the center of the cube and the pivot
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

let GLASSESOBJ3D = new THREE.Object3D();

let CANVAS;
let NUMBERBEES = 8;
let ACTIONS = [];
let MIXERS = [];

let ISANIMATED;

let BEEMESH;
let BEEOBJ3D;


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
    // grab a reference to our canvas
    CANVAS = document.getElementById('jeeFaceFilterCanvas')

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

    let frameMesh;
    let lensesMesh;
    let branchesMesh;
    let decoMesh;

    const loadingManager = new THREE.LoadingManager();

    // CREATE OUR FRAME
    const loaderFrame = new THREE.BufferGeometryLoader(loadingManager);

    loaderFrame.load(
        './models/glasses/frame.json',
        (geometry) => {
            const mat = new THREE.MeshPhongMaterial({
                color: 0x000000,
                shininess: 2,
                specular: 0xffffff,
                transparent: true
            });

            frameMesh = new THREE.Mesh(geometry, mat);
            frameMesh.scale.multiplyScalar(0.0067);
            frameMesh.frustumCulled = false;
            frameMesh.renderOrder = 10000;
        }
    )

    // CREATE OUR LENSES
    const loaderLenses = new THREE.BufferGeometryLoader(loadingManager);

    loaderLenses.load(
        './models/glasses/lenses.json',
        (geometry) => {
            const mat = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load('./models/glasses/texture_mp.jpg')
            });

            lensesMesh = new THREE.Mesh(geometry, mat);
            lensesMesh.scale.multiplyScalar(0.0067);
            lensesMesh.frustumCulled = false;
            lensesMesh.renderOrder = 10000;
        }
    )
    // CREATE OUR BRANCHES
    const loaderBranches = new THREE.BufferGeometryLoader(loadingManager);

    loaderBranches.load(
        './models/glasses/branches.json',
        (geometry) => {
            const mat = new THREE.MeshBasicMaterial({
                alphaMap: new THREE.TextureLoader().load('./models/glasses/alpha_branches.jpg'),
                map: new THREE.TextureLoader().load('./models/glasses/textureBlack.jpg'),
                transparent: true
            });

            branchesMesh = new THREE.Mesh(geometry, mat);
            branchesMesh.scale.multiplyScalar(0.0067);
            branchesMesh.frustumCulled = false;
            branchesMesh.renderOrder = 10000;
        }
    )

    // CREATE OUR DECO
    const loaderDeco = new THREE.BufferGeometryLoader(loadingManager);

    loaderDeco.load(
        './models/glasses/deco.json',
        (geometry) => {
            const mat = new THREE.MeshBasicMaterial({
                color: 0xffffff
            });

            decoMesh = new THREE.Mesh(geometry, mat);
            decoMesh.scale.multiplyScalar(0.0067);
            
            decoMesh.frustumCulled = false;
            decoMesh.renderOrder = 10000;
        }
    )

    loadingManager.onLoad = () => {
        GLASSESOBJ3D.add(branchesMesh);
        GLASSESOBJ3D.add(frameMesh);
        GLASSESOBJ3D.add(lensesMesh);
        
        GLASSESOBJ3D.add(decoMesh);
        GLASSESOBJ3D.position.setY(0.05);

        addDragEventListener(GLASSESOBJ3D);

        THREEFACEOBJ3DPIVOTED.add(GLASSESOBJ3D);
    }

    // ADD OUR BEES
    const beeLoader = new THREE.JSONLoader();

    beeLoader.load(
        './models/bee/bee.json',
        (geometry) => {

            const materialBee = new THREE.MeshLambertMaterial({
                map: new THREE.TextureLoader().load('./models/bee/texture_bee.jpg'),
                transparent: true,
                morphTargets: true
            });

            BEEMESH = new THREE.Mesh(geometry, materialBee);

            // let butterFlyInstance
            // let action;
            let clips;
            let clip;
            let xRand;
            let yRand;
            let zRand;

            BEEOBJ3D = new THREE.Object3D();

            for (let i = 1; i < NUMBERBEES; i++) {
                const sign = i % 2 === 0 ? 1 : -1;
                const beeInstance = BEEMESH.clone();



                xRand = Math.random() * 1.5 - 0.75;
                yRand = Math.random() * 2 - 1 + 1;
                zRand = Math.random() * 0.5 - 0.25;

                beeInstance.position.set(xRand, yRand, zRand);
                beeInstance.scale.multiplyScalar(0.1);
                animateFlyBees(beeInstance, sign * ((i + 1) * 0.005 + 0.01), sign);
                let BEEINSTANCEOBJ3D = new THREE.Object3D();
                BEEINSTANCEOBJ3D.add(beeInstance);

                // CREATE BATTEMENT D'AILE ANIMATION
                if (!ISANIMATED) {
                    // This is where adding our animation begins
                    const mixer = new THREE.AnimationMixer(beeInstance);

                    clips = beeInstance.geometry.animations;

                    clip = clips[0];


                    const action = mixer.clipAction(clip);


                    ACTIONS.push(action);
                    MIXERS.push(mixer);
                }

                BEEOBJ3D.add(BEEINSTANCEOBJ3D);
            }

            // We play the animation for each butterfly and shift their cycles
            // by adding a small timeout
            ACTIONS.forEach((a, index) => {
                setTimeout(() => {
                    a.play();
                }, index*33);
            });

            
            THREEFACEOBJ3DPIVOTED.add(BEEOBJ3D);
        }
    )

    // CREATE THE SCENE
    THREESCENE = new THREE.Scene();
    THREESCENE.add(THREEFACEOBJ3D);

    // init video texture with red
    THREEVIDEOTEXTURE = new THREE.DataTexture(new Uint8Array([255,0,0]), 1, 1, THREE.RGBFormat);
    THREEVIDEOTEXTURE.needsUpdate = true;

    // CREATE THE VIDEO BACKGROUND
    function create_mat2d(threeTexture, isTransparent){ //MT216 : we put the creation of the video material in a func because we will also use it for the frame
        return new THREE.RawShaderMaterial({
            depthWrite: false,
            depthTest: false,
            transparent: isTransparent,
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
                samplerVideo: { value: threeTexture }
             }
        });
    }
    const videoMaterial =create_mat2d(THREEVIDEOTEXTURE, false);
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

    //MT216 : create the frame. We reuse the geometry of the video
    const calqueMesh = new THREE.Mesh(videoGeometry,  create_mat2d(new THREE.TextureLoader().load('./images/frame.png'), true))
    calqueMesh.renderOrder = 999; // render last
    calqueMesh.frustumCulled = false;
    THREESCENE.add(calqueMesh);

    // CREATE THE CAMERA
    const aspecRatio = spec.canvasElement.width / spec.canvasElement.height;
    THREECAMERA = new THREE.PerspectiveCamera(SETTINGS.cameraFOV, aspecRatio, 0.1, 100);

    // CREATE A LIGHT
    const ambient = new THREE.AmbientLight(0xffffff, 1);
    THREESCENE.add(ambient)

    var dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(100, 1000, 100);

    THREESCENE.add(dirLight)
} // end init_threeScene()

function animateFlyBees(mesh, theta, sign) {
    let count = 0
    setInterval(() => {
        count += 1
        const x = mesh.position.x
        const z = mesh.position.z
        const y = mesh.position.y
        const rotY = mesh.rotation._y

        mesh.position.set(
            (x * Math.cos(theta) + z * Math.sin(theta)),
            (y * Math.cos(theta) + x * Math.sin(theta))*0.96 + 0.05,
            (z * Math.cos(theta) - x * Math.sin(theta)) //(z * Math.cos(0.03*theta) - x * Math.sin(0.03*theta)*theta)
        )
        mesh.rotation.set(-(x * Math.cos(theta) + z * Math.sin(theta))*sign, -(y * Math.cos(theta) + z * Math.sin(theta))*sign, -(z * Math.cos(theta) - x * Math.sin(theta))*sign)
        // mesh.rotation._y = Math.sin(Math.random()*2*Math.PI*100)
    }, 16)
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
                    m.update(0.16);
                })
            }

            // trigger the render of the THREE.JS SCENE
            THREERENDERER.render(THREESCENE, THREECAMERA);
        } // end callbackTrack()
    }); // end JEEFACEFILTERAPI.init call
} // end main()

