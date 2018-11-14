"use strict";

// SETTINGS of this demo :
let SETTINGS = {
    rotationOffsetX: 0, // negative -> look upper. in radians
    cameraFOV: 40,      // in degrees, 3D camera FOV
    pivotOffsetYZ: [0.0, 0.2], // XYZ of the distance between the center of the cube and the pivot
    detectionThreshold: 0.75, // sensibility, between 0 and 1. Less -> more sensitive
    detectionHysteresis: 0.05,
    scale: 1 // scale of the 3D cube
};


// some globalz :
let THREEVIDEOTEXTURE;
let THREERENDERER;
let THREEFACEOBJ3D;
let THREEFACEOBJ3DPIVOTED;
let THREESCENE;
let THREECAMERA;
let ISDETECTED = false;



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
    const threeStuffs = THREE.JeelizHelper.init(spec, detect_callback);

    // Create the JSONLoader for our hat
    const loader = new THREE.BufferGeometryLoader();
    // Load our cool hat
    loader.load(
        'models/luffys_hat.json',
        function (geometry, materials) {
            // we create our Hat mesh
            const mat = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("models/Texture.jpg")
            });
            const hatMesh = new THREE.Mesh(geometry, mat);

            hatMesh.scale.multiplyScalar(1.2);
            hatMesh.rotation.set(0, -40, 0);
            hatMesh.position.set(0.0, 0.6, 0.0);
            hatMesh.frustumCulled = false;
            hatMesh.side = THREE.DoubleSide;

            threeStuffs.faceObject.add(hatMesh);
        }
    )

    // CREATE LIGHT
    const ambientLight = new THREE.AmbientLight(0XFFFFFF, 0.8);
    threeStuffs.scene.add(ambientLight);

    // CREATE THE CAMERA
    const aspecRatio = spec.canvasElement.width / spec.canvasElement.height;
    THREECAMERA = new THREE.PerspectiveCamera(SETTINGS.cameraFOV, aspecRatio, 0.1, 100);
} // end init_threeScene()

//launched by body.onload() :
function main() {
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
                console.log('AN ERROR HAPPENED. SORRY BRO :( . ERR =', errCode);
                return;
            }

            console.log('INFO : JEEFACEFILTERAPI IS READY');
            init_threeScene(spec);
        }, // end callbackReady()

        // called at each render iteration (drawing loop)
        callbackTrack: function(detectState) {
            THREE.JeelizHelper.render(detectState, THREECAMERA);
        } // end callbackTrack()
    }); // end JEEFACEFILTERAPI.init call
} // end main()

