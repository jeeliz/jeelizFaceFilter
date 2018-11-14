"use strict";


// SETTINGS of this demo :
const SETTINGS = {
    rotationOffsetX: 0, // negative -> look upper. in radians
    cameraFOV: 40,      // in degrees, 3D camera FOV
    pivotOffsetYZ: [-0.2, -0.5], // XYZ of the distance between the center of the cube and the pivot
    detectionThreshold: 0.5, // sensibility, between 0 and 1. Less -> more sensitive
    detectionHysteresis: 0.1,
    scale: 1 // scale of the 3D cube
};


// some globalz :
let THREEVIDEOTEXTURE;
let THREERENDERER;
let THREEFACEOBJ3D;
let THREEFACEOBJ3DPIVOTED
let THREESCENE;
let THREECAMERA;
let ISDETECTED = false;
let CANVAS;

let MOUSEVECTOR = new THREE.Vector3();
let DIRECTIONVECTOR = new THREE.Vector3();
let VIEWPORTVECTOR = new THREE.Vector3();

var _headCenterZ = -1;

let Z;

let FACEMESH;

let ANGELMESH1 = false;
let ANGELMESH2 = false;
let ANGELMESH3 = false;
let MIXERANGEL1 = false;
let MIXERANGEL2 = false;
let MIXERANGEL3 = false;
let ACTIONANGEL1 = false;
let ACTIONANGEL2 = false;
let ACTIONANGEL3 = false;

let HARPMESH1 = false;
let HARPMESH2 = false;
let HARPMESH3 = false;
let MIXERHARP1 = false;
let MIXERHARP2 = false;
let MIXERHARP3 = false;
let ACTIONHARP1 = false;
let ACTIONHARP2 = false;
let ACTIONHARP3 = false;

let DEMONMESH1 = false;
let DEMONMESH2 = false;
let DEMONMESH3 = false;
let MIXERDEMON1 = false;
let MIXERDEMON2 = false;
let MIXERDEMON3 = false;
let ACTIONDEMON1 = false;
let ACTIONDEMON2 = false;
let ACTIONDEMON3 = false;

let FORKMESH1 = false;
let FORKMESH2 = false;
let FORKMESH3 = false;
let MIXERFORK1 = false;
let MIXERFORK2 = false;
let MIXERFORK3 = false;
let ACTIONFORK1 = false;
let ACTIONFORK2 = false;
let ACTIONFORK3 = false;

let GROUPOBJ3D = new THREE.Object3D();

let isFighting = false;

let states = {
    intro: 0,
    idle: 1,
    fight: 2
}

let state = false;

let isLoaded = false;

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
    // get a reference for our canvas
    CANVAS = document.getElementById('jeeFaceFilterCanvas');

    $('#openMouthInstructions').hide();

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

    const loadingManager = new THREE.LoadingManager();


    /*
        LOAD ALL THE ANGEL MESHS
    */
    const loaderAngelIntro = new THREE.JSONLoader(loadingManager);

    loaderAngelIntro.load(
        './models/angel/angel_intro.json',
        function (geometry) {
            const mat = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("./models/angel/diffuse_angel.png"),
                morphTargets: true
            });

            ANGELMESH1 = new THREE.Mesh(geometry, mat);

            ANGELMESH1.frustumCulled = false;
            ANGELMESH1.side = THREE.DoubleSide;

            MIXERANGEL1 = new THREE.AnimationMixer(ANGELMESH1);
            const clipsAngel = ANGELMESH1.geometry.animations;

            const clipAngel = clipsAngel[0];

            ACTIONANGEL1 = MIXERANGEL1.clipAction(clipAngel);
        }
    )

    const loaderAngelIdle = new THREE.JSONLoader(loadingManager);

    loaderAngelIdle.load(
        './models/angel/angel_idle.json',
        function (geometry) {
            const mat = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("./models/angel/diffuse_angel.png"),
                morphTargets: true
            });

            ANGELMESH2 = new THREE.Mesh(geometry, mat);

            ANGELMESH2.frustumCulled = false;
            ANGELMESH2.side = THREE.DoubleSide;
            ANGELMESH2.visible = false;

            MIXERANGEL2 = new THREE.AnimationMixer(ANGELMESH2);
            const clipsAngel = ANGELMESH2.geometry.animations;

            const clipAngel = clipsAngel[0];

            ACTIONANGEL2 = MIXERANGEL2.clipAction(clipAngel);
        }
    )

    const loaderAngelFight = new THREE.JSONLoader(loadingManager);

    loaderAngelFight.load(
        './models/angel/angel_fight.json',
        function (geometry) {
            const mat = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("./models/angel/diffuse_angel.png"),
                morphTargets: true
            });

            ANGELMESH3 = new THREE.Mesh(geometry, mat);

            ANGELMESH3.frustumCulled = false;
            ANGELMESH3.side = THREE.DoubleSide;
            ANGELMESH3.visible = false;

            MIXERANGEL3 = new THREE.AnimationMixer(ANGELMESH3);
            const clipsAngel = ANGELMESH3.geometry.animations;

            const clipAngel = clipsAngel[0];

            ACTIONANGEL3 = MIXERANGEL3.clipAction(clipAngel);
        }
    )

    /*
        LOAD ALL HARP MESHS
    */


    const loaderHarpIntro = new THREE.JSONLoader(loadingManager);

    loaderHarpIntro.load(
        './models/angel/harp_intro.json',
        function (geometry) {
            const mat = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("./models/angel/harpe.jpg"),
                morphTargets: true
            });

            HARPMESH1 = new THREE.Mesh(geometry, mat);

            HARPMESH1.frustumCulled = false;
            HARPMESH1.side = THREE.DoubleSide;

            MIXERHARP1 = new THREE.AnimationMixer(HARPMESH1);
            const clipsHarp = HARPMESH1.geometry.animations;


            const clipHarp = clipsHarp[0];

            ACTIONHARP1 = MIXERHARP1.clipAction(clipHarp);  
        }
    )

    const loaderHarpIdle = new THREE.JSONLoader(loadingManager);

    loaderHarpIdle.load(
        './models/angel/harp_idle.json',
        function (geometry) {
            const mat = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("./models/angel/harpe.jpg"),
                morphTargets: true
            });

            HARPMESH2 = new THREE.Mesh(geometry, mat);

            HARPMESH2.frustumCulled = false;
            HARPMESH2.side = THREE.DoubleSide;
            HARPMESH2.visible = false;

            MIXERHARP2 = new THREE.AnimationMixer(HARPMESH2);
            const clipsHarp = HARPMESH2.geometry.animations;


            const clipHarp = clipsHarp[0];

            ACTIONHARP2 = MIXERHARP2.clipAction(clipHarp);     
        }
    )

    const loaderHarpFight = new THREE.JSONLoader(loadingManager);

    loaderHarpFight.load(
        './models/angel/harp_fight.json',
        function (geometry) {
            const mat = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("./models/angel/harpe.jpg"),
                morphTargets: true
            });

            HARPMESH3 = new THREE.Mesh(geometry, mat);

            HARPMESH3.frustumCulled = false;
            HARPMESH3.side = THREE.DoubleSide;
            HARPMESH3.visible = false;

            MIXERHARP3 = new THREE.AnimationMixer(HARPMESH3);
            const clipsHarp = HARPMESH3.geometry.animations;


            const clipHarp = clipsHarp[0];

            ACTIONHARP3 = MIXERHARP3.clipAction(clipHarp);          
        }
    )

    /*
        LOAD ALL DEMON MESHS
    */

    const loaderDemonIntro = new THREE.JSONLoader(loadingManager);

    loaderDemonIntro.load(
        './models/demon/demon_intro.json',
        function (geometry) {
            const mat = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("./models/demon/diffuse_demon.png"),
                morphTargets: true
            });

            DEMONMESH1 = new THREE.Mesh(geometry, mat);

            DEMONMESH1.frustumCulled = false;
            DEMONMESH1.side = THREE.DoubleSide;

            MIXERDEMON1 = new THREE.AnimationMixer(DEMONMESH1);
            const clipsDemon = DEMONMESH1.geometry.animations;


            const clipDemon = clipsDemon[0];

            ACTIONDEMON1 = MIXERDEMON1.clipAction(clipDemon);
        }
    )

    const loaderDemonIdle = new THREE.JSONLoader(loadingManager);

    loaderDemonIdle.load(
        './models/demon/demon_idle.json',
        function (geometry) {
            const mat = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("./models/demon/diffuse_demon.png"),
                morphTargets: true
            });

            DEMONMESH2 = new THREE.Mesh(geometry, mat);

            DEMONMESH2.frustumCulled = false;
            DEMONMESH2.side = THREE.DoubleSide;
            DEMONMESH2.visible = false;

            MIXERDEMON2 = new THREE.AnimationMixer(DEMONMESH2);
            const clipsDemon = DEMONMESH2.geometry.animations;


            const clipDemon = clipsDemon[0];

            ACTIONDEMON2 = MIXERDEMON2.clipAction(clipDemon);
        }
    )

    const loaderDemonFight = new THREE.JSONLoader(loadingManager);

    loaderDemonFight.load(
        './models/demon/demon_fight.json',
        function (geometry) {
            const mat = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("./models/demon/diffuse_demon.png"),
                morphTargets: true
            });

            DEMONMESH3 = new THREE.Mesh(geometry, mat);

            DEMONMESH3.frustumCulled = false;
            DEMONMESH3.side = THREE.DoubleSide;
            DEMONMESH3.visible = false;

            MIXERDEMON3 = new THREE.AnimationMixer(DEMONMESH3);
            const clipsDemon = DEMONMESH3.geometry.animations;


            const clipDemon = clipsDemon[0];

            ACTIONDEMON3 = MIXERDEMON3.clipAction(clipDemon);
        }
    )

    /*
        LOAD ALL FORK MESHS
    */

    const loaderForkIntro = new THREE.JSONLoader(loadingManager);

    loaderForkIntro.load(
        './models/demon/fourche_intro.json',
        function (geometry) {
            const mat = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("./models/demon/fourche.jpg"),
                morphTargets: true
            });

            FORKMESH1 = new THREE.Mesh(geometry, mat);

            FORKMESH1.frustumCulled = false;
            FORKMESH1.side = THREE.DoubleSide;

            MIXERFORK1 = new THREE.AnimationMixer(FORKMESH1);
            const clipsFork = FORKMESH1.geometry.animations;


            const clipFork = clipsFork[0];

            ACTIONFORK1 = MIXERFORK1.clipAction(clipFork);
        }
    )

    const loaderForkIdle = new THREE.JSONLoader(loadingManager);

    loaderForkIdle.load(
        './models/demon/fourche_idle.json',
        function (geometry) {
            const mat = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("./models/demon/fourche.jpg"),
                morphTargets: true
            });

            FORKMESH2 = new THREE.Mesh(geometry, mat);

            FORKMESH2.frustumCulled = false;
            FORKMESH2.side = THREE.DoubleSide;
            FORKMESH2.visible = false;

            MIXERFORK2 = new THREE.AnimationMixer(FORKMESH2);
            const clipsFork = FORKMESH2.geometry.animations;


            const clipFork = clipsFork[0];

            ACTIONFORK2 = MIXERFORK2.clipAction(clipFork);  
        }
    )

    const loaderForkFight = new THREE.JSONLoader(loadingManager);

    loaderForkFight.load(
        './models/demon/fourche_fight.json',
        function (geometry) {
            const mat = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("./models/demon/fourche.jpg"),
                morphTargets: true
            });

            FORKMESH3 = new THREE.Mesh(geometry, mat);

            FORKMESH3.frustumCulled = false;
            FORKMESH3.side = THREE.DoubleSide;
            FORKMESH3.visible = false;

            MIXERFORK3 = new THREE.AnimationMixer(FORKMESH3);
            const clipsFork = FORKMESH3.geometry.animations;


            const clipFork = clipsFork[0];

            ACTIONFORK3 = MIXERFORK3.clipAction(clipFork);
        }
    )


    // CREATE THE MASK
    const maskLoader = new THREE.BufferGeometryLoader(loadingManager);
    /*
    faceLowPolyEyesEarsFill.json has been exported from dev/faceLowPolyEyesEarsFill.blend using THREE.JS blender exporter with Blender v2.76
    */
    maskLoader.load('./models/face/face.json', function (maskBufferGeometry) {
        const vertexShaderSource = 'varying vec2 vUVvideo;\n\
        varying float vY, vNormalDotZ;\n\
        const float THETAHEAD=0.25;\n\
        void main() {\n\
            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0);\n\
            vec4 projectedPosition=projectionMatrix * mvPosition;\n\
            gl_Position=projectedPosition;\n\
            \n\
            //compute UV coordinates on the video texture :\n\
            vec4 mvPosition0 = modelViewMatrix * vec4( position, 1.0 );\n\
            vec4 projectedPosition0=projectionMatrix * mvPosition0;\n\
            vUVvideo=vec2(0.5,0.5)+0.5*projectedPosition0.xy/projectedPosition0.w;\n\
            vY=position.y*cos(THETAHEAD)-position.z*sin(THETAHEAD);\n\
            vec3 normalView=vec3(modelViewMatrix * vec4(normal,0.));\n\
            vNormalDotZ=pow(abs(normalView.z), 1.5);\n\
        }';

       const fragmentShaderSource = "precision lowp float;\n\
        uniform sampler2D samplerVideo;\n\
        varying vec2 vUVvideo;\n\
        varying float vY, vNormalDotZ;\n\
        void main() {\n\
            vec3 videoColor=texture2D(samplerVideo, vUVvideo).rgb;\n\
            float darkenCoeff=smoothstep(-0.15, 0.15, vY);\n\
            float borderCoeff=smoothstep(0.0, 0.85, vNormalDotZ);\n\
            gl_FragColor=vec4(videoColor*(1.-darkenCoeff), borderCoeff );\n\
            gl_FragColor=vec4(videoColor, borderCoeff );\n\
            // gl_FragColor=vec4(borderCoeff, 0., 0., 1.);\n\
            // gl_FragColor=vec4(darkenCoeff, 0., 0., 1.);\n\
        }";

        const mat = new THREE.ShaderMaterial({
            vertexShader: vertexShaderSource,
            fragmentShader: fragmentShaderSource,
            transparent: true,
            flatShading: false,
            uniforms: {
                samplerVideo:{ value: THREEVIDEOTEXTURE }
            }
           ,transparent: true
        });
        maskBufferGeometry.computeVertexNormals();
        FACEMESH = new THREE.Mesh(maskBufferGeometry, mat);
        FACEMESH.frustumCulled = false;
        FACEMESH.scale.multiplyScalar(1.1);
        FACEMESH.position.set(0, 0.7, -0.75);
        FACEMESH.renderOrder = 100000
    });

    loadingManager.onLoad = () => {
        isLoaded = true;
        GROUPOBJ3D.add(
            ANGELMESH1,
            ANGELMESH2,
            ANGELMESH3,
            HARPMESH1,
            HARPMESH2,
            HARPMESH3,
            DEMONMESH1,
            DEMONMESH2,
            DEMONMESH3,
            FORKMESH1,
            FORKMESH2,
            FORKMESH3,
            FACEMESH);

        GROUPOBJ3D.scale.multiplyScalar(1.4);
        GROUPOBJ3D.position.y -= 0.5;
        GROUPOBJ3D.position.z -= 0.5;


        addDragEventListener(GROUPOBJ3D);
        THREEFACEOBJ3DPIVOTED.add(GROUPOBJ3D);

        animateIntro();
    }

    // CREATE THE SCENE
    THREESCENE = new THREE.Scene();
    
    THREESCENE.add(THREEFACEOBJ3D);

    // init video texture with red
    THREEVIDEOTEXTURE = new THREE.DataTexture(new Uint8Array([255, 0, 0]), 1, 1, THREE.RGBFormat);
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
        delete(videoMesh.onAfterRender);
    };
    videoMesh.renderOrder = -1000; // render first
    videoMesh.frustumCulled = false;
    THREESCENE.add(videoMesh);   

    // CREATE THE CAMERA
    const aspecRatio = spec.canvasElement.width / spec.canvasElement.height;
    THREECAMERA = new THREE.PerspectiveCamera(SETTINGS.cameraFOV, aspecRatio, 0.1, 100);
} // end init_threeScene()

function animateIntro () {
    state = states.intro;

    ACTIONANGEL1.clampWhenFinished = true;
    ACTIONHARP1.clampWhenFinished = true;
    ACTIONDEMON1.clampWhenFinished = true;
    ACTIONFORK1.clampWhenFinished = true;
    /*
    ACTIONANGEL1.loop = THREE.LoopOnce;
    ACTIONHARP1.loop = THREE.LoopOnce;
    ACTIONDEMON1.loop = THREE.LoopOnce;
    ACTIONFORK1.loop = THREE.LoopOnce;*/

    MIXERANGEL1.addEventListener('loop', () => {
        animateIdle();
    });

    ACTIONANGEL1.play();
    ACTIONHARP1.play();
    ACTIONDEMON1.play();
    ACTIONFORK1.play();
}

function animateIdle() {
    $('#openMouthInstructions').show();
    state = states.idle;

    // Stop animation + hide meshes
    ACTIONANGEL1.stop();
    ACTIONHARP1.stop();
    ACTIONDEMON1.stop();
    ACTIONFORK1.stop();
    ANGELMESH1.visible = false;
    HARPMESH1.visible = false;
    DEMONMESH1.visible = false;
    FORKMESH1.visible = false;

    // Stop animation + hide meshes
    ACTIONANGEL3.stop();
    ACTIONHARP3.stop();
    ACTIONDEMON3.stop();
    ACTIONFORK3.stop();
    ANGELMESH3.visible = false;
    HARPMESH3.visible = false;
    DEMONMESH3.visible = false;
    FORKMESH3.visible = false;

    // Show meshes + start animation
    ANGELMESH2.visible = true;
    HARPMESH2.visible = true;
    DEMONMESH2.visible = true;
    FORKMESH2.visible = true;
    ACTIONANGEL2.play();
    ACTIONHARP2.play();
    ACTIONDEMON2.play();
    ACTIONFORK2.play();
}

function animateFight() {
    state = states.fight;

    // Stop animation + hide meshes
    ACTIONANGEL2.stop();
    ACTIONHARP2.stop();
    ACTIONDEMON2.stop();
    ACTIONFORK2.stop();
    ANGELMESH2.visible = false;
    HARPMESH2.visible = false;
    DEMONMESH2.visible = false;
    FORKMESH2.visible = false;

    MIXERFORK3.addEventListener('loop', () => {
        animateIdle();
    });

    // Show meshes + start animation
    ANGELMESH3.visible = true;
    HARPMESH3.visible = true;
    DEMONMESH3.visible = true;
    FORKMESH3.visible = true;
    ACTIONANGEL3.play();
    ACTIONHARP3.play();
    ACTIONDEMON3.play();
    ACTIONFORK3.play();
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

function init_faceFilter(videoSettings) {
    JEEFACEFILTERAPI.init({
        canvasId: 'jeeFaceFilterCanvas',
        NNCpath: '../../../dist/', // root of NNC.json file
        videoSettings: videoSettings,
        callbackReady: function (errCode, spec) {
            if (errCode) {
                console.log('AN ERROR HAPPENED. SORRY BRO :( . ERR =', errCode);
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
                const D = 1/(2*W*tanFOV); // distance between the front face of the cube and the camera
                
                // coords in 2D of the center of the detection window in the viewport :
                const xv=detectState.x;
                const yv=detectState.y;
                
                // coords in 3D of the center of the cube (in the view coordinates system)
                const z = -D - 0.5;   // minus because view coordinate system Z goes backward. -0.5 because z is the coord of the center of the cube (not the front face)
                const x = xv * D * tanFOV;
                const y = (yv * D * tanFOV / THREECAMERA.aspect);

                // move and rotate the cube
                THREEFACEOBJ3D.position.set(x, y + SETTINGS.pivotOffsetYZ[0], z + SETTINGS.pivotOffsetYZ[1]);
                THREEFACEOBJ3D.rotation.set(detectState.rx + SETTINGS.rotationOffsetX, detectState.ry, detectState.rz, "XYZ");

                
                if (detectState.expressions[0] >= 0.8 && isLoaded && state !== 0 && state !== 2) {
                    animateFight();
                }
            }

            // reinitialize the state of THREE.JS because JEEFACEFILTER have changed stuffs
            THREERENDERER.state.reset();

            switch (state) {
                case 0:
                    MIXERANGEL1.update(0.08);
                    MIXERHARP1.update(0.08);
                    MIXERDEMON1.update(0.08);
                    MIXERFORK1.update(0.08);
                    break
                case 1:
                    MIXERANGEL2.update(0.08);
                    MIXERHARP2.update(0.08);
                    MIXERDEMON2.update(0.08);
                    MIXERFORK2.update(0.08);
                    break
                case 2:
                    MIXERANGEL3.update(0.08);
                    MIXERHARP3.update(0.08);
                    MIXERDEMON3.update(0.08);
                    MIXERFORK3.update(0.08);
                    break
                default:
            }

            // trigger the render of the THREE.JS SCENE
            THREERENDERER.render(THREESCENE, THREECAMERA);
        } // end callbackTrack()
    }); // end JEEFACEFILTERAPI.init call
} // end main()

