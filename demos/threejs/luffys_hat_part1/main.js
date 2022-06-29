// SETTINGS of this demo :
// We don't use fixed FoV anymore
/*let SETTINGS = {
  cameraFOV: 40,    // in degrees, 3D camera FOV
};*/


// some globalz :
let THREECAMERA;

// callback: launched if a face is detected or lost
function detect_callback(isDetected) {
  if (isDetected) {
    console.log('INFO in detect_callback(): DETECTED');
  } else {
    console.log('INFO in detect_callback(): LOST');
  }
}


// build the 3D. called once when Jeeliz Face Filter is OK
function init_threeScene(spec) {
  const threeStuffs = JeelizThreeHelper.init(spec, detect_callback);

  // Create the JSONLoader for our hat:
  const loader = new THREE.BufferGeometryLoader();
  
  // Load our cool hat:
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
  // old fashioned way: with a fixed FoV:
  //const aspecRatio = spec.canvasElement.width / spec.canvasElement.height;
  //THREECAMERA = new THREE.PerspectiveCamera(SETTINGS.cameraFOV, aspecRatio, 0.1, 100);
  
  // New hype and lazy way, the helper guess a plausible FoV depending on the hardware:
  THREECAMERA = JeelizThreeHelper.create_camera();
} // end init_threeScene()


// Entry point:
function main() {
  JeelizResizer.size_canvas({
    canvasId: 'jeeFaceFilterCanvas',
    callback: function(isError, bestVideoSettings){
      init_faceFilter(bestVideoSettings);
    }
  })
}


function init_faceFilter(videoSettings){
  JEELIZFACEFILTER.init({
    canvasId: 'jeeFaceFilterCanvas',
    NNCPath: '../../../neuralNets/', // path of NN_DEFAULT.json file
    videoSettings: videoSettings,
    callbackReady: function (errCode, spec) {
      if (errCode) {
        console.log('AN ERROR HAPPENED. SORRY BRO :( . ERR =', errCode);
        return;
      }

      console.log('INFO: JEELIZFACEFILTER IS READY');
      init_threeScene(spec);
    },

    // called at each render iteration (drawing loop)
    callbackTrack: function(detectState) {
      JeelizThreeHelper.render(detectState, THREECAMERA);
    }
  }); // end JEELIZFACEFILTER.init call
}


window.addEventListener('load', main);

