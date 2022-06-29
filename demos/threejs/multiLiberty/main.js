// SETTINGS of this demo:
const SETTINGS = {
  maxFaces: 4, //max number of detected faces
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


function create_libertyMaterial(){
  return new THREE.MeshLambertMaterial({
    color: 0xadd7bf, // cyan oxidized bronze
    alphaMap: new THREE.TextureLoader().load('./assets/libertyAlphaMapSoft512.png'),
    transparent: true,
    premultipliedAlpha: true
  });
}


function create_faceMaterial(){
  return new THREE.MeshBasicMaterial({
    color: 0x5da0a0, // cyan oxidized bronze a bit modified
    transparent: true,
    side: THREE.DoubleSide,
    premultipliedAlpha: false,
    blending: THREE.CustomBlending,
    blendSrc: THREE.SrcColorFactor,  
    blendDst: THREE.OneFactor,
    blendEquation: THREE.AddEquation
  });
}


// build the 3D. called once when Jeeliz Face Filter is OK:
function init_threeScene(spec){
  const threeStuffs = JeelizThreeHelper.init(spec, detect_callback);
  
  function add_faceMesh(threeFaceMesh){
    threeFaceMesh.frustumCulled = false;
    threeFaceMesh.scale.multiplyScalar(0.37);
    threeFaceMesh.position.set(0,0.25,0.5);
    threeStuffs.faceObjects.forEach(function(faceObject){ //display the cube for each detected face
      faceObject.add(threeFaceMesh.clone());
    });
  }

  // IMPORT THE STATUE OF LIBERTY
  const libertyLoader = new  THREE.BufferGeometryLoader();
  libertyLoader.load('./assets/liberty.json', function(libertyGeometry){
    JeelizThreeHelper.sortFaces(libertyGeometry, 'z', true);
    const libertyMesh = new THREE.Mesh(libertyGeometry, create_libertyMaterial());
    libertyMesh.renderOrder = 2;
    add_faceMesh(libertyMesh);
  });

  // IMPORT THE FACE MASK
  new THREE.BufferGeometryLoader().load('./assets/libertyFaceMask.json', function(faceGeometry){
    JeelizThreeHelper.sortFaces(faceGeometry, 'z', true);
    const faceMesh = new THREE.Mesh(faceGeometry, create_faceMaterial());
    faceMesh.renderOrder = 1;
    add_faceMesh(faceMesh);
  });

  // CREATE THE CAMERA
  THREECAMERA = JeelizThreeHelper.create_camera();

  // ADD LIGHTS
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  const dirLight = new THREE.DirectionalLight(0xffffee, 0.7);
  dirLight.position.set(0, 0.05, 1);
  threeStuffs.scene.add(ambientLight, dirLight);
} //end init_threeScene()


// Entry point:
function main(){
  JEELIZFACEFILTER.init({
    canvasId: 'jeeFaceFilterCanvas',
    NNCPath: '../../../neuralNets/', // path of NN_DEFAULT.json file
    maxFacesDetected: SETTINGS.maxFaces,
    callbackReady: function(errCode, spec){
      if (errCode){
        console.log('AN ERROR HAPPENS. SORRY BRO :( . ERR =', errCode);
        return;
      }

      console.log('INFO: JEELIZFACEFILTER IS READY');
      init_threeScene(spec);
    }, //end callbackReady()

    // called at each render iteration (drawing loop):
    callbackTrack: function(detectState){
      JeelizThreeHelper.render(detectState, THREECAMERA);
    } //end callbackTrack()
  }); //end JEELIZFACEFILTER.init call
}


window.addEventListener('load', main);