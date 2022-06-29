// some globalz:
let THREECAMERA = null;
const ARRAY_BILLS = [];


// callback: launched if a face is detected or lost
function detect_callback(isDetected) {
  if (isDetected) {
    console.log('INFO in detect_callback(): DETECTED');
  } else {
    console.log('INFO in detect_callback(): LOST');
  }
}


function create_mat2d(threeTexture, isTransparent){ // MT216: we put the creation of the video material in a func because we will also use it for the frame
  return new THREE.RawShaderMaterial({
    depthWrite: false,
    depthTest: false,
    transparent: isTransparent,
    vertexShader: "attribute vec2 position;\n\
      varying vec2 vUV;\n\
      void main(void){\n\
        gl_Position = vec4(position, 0., 1.);\n\
        vUV = 0.5 + 0.5*position;\n\
      }",
    fragmentShader: "precision lowp float;\n\
      uniform sampler2D samplerVideo;\n\
      varying vec2 vUV;\n\
      void main(void){\n\
        gl_FragColor = texture2D(samplerVideo, vUV);\n\
      }",
     uniforms:{
      samplerVideo: { value: threeTexture }
     }
  });
}


// build the 3D. called once when Jeeliz Face Filter is OK
function init_threeScene(spec) {
  // We use the helper
  window.THREESTUFF = JeelizThreeHelper.init(spec, detect_callback);

  // CREATE OUR MASK OBJECT AND ADD IT TO OUR SCENE
  const casaLoader = new THREE.BufferGeometryLoader();

  casaLoader.load(
    './models/casa_de_papel/casa_de_papel.json',
    (maskGeometry) => {
      const maskMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('./models/casa_de_papel/CasaDePapel_DIFFUSE.png'),
        normalMap: new THREE.TextureLoader().load('./models/casa_de_papel/CasaDePapel_NRM.png'),
        reflectivity: 1,
        emissiveMap: new THREE.TextureLoader().load('./models/casa_de_papel/CasaDePapel_REFLECT.png')
      });

      const maskMesh = new THREE.Mesh(maskGeometry, maskMaterial);
      maskMesh.scale.multiplyScalar(0.06);
      maskMesh.position.y = -0.8;
      maskMesh.scale.x = 0.07;

      addDragEventListener(maskMesh);

      THREESTUFF.faceObject.add(maskMesh);
    }
  )

  // Create the bills:
  const billGeometry = new THREE.PlaneGeometry(0.4, 0.4);
  const billMaterial = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('./images/billet_50.png'),
    side: THREE.DoubleSide,
    transparent: true,
  });

  
  // Position each bill randomly + add animations:
  for (let i = 0; i < 40; i++) {

    const xRand = Math.random()*1 - 0.5;
    const yRand = 3;
    const zRand = (Math.random()*3 - 1.5) - 1.5;

    const billMesh = new THREE.Mesh(billGeometry, billMaterial);
    billMesh.renderOrder = 100;
    billMesh.frustumCulled = false;
    billMesh.visible = false;

    billMesh.position.set(xRand, yRand, zRand);
    billMesh.rotation.y = xRand;
    billMesh.rotation.z = zRand;

    billMesh.scale.multiplyScalar(0.4);
    billMesh.scale.z = xRand * 10;

    ARRAY_BILLS.push(billMesh);

    const button = document.getElementById('buttonPlayAudio');
    button.classList.remove('disabled');
  }

  //MT216 : create the frame. We reuse the geometry of the video
  const calqueMesh = new THREE.Mesh(THREESTUFF.videoMesh.geometry, create_mat2d(new THREE.TextureLoader().load('./images/calque.png'), true))
  calqueMesh.renderOrder = 999; // render last
  calqueMesh.frustumCulled = false;
  THREESTUFF.scene.add(calqueMesh);

  // CREATE THE CAMERA
  THREECAMERA = JeelizThreeHelper.create_camera();

  // CREATE AN AMBIENT LIGHT
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  THREESTUFF.scene.add(ambientLight);

  // CREATE A DIRECTIONALLIGHT
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLight.position.set(100, 1000, 1000);
  THREESTUFF.scene.add(dirLight);
} // end init_threeScene()



// Animate the falling bills:
function animate_bill(mesh, index) {
  mesh.visible = true;
  
  let count = 0;
  setInterval(() => {
    if (mesh.position.y < -3) {
      mesh.position.y = 3;
    }
    mesh.position.x = mesh.position.x + (0.005 * Math.cos(Math.PI / 40 * count));
    
    mesh.position.y -= 0.01;

    mesh.rotation.y = mesh.rotation.y + (0.005 * Math.cos(Math.PI / 40 * count));
    mesh.rotation.x += 0.03;
    mesh.rotation.z += 0.02;

    count += 0.9;
  }, 16)
}


let contextAudio = null;

// Plays the theme song and starts animation for the bills:
function play_audio() {
  ARRAY_BILLS.forEach((bill, i) => {
    setTimeout(() => {
      animate_bill(bill, i);

      THREESTUFF.scene.add(bill);      
    }, 230*i)
  })


  const button = document.getElementById('buttonPlayAudio');

  button.style.display = 'none';
  // INIT WEB AUDIO
  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    contextAudio = new AudioContext();
  } catch (e) {
    console.log('Web Audio API is not supported in this browser.');
  }
  if (contextAudio) {
    const bufferLoader = new BufferLoader(
      contextAudio,
      ['./audio/bella_ciao.mp3'],
      (bufferList) => {
        const around = contextAudio.createBufferSource();

        around.buffer = bufferList[0];
        
        around.connect(contextAudio.destination);
        around.loop = true;
        around.start();        
      }
    );
    bufferLoader.load();
  }
}


// entry point:
function main(){
  JeelizResizer.size_canvas({
    canvasId: 'jeeFaceFilterCanvas',
    callback: function(isError, bestVideoSettings) {
      init_faceFilter(bestVideoSettings);
    }
  })
}


function init_faceFilter(videoSettings) {
  JEELIZFACEFILTER.init({
    canvasId: 'jeeFaceFilterCanvas',
    NNCPath: '../../../neuralNets/', // path of NN_DEFAULT.json file
    videoSettings: videoSettings,
    callbackReady: function (errCode, spec) {
      if (errCode) {
        console.log('AN ERROR HAPPENS. SORRY BRO :( . ERR =', errCode);
        return;
      }

      console.log('INFO : JEELIZFACEFILTER IS READY');
      init_threeScene(spec);
    }, // end callbackReady()

    // called at each render iteration (drawing loop)
    callbackTrack: function (detectState) {
      JeelizThreeHelper.render(detectState, THREECAMERA);
    } // end callbackTrack()
  }); // end JEELIZFACEFILTER.init call
}


window.addEventListener('load', main);
