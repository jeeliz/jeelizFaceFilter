// SETTINGS of this demo:
const SETTINGS = {
  rotationOffsetX: 0, // negative -> look upper. in radians
  cameraFOV: 40,    // in degrees, 3D camera FOV
  pivotOffsetYZ: [0.2, 0.6], // XYZ of the distance between the center of the cube and the pivot
  detectionThreshold: 0.75, // sensibility, between 0 and 1. Less -> more sensitive
  detectionHysteresis: 0.05,
  scale: 1.1, // scale
  blurEdgeSoftness: 10
};

// global THREE objects:
let THREEVIDEOTEXTURE = null;
let THREERENDERER = null;
let THREEFACEOBJ3D = null;
let THREEFACEOBJ3DPIVOTED = null;
let THREESCENE = null;
let THREECAMERA = null;
let THREESCENE0 = null;
let THREESCENE0RENDERTARGET = null;
let THREESCENE1 = null;
let THREESCENE1RENDERTARGET = null;
let THREESCENE2 = null;
let THREESCENE2RENDERTARGET = null;

// global initilialized by JEEFACEFILTER:
let GL = null, GLVIDEOTEXTURE = null;

// other globalz:
let ISDETECTED = false;

// callback: launched if a face is detected or lost
function detect_callback(isDetected) {
  if (isDetected) {
    console.log('INFO in detect_callback(): DETECTED');
  } else {
    console.log('INFO in detect_callback(): LOST');
  }
}

function get_mat2DshaderSource() {
  return "attribute vec2 position;\n\
      varying vec2 vUV;\n\
      void main(void){\n\
        gl_Position = vec4(position,0.,1.);\n\
        vUV = 0.5 + 0.5*position;\n\
      }";
}

function build_videoMaterial(blurredAlphaTexture, videoTransformMat2) {
  const mat = new THREE.RawShaderMaterial({
    depthWrite: false,
    depthTest: false,
    vertexShader: get_mat2DshaderSource(),
    fragmentShader: "precision lowp float;\n\
      uniform sampler2D samplerVideo, samplerBlurredAlphaFace;\n\
      uniform mat2 videoTransformMat2;\n\
      varying vec2 vUV;\n\
      \n\
      const vec3 LUMA=vec3(0.299,0.587,0.114); //grayscale conversion - see https://en.wikipedia.org/wiki/Grayscale#Luma_coding_in_video_systems\n\
      const vec3 FACECOLOR=1.2*vec3(242.0, 236.0, 230.0)/255.0;\n\
      \n\
      void main(void){\n\
        vec2 uvVideoCentered = 2.0 * videoTransformMat2 * (vUV - 0.5);\n\
        vec3 videoColor = texture2D(samplerVideo, 0.5 + uvVideoCentered).rgb;\n\
        vec4 faceColor = texture2D(samplerBlurredAlphaFace, vUV);\n\
        // apply some tweaks to faceColor:\n\
        vec3 faceColorTweaked = dot(LUMA, faceColor.rgb)*FACECOLOR;\n\
        vec3 mixedColor = mix(videoColor, faceColorTweaked, faceColor.a);\n\
        gl_FragColor = vec4(mixedColor, 1.);\n\
      }",
    uniforms: {
      samplerVideo: { value: THREEVIDEOTEXTURE },
      samplerBlurredAlphaFace: { value: blurredAlphaTexture },
      videoTransformMat2: {value: videoTransformMat2}
    }
  });
  return mat;
}

function build_maskMaterial(fragmentShaderSource, videoDimensions, videoTransformMat2) {
  const vertexShaderSource = 'varying vec2 vUVvideo;\n\
    uniform mat2 videoTransformMat2;\n\
    void main() {\n\
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n\
      vec4 projectedPosition = projectionMatrix * mvPosition;\n\
      gl_Position = projectedPosition;\n\
      // compute UV coordinates on the video texture:\n\
      vUVvideo = vec2(0.5,0.5 ) + videoTransformMat2 * projectedPosition.xy/projectedPosition.w;\n\
    }';

  const mat = new THREE.ShaderMaterial({
    vertexShader: vertexShaderSource,
    fragmentShader: fragmentShaderSource,
    uniforms: {
      samplerVideo: { value: THREEVIDEOTEXTURE },
      videoSize: { value: new THREE.Vector2().fromArray(videoDimensions) },
      videoTransformMat2: {value: videoTransformMat2}
    }
  });
  return mat;
}

function build_blurMaterial(dxy, threeTexture) {
  const mat = new THREE.RawShaderMaterial({
    depthWrite: false,
    depthTest: false,
    vertexShader: get_mat2DshaderSource(),
    fragmentShader: "precision lowp float;\n\
      uniform sampler2D samplerImage;\n\
      uniform vec2 dxy;\n\
      varying vec2 vUV;\n\
      void main(void){\n\
        vec4 colCenter = texture2D(samplerImage, vUV);\n\
        float alphaBlured = (8./254.) *texture2D(samplerImage, vUV-3.*dxy).a\n\
          +(28./254.)*texture2D(samplerImage, vUV-2.*dxy).a\n\
          +(56./254.)*texture2D(samplerImage, vUV-dxy).a\n\
          +(70./254.)*colCenter.a\n\
          +(56./254.)*texture2D(samplerImage, vUV+dxy).a\n\
          +(28./254.)*texture2D(samplerImage, vUV+2.*dxy).a\n\
          +(8./254.) *texture2D(samplerImage, vUV+3.*dxy).a;\n\
        if (colCenter.a==0.0){alphaBlured=colCenter.a;}//blur only the interior (if colCenter.a==0 do nothing);\n\
        gl_FragColor = vec4(colCenter.rgb, pow(alphaBlured, 2.));\n\
      }",
    uniforms: {
      samplerImage:{ value: threeTexture },
      dxy: { value: new THREE.Vector2().fromArray(dxy).multiplyScalar(SETTINGS.blurEdgeSoftness) }
    }
  });
  return mat;
} // end build_blurMaterial()

// build the 3D. called once when Jeeliz Face Filter is OK
function init_threeScene(spec) {
  // AFFECT GLOBALS:
  GL = spec.GL;
  GLVIDEOTEXTURE = spec.videoTexture;

  // INIT THE THREE.JS context
  THREERENDERER = new THREE.WebGLRenderer({
    context: spec.GL,
    canvas: spec.canvasElement
  });
  
  // CREATE THE SCENES
  THREESCENE = new THREE.Scene();
  THREESCENE0 = new THREE.Scene();
  THREESCENE1 = new THREE.Scene();
  THREESCENE2 = new THREE.Scene();
  
  // CREATE THE TARGET TEXTURES FOR RENDER TO TEXTURE
  const filters = {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    depthBuffer: false,
    stencilBuffer: false
  };
  THREESCENE0RENDERTARGET = new THREE.WebGLRenderTarget(spec.canvasElement.width, spec.canvasElement.height, filters);
  THREESCENE1RENDERTARGET = new THREE.WebGLRenderTarget(spec.canvasElement.width, spec.canvasElement.height, filters);
  THREESCENE2RENDERTARGET = new THREE.WebGLRenderTarget(spec.canvasElement.width, spec.canvasElement.height, filters);
  
  // init video texture with red
  THREEVIDEOTEXTURE = new THREE.DataTexture(new Uint8Array([255,0,0]), 1, 1, THREE.RGBFormat);
  THREEVIDEOTEXTURE.needsUpdate = true;

  // INIT THE THREE.JS LOADING MANAGER
  const _threeLoadingManager = new THREE.LoadingManager();

  // COMPOSITE OBJECT WHICH WILL FOLLOW THE HEAD
  // in fact we create 2 objects to be able to shift the pivot point
  THREEFACEOBJ3D = new THREE.Object3D();
  THREEFACEOBJ3D.frustumCulled = false;
  THREEFACEOBJ3DPIVOTED = new THREE.Object3D();
  THREEFACEOBJ3DPIVOTED.frustumCulled = false;
  THREEFACEOBJ3DPIVOTED.position.set(0, -SETTINGS.pivotOffsetYZ[0], -SETTINGS.pivotOffsetYZ[1]);
  THREEFACEOBJ3DPIVOTED.scale.set(SETTINGS.scale, SETTINGS.scale, SETTINGS.scale);
  THREEFACEOBJ3D.add(THREEFACEOBJ3DPIVOTED);
  THREESCENE0.add(THREEFACEOBJ3D);

  // REATE THE MASK
  const maskLoader = new THREE.BufferGeometryLoader(_threeLoadingManager);
  let _maskBufferGeometry = null, _maskMaterial = null;
  /*
  faceLowPoly.json has been exported from dev/faceLowPoly.blend using THREE.JS blender exporter with Blender v2.76
  */
  maskLoader.load('./models/faceLowPoly.json', function (maskBufferGeometry) {
    maskBufferGeometry.computeVertexNormals();
    _maskBufferGeometry = maskBufferGeometry;
  });
  const celFragmentShaderLoader = new THREE.FileLoader(_threeLoadingManager);
  celFragmentShaderLoader.load('./shaders/celFragmentShader.gl', function (fragmentShaderSource) {
    _maskMaterial = build_maskMaterial(fragmentShaderSource, [spec.canvasElement.width, spec.canvasElement.height], spec.videoTransformMat2);
  });
  _threeLoadingManager.onLoad = function () {
    console.log('INFO in demo_celFace.js: all 3D assets have been loaded successfully :)');
    const threeMask = new THREE.Mesh(_maskBufferGeometry, _maskMaterial);
    threeMask.frustumCulled = false;
    threeMask.scale.multiplyScalar(1.2);
    threeMask.position.set(0, 0.2, -0.5);
    THREEFACEOBJ3DPIVOTED.add(threeMask);
  }
  
  // CREATE THE VIDEO BACKGROUND
  const _quad2DGeometry = new THREE.BufferGeometry()
  const videoScreenCorners = new Float32Array([-1,-1,   1,-1,   1,1,   -1,1]);
  _quad2DGeometry.addAttribute('position', new THREE.BufferAttribute( videoScreenCorners, 2));
  _quad2DGeometry.setIndex(new THREE.BufferAttribute(new Uint16Array([0,1,2, 0,2,3]), 1));
  const _videoMaterial = build_videoMaterial(THREESCENE2RENDERTARGET.texture, spec.videoTransformMat2);
  const videoMesh = new THREE.Mesh(_quad2DGeometry, _videoMaterial);
  videoMesh.frustumCulled = false;
  videoMesh.onAfterRender = function () {
    THREERENDERER.properties.update(THREEVIDEOTEXTURE, '__webglTexture', GLVIDEOTEXTURE);
    THREEVIDEOTEXTURE.magFilter = THREE.LinearFilter;
    THREEVIDEOTEXTURE.minFilter = THREE.LinearFilter;
    delete(videoMesh.onAfterRender);
  }
  THREESCENE.add(videoMesh);

  // INIT STUFFS FOR THE SECOND PASS:
  const faceBlurAlphaXmesh = new THREE.Mesh(_quad2DGeometry, build_blurMaterial([1 / spec.canvasElement.width, 0], THREESCENE0RENDERTARGET.texture));
  const faceBlurAlphaYmesh = new THREE.Mesh(_quad2DGeometry, build_blurMaterial([0, 1 / spec.canvasElement.height], THREESCENE1RENDERTARGET.texture));
  faceBlurAlphaXmesh.frustumCulled = false;
  faceBlurAlphaYmesh.frustumCulled = false;
  THREESCENE1.add(faceBlurAlphaXmesh);
  THREESCENE2.add(faceBlurAlphaYmesh);

  // CREATE THE CAMERA:
  const aspecRatio = spec.canvasElement.width / spec.canvasElement.height;
  THREECAMERA = new THREE.PerspectiveCamera(SETTINGS.cameraFOV, aspecRatio, 0.1, 100);
} // end init_threeScene()


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
      if (ISDETECTED && detectState.detected < SETTINGS.detectionThreshold - SETTINGS.detectionHysteresis) {
        // DETECTION LOST
        detect_callback(false);
        ISDETECTED = false;
      } else if (!ISDETECTED && detectState.detected > SETTINGS.detectionThreshold + SETTINGS.detectionHysteresis) {
        // FACE DETECTED
        detect_callback(true);
        ISDETECTED = true;
      }

      if (ISDETECTED) {
        // move the cube in order to fit the head
        const tanFOV = Math.tan(THREECAMERA.aspect * THREECAMERA.fov * Math.PI / 360); // tan(FOV/2), in radians
        const W = detectState.s;  // relative width of the detection window (1-> whole width of the detection window)
        const D = 1 / (2 * W * tanFOV); // distance between the front face of the cube and the camera
        
        // coords in 2D of the center of the detection window in the viewport:
        const xv = detectState.x;
        const yv = detectState.y;
        
        //coords in 3D of the center of the cube (in the view coordinates system)
        const z = -D - 0.5;   // minus because view coordinate system Z goes backward. -0.5 because z is the coord of the center of the cube (not the front face)
        const x = xv * D * tanFOV;
        const y = yv * D * tanFOV / THREECAMERA.aspect;

        // move and rotate the cube
        THREEFACEOBJ3D.position.set(x, y + SETTINGS.pivotOffsetYZ[0], z + SETTINGS.pivotOffsetYZ[1]);
        THREEFACEOBJ3D.rotation.set(detectState.rx + SETTINGS.rotationOffsetX, detectState.ry, detectState.rz, "XYZ");
      }

      THREERENDERER.state.reset();
      
      // first render to texture: 3D face  mask with cel shading
      THREERENDERER.render(THREESCENE0, THREECAMERA, THREESCENE0RENDERTARGET);

      // second pass: add gaussian blur on alpha channel horizontally
      THREERENDERER.render(THREESCENE1, THREECAMERA, THREESCENE1RENDERTARGET);

      // second pass: add gaussian blur on alpha channel vertically
      THREERENDERER.render(THREESCENE2, THREECAMERA, THREESCENE2RENDERTARGET);

      THREERENDERER.render(THREESCENE, THREECAMERA);
    } // end callbackTrack()
  }); // end JEELIZFACEFILTER.init call
} // end main()


window.addEventListener('load', main);