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

function create_libertyMaterial(){
    return new THREE.MeshLambertMaterial({
        color: 0xadd7bf, //cyan oxidized bronze
        alphaMap: new THREE.TextureLoader().load('./assets/libertyAlphaMapSoft512.png'),
        transparent: true,
        premultipliedAlpha: true
    });
}

function create_faceMaterial(){
    return new THREE.MeshBasicMaterial({
        color: 0x5da0a0, //cyan oxidized bronze a bit modified
        transparent: true,
        side: THREE.DoubleSide,
        premultipliedAlpha: false,
        blending: THREE.CustomBlending,
        blendSrc: THREE.SrcColorFactor,    
        blendDst: THREE.OneFactor,
        blendEquation: THREE.AddEquation
    });
}

//build the 3D. called once when Jeeliz Face Filter is OK
function init_threeScene(spec){
    var threeStuffs = THREE.JeelizHelper.init(spec, detect_callback);
    
    function add_faceMesh(threeFaceMesh){
        threeFaceMesh.frustumCulled=false;
        threeFaceMesh.scale.multiplyScalar(0.37);
        threeFaceMesh.position.set(0,0.25,0.5);
        threeStuffs.faceObjects.forEach(function(faceObject){ //display the cube for each detected face
            faceObject.add(threeFaceMesh.clone());
        });
    }

    //IMPORT THE STATUE OF LIBERTY
    var libertyLoader=new  THREE.BufferGeometryLoader();
    libertyLoader.load('./assets/liberty.json', function(libertyGeometry){
        THREE.JeelizHelper.sortFaces(libertyGeometry, 'z', true);
        var libertyMesh=new THREE.Mesh(libertyGeometry, create_libertyMaterial());
        libertyMesh.renderOrder=2;
        add_faceMesh(libertyMesh);
    });

    //IMPORT THE FACE MASK
    new THREE.BufferGeometryLoader().load('./assets/libertyFaceMask.json', function(faceGeometry){
        THREE.JeelizHelper.sortFaces(faceGeometry, 'z', true);
        var faceMesh=new THREE.Mesh(faceGeometry, create_faceMaterial());
        faceMesh.renderOrder=1;
        add_faceMesh(faceMesh);
    });

    //CREATE THE CAMERA
    var aspecRatio=spec.canvasElement.width / spec.canvasElement.height;
    THREECAMERA=new THREE.PerspectiveCamera(SETTINGS.cameraFOV, aspecRatio, 0.1, 100);

    //ADD LIGHTS
    var ambientLight=new THREE.AmbientLight(0xffffff, 0.5);
    var dirLight=new THREE.DirectionalLight(0xffffee, 0.7);
    dirLight.position.set(0,0.05,1);
    threeStuffs.scene.add(ambientLight, dirLight);
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