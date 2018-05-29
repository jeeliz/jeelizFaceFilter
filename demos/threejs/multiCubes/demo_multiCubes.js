"use strict";

//SETTINGS of this demo :
var SETTINGS={
    maxFaces: 4, //max number of detected faces
    cameraFOV: 40      //in degrees, 3D camera FOV
};

//some globalz :
var THREECAMERA;

//callback : launched if a face is detected or lost. TODO : add a cool particle effect WoW !
function detect_callback(faceIndex, isDetected){
    if (isDetected){
        console.log('INFO in detect_callback() : face n°', faceIndex, 'DETECTED');
    } else {
        console.log('INFO in detect_callback() : face n°', faceIndex, 'LOST');
    }
}

//build the 3D. called once when Jeeliz Face Filter is OK
function init_threeScene(spec){
    var threeStuffs = THREE.JeelizHelper.init(spec, detect_callback);
    
    //CREATE A CUBE
    var cubeGeometry=new THREE.BoxGeometry(1,1,1);
    var cubeMaterial=new THREE.MeshNormalMaterial();
    var threeCube=new THREE.Mesh(cubeGeometry, cubeMaterial);
    threeCube.frustumCulled=false;
    threeStuffs.faceObjects.forEach(function(faceObject){ //display the cube for each detected face
        faceObject.add(threeCube.clone());
    });

    //CREATE THE CAMERA
    var aspecRatio=spec.canvasElement.width / spec.canvasElement.height;
    THREECAMERA=new THREE.PerspectiveCamera(SETTINGS.cameraFOV, aspecRatio, 0.1, 100);
} //end init_threeScene()

//launched by body.onload() :
function main(){
    JEEFACEFILTERAPI.init({
        canvasId: 'jeeFaceFilterCanvas',
        NNCpath: '../../../dist/', //root of NNC.json file
        maxFacesDetected: SETTINGS.maxFaces,
        callbackReady: function(errCode, spec){
            if (errCode){
                console.log('AN ERROR HAPPENS. SORRY BRO :( . ERR =', errCode);
                return;
            }

            console.log('INFO : JEEFACEFILTERAPI IS READY');
            init_threeScene(spec);
        }, //end callbackReady()

        //called at each render iteration (drawing loop)
        callbackTrack: function(detectState){
            THREE.JeelizHelper.render(detectState, THREECAMERA);
        } //end callbackTrack()
    }); //end JEEFACEFILTERAPI.init call
} //end main()