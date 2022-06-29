// some globalz:
let THREECAMERA = null, TIGERMOUTHHIDEMESH = null;
let MOUTHOPENINGMATERIALS = [];
let PARTICLESOBJ3D = null, PARTICLES = [], PARTICLESHOTINDEX = 0, PARTICLEDIR = null;
let ISDETECTED = false;


// callback: launched if a face is detected or lost
function detect_callback(isDetected){
  if (isDetected){
    console.log('INFO in detect_callback(): DETECTED');
  } else {
    console.log('INFO in detect_callback(): LOST');
  }
}


function generate_sprite() { // generate a canvas2D used as texture for particle sprite material:
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,0.5)');
  gradient.addColorStop(0.2, 'rgba(0,255,255,0.5)');
  gradient.addColorStop(0.4, 'rgba(0,0,64,0.5)');
  gradient.addColorStop(1, 'rgba(0,0,0,0.5)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  return canvas;
}


function init_particle( particle, delay, direction) { // init 1 particle position and movement
  if (particle.visible) return; // particle is already in move

  // tween position:
  particle.position.set(0.5*(Math.random()-0.5),-0.35+0.5*(Math.random()-0.5),0.5);
  particle.visible = true;
  
  new TWEEN.Tween( particle.position )
    .to( {x: direction.x*10,
        y: direction.y*10,
        z: direction.z*10 }, delay)
    .start().onComplete(function(){
      particle.visible = false;
    });

  // tween scale:
  particle.scale.x = particle.scale.y = Math.random() * 0.6
  new TWEEN.Tween( particle.scale )
    .to( {x: 0.8, y: 0.8}, delay)
    .start();
}


function build_customMaskMaterial(textureURL, videoTransformMat2){
  let vertexShaderSource = THREE.ShaderLib.lambert.vertexShader;
  vertexShaderSource = vertexShaderSource.replace('void main() {', 'varying vec3 vPos; uniform float mouthOpening; void main(){ vPos=position;');
  let glslSource = [
    'float isLowerJaw = step(position.y+position.z*0.2, 0.0);',
    //'transformed+=vec3(0., -0.1, 0.)*isLowerJaw*mouthOpening;'
    'float theta = isLowerJaw * mouthOpening * 3.14/12.0;',
    'transformed.yz = mat2(cos(theta), sin(theta),-sin(theta), cos(theta))*transformed.yz;'

  ].join('\n');
  vertexShaderSource = vertexShaderSource.replace('#include <begin_vertex>', '#include <begin_vertex>\n'+glslSource);

  let fragmentShaderSource = THREE.ShaderLib.lambert.fragmentShader;
  glslSource = [
    'float alphaMask = 1.0;', // initialize the opacity coefficient (1.0->fully opaque)
    'vec2 pointToEyeL = vPos.xy - vec2(0.25,0.15);',  // position of left eye
    'vec2 pointToEyeR = vPos.xy - vec2(-0.25,0.15);', // position of right eye
    'alphaMask *= smoothstep(0.05, 0.2, length(vec2(0.6,1.)*pointToEyeL));', // left eye fading
    'alphaMask *= smoothstep(0.05, 0.2, length(vec2(0.6,1.)*pointToEyeR));', // left eye fading
    'alphaMask = max(alphaMask, smoothstep(0.65, 0.75, vPos.z));', // force the nose opaque
    'float isDark = step(dot(texelColor.rgb, vec3(1.,1.,1.)), 1.0);',
    'alphaMask = mix(alphaMask, 1., isDark);',// only make transparent light parts'
    // compute get video color:
    'vec2 uvVp = gl_FragCoord.xy/resolution;', // 2D position in the viewport (between 0 and 1)
    'float scale = 0.03 / vPos.z;', // scale of the distorsion in 2D
    'vec2 uvMove = vec2(-sign(vPos.x), -1.5) * scale;', // video distorsion. the sign() distinguish between left and right face side
    'uvVp += uvMove;', // apply uvMove
    'vec2 uvVideo = 0.5 + 2.0 * videoTransformMat2 * (uvVp - 0.5);', // UV coordinate in camera video texture. videoTransformMat2 should be applied to centered UVs
    'vec4 videoColor = texture2D(samplerVideo, uvVideo);',
    // process and mix video color with rendering color:
    'float videoColorGS = dot(vec3(0.299, 0.587, 0.114), videoColor.rgb);', // grayscale value of the video pixel
    'videoColor.rgb = videoColorGS * vec3(1.5,0.6,0.0);', // color video with orange
    'gl_FragColor = mix(videoColor, gl_FragColor, alphaMask);' // mix video background with mask color
  ].join('\n');
  fragmentShaderSource = fragmentShaderSource.replace('void main() {', 'varying vec3 vPos; uniform sampler2D samplerVideo; uniform vec2 resolution; uniform mat2 videoTransformMat2; void main(){');
  fragmentShaderSource = fragmentShaderSource.replace('#include <dithering_fragment>', '#include <dithering_fragment>\n'+glslSource);
    
  const mat = new THREE.ShaderMaterial({
    vertexShader: vertexShaderSource,
    fragmentShader: fragmentShaderSource,
    uniforms: Object.assign({
      samplerVideo: {value: JeelizThreeHelper.get_threeVideoTexture()},
      resolution: {value: new THREE.Vector2(THREESTUFF.renderer.getSize().width, THREESTUFF.renderer.getSize().height)},
      mouthOpening: {value: 0},
      videoTransformMat2: {value: videoTransformMat2}
    }, THREE.ShaderLib.lambert.uniforms),
    lights: true,
    transparent: true
  });
  const texture = new THREE.TextureLoader().load(textureURL);
  mat.uniforms.map = {value: texture};
  mat.map = texture;

  MOUTHOPENINGMATERIALS.push(mat);
  return mat;
}


// build the 3D. called once when Jeeliz Face Filter is OK:
function init_threeScene(spec){

  // INIT THE THREE.JS context
  const threeStuffs = JeelizThreeHelper.init(spec, detect_callback);
  window.THREESTUFF = threeStuffs; // to debug in the console
  const videoTransformMat2 = spec.videoTransformMat2;

  // LOAD THE TIGGER MESH
  const tigerMaskLoader = new THREE.BufferGeometryLoader();
  tigerMaskLoader.load('TigerHead.json', function(tigerMaskGeom){
    const tigerFaceSkinMat = build_customMaskMaterial('headTexture2.png', videoTransformMat2);
    const tigerEyesMat = build_customMaskMaterial('white.png', videoTransformMat2);

    const whiskersMat = new THREE.MeshLambertMaterial({
      color: 0xffffff
    });
    const insideEarsMat = new THREE.MeshBasicMaterial({
      color: 0x331100
    });
    const tigerMaskMesh = new THREE.Mesh(tigerMaskGeom, [
      whiskersMat, tigerEyesMat, tigerFaceSkinMat, insideEarsMat
      ]);
    tigerMaskMesh.scale.set(2,3,2);
    tigerMaskMesh.position.set(0., 0.2, -0.48);

    // small black quad to hide inside the mouth
    // (visible only if the user opens the mouth)
    TIGERMOUTHHIDEMESH = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(0.5,0.6),
      new THREE.MeshBasicMaterial({color: 0x000000})
    );
    TIGERMOUTHHIDEMESH.position.set(0,-0.35,0.5);
    threeStuffs.faceObject.add(tigerMaskMesh, TIGERMOUTHHIDEMESH);
  });

  //BUILD PARTICLES :
  PARTICLESOBJ3D = new THREE.Object3D();
  const particleMaterial = new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(generate_sprite()),
    blending: THREE.AdditiveBlending
  });
  for ( let i = 0; i <= 200; ++i ) { // we work with a fixed number of particle to avoir memory dynamic allowation
    const particle = new THREE.Sprite(particleMaterial);
    particle.scale.multiplyScalar(0);
    particle.visible = false;
    PARTICLES.push(particle);
    PARTICLESOBJ3D.add(particle);
  }
  threeStuffs.faceObject.add(PARTICLESOBJ3D);
  PARTICLEDIR = new THREE.Vector3();

  //AND THERE WAS LIGHT
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  const dirLight = new THREE.DirectionalLight(0xff8833, 2);
  dirLight.position.set(0,0.5,1);

  threeStuffs.scene.add(ambientLight, dirLight);

  //CREATE THE CAMERA
  THREECAMERA = JeelizThreeHelper.create_camera();
} //end init_threeScene()


// Entry point:
function main(){
  JEELIZFACEFILTER.init({
    canvasId: 'jeeFaceFilterCanvas',
    NNCPath: '../../../neuralNets/', // path of NN_DEFAULT.json file
    callbackReady: function(errCode, spec){
      if (errCode){
        console.log('AN ERROR HAPPENS. SORRY BRO :( . ERR =', errCode);
        return;
      }

      console.log('INFO: JEELIZFACEFILTER IS READY');
      init_threeScene(spec);
    },

    // called at each render iteration (drawing loop):
    callbackTrack: function(detectState){
      ISDETECTED = JeelizThreeHelper.get_isDetected();

      if (ISDETECTED) {
        // update mouth opening:
        let mouthOpening = (detectState.expressions[0]-0.2) * 5.0;
        mouthOpening = Math.min(Math.max(mouthOpening, 0), 1);
        if (mouthOpening > 0.5){
          const theta = Math.random() * 6.28;
          PARTICLEDIR.set(0.5*Math.cos(theta),0.5*Math.sin(theta),1).applyEuler(THREESTUFF.faceObject.rotation);
          init_particle(PARTICLES[PARTICLESHOTINDEX], 2000+40*Math.random(), PARTICLEDIR);
          PARTICLESHOTINDEX = (PARTICLESHOTINDEX+1) % PARTICLES.length;
        }

        MOUTHOPENINGMATERIALS.forEach(function(mat){
          mat.uniforms.mouthOpening.value=mouthOpening;
        });
        if(TIGERMOUTHHIDEMESH){
          TIGERMOUTHHIDEMESH.scale.setY(1. + mouthOpening * 0.4);
        }
      }

      TWEEN.update();

      JeelizThreeHelper.render(detectState, THREECAMERA);
    } //end callbackTrack()
  }); //end JEELIZFACEFILTER.init call
} //end main()

 
window.addEventListener('load', main);