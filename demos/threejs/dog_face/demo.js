"use strict";

// SETTINGS of this demo :
const SETTINGS = {
    rotationOffsetX: 0, // negative -> look upper. in radians
    cameraFOV: 40,      // in degrees, 3D camera FOV
    pivotOffsetYZ: [-0.2, -0.4], // XYZ of the distance between the center of the cube and the pivot
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
let TONGUEMESH;
let NOSEMESH;
const DOGOBJ3D = new THREE.Object3D();
let EARMESH;
let CANVAS;

let ISOVERTHRESHOLD = false;
let ISUNDERTRESHOLD = true;

let ISLOADED = false;

let MOUSEVECTOR = new THREE.Vector3()
let DIRECTIONVECTOR = new THREE.Vector3()
let VIEWPORTVECTOR = new THREE.Vector3()
var _headCenterZ = -1;

let MIXER = false;
let ACTION = false;

let ISANIMATING = false;
let ISOPAQUE = false;
let ISTONGUEOUT = false;
let ISANIMATIONOVER = false;

let y_ears;

let _flexParts=[];

let VIDEOGEOMETRY;
let FRAMEOBJ3D = new THREE.Object3D();

// callback : launched if a face is detected or lost. TODO : add a cool particle effect WoW !
function detect_callback(isDetected) {
    if (isDetected) {
        console.log('INFO in detect_callback() : DETECTED');
    } else {
        console.log('INFO in detect_callback() : LOST');
    }
}

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

function applyFilter() {
    let canvas;
    try {
        canvas = fx.canvas();
    } catch (e) {
        alert('Ow no! WebGL isn\'t supported...')
        return
    }

    const tempImage = new Image(512, 512);
    tempImage.src = './images/texture_pink.jpg';

    tempImage.onload = () => {
        const texture = canvas.texture(tempImage);

        // Create the effet
        canvas.draw(texture).vignette(0.5, 0.6).update();

        const canvasOpacity = document.createElement('canvas');
        canvasOpacity.width = 512;
        canvasOpacity.height = 512;
        const ctx = canvasOpacity.getContext('2d');

        ctx.globalAlpha = 0.2
        ctx.drawImage(canvas, 0, 0, 512, 512);

        // Add the effect
        const calqueMesh = new THREE.Mesh(VIDEOGEOMETRY,  create_mat2d(new THREE.TextureLoader().load(canvasOpacity.toDataURL('image/png')), true))
        calqueMesh.material.opacity = 0.2;
        calqueMesh.material.transparent = true;
        calqueMesh.renderOrder = 999; // render last
        calqueMesh.frustumCulled = false;
        FRAMEOBJ3D.add(calqueMesh);
    }
}

// build the 3D. called once when Jeeliz Face Filter is OK
function init_threeScene(spec) {
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




    // CREATE OUR DOG EARS

    // let's begin by creating a loading manager that will allow us to
    // have more control over the three parts of our dog model
    const loadingManager = new THREE.LoadingManager();

    const loaderEars = new THREE.BufferGeometryLoader(loadingManager);

    loaderEars.load(
        './models/dog/dog_ears.json',
        function (geometry) {
            const mat = new THREE.FlexMaterial({
                map: new THREE.TextureLoader().load('./models/dog/texture_ears.jpg'),
                flexMap: new THREE.TextureLoader().load('./models/dog/flex_ears_256.jpg'),
                alphaMap: new THREE.TextureLoader().load('./models/dog/alpha_ears_256.jpg'),
                transparent: true,
                opacity: 1,
                bumpMap: new THREE.TextureLoader().load('./models/dog/normal_ears.jpg'),
                bumpScale: 0.0075,
                shininess: 1.5,
                specular: 0xffffff,
            });

            EARMESH = new THREE.Mesh(geometry, mat);
            EARMESH.scale.multiplyScalar(0.025);
            EARMESH.position.setY(-0.3);
            EARMESH.frustumCulled = false;
            EARMESH.renderOrder = 10000;
            EARMESH.material.opacity.value = 1;
        }
    )
    // CREATE OUR DOG NOSE
    const loaderNose = new THREE.BufferGeometryLoader(loadingManager);

    loaderNose.load(
        './models/dog/dog_nose.json',
        function (geometry) {
            const mat = new THREE.MeshPhongMaterial({
                map: new THREE.TextureLoader().load('./models/dog/texture_nose.jpg'),
                shininess: 1.5,
                specular: 0xffffff,
                bumpMap: new THREE.TextureLoader().load('./models/dog/normal_nose.jpg'),
                bumpScale: 0.005
            });

            NOSEMESH = new THREE.Mesh(geometry, mat);
            NOSEMESH.scale.multiplyScalar(0.018);
            NOSEMESH.position.setY(-0.05);
            NOSEMESH.position.setZ(0.15);
            NOSEMESH.frustumCulled = false;
            NOSEMESH.renderOrder = 10000;
        }
    )

    // CREATE OUR DOG TONGUE
    const loaderTongue = new THREE.JSONLoader(loadingManager)

    loaderTongue.load(
        'models/dog/dog_tongue.json',
        function (geometry) {
            geometry.computeMorphNormals();
            const mat = new THREE.FlexMaterial({
                map: new THREE.TextureLoader().load('./models/dog/dog_tongue.jpg'),
                flexMap: new THREE.TextureLoader().load('./models/dog/flex_tongue_256.png'),
                alphaMap: new THREE.TextureLoader().load('./models/dog/tongue_alpha_256.jpg'),
                transparent: true,
                morphTargets: true,
                opacity: 1
            });

            TONGUEMESH = new THREE.Mesh(geometry, mat);
            TONGUEMESH.material.opacity.value = 0;

            TONGUEMESH.scale.multiplyScalar(2);
            TONGUEMESH.position.setY(-0.28);

            TONGUEMESH.frustumCulled = false;
            //TONGUEMESH.renderOrder = 10000
            TONGUEMESH.visible = false;

            if (!MIXER) {
                // the mixer is declared globally so we can use it in the THREE renderer
                MIXER = new THREE.AnimationMixer(TONGUEMESH);
                const clips = TONGUEMESH.geometry.animations;

                const clip = clips[0];

                ACTION = MIXER.clipAction(clip);
                ACTION.noLoop = true;

                ACTION.play();
            }
        }
    )

    loadingManager.onLoad = () => {
        DOGOBJ3D.add(EARMESH);
        DOGOBJ3D.add(NOSEMESH);
        DOGOBJ3D.add(TONGUEMESH);

        addDragEventListener(DOGOBJ3D);
        // addResizeEventListener(DOGOBJ3D)

        THREEFACEOBJ3DPIVOTED.add(DOGOBJ3D);

        ISLOADED = true;
    }

    // CREATE THE SCENE
    THREESCENE = new THREE.Scene();
    THREESCENE.add(THREEFACEOBJ3D);

    // CREATE A LIGHT
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    THREESCENE.add(ambient)

    // CREAT A DIRECTIONALLIGHT
    var dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(100, 1000, 1000);

    THREESCENE.add(dirLight);

    // init video texture with red
    THREEVIDEOTEXTURE = new THREE.DataTexture(new Uint8Array([255,0,0]), 1, 1, THREE.RGBFormat);
    THREEVIDEOTEXTURE.needsUpdate = true;

    // CREATE THE VIDEO BACKGROUND
    const videoMaterial = create_mat2d(THREEVIDEOTEXTURE, false);
    VIDEOGEOMETRY = new THREE.BufferGeometry();
    const videoScreenCorners = new Float32Array([-1,-1,   1,-1,   1,1,   -1,1]);
    VIDEOGEOMETRY.addAttribute('position', new THREE.BufferAttribute( videoScreenCorners, 2));
    VIDEOGEOMETRY.setIndex(new THREE.BufferAttribute(new Uint16Array([0,1,2, 0,2,3]), 1));
    const videoMesh = new THREE.Mesh(VIDEOGEOMETRY, videoMaterial);
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

    THREESCENE.add(FRAMEOBJ3D);

    // Add filter
    applyFilter()
} // end init_threeScene()

function animateTongue (mesh, isReverse) {
    mesh.visible = true;

    if (isReverse) {
        ACTION.timescale = -1;
        ACTION.paused = false;

        setTimeout(() => {
            ACTION.paused = true;

            ISOPAQUE = false;
            ISTONGUEOUT = false;
            ISANIMATING = false;
            ISANIMATIONOVER = true;


            new TWEEN.Tween(mesh.material.opacity)
                .to({ value: 0 }, 150)
                .start();
        }, 150)
    } else {
        ACTION.timescale = 1;
        ACTION.reset();
        ACTION.paused = false;

        new TWEEN.Tween(mesh.material.opacity)
            .to({ value: 1 }, 100)
            .onComplete(() => {
                ISOPAQUE = true;
                setTimeout(() => {
                    ACTION.paused = true;
                    ISANIMATING = false;
                    ISTONGUEOUT = true;
                    ISANIMATIONOVER = true;
                }, 150)
            })
            .start();
    }
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

                //flex ears material
                if (EARMESH && EARMESH.material.set_amortized){
                    EARMESH.material.set_amortized(EARMESH.getWorldPosition(), EARMESH.getWorldScale(), EARMESH.getWorldRotation(), false, 0.1);
                }

                if (TONGUEMESH && TONGUEMESH.material.set_amortized){
                    TONGUEMESH.material.set_amortized(TONGUEMESH.getWorldPosition(), TONGUEMESH.getWorldScale(), TONGUEMESH.getWorldRotation(), false, 0.3);
                }

                if (detectState.expressions[0] >= 0.85 && !ISOVERTHRESHOLD) {
                    ISOVERTHRESHOLD = true;
                    ISUNDERTRESHOLD = false;
                    ISANIMATIONOVER = false;
                }
                if (detectState.expressions[0] <= 0.1 && !ISUNDERTRESHOLD) {
                    ISOVERTHRESHOLD = false;
                    ISUNDERTRESHOLD = true;
                    ISANIMATIONOVER = false;
                }

                if (ISLOADED && ISOVERTHRESHOLD && !ISANIMATING && !ISANIMATIONOVER) {
                    if (!ISTONGUEOUT) {
                        ISANIMATING = true;
                        animateTongue(TONGUEMESH);
                    } else {
                        ISANIMATING = true;
                        animateTongue(TONGUEMESH, true);
                    }
                }
            }

            // reinitialize the state of THREE.JS because JEEFACEFILTER have changed stuffs
            THREERENDERER.state.reset();

            TWEEN.update()


            // Update the mixer on each frame
            if (ISOPAQUE) {
                MIXER.update(0.16);
            }


            // trigger the render of the THREE.JS SCENE
            THREERENDERER.render(THREESCENE, THREECAMERA);
        } // end callbackTrack()
    }); // end JEEFACEFILTERAPI.init call
} // end main()

