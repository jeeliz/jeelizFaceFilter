"use strict";

// SETTINGS of this demo :
const SETTINGS = {
    rotationOffsetX: 0, // negative -> look upper. in radians
    cameraFOV: 40,      // in degrees, 3D camera FOV
    pivotOffsetYZ: [-0.2, -0.2], // XYZ of the distance between the center of the cube and the pivot
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
let WOLFOBJ3D = new THREE.Object3D()
let MASKOBJ3D = new THREE.Object3D()
let WOLFMESH;
let FACEMESH;
let COLORFILTERCOEF;
let VIDEOMESH;

let MOONSPRITE;
let MOONHALO;

let isTransformed = false
let ROTATIONX = 0;

let MIXER = false;

let PARTICLEGROUP;

let GROUP;

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
    addFrame();

    const openMouthInstruction = $('#openMouthInstruction');
    openMouthInstruction.hide();

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
                        
    // Add our wolf head model

    const loadingManager = new THREE.LoadingManager();
    let wolfMesh;
    let faceMesh;


    const headLoader = new THREE.JSONLoader(loadingManager)

    headLoader.load(
        './models/werewolf/werewolf_not_animated.json',
        // './models/werewolf/Werewolf.fbx',
        (geometryHead) => {
            // GROUP = group;

            const matHead = new THREE.MeshPhongMaterial({
                map: new THREE.TextureLoader().load('./models/werewolf/head_diffuse.png'),
                normalMap: new THREE.TextureLoader().load('./models/werewolf/head_normal.jpg'),
                alphaMap: new THREE.TextureLoader().load('./models/werewolf/head_alpha.jpg'),
                side: THREE.FrontSide,
                shininess: 10,
                transparent: true,
                morphTargets: true
            })

            const matFur = new THREE.MeshPhongMaterial({ //MT203 : should not apply lighting because normals are wrong
                map: new THREE.TextureLoader().load('./models/werewolf/fur_diffuse.jpg'),
                normalMap: new THREE.TextureLoader().load('./models/werewolf/fur_normal.png'),
                alphaMap: new THREE.TextureLoader().load('./models/werewolf/fur_alpha.jpg'),
                transparent: true,
                shininess: 20,
                opacity: 1,
                normalScale: new THREE.Vector2(2, 2),
                depthWrite: false
            })
            const matTeeth = new THREE.MeshPhongMaterial({
                map: new THREE.TextureLoader().load('./models/werewolf/teeth_diffuse.jpg'),
                transparent: true,
                emissive: 0x070505,
                emissiveIntensity: 0,
                shininess: 0,
                reflectivity: 0,
                morphTargets: true
            })

            /*
                Useless because we created a mesh for the fur instead of the sprites we used previously
            */
            // BEGIN MANTIS 203
            // we consider all faces matching the fur (material which index=2) :
            /*
            var groupFur = geometryHead.groups[2];
            var facesFur = [];
            for (var ind = 0; ind < groupFur.count  /3; ++ind) {
                facesFur.push([
                    geometryHead.index.array[groupFur.start+ind*3], // push the 3 index of the triangle vertices
                    geometryHead.index.array[groupFur.start+ ind*3+1],
                    geometryHead.index.array[groupFur.start+ ind*3+2],
                    ind // save the original index of the face
                    ]);
            }

            // we compute faces controidsZ :
            var facesControidsZ=facesFur.map(function(face){
                return geometryHead.attributes.position.array[3*face[0]+2]
                        +geometryHead.attributes.position.array[3*face[1]+2]
                        +geometryHead.attributes.position.array[3*face[2]+2];
            });

            // we sort the faces by centroid
            facesFur.sort(function(faceA, faceB){
                var zFaceA=facesControidsZ[faceA[3]];
                var zFaceB=facesControidsZ[faceB[3]];
                return zFaceA-zFaceB;
            });

            // we replace the original face order by the new one
            facesFur.forEach(function (face, faceIndex) {
                var ind = groupFur.start + faceIndex * 3;
                geometryHead.index.array[ind] = face[0];
                geometryHead.index.array[ind + 1] = face[1];
                geometryHead.index.array[ind + 2] = face[2];
            });

            // helps the GC by unaffecting big arrays :
            facesFur = null;
            // END MANTIS203*/
            // WOLFMESH = GROUP.children[0]; // new THREE.Mesh(geometryHead, [matHead, matFur, matTeeth]);

            WOLFMESH = new THREE.Mesh(geometryHead, [matHead, matFur, matTeeth]);
            WOLFMESH.frustumCulled = false;
            WOLFMESH.renderOrder = 1000000;

            /*MIXER = new THREE.AnimationMixer(WOLFMESH);       


            const action = MIXER.clipAction(WOLFMESH.geometry.animations[0]);
            action.play();*/

            // FOR THE APPEAR ANIMATION
            // we set the opacity of the materials to zero
            // the mesh will appear when the user growwlsss (or simply open his mouth)

            WOLFMESH.material[0].opacity = 0;

            WOLFMESH.material[1].opacity = 0;

            WOLFMESH.material[2].opacity = 0;

            WOLFOBJ3D.add(WOLFMESH);
            WOLFOBJ3D.scale.multiplyScalar(7)
            WOLFOBJ3D.position.y -= 1.2
            WOLFOBJ3D.position.z -= 0.5
            // WOLFOBJ3D.rotation.x -= 1.8

            addDragEventListener(WOLFOBJ3D);

            /*
            IN PROGRESS: Add particles when the wolf breathes

            const textureParticle = new THREE.TextureLoader().load('./images/moon.png');
            PARTICLEGROUP = new SPE.Group({
                texture: {
                    value: textureParticle
                },
                blending: THREE.NormalBlending
            });

            const emitter = new SPE.Emitter({

                maxAge: { value: 12 },
                position: { 
                    value: new THREE.Vector3( 0, 0, -10 ),
                    spread: new THREE.Vector3( 1, 0.5, 2 ),
                },
                size: {
                    value: [ 2, 8 ],
                    spread: [ 0, 1, 2 ]
                },
                acceleration: {
                    value: new THREE.Vector3( 0, 0, 0 ),
                },
                rotation: {
                    axis: new THREE.Vector3( 0, 1, 0 ),
                    spread: new THREE.Vector3( 0, 20, 0 ),
                    angle: 100 * Math.PI / 180,
                },
                velocity: {
                    value: new THREE.Vector3( 0, 1, -0.5 ),
                    spread: new THREE.Vector3( 0.25, 0.1, 0.25 )
                },
                opacity: {
                    value: [ 0.2, 0.5, 0 ]
                },
                color: {
                    value: [ new THREE.Color( 0x333333 ), new THREE.Color( 0x111111 ) ],
                    spread: [ new THREE.Vector3( 0.2, 0.1, 0.1 ), new THREE.Vector3( 0, 0, 0 ) ]
                },
                particleCount: 600,
            });

            PARTICLEGROUP.addEmitter(emitter)
            PARTICLEGROUP.mesh.scale.multiplyScalar(100);
            WOLFOBJ3D.add(PARTICLEGROUP.mesh)*/

            THREEFACEOBJ3DPIVOTED.add(WOLFOBJ3D)
            openMouthInstruction.show()
            isLoaded = true;
        }
    )



    // CREATE THE SCENE
    THREESCENE = new THREE.Scene();
    THREESCENE.add(THREEFACEOBJ3D);

    // CREATE THE MOON
    const moonGeometry = new THREE.PlaneGeometry(10, 10, 10);
    const moonMaterial = new THREE.SpriteMaterial({ //MT219 : sprites are textured with specific material
        map: new THREE.TextureLoader().load('./images/moon.png'),
        transparent: true,
        depthTest: false
    })

    MOONSPRITE = new THREE.Sprite(moonMaterial); //MT219 : the geometry of a sprite is always a 2D plane, so u don't need to specify it
    MOONSPRITE.position.set(1.5, 1.5, -5); //MT219 : even if it is a sprite you should position it in 3D : a sprite is a 2D object in a 3D scene
    MOONSPRITE.scale.multiplyScalar(1.2);
    MOONSPRITE.renderOrder = -10000000;
    THREESCENE.add(MOONSPRITE);

    // CREATE THE LIGHT COMING FROM THE MOON
    const pointlightMoon = new THREE.PointLight(0XFFD090, 0.5);
    pointlightMoon.position.set(1.5, 2.5, -2);
    THREEFACEOBJ3D.add(pointlightMoon);

    // CREATE THE MOON GLOW EFFECT
    const moonGlowGeometry = new THREE.SphereGeometry(0.8,32, 32);
    THREEx.dilateGeometry(moonGlowGeometry, 0.15);

    var material = THREEx.createAtmosphereMaterial();
    material.opacity = 0.1;
    
    MOONHALO = new THREE.Mesh(moonGlowGeometry, material);
    MOONHALO.position.set(1.5, 1.5, -5);
    MOONHALO.scale.y = 0.7;
    MOONHALO.scale.x = 0.7;

    THREESCENE.add(MOONHALO);
    // possible customisation of AtmosphereMaterial
    material.uniforms.glowColor.value = new THREE.Color(0XFFFFE0);
    material.uniforms.coeficient.value = 0.1;
    material.uniforms.power.value = 2;
    

    // CREATE AN AMBIENT LIGHT
    const ambient = new THREE.AmbientLight(0x888899, 1)
    THREESCENE.add(ambient)


    // CREATE A SPOTLIGHT
    const dirLight = new THREE.DirectionalLight(0x998899, 1);
    dirLight.position.set(100, 100, 100);
    THREESCENE.add(dirLight);

    // White directional light at half intensity shining from the top.
    // var directionalLight = new THREE.DirectionalLight( 0x444477, 1.5 );
    var directionalLight = new THREE.DirectionalLight(new THREE.Color(0, 0.1, 0.2), 1);
    THREESCENE.add(directionalLight);

    // init video texture with red
    THREEVIDEOTEXTURE = new THREE.DataTexture(new Uint8Array([255,0,0]), 1, 1, THREE.RGBFormat);
    THREEVIDEOTEXTURE.needsUpdate = true;

    const videoColorFilter = new THREE.Vector3(0.05, 0.1, 0.15);
    COLORFILTERCOEF = 0.7;

    //CREATE THE VIDEO BACKGROUND
    var videoMaterial = new THREE.RawShaderMaterial({
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
            uniform vec3 colorFilter;\n\
            uniform float colorFilterCoef;\n\
            varying vec2 vUV;\n\
            void main(void){\n\
                vec3 col=texture2D(samplerVideo, vUV).rgb;\n\
                col=mix(col, colorFilter, colorFilterCoef);\n\
                gl_FragColor=vec4(col,1.);\n\
            }",
         uniforms: {
            samplerVideo: { value: THREEVIDEOTEXTURE },
            colorFilter: { value: videoColorFilter },
            colorFilterCoef: { value: COLORFILTERCOEF }
         }
    });
    const videoGeometry = new THREE.BufferGeometry();
    const videoScreenCorners = new Float32Array([-1,-1,   1,-1,   1,1,   -1,1]);
    videoGeometry.addAttribute('position', new THREE.BufferAttribute( videoScreenCorners, 2));
    videoGeometry.setIndex(new THREE.BufferAttribute(new Uint16Array([0,1,2, 0,2,3]), 1));
    VIDEOMESH = new THREE.Mesh(videoGeometry, videoMaterial);
    VIDEOMESH.onAfterRender = function () {
        // replace THREEVIDEOTEXTURE.__webglTexture by the real video texture
        THREERENDERER.properties.update(THREEVIDEOTEXTURE, '__webglTexture', spec.videoTexture);
        THREEVIDEOTEXTURE.magFilter = THREE.LinearFilter;
        THREEVIDEOTEXTURE.minFilter = THREE.LinearFilter;
        delete(VIDEOMESH.onAfterRender);
    };
    VIDEOMESH.renderOrder = -1000; // render first
    VIDEOMESH.frustumCulled = false;
    THREESCENE.add(VIDEOMESH);

    // CREATE THE CAMERA
    const aspecRatio = spec.canvasElement.width / spec.canvasElement.height;
    THREECAMERA = new THREE.PerspectiveCamera(SETTINGS.cameraFOV, aspecRatio, 0.1, 100);
} // end init_threeScene()

function animateWolf (object3D) {
    object3D.visible = true
    // new TWEEN.Tween(object3D.material[1].opacity)
    new TWEEN.Tween(object3D.material[1])
        // .to({ value: 1 }, 700)
        .to({ opacity: 1 }, 1000)
        .start();
    // new TWEEN.Tween(object3D.material[2].opacity)
    new TWEEN.Tween(object3D.material[2])
        // .to({ value: 1 }, 700)
        .to({ opacity: 1 }, 1000)
        .start();
    new TWEEN.Tween(object3D.material[0])
        .to({ opacity: 1 }, 1000)
        .start();
}

function addFrame() {
    const frame = document.getElementById('frame');

    const ctx = frame.getContext('2d');

    const img = new Image(600, 600);
    img.onload = () => {
        ctx.drawImage(img, 0, 0, 600, 600)
    }

    img.src = './images/frame.png'
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

                //MT223 : the flexmaterial needs mesh world position, scale and rotation
                //in order to compute the amortized movement
                //otherwise it is undefined and the mesh does not display
                if (WOLFMESH) {
                    // WOLFMESH.material[0].set_amortized(WOLFMESH.getWorldPosition(), WOLFMESH.getWorldScale(), WOLFMESH.getWorldRotation(), false, 0.1);
                    // WOLFMESH.material[1].set_amortized(WOLFMESH.getWorldPosition(), WOLFMESH.getWorldScale(), WOLFMESH.getWorldRotation(), false, 0.1);
                }

                if (detectState.expressions[0] >= 0.9 && !isTransformed && isLoaded) {

                    isTransformed = true;
                    animateWolf(WOLFMESH);

                    const openMouthInstruction = $('#openMouthInstruction');
                    openMouthInstruction.hide();
                }
            }
            

            // reinitialize the state of THREE.JS because JEEFACEFILTER have changed stuffs
            THREERENDERER.state.reset();

            THREERENDERER.sortElements = true
            
            TWEEN.update()

            if (MIXER) {
                MIXER.update(0.08);
            }
            /*
            if (PARTICLEGROUP) {
                PARTICLEGROUP.tick(0.10);
            }*/

            // trigger the render of the THREE.JS SCENE
            THREERENDERER.render(THREESCENE, THREECAMERA);
        } // end callbackTrack()
    }); // end JEEFACEFILTERAPI.init call
} // end main()

