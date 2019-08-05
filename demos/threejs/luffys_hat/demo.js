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

function setFullScreen(canvasElement, renderer) {
  const canvasRect = canvasElement.getBoundingClientRect()
  canvasElement.width  = Math.round(canvasRect.width)
  canvasElement.height = Math.round(canvasRect.height)

  const aspecRatio = canvasElement.width / canvasElement.height
  THREECAMERA.aspect = aspecRatio
  THREECAMERA.updateProjectionMatrix()
  window.JEEFACEFILTERAPI.resize()

  renderer.setSize(
    canvasElement.width, canvasElement.height, false
  )
  renderer.setViewport(
    0, 0, canvasElement.width, canvasElement.height
  )
}

// build the 3D. called once when Jeeliz Face Filter is OK
function init_threeScene(spec) {
    const threeStuffs = THREE.JeelizHelper.init(spec, detect_callback);

     // CREATE A CUBE
    const cubeGeometry = new THREE.BoxGeometry(1,1,1);
    const cubeMaterial = new THREE.MeshNormalMaterial();
    const threeCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    threeCube.frustumCulled = false;

    new THREE.BufferGeometryLoader().load(
      'models/face.json',
      function(occluderGeometry, materials){
      const mat = new THREE.ShaderMaterial({
        vertexShader: THREE.ShaderLib.basic.vertexShader,
        fragmentShader: "precision lowp float;\n void main(void){\n gl_FragColor=vec4(1.,0.,0.,0.);\n }",
        uniforms: THREE.ShaderLib.basic.uniforms,
        colorWrite: false
      });
      const occluderMesh = new THREE.Mesh(occluderGeometry, mat);
      occluderMesh.scale.multiplyScalar(0.008);
      occluderMesh.position.set(0.0, 0.1, -0.25);
      occluderMesh.renderOrder = -1; //render first
      threeStuffs.faceObject.add(occluderMesh)
    });

    // IMPORT THE GLTF MODEL
    const gltfLoader = new window.THREE.GLTFLoader()
    gltfLoader.load('models/sunglasses.gltf', (gltf) => {
      gltf.scene.frustumCulled = false

      // Center and scale the object
      const bbox = new window.THREE.Box3().expandByObject(gltf.scene)

      // Center the model
      const centerBBox = bbox.getCenter(new window.THREE.Vector3())
      gltf.scene.position.add(centerBBox.multiplyScalar(-1))
      gltf.scene.position.add(new window.THREE.Vector3(
        0,
        0.07,
        0.1
      ))

      // Scale the model according to its width
      const sizeX = bbox.getSize(new window.THREE.Vector3()).x
      gltf.scene.scale.multiplyScalar(1.2 / sizeX)

      // Dispatch the model
      threeStuffs.faceObject.add(gltf.scene)
    })

    // Load our cool hat
    new THREE.BufferGeometryLoader().load(
      'models/luffys_hat.json',
      function (geometry, materials) {
        // we create our Hat material
        var mat=new THREE.MeshBasicMaterial({
          // load the texture using a TextureLoader
          map: new THREE.TextureLoader().load( 'models/Texture.jpg')
        });
        // and finally create our mesh
        const hatMesh = new THREE.Mesh(geometry, mat)
        hatMesh.scale.multiplyScalar(1.2);
        hatMesh.rotation.set(0, -40, 0);
        hatMesh.position.set(0.0, 0.6, 0.0);
        threeStuffs.faceObject.add(hatMesh)
      }
    )

    //CREATE THE CAMERA
    const aspecRatio=spec.canvasElement.width / spec.canvasElement.height;
    THREECAMERA = new THREE.PerspectiveCamera(20, aspecRatio, 0.1, 100);
    setFullScreen(spec.canvasElement, threeStuffs.renderer)
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
      videoSettings:{ //increase the default video resolution since we are in full screen
        'idealWidth': 1280,  //ideal video width in pixels
        'idealHeight': 800, //ideal video height in pixels
        'maxWidth': 1920,   //max video width in pixels
        'maxHeight': 1920   //max video height in pixels
      },
        followZRot: true,   // Allow full rotation around depth axis https://github.com/jeeliz/jeelizFaceFilter/issues/42
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

