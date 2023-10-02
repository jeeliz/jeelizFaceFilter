let THREECAMERA = null, MOUTHOPENMESH = null, MOUTHSMILEMESH = null, EYEBROWSMESH = null;


// callback: launched if a face is detected or lost
function detect_callback(faceIndex, isDetected) {
  if (isDetected) {
    console.log('INFO in detect_callback(): DETECTED');
  } else {
    console.log('INFO in detect_callback(): LOST');
  }
}


// build the 3D. called once when Jeeliz Face Filter is OK
function init_threeScene(spec) {
  spec.threeCanvasId = 'threeCanvas'; // enable 2 canvas mode
  const threeStuffs = JeelizThreeHelper.init(spec, detect_callback);

   // CREATE A CUBE
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const cubeMaterial = new THREE.MeshNormalMaterial();
  const threeCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  threeCube.frustumCulled = false;
  threeStuffs.faceObject.add(threeCube);

  // CREATE MOUTH MESHES:
  const create_mouthMesh = function(geom){
    const mouthMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000
    });
    const mouthMesh = new THREE.Mesh(geom, mouthMaterial);
    mouthMesh.rotateX(Math.PI/2);
    mouthMesh.position.set(0, -0.2, 0.2);
    threeStuffs.faceObject.add(mouthMesh);
    return mouthMesh;
  }

  // CREATE MOUTH OPEN MESH:
  MOUTHOPENMESH = create_mouthMesh(new THREE.CylinderGeometry(0.3,0.3, 1, 32));
 
  // CREATE MOUTH SMILE MESH:
  MOUTHSMILEMESH = create_mouthMesh(new THREE.CylinderGeometry(0.5,0.5, 1, 32, 1, false, -Math.PI/2, Math.PI));

  // CREATE EYEBROWS:
  EYEBROWSMESH = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 1), new THREE.MeshBasicMaterial({
    color: 0x000000
  }));
  EYEBROWSMESH.position.setZ(0.2).setY(0.3);
  threeStuffs.faceObject.add(EYEBROWSMESH);

  // CREATE EYES:
  [-0.2, 0.2].map(function(x){
    const eyeMaterial = new THREE.MeshBasicMaterial({
      color: 0x0000aa
    });
    const eyeMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05, 1), eyeMaterial);
    eyeMesh.rotateX(Math.PI/2);
    eyeMesh.position.set(x, 0.1, 0.05);
    threeStuffs.faceObject.add(eyeMesh);
  });  

  //CREATE THE CAMERA
  THREECAMERA = JeelizThreeHelper.create_camera();
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
    NNCPath: '../../../neuralNets/NN_4EXPR_3.json', // This neural network model has learnt 4 expressions
    
    maxFacesDetected: 1,
    callbackReady: function(errCode, spec){
      if (errCode){
        console.log('AN ERROR HAPPENS. ERR =', errCode);
        return;
      }

      console.log('INFO: JEELIZFACEFILTER IS READY');
      init_threeScene(spec);
    },

    // called at each render iteration (drawing loop):
    callbackTrack: function(detectState){
      const expr = detectState.expressions;
      const mouthOpen = Math.max(0.001, expr[0]); // should not be 0
      const mouthSmile = Math.max(0.001, expr[1]);
      const eyebrowFrown = expr[2];
      const eyebrowRaised = expr[3];

      // set mouth according the expression:
      MOUTHOPENMESH.scale.setX(mouthOpen).setZ(mouthOpen);
      MOUTHSMILEMESH.scale.setX(mouthSmile).setZ(mouthSmile);

      // set eyebrows:
      const yEyeBrows = ( eyebrowFrown > eyebrowRaised ) ? -0.2 * eyebrowFrown : 0.7 * eyebrowRaised;
      EYEBROWSMESH.position.setY(0.3 + yEyeBrows);

      JeelizThreeHelper.render(detectState, THREECAMERA);
    }
  }); //end JEELIZFACEFILTER.init call
}


window.addEventListener('load', main);
