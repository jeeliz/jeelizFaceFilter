"use strict";

// SETTINGS of this demo:
const SETTINGS = {
  maxFaces: 4, // max number of detected faces
};

// some globalz:
let THREECAMERA = null;

// callback: launched if a face is detected or lost
function detect_callback(faceIndex, isDetected){
  if (isDetected){
    console.log('INFO in detect_callback(): face n°', faceIndex, 'DETECTED');
  } else {
    console.log('INFO in detect_callback(): face n°', faceIndex, 'LOST');
  }
}

// build the 3D. called once when Jeeliz Face Filter is OK
function init_threeScene(spec){
  const threeStuffs = THREE.JeelizHelper.init(spec, detect_callback);
  
  // CREATE A CUBE:
  const cubeGeometry = new THREE.BoxGeometry(1,1,1);
  const cubeMaterial = new THREE.MeshNormalMaterial();
  const threeCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  threeCube.frustumCulled = false;
  threeStuffs.faceObjects.forEach(function(faceObject){ // display the cube for each detected face
    faceObject.add(threeCube.clone());
  });

  // CREATE THE CAMERA:
  THREECAMERA = THREE.JeelizHelper.create_camera();
}

// Entry point, launched by body.onload():
function main(){
  JEEFACEFILTERAPI.init({
    canvasId: 'jeeFaceFilterCanvas',
    NNCpath: '../../../dist/', // root of NNC.json file
    maxFacesDetected: SETTINGS.maxFaces,
    callbackReady: function(errCode, spec){
      if (errCode){
        console.log('AN ERROR HAPPENS. SORRY BRO :( . ERR =', errCode);
        return;
      }

      console.log('INFO: JEEFACEFILTERAPI IS READY');
      init_threeScene(spec);
    },

    // called at each render iteration (drawing loop)
    callbackTrack: function(detectState){
      THREE.JeelizHelper.render(detectState, THREECAMERA);
    }
  }); //end JEEFACEFILTERAPI.init call
}