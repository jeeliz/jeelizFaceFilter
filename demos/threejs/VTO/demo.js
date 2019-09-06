"use strict";

let THREECAMERA;

// callback : launched if a face is detected or lost. TODO : add a cool particle effect WoW !
function detect_callback(faceIndex, isDetected) {
  if (isDetected) {
    console.log('INFO in detect_callback() : DETECTED');
  } else {
    console.log('INFO in detect_callback() : LOST');
  }
}

// build the 3D. called once when Jeeliz Face Filter is OK
function init_threeScene(spec) {
  const threeStuffs = THREE.JeelizHelper.init(spec, detect_callback);

  // CREATE THE GLASSES AND ADD THEM
  const r = JeelizThreeGlassesCreator({
    envMapURL: "envMap.jpg",
    frameMeshURL: "models3D/glassesFramesBranchesBent.json",
    lensesMeshURL: "models3D/glassesLenses.json",
    occluderURL: "models3D/face.json"
  });

  threeStuffs.faceObject.add(r.occluder);
  r.occluder.rotation.set(0.3,0,0);
  r.occluder.position.set(0,0.1,-0.04);
  r.occluder.scale.multiplyScalar(0.0084);

  const threeGlasses = r.glasses;
  //threeGlasses.rotation.set(-0.15,0,0); //X neg -> rotate branches down
  threeGlasses.position.set(0,0.07,0.4);
  threeGlasses.scale.multiplyScalar(0.006);
  threeStuffs.faceObject.add(threeGlasses);

  //CREATE THE CAMERA
  THREECAMERA = THREE.JeelizHelper.create_camera();
} // end init_threeScene()

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
    followZRot: true,
    canvasId: 'jeeFaceFilterCanvas',
    NNCpath: '../../../dist/', // root of NNC.json file
    maxFacesDetected: 1,
    callbackReady: function(errCode, spec){
      if (errCode){
      console.log('AN ERROR HAPPENS. ERR =', errCode);
      return;
      }

      console.log('INFO : JEEFACEFILTERAPI IS READY');
      init_threeScene(spec);
    }, //end callbackReady()

    //called at each render iteration (drawing loop) :
    callbackTrack: function(detectState){
      THREE.JeelizHelper.render(detectState, THREECAMERA);
    } //end callbackTrack()
  }); //end JEEFACEFILTERAPI.init call
} // end main()

