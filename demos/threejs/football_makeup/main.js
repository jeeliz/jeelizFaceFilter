let THREECAMERA = null;

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

  // Add our face model:
  const loader = new THREE.BufferGeometryLoader();

  loader.load(
    './models/football_makeup/face.json',
    (geometry) => {
      const mat = new THREE.MeshBasicMaterial({
        // DEBUG: uncomment color, comment map and alphaMap
        map: new THREE.TextureLoader().load('./models/football_makeup/texture.png'),
        alphaMap: new THREE.TextureLoader().load('./models/football_makeup/alpha_map_256.png'),
        transparent: true,
        opacity: 0.6
      });

      const faceMesh = new THREE.Mesh(geometry, mat);
      faceMesh.position.y += 0.15;
      faceMesh.position.z -= 0.25;

      addDragEventListener(faceMesh);

      threeStuffs.faceObject.add(faceMesh);
    }
  )

  // We load the font that we'll use to display 3D text:
  const fontLoader = new THREE.FontLoader();

  fontLoader.load(
    './fonts/helvetiker_regular.typeface.json',
    (font) => {
      const textGeometry = new THREE.TextGeometry('Allez les Bleus!', {
        font: font,
        size: 0.25,
        height: 0.1,
        curveSegments: 12,
      });

      const textMesh = new THREE.Mesh(textGeometry, new THREE.MeshBasicMaterial({
        color: 0x2951A7
      }));
      
      textMesh.rotation.y = 3;
      textMesh.rotation.z = 0.3;
      textMesh.position.x += 1.5;
      textMesh.position.y += 1;
      threeStuffs.faceObject.add(textMesh);
    }
  );

  // CREATE THE VIDEO BACKGROUND
  function create_mat2d(threeTexture, isTransparent){ //MT216 : we put the creation of the video material in a func because we will also use it for the frame
    return new THREE.RawShaderMaterial({
      depthWrite: false,
      depthTest: false,
      transparent: isTransparent,
      vertexShader: "attribute vec2 position;\n\
        varying vec2 vUV;\n\
        void main(void){\n\
          gl_Position=vec4(position, 0., 1.);\n\
          vUV=0.5+0.5*position;\n\
        }",
      fragmentShader: "precision lowp float;\n\
        uniform sampler2D samplerVideo;\n\
        varying vec2 vUV;\n\
        void main(void){\n\
          gl_FragColor=texture2D(samplerVideo, vUV);\n\
        }",
       uniforms:{
        samplerVideo: { value: threeTexture }
       }
    });
  }

  //MT216 : create the frame. We reuse the geometry of the video
  const calqueMesh = new THREE.Mesh(threeStuffs.videoMesh.geometry,  create_mat2d(new THREE.TextureLoader().load('./images/cadre_france.png'), true))
  calqueMesh.renderOrder = 999; // render last
  calqueMesh.frustumCulled = false;
  threeStuffs.scene.add(calqueMesh);

  // CREATE THE CAMERA
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
        console.log('AN ERROR HAPPENS. SORRY BRO :( . ERR =', errCode);
        return;
      }

      console.log('INFO: JEELIZFACEFILTER IS READY');
      init_threeScene(spec);
    }, // end callbackReady()

    // called at each render iteration (drawing loop)
    callbackTrack: function (detectState) {
      JeelizThreeHelper.render(detectState, THREECAMERA);
    } // end callbackTrack()
  }); // end JEELIZFACEFILTER.init call
}


window.addEventListener('load', main);