// some globalz:
let THREEVIDEOTEXTURE = null;
let THREECAMERA = null;
let ISDETECTED = false;

let WOLFOBJ3D = null, MASKOBJ3D = null;
let WOLFMESH = null, FACEMESH = null;
let COLORFILTERCOEF = null;
let VIDEOMESH = null;

let MOONSPRITE = null, MOONHALO = null;

let isTransformed = false;
let ROTATIONX = 0;

let MIXER = null;

let PARTICLEGROUP = null, GROUP = null;

let isLoaded = false;


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
  add_frame();

  const openMouthInstruction = $('#openMouthInstruction');
  openMouthInstruction.hide();

  const threeStuffs = JeelizThreeHelper.init(spec, detect_callback);
            
  // Add our wolf head model:
  const loadingManager = new THREE.LoadingManager();
  const headLoader = new THREE.JSONLoader(loadingManager);

  headLoader.load(
    './models/werewolf/werewolf_not_animated.json',
    // './models/werewolf/Werewolf.fbx',
    (geometryHead) => {
      // GROUP = group;

      const matHead = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('./models/werewolf/head_diffuse.png'),
        normalMap: new THREE.TextureLoader().load('./models/werewolf/head_normal.jpg'),
        alphaMap: new THREE.TextureLoader().load('./models/werewolf/head_alpha.jpg'),
        side: THREE.FrontSide,
        shininess: 10,
        transparent: true,
        morphTargets: true
      });

      const matFur = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('./models/werewolf/fur_diffuse.jpg'),
        normalMap: new THREE.TextureLoader().load('./models/werewolf/fur_normal.png'),
        alphaMap: new THREE.TextureLoader().load('./models/werewolf/fur_alpha.jpg'),
        transparent: true,
        shininess: 20,
        opacity: 1,
        normalScale: new THREE.Vector2(2, 2),
        depthWrite: false
      });
      const matTeeth = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('./models/werewolf/teeth_diffuse.jpg'),
        transparent: true,
        emissive: 0x070505,
        emissiveIntensity: 0,
        shininess: 0,
        reflectivity: 0,
        morphTargets: true
      });

      WOLFMESH = new THREE.Mesh(geometryHead, [matHead, matFur, matTeeth]);
      WOLFMESH.frustumCulled = false;
      WOLFMESH.renderOrder = 1000000;

      WOLFMESH.material[0].opacity = 0;
      WOLFMESH.material[1].opacity = 0;
      WOLFMESH.material[2].opacity = 0;

      WOLFOBJ3D.add(WOLFMESH);
      WOLFOBJ3D.scale.multiplyScalar(7);
      WOLFOBJ3D.position.y -= 1.2;
      WOLFOBJ3D.position.z -= 0.5;

      addDragEventListener(WOLFOBJ3D);

      threeStuffs.faceObject.add(WOLFOBJ3D);
      openMouthInstruction.show();
      isLoaded = true;
    }
  );

  // CREATE THE MOON
  const moonGeometry = new THREE.PlaneGeometry(10, 10, 10);
  const moonMaterial = new THREE.SpriteMaterial({ //MT219: sprites are textured with specific material
    map: new THREE.TextureLoader().load('./images/moon.png'),
    transparent: true,
    depthTest: false
  });

  MOONSPRITE = new THREE.Sprite(moonMaterial); //MT219: the geometry of a sprite is always a 2D plane, so u don't need to specify it
  MOONSPRITE.position.set(1.5, 1.5, -5); //MT219: even if it is a sprite you should position it in 3D: a sprite is a 2D object in a 3D scene
  MOONSPRITE.scale.multiplyScalar(1.2);
  MOONSPRITE.renderOrder = -10000000;
  threeStuffs.scene.add(MOONSPRITE);

  // CREATE THE LIGHT COMING FROM THE MOON
  const pointlightMoon = new THREE.PointLight(0XFFD090, 0.5);
  pointlightMoon.position.set(1.5, 2.5, -2);
  threeStuffs.scene.add(pointlightMoon);

  // CREATE THE MOON GLOW EFFECT
  const moonGlowGeometry = new THREE.SphereGeometry(0.8,32, 32);
  THREEx.dilateGeometry(moonGlowGeometry, 0.15);

  const material = THREEx.createAtmosphereMaterial();
  material.opacity = 0.1;
  
  MOONHALO = new THREE.Mesh(moonGlowGeometry, material);
  MOONHALO.position.set(1.5, 1.5, -5);
  MOONHALO.scale.y = 0.7;
  MOONHALO.scale.x = 0.7;

  threeStuffs.scene.add(MOONHALO);
  // possible customisation of AtmosphereMaterial
  material.uniforms.glowColor.value = new THREE.Color(0XFFFFE0);
  material.uniforms.coeficient.value = 0.1;
  material.uniforms.power.value = 2;
  

  // CREATE AN AMBIENT LIGHT
  const ambient = new THREE.AmbientLight(0x888899, 1);
  threeStuffs.scene.add(ambient);


  // CREATE A SPOTLIGHT
  const dirLight = new THREE.DirectionalLight(0x998899, 1);
  dirLight.position.set(100, 100, 100);
  threeStuffs.scene.add(dirLight);

  // White directional light at half intensity shining from the top.
  const directionalLight = new THREE.DirectionalLight(new THREE.Color(0, 0.1, 0.2), 1);
  threeStuffs.scene.add(directionalLight);

  // init video texture with red
  THREEVIDEOTEXTURE = JeelizThreeHelper.get_threeVideoTexture();
  THREEVIDEOTEXTURE.needsUpdate = true;

  const videoColorFilter = new THREE.Vector3(0.05, 0.1, 0.15);
  COLORFILTERCOEF = 0.7;

  //CREATE THE VIDEO BACKGROUND
  const videoMaterial = new THREE.RawShaderMaterial({
    depthWrite: false,
    depthTest: false,
    vertexShader: "uniform mat2 videoTransformMat2;\n\
      attribute vec2 position;\n\
      varying vec2 vUV;\n\
      void main(void){\n\
        gl_Position=vec4(position, 0., 1.);\n\
        vUV = 0.5 + videoTransformMat2*position;\n\
      }",
    fragmentShader: "precision lowp float;\n\
      uniform sampler2D samplerVideo;\n\
      uniform vec3 colorFilter;\n\
      uniform float colorFilterCoef;\n\
      varying vec2 vUV;\n\
      void main(void){\n\
        vec3 col = texture2D(samplerVideo, vUV).rgb;\n\
        col = mix(col, colorFilter, colorFilterCoef);\n\
        gl_FragColor = vec4(col,1.);\n\
      }",
     uniforms: {
      samplerVideo: { value: THREEVIDEOTEXTURE },
      colorFilter: { value: videoColorFilter },
      colorFilterCoef: { value: COLORFILTERCOEF },
      videoTransformMat2: {value: spec.videoTransformMat2}
     }
  });

  threeStuffs.videoMesh.material = videoMaterial;
  threeStuffs.videoMesh.material.needsUpdate = true;

  // CREATE THE CAMERA
  THREECAMERA = JeelizThreeHelper.create_camera();
} // end init_threeScene()


function animate_wolf (object3D) {
  object3D.visible = true
  new TWEEN.Tween(object3D.material[1])
    .to({ opacity: 1 }, 1000)
    .start();
  new TWEEN.Tween(object3D.material[2])
    .to({ opacity: 1 }, 1000)
    .start();
  new TWEEN.Tween(object3D.material[0])
    .to({ opacity: 1 }, 1000)
    .start();
}


function add_frame() {
  const frame = document.getElementById('frame');
  const ctx = frame.getContext('2d');
  const img = new Image(600, 600);
  img.onload = () => {
    ctx.drawImage(img, 0, 0, 600, 600)
  }
  img.src = './images/frame.png'
}


// entry point:
function main(){
  WOLFOBJ3D = new THREE.Object3D();
  MASKOBJ3D = new THREE.Object3D();

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
    NNCPath: '../../../neuralNets/', // root of NN_DEFAULT.json file
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
      ISDETECTED = JeelizThreeHelper.get_isDetected();

      if (ISDETECTED && detectState.expressions[0] >= 0.9 && !isTransformed && isLoaded) {

        isTransformed = true;
        animate_wolf(WOLFMESH);

        const openMouthInstruction = $('#openMouthInstruction');
        openMouthInstruction.hide();
      }
      
      TWEEN.update();
      if (MIXER) {
        MIXER.update(0.08);
      }

      JeelizThreeHelper.render(detectState, THREECAMERA);
    }
  }); // end JEELIZFACEFILTER.init call
}


window.addEventListener('load', main);
