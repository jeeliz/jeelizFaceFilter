// SETTINGS of this demo:
const SETTINGS = {
  maskScale: 0.065,
  maskPositionOffset: [0, -0.75, 0.35]
};

// some globals:
let THREECAMERA = null; // should be prop of window

let ANONYMOUSMESH = null;
let ANONYMOUSOBJ3D = null;
let isTransformed = false;


// callback: launched if a face is detected or lost.
function detect_callback(isDetected) {
  if (isDetected) {
    console.log('INFO in detect_callback(): DETECTED');
  } else {
    console.log('INFO in detect_callback(): LOST');
  }
}


// build the 3D. called once when Jeeliz Face Filter is OK:
function init_threeScene(spec) {
  const threeStuffs = JeelizThreeHelper.init(spec, detect_callback);


  // Draw frame canvas:
  const frameCanvas = document.getElementById('frameCanvas');
  const ctx = frameCanvas.getContext('2d');
  const img = new Image(600, 600);
  img.onload = () => {
    ctx.drawImage(img, 0, 0, 600, 600);
  }
  img.src = './images/frame.png';

  const openMouthInstruction = $('#openMouthInstruction');
  openMouthInstruction.hide();

  // CREATE OUR ANONYMOUS MASK:
  const headLoader = new THREE.BufferGeometryLoader();
  headLoader.load(
    './models/anonymous/anonymous.json',
    (geometryHead) => {
       const mat = new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load('./models/anonymous/anonymous.png'),
        transparent: true
      });

      ANONYMOUSMESH = new THREE.Mesh(geometryHead, mat);
      ANONYMOUSMESH.frustumCulled = false;
      ANONYMOUSMESH.scale.multiplyScalar(SETTINGS.maskScale);
      ANONYMOUSMESH.position.fromArray(SETTINGS.maskPositionOffset);
      ANONYMOUSMESH.renderOrder = 1000000;

      // FOR THE APPEAR ANIMATION
      // we set the opacity of the materials to zero
      // the mesh will appear when the user growwlsss (or simply open his mouth)
      ANONYMOUSMESH.material.opacity = 0;

      ANONYMOUSOBJ3D = new THREE.Object3D();
      ANONYMOUSOBJ3D.add(ANONYMOUSMESH);
      addDragEventListener(ANONYMOUSOBJ3D);

      threeStuffs.faceObject.add(ANONYMOUSOBJ3D);
      openMouthInstruction.show();
    }
  );

  // add our video recording effect
  const canvas = document.getElementById('jeeFaceFilterCanvas');
  if (canvas) {
     addVideoRecordingEffect(canvas);
  }

  // CREATE THE CAMERA
  THREECAMERA = JeelizThreeHelper.create_camera();
  
  // CREATE A LIGHT
  const ambient = new THREE.AmbientLight(0xffffff, 0.8);
  threeStuffs.scene.add(ambient);

  // CREAT A SPOTLIGHT
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLight.position.set(100, 1000, 1000);
  threeStuffs.scene.add(dirLight);
} // end init_threeScene()

// ANIMATION
function animateAppear (object3D) {
  new TWEEN.Tween( object3D.material )
    .to({ opacity: 1}, 700)
    .start();
} 


// entry point:
function main(){
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
        console.log('AN ERROR HAPPENS. SORRY BRO :( . ERR =', errCode);
        return;
      }

      console.log('INFO: JEELIZFACEFILTER IS READY');
      init_threeScene(spec);
    },

    // called at each render iteration (drawing loop)
    callbackTrack: function (detectState) {
      const isDetected = JeelizThreeHelper.get_isDetected();


      if (isDetected && detectState.expressions[0] >= 0.8 && !isTransformed) {
        isTransformed = true;
        animateAppear(ANONYMOUSMESH);
        const openMouthInstruction = $('#openMouthInstruction');
        openMouthInstruction.hide();
      }

      TWEEN.update();

      JeelizThreeHelper.render(detectState, THREECAMERA);
    }
  }); // end JEELIZFACEFILTER.init call
}


window.addEventListener('load', main);