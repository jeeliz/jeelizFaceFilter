"use strict";

let THREECAMERA = null;

// callback: launched if a face is detected or lost.
function detect_callback(faceIndex, isDetected) {
  if (isDetected) {
    console.log('INFO in detect_callback(): DETECTED');
  } else {
    console.log('INFO in detect_callback(): LOST');
  }
}

// build the 3D. called once when Jeeliz Face Filter is OK
function init_threeScene(spec) {
  const threeStuffs = THREE.JeelizHelper.init(spec, detect_callback);

  // CREATE A CUBE:
  const cubeGeometry = new THREE.BoxGeometry(1,1,1);
  const cubeMaterial = new THREE.MeshNormalMaterial();
  const threeCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  threeCube.frustumCulled = false;
  threeStuffs.faceObject.add(threeCube);

  // CREATE THE CAMERA:
  const aspectRatio = spec.canvasElement.width / spec.canvasElement.height;
  THREECAMERA=new THREE.PerspectiveCamera(20, aspectRatio, 0.1, 100);
} // end init_threeScene()

// entry point:
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
    NNCpath: '../../../dist/NNCwideAngles.json', // Neuron net with wide angles
    maxFacesDetected: 1,
    stabilizationSettings: { // adjust stabilization parameters for more responsivity
      'translationFactorRange': [0.001, 0.003],
      'rotationFactorRange': [0.002, 0.015],
      'qualityFactorRange': [0.91, 0.98],
      'alphaRange': [0.07, 1]
    },

    callbackReady: function(errCode, spec){
      if (errCode){
      console.log('AN ERROR HAPPENS. ERR =', errCode);
      return;
      }

      console.log('INFO : JEEFACEFILTERAPI IS READY');
      init_threeScene(spec);
    },

    //c alled at each render iteration (drawing loop):
    callbackTrack: function(detectState){
      THREE.JeelizHelper.render(detectState, THREECAMERA);
    }
  }); //end JEEFACEFILTERAPI.init call
}
