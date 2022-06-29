// some globalz :
let THREECAMERA = null;
let BUTTERFLYOBJ3D = null;
const NUMBERBUTTERFLIES = 10;
const MIXERS = [];
const ACTIONS = [];
let ISANIMATED = false;


// callback : launched if a face is detected or lost
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

  // ADD OUR BUTTERFLY:
  const butterflyLoader = new THREE.JSONLoader();

  butterflyLoader.load(
    './models/butterfly/butterfly.json',
    (geometry) => {
      const materialBody = new THREE.MeshBasicMaterial({
        color: 0x000000,
        depthWrite: false,
        opacity: 0
      });

      // let butterFlyInstance
      // let action;
      let clips = null;
      let clip = null;
      let xRand = null;
      let yRand = null;
      let zRand = null;
      let sign = null;

      BUTTERFLYOBJ3D = new THREE.Object3D();

      for (let i = 2; i <= NUMBERBUTTERFLIES; i++) {
        const indexTexture = i % 6 === 0 ? 1 : i % 6;

        const materialWings = new THREE.MeshLambertMaterial({
          map: new THREE.TextureLoader().load(`./models/butterfly/Wing_Diffuse_${indexTexture}.jpg`),
          alphaMap: new THREE.TextureLoader().load('./models/butterfly/Wing_Alpha.jpg'),
          transparent: true,
          morphTargets: true,
          opacity: 0
        });
        const butterFlyInstance = new THREE.Mesh(geometry, [materialWings, materialBody]);

        xRand = Math.random() * 2 - 1;
        yRand = Math.random() * 1 + 0.1;
        zRand = Math.random() * 1 + 0.5;

        sign = i % 2 === 0 ? -1 : 1;

        butterFlyInstance.position.set(xRand, yRand, zRand);
        butterFlyInstance.scale.multiplyScalar(0.55);
        butterFlyInstance.visible = false;
        let BUTTERFLYINSTANCEOBJ3D = new THREE.Object3D();
        setTimeout(() => {
          animateFly(butterFlyInstance, 0.01*(i + 3)*0.1 + 0.002, i)
          butterFlyInstance.material[0].opacity = 1;
          butterFlyInstance.material[1].opacity = 1;
          butterFlyInstance.visible = true
          BUTTERFLYINSTANCEOBJ3D.add(butterFlyInstance)
        }, 600*i);


        // CREATE WING FLAP ANIMATION
        if (!ISANIMATED) {
          // This is where adding our animation begins
          const mixer = new THREE.AnimationMixer(butterFlyInstance);     

          clips = butterFlyInstance.geometry.animations;

          clip = clips[0];


          const action = mixer.clipAction(clip);


          ACTIONS.push(action);
          MIXERS.push(mixer);
        }


        // ADD OUR LIGHTS INSIDE THE BUTTERFLY TO CREATE A GLOWING EFFECT
        let pointLight = new THREE.PointLight(0x77ffff, 1, 1, 0.1);
        pointLight.position.set(xRand, yRand, zRand);


        setTimeout(() => {
          animatePointLightButterfly(pointLight);
          animateFly(pointLight, 0.01*(i + 3)*0.1 + 0.002, i);
        }, 600*i);

        BUTTERFLYINSTANCEOBJ3D.add(pointLight);


        BUTTERFLYOBJ3D.add(BUTTERFLYINSTANCEOBJ3D);
      }

      // We play the animation for each butterfly and shift their cycles
      // by adding a small timeout
      ACTIONS.forEach((a, index) => {
        setTimeout(() => {
          a.play();
        }, index*33)
      })

      ISANIMATED = true;
      
      threeStuffs.faceObject.add(BUTTERFLYOBJ3D);
    }
  );

  // CREATE THE CAMERA
  THREECAMERA = JeelizThreeHelper.create_camera();
} // end init_threeScene()


// Create the animation for the wings
function animateFly(mesh, theta, index) {
  let count = 0
  const x = mesh.position.x;
  const y = mesh.position.y;
  const z = mesh.position.z;
  
  setInterval(() => {
    count += 0.01

    mesh.position.set(
      (x + (index*0.01)) * Math.cos(count),
      (y*0.5 + (index*0.01)) * Math.sin(count*0.2*index) + 1,
      (z + (index*0.01)) * Math.sin(count)
    ) 
    mesh.rotation.y = (1.5 * Math.cos(count+0.05)) + 0.3;
    mesh.rotation.z = 0.2 * Math.sin(count);
  }, 16)
}

// Animates the soptlight for each butterfly
function animatePointLightButterfly (light) {
  const opacityUp = new TWEEN.Tween(light)
  .to({ intensity: 0.6 }, 2000);

  const opacityDown = new TWEEN.Tween(light)
  .to({ intensity: 0 }, 2000);

  opacityUp.chain(opacityDown);

  opacityDown.onComplete(() => {
    opacityUp.start()
  });

  opacityUp.start();
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

      console.log('INFO : JEELIZFACEFILTER IS READY');
      init_threeScene(spec);
    }, // end callbackReady()

    // called at each render iteration (drawing loop):
    callbackTrack: function (detectState) {
      TWEEN.update();
      
      if (MIXERS.length > 1) {
        MIXERS.forEach((m) => {
          m.update(0.13);
        });
      }

      JeelizThreeHelper.render(detectState, THREECAMERA);
    } // end callbackTrack()
  }); // end JEELIZFACEFILTER.init call
} // end main()


window.addEventListener('load', main);