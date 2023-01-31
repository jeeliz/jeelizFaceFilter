const SETTINGS = {
  // detect state in the initial gif to avoid search step (it is logged in the console after a first search)
  
  // for fuck.gif:
  gif: 'gifs/fuck.gif', // initial gif
  detectedStates: [{x:-0.359,y:0.322,s:0.175,ry:-0.033,rz:0.239},{x:-0.34,y:0.32,s:0.171,ry:-0.024,rz:0.239},{x:-0.277,y:0.31,s:0.173,ry:-0.059,rz:0.221},{x:-0.256,y:0.316,s:0.174,ry:-0.077,rz:0.203},{x:-0.242,y:0.321,s:0.173,ry:-0.107,rz:0.187},{x:-0.24,y:0.334,s:0.168,ry:-0.074,rz:0.165},{x:-0.239,y:0.347,s:0.164,ry:-0.061,rz:0.148},{x:-0.235,y:0.352,s:0.162,ry:-0.058,rz:0.133},{x:-0.233,y:0.354,s:0.161,ry:-0.06,rz:0.133},{x:-0.228,y:0.356,s:0.163,ry:-0.067,rz:0.138},{x:-0.234,y:0.352,s:0.166,ry:-0.089,rz:0.154},{x:-0.233,y:0.364,s:0.168,ry:-0.076,rz:0.148},{x:-0.216,y:0.37,s:0.174,ry:-0.098,rz:0.145},{x:-0.191,y:0.373,s:0.175,ry:-0.132,rz:0.139},{x:-0.131,y:0.388,s:0.178,ry:-0.134,rz:0.102},{x:-0.091,y:0.384,s:0.178,ry:-0.146,rz:0.096},{x:-0.062,y:0.383,s:0.177,ry:-0.157,rz:0.079},{x:-0.01,y:0.363,s:0.179,ry:-0.109,rz:0.08},{x:0.049,y:0.345,s:0.178,ry:-0.174,rz:0.032},{x:0.124,y:0.336,s:0.182,ry:-0.25,rz:-0.052}],
  mirroredLoop: true, //*/
  
  //hideIfNotDetectedDuringNframes: 3,

  nDetectsGif: 32, // number of positive detections to perfectly locate the face in the gif
  nMaxTestsGif: 300, // maximum nomber of detection trial, after that abandon

  detectGifThreshold: 0.6,

  // hole shape parameters:
  gifMaskScale: [1.3, 1.5],
  gifMaskOffset: [-0.2, 0.1],//[0.01,0.10], // relative. 1-> 100% scale mask width of the image (or height)
  gifCropSmoothEdge: 0.25, // crop smooth edge
  gifHeadForheadY: 0.7, // forhead start when Y>this value. Max: 1
  gifHeadJawY: 0.5, // lower jaw start when Y<this value. Max: 1
  rzDriftDx: 0.1, // drift along X axis if rotation around Z. tweak

  // user crop face and detection settings:
  videoDetectSizePx: 512,
  faceRenderSizePx: 128,
  zoomFactor: 1.012, // 1-> exactly the same zoom than for the art painting
  detectionThreshold: 0.62, // sensibility, between 0 and 1. Less -> more sensitive
  detectionHysteresis: 0.01,
    
  // mixed settings:
  hueTextureSizePx: 4,  //should be PoT

  // debug flags - should be set to false for standard running:
  debugGifCrop: false
};

const GIF = {
  animation:{
    way: 1, // 1-> forward, -1-> backward play
    currentFrameIndex: 0,
    startTimestamp: 0
  },
  mirroredLoop: SETTINGS.mirroredLoop,
  hideIfNotDetectedDuringNframes: SETTINGS.hideIfNotDetectedDuringNframes,
  baseTexture: null,
  info: null,
  potFaceCutTexture: null,
  potFaceCutTextureSizePx: 0,
  hueTextures: [],
  detectCounter: 0,
  testCounter: 0,
  image: null,
  frames: [],
  canvasMask: null,
  canvasMaskCtx: null,
  frameMasks: [],
  url: -1,
  positionsFace: [],
  scalesFace: [],
  rzsFace: [],
  detectedStates: null
};
const USERCROP = {
  faceCutDims: [0,0],
  potFaceCutTexture: null,
  hueTexture: null,
};
const SHPS = { // shaderprograms
  cropUserFace: null,
  copy: null
};


let DOMGIFCONTAINER = null;
let GL = null, GLDRAWTARGET = null, FBO = null; // WebGL global stuffs

let NLOADEDS = 0, FFSPECS = null;
const STATES = { // possible states of the app. ENUM equivalent
  ERROR: -1,
  IDLE: 0,
  LOADING: 1,
  DETECTGIFFACE: 2,
  DETECTUSERFACE: 3,
  BUSY: 4,
  GIFFACEDETECTPROVIDED: 5
}
let STATE = STATES.IDLE, ISUSERFACEDETECTED = false;


// entry point:
function main(){
  STATE = STATES.LOADING;

  build_carousel();

  DOMGIFCONTAINER = document.getElementById('gifContainer');

  load_gifURL(SETTINGS.gif, check_isLoaded.bind(null, 'GIF.image'));

  JEELIZFACEFILTER.init({
    canvasId: 'jeelizFaceFilterCanvas',
    NNCPath: '../../../neuralNets/', // root of NN_DEFAULT.json file
    callbackReady: function(errCode, spec){
      if (errCode){
        console.log('AN ERROR HAPPENS. ERROR CODE =', errCode);
        STATE = STATES.ERROR;
        return;
      }
      FFSPECS = spec;
      GL = spec.GL;
      FBO = GL.createFramebuffer();
      GLDRAWTARGET = (GL.DRAW_FRAMEBUFFER) ? GL.DRAW_FRAMEBUFFER : GL.FRAMEBUFFER;

      console.log('INFO: JEELIZFACEFILTER IS READY');
      check_isLoaded('JEELIZFACEFILTER');
    }, //end callbackReady()

    // called at each render iteration (drawing loop):
    callbackTrack: callbackTrack
  }); //end JEELIZFACEFILTER.init
}


function check_isLoaded(label){
  console.log('INFO in check_isLoaded(): ', label, 'is loaded');
  if (++NLOADEDS === 2){
    start();
  }
}


function start(){
  console.log('INFO: start()');

  create_textures();
  build_shps();
  
  update_gif(SETTINGS.detectedStates);
}


function set_gifFrameAsInput(frameIndex){
  console.log('INFO: set_gifFrameAsInput() - frameIndex =', frameIndex);
  GL.bindTexture(GL.TEXTURE_2D, GIF.baseTexture);
  GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, false);
  GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, GIF.frames[frameIndex]);
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
  JEELIZFACEFILTER.set_inputTexture(GIF.baseTexture, GIF.image.width, GIF.image.height);  
}


function update_gif(detectedStates){ //called both at start (start()) and when user change the art painting
  FFSPECS.canvasElement.width = GIF.image.width;
  FFSPECS.canvasElement.height = GIF.image.height;
  JEELIZFACEFILTER.resize();

  if (!GIF.baseTexture){
    GIF.baseTexture = GL.createTexture();
  }
  set_gifFrameAsInput(0);

  GIF.detectCounter = 0;
  GIF.testCounter = 0;
  
  FFSPECS.canvasElement.classList.remove('canvasDetected');
  FFSPECS.canvasElement.classList.remove('canvasNotDetected');
  FFSPECS.canvasElement.classList.add('gif');

  FFSPECS.canvasElement.style.top = '';
  FFSPECS.canvasElement.style.left = '';
  FFSPECS.canvasElement.style.width = '';

  toggle_carousel(true);

  if (detectedStates){
    // repair detectedState:
    while (detectedStates.length < GIF.frames.length){ // complete lacking frames with false
      detectedStates.push(null);
    }


    STATE = STATES.GIFFACEDETECTPROVIDED;
    GIF.detectedStates = detectedStates;
    interpolate_detectedStates();
    for (let i=0; i<5; ++i){
      denoise_detectedStates();
    }
  } else {
    GIF.detectedStates = [];
    STATE = STATES.DETECTGIFFACE;
  }
} //end update_gif()


function size_CSSgif(){
  // compare the aspect ratios of the gif and of the screen:
  const aspectRatioGif = GIF.info.width / GIF.info.height;
  const aspectRatioAvailableSpace = (window.innerWidth / (window.innerHeight-150));
  let w = 'auto', h = 'auto';
  if (aspectRatioGif>aspectRatioAvailableSpace){ // the gif is in landscape
    w = Math.round(0.9*window.innerWidth).toString() + 'px';
  } else { // the gif is in portrait
    h = Math.round(0.9*window.innerHeight).toString() + 'px';
  }  
  const domGifs = document.getElementsByClassName('gif');
  for (let i=0; i<domGifs.length; ++i){
    domGifs[i].style.width = w;
    domGifs[i].style.height = h;
  }
}


function build_carousel(){
   $('#carousel').slick({ // see http://kenwheeler.github.io/slick/
    speed: 300,
    slidesToShow: 1,
    centerMode: true,
    variableWidth: true,
    arrows: false,
    swipeToSlide: true,
    infinite: false,
    focusOnSelect: true
   });
   toggle_carousel(false);
}


function toggle_carousel(isEnabled){
  if (isEnabled){
    $('#carousel').css({
      opacity: 1,
      pointerEvents: 'auto'
    });
  } else {
    $('#carousel').css({
      opacity: 0.5,
      pointerEvents: 'none'
    });
  }
}


// called directly from the DOM controls to change the base image::
function change_gif(urlImage, detectedStates, isMirroredLoop, hideIfNotDetectedDuringNframes){
  if (urlImage===GIF.url || [STATES.DETECTGIFFACE, STATES.DETECTUSERFACE].indexOf(STATE)===-1){
    return;
  }
  if (typeof(detectState)==='undefined'){
    var detectState = null;
  }

  STATE = STATES.BUSY;
  toggle_carousel(false);
  if (GIF.canvasMask){
    GIF.canvasMask.parentElement.removeChild(GIF.canvasMask);
    GIF.canvasMask = false;
  }
  
  if (urlImage==='CUSTOM'){ // upload custom image:
    GIF.mirroredLoop = false;
    GIF.hideIfNotDetectedDuringNframes = 5;

    const domInputFile = document.getElementById('customImage');
    if (!domInputFile.files || !domInputFile.files[0]){
      alert('You should select at least one file');
      return;
    }
    load_gifBlob(domInputFile.files[0], update_gif.bind(null, false));
  } else { // upload image from the carousel:
    GIF.mirroredLoop = (isMirroredLoop) ? true : false;
    GIF.hideIfNotDetectedDuringNframes = (hideIfNotDetectedDuringNframes) ? hideIfNotDetectedDuringNframes : false;
    load_gifURL(urlImage, update_gif.bind(null, detectedStates));
  }
} //end change_gif()


// from https://stackoverflow.com/questions/17657184/using-jquerys-ajax-method-to-retrieve-images-as-a-blob/17682424
// do an ajax request and call a callback function with a blob as argument
function request_ajaxObjectBlob(url, callback){
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
      callback(this.response);
    }
  }
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}


function load_gifURL(urlImage, callback){
  request_ajaxObjectBlob(urlImage, function(blob){
    load_gifBlob(blob, callback);
  });
}


function load_gifBlob(blob, callback){ // called both at first loading and by change_gif()
  // GIF reading - from https://github.com/rfrench/gify/blob/master/example.html
  const blobURL = window.URL.createObjectURL(blob);
  GIF.image = new Image();
  GIF.image.src = blobURL;
  GIF.image.onload = function() {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const arrayBuffer = this.result;
      GIF.info = gify.getInfo(arrayBuffer); // gify read only ArrayBuffer instances

      // correct a special bug with gify lib:
      GIF.info.duration=GIF.info.duration || GIF.info.durationChrome || GIF.info.durationFirefox || GIF.info.durationIE || GIF.frames.length*20;
      if (GIF.info.durationChrome){
        GIF.info.duration=Math.max(GIF.info.duration, GIF.info.durationChrome);
      }

      if (!GIF.info.valid || !GIF.info.duration) {
        alert('INVALID GIF');
        return;
      }

      extract_gifFrames(callback);
    };
    fileReader.readAsArrayBuffer(blob);
  } //end GIF.image callback
} //end load_gifBlob()


// use GIF-FRAMES library to extract the frames - https://github.com/benwiley4000/gif-frames
function extract_gifFrames(callback){
  gifFrames({ url: GIF.image.src, frames: 'all', outputType: 'canvas', cumulative: true }).then(function (framesData) {
    GIF.frames = framesData.map(function(frameData){
      return frameData.getImage();
    });
    callback();
  });
}


function create_emptyTexture(w, h){
  const tex = GL.createTexture();
  GL.bindTexture(GL.TEXTURE_2D, tex);
  GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, w, h, 0, GL.RGBA, GL.UNSIGNED_BYTE, null);
  return tex;
};
function create_emptyLinearTexture(w, h){
  const tex = create_emptyTexture(w,h);
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
  return tex;
};
function create_hueTexture(){
  return create_emptyLinearTexture(SETTINGS.hueTextureSizePx, SETTINGS.hueTextureSizePx);
};


function create_textures(){
  USERCROP.hueTexture = create_hueTexture();

  // create the userCrop textures:
  const faceAspectRatio = SETTINGS.gifMaskScale[1] / SETTINGS.gifMaskScale[0];
  USERCROP.faceCutDims[0] = SETTINGS.faceRenderSizePx;
  USERCROP.faceCutDims[1] = Math.round(SETTINGS.faceRenderSizePx*faceAspectRatio);
  
  USERCROP.potFaceCutTexture = create_emptyTexture(SETTINGS.faceRenderSizePx, SETTINGS.faceRenderSizePx);
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_NEAREST);
}


// interpolate face position for frames where head has not been detected:
function interpolate_detectedStates(){
   if(GIF.detectedStates.every(function(ds){
     return !ds;
   })){
     alert('NO FACE FOUND ON ANY FRAME :(');
     return;
   }

   const mix_states = function(sa, sb, t){ // analogous to GLSL mix function
     return {
       x: sa.x*(1-t)+sb.x*t,
       y: sa.y*(1-t)+sb.y*t,
       s: sa.s*(1-t)+sb.s*t,
       ry:sa.ry*(1-t)+sb.ry*t,
       rz: sa.rz*(1-t)+sb.rz*t
     };
   }

   const get_dState = function(ind){
     return GIF.detectedStates[(ind+GIF.detectedStates.length)%GIF.detectedStates.length];
   }

   GIF.detectedStates = GIF.detectedStates.map(function(ds, dsi){
     if (ds) return ds;
     let distBefore=0, distAfter=0;
     while (!get_dState(dsi-distBefore)) ++distBefore;
     while (!get_dState(dsi+distAfter)) ++distAfter;
     const t = distBefore / (distBefore+distAfter);
     const nNotDetectedFrames = distAfter + distBefore - 1;
     if (GIF.hideIfNotDetectedDuringNframes && nNotDetectedFrames>GIF.hideIfNotDetectedDuringNframes){
       return null;
     }
     return mix_states(get_dState(dsi-distBefore), get_dState(dsi+distAfter), t);
   });
} //end interpolate_detectedStates()


// try to remove the noise of detected states:
function denoise_detectedStates(){
  GIF.detectedStates.forEach(function(ds, dsi){
    if (dsi===0 || !ds){
      return;
    }
    const previousDs = GIF.detectedStates[dsi-1];
    if (!previousDs) return ds;

    let newDs = Object.assign({}, ds);
    const dxPx = Math.abs((ds.x-previousDs.x) * 2 * GIF.info.width);
    const dyPx = Math.abs((ds.y-previousDs.y) * 2 * GIF.info.height);
    const dsPx = Math.abs((ds.s-previousDs.s) * GIF.info.width);
    const dRy = 180*Math.abs(ds.ry-previousDs.ry) / Math.PI; // in degrees
    const dRz = 180*Math.abs(ds.rz-previousDs.rz) / Math.PI;
    
    if (dxPx<3){
      const avgX = (previousDs.x+newDs.x)/2;
      newDs.x = avgX;
      previousDs.x = avgX;
    }
    if (dyPx<3){
      const avgY = (previousDs.y+newDs.y)/2;
      newDs.y = avgY;
      previousDs.y = avgY;
    }
    if (dsPx<4){
      const avgS = (previousDs.s+newDs.s)/2;
      newDs.s = avgS;
      previousDs.s = avgS;
    }
    if (dRy<3){
      const avgRy = (previousDs.ry+newDs.ry)/2;
      newDs.ry = avgRy;
      previousDs.ry = avgRy;
    }
    if (dRz<3){
      const avgRz = (previousDs.rz+newDs.rz)/2;
      newDs.rz = avgRz;
      previousDs.rz = avgRz;
    }
    GIF.detectedStates[dsi] = newDs;
  });
}


function build_gifMasks(detectStates){ // detectStates is the detectState for each gif frame
  detectStates.forEach(build_gifFrameMask);
  
  const gifMask = document.createElement('canvas');
  gifMask.width = GIF.image.width;
  gifMask.height = GIF.image.height;
  GIF.canvasMaskCtx = gifMask.getContext('2d');

  gifMask.classList.add('gif');
  FFSPECS.canvasElement.classList.remove('gif');
  FFSPECS.canvasElement.classList.add('canvasNotDetected');
  GIF.canvasMask = gifMask;
  DOMGIFCONTAINER.appendChild(gifMask);
  ISUSERFACEDETECTED = false;
}


function build_gifFrameMask(detectState, frameIndex){
  // BUILD THE FACE MASK:

  // cut the face with webgl and put a fading
  // console.log('INFO: build_gifFrameMask() from frame n°', frameIndex);

  if (GIF.hueTextures.length <= frameIndex){
    GIF.hueTextures.push(create_hueTexture());
    GIF.positionsFace.push([0,0]);
    GIF.scalesFace.push([1,1]);
    GIF.rzsFace.push(0);
  }

  if (!detectState){
    GIF.frameMasks[frameIndex] = null;
    return;
  }
  
  const x=detectState.x, y=detectState.y, s=detectState.s, ry=detectState.ry, rz=(detectState.rz)?detectState.rz:0;
  // compute normalized frame cut params:
  let xn = x*0.5+0.5+s*SETTINGS.gifMaskOffset[0]*Math.sin(ry); // normalized x position
  const yn = y*0.5+0.5+s*SETTINGS.gifMaskOffset[1];
  const sxn = s*SETTINGS.gifMaskScale[0];
  const syn = s*SETTINGS.gifMaskScale[1]*GIF.image.width/GIF.image.height;

  // correction due to the rotation along z axis:
  xn += SETTINGS.rzDriftDx * sxn * Math.sin(rz);

  GIF.positionsFace[frameIndex][0] = xn;
  GIF.positionsFace[frameIndex][1] = yn;
  GIF.scalesFace[frameIndex][0] = sxn;
  GIF.scalesFace[frameIndex][1] = syn;
  GIF.rzsFace[frameIndex] = rz;

  // build the mask (the gif with the hole cut):
  GL.useProgram(SHPS.buildMask.program);
  GL.viewport(0, 0, FFSPECS.canvasElement.width, FFSPECS.canvasElement.height);
  GL.uniform2f(SHPS.buildMask.offset, xn, yn);
  GL.uniform2f(SHPS.buildMask.scale, sxn, syn);
  GL.uniform1f(SHPS.buildMask.rz, rz);

  GL.activeTexture(GL.TEXTURE0);
  GL.bindTexture(GL.TEXTURE_2D, GIF.baseTexture);
  GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
  GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, GIF.frames[frameIndex]);
  
  
  // FILL VIEWPORT:
  GL.enable(GL.BLEND);
  GL.blendFunc(GL.SRC_ALPHA, GL.ZERO);
  GL.clearColor(0, 0, 0, 0);
  GL.clear(GL.COLOR_BUFFER_BIT);
  GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0);
  GL.disable(GL.BLEND);
  GL.finish();

  // add the mask to the frameMasks list:
  const gifFrameMask = document.createElement('canvas');
  gifFrameMask.width = GIF.image.width;
  gifFrameMask.height = GIF.image.height;
  const ctx = gifFrameMask.getContext('2d');
  ctx.drawImage(FFSPECS.canvasElement,0,0);
  GIF.frameMasks[frameIndex] = gifFrameMask;


  // BUILD THE HUE TEXTURE:

  // initialize the face cut pot texture:
  const faceWidthPx = Math.round(GIF.image.width*sxn);
  const faceHeightPx = Math.round(GIF.image.height*syn);
  const maxDimPx = Math.max(faceWidthPx, faceHeightPx);
  GIF.potFaceCutTextureSizePx = Math.pow(2, Math.ceil(Math.log(maxDimPx)/Math.log(2)));
  GIF.potFaceCutTexture = GL.createTexture();
  GL.bindTexture(GL.TEXTURE_2D, GIF.potFaceCutTexture);
  GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GIF.potFaceCutTextureSizePx, GIF.potFaceCutTextureSizePx, 0, GL.RGBA, GL.UNSIGNED_BYTE, null);
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
  GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_NEAREST);

  // compute the face cut pot texture by doing render to texture:
  GL.useProgram(SHPS.cropUserFace.program);
  GL.uniform2f(SHPS.cropUserFace.offset, xn, yn);
  GL.uniform2f(SHPS.cropUserFace.scale, sxn, syn);
  GL.uniformMatrix2fv(SHPS.cropUserFace.videoTransformMat2, false, [0.5, 0, 0, 0.5]);
  GL.bindFramebuffer(GLDRAWTARGET, FBO);
  GL.bindTexture(GL.TEXTURE_2D, GIF.baseTexture);
  GL.viewport(0,0,GIF.potFaceCutTextureSizePx,GIF.potFaceCutTextureSizePx);
  GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, GIF.potFaceCutTexture, 0);
  GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0); // FILL VIEWPORT

  // copy the GIF.potFaceCutTexture to GIF.hueTexture:
  GL.useProgram(SHPS.copyInvX.program);
  GL.viewport(0,0,SETTINGS.hueTextureSizePx,SETTINGS.hueTextureSizePx);
  GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, GIF.hueTextures[frameIndex], 0);
  GL.bindTexture(GL.TEXTURE_2D, GIF.potFaceCutTexture);
  GL.generateMipmap(GL.TEXTURE_2D);
  GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0); // FILL VIEWPORT

  GL.bindFramebuffer(GLDRAWTARGET, null);  
  
} //end build_gifFrameMask()


function build_shps(){
  const copyVertexShaderSource = "attribute vec2 position;\n\
    varying vec2 vUV;\n\
    void main(void){\n\
      gl_Position = vec4(position, 0., 1.);\n\
      vUV = 0.5 + 0.5 * position;\n\
    }";

  const copyFragmentShaderSource = "precision lowp float;\n\
    uniform sampler2D samplerImage;\n\
    varying vec2 vUV;\n\
    \n\
    void main(void){\n\
      gl_FragColor=texture2D(samplerImage, vUV);\n\
    }";

  // build the search SHP:
  const shpSearch = build_shaderProgram(copyVertexShaderSource, 
     "precision lowp float;\n\
      varying vec2 vUV;\n\
      uniform mat2 videoTransformMat2;\n\
      uniform sampler2D samplerVideo;\n\
      uniform vec4 uxysw;\n\
      \n\
      void main(void) {\n\
        vec2 uvVideoCentered = 2.0 * videoTransformMat2 * (vUV - 0.5);\n\
        vec3 colorVideo = texture2D(samplerVideo, 0.5 + uvVideoCentered).rgb;\n\
        vec2 pos = vUV * 2. - vec2(1.,1.);\n\
        vec2 isInside = step(uxysw.xy-uxysw.zw, pos);\n\
        isInside *= step(pos, uxysw.xy+uxysw.zw);\n\
        vec2 blendCenterFactor = abs(pos-uxysw.xy) / uxysw.zw;\n\
        float alpha = isInside.x * isInside.y * pow(max(blendCenterFactor.x, blendCenterFactor.y), 3.);\n\
        vec3 color = mix(colorVideo, vec3(0.,0.6,1.), alpha);\n\
        gl_FragColor = vec4(color,1.);\n\
      }",
      "SEARCH FACE"
    );
  SHPS.search = {
    program: shpSearch,
    samplerVideo: GL.getUniformLocation(shpSearch, 'samplerVideo'),
    videoTransformMat2: GL.getUniformLocation(shpSearch, 'videoTransformMat2'),
    uxysw: GL.getUniformLocation(shpSearch, 'uxysw')
  };
  GL.useProgram(shpSearch);
  GL.uniform1i(SHPS.search.samplerVideo, 0);

  //G IF SHPS:
  const set_apShp = function(shp, isTransformMat){
    const uSamplerImage = GL.getUniformLocation(shp, 'samplerImage');
    const uScale = GL.getUniformLocation(shp, 'scale');
    const uOffset = GL.getUniformLocation(shp, 'offset');
    const uVideoTransformMat2 = (isTransformMat) ? GL.getUniformLocation(shp, 'videoTransformMat2') : null;

    GL.useProgram(shp);
    GL.uniform1i(uSamplerImage, 0);
    
    return {
      scale: uScale,
      offset: uOffset,
      videoTransformMat2: uVideoTransformMat2,
      program: shp
    };
  };

  let alphaShaderChunk = "float alpha=0.;\n\
      vec2 uv=(vUV-offset+s2)/(2.*s2); //uv normalized in the face\n\
      if (uv.y>UPPERHEADY){ // upper head: circle arc\n\
        vec2 uvc = (uv-vec2(0.5,UPPERHEADY))*vec2(1., 0.5/(1.-UPPERHEADY));\n\
        float alphaBorder = smoothstep(0.5-SMOOTHEDGE, 0.5, length(uvc));\n\
        float alphaCenter = pow(smoothstep(UPPERHEADY, 1., uv.y), 0.5);\n\
        alpha = mix(alphaCenter, alphaBorder, smoothstep(0.3, 0.4, abs(uv.x-0.5)));\n\
      } else if (uv.y<LOWERHEADY){ // lower head: circle arc \n\
        vec2 uvc = (uv-vec2(0.5, LOWERHEADY))*vec2(1., 0.5/LOWERHEADY);\n\
        alpha = smoothstep(0.5-SMOOTHEDGE, 0.5, length(uvc));\n\
      } else { // middle head: straight\n\
        vec2 uvc = vec2(uv.x-0.5, 0.);\n\
        alpha = smoothstep(0.5-SMOOTHEDGE, 0.5,length(uvc));\n\
      }\n\
     //alpha=0.0;\n";

  // set more alpha where it is dark on the side of the face:
  alphaShaderChunk += "float grayScale = dot(color, vec3(0.33,0.33,0.33));\n\
       if (alpha>0.01){\n\
         alpha = mix(pow(alpha, 0.5), pow(alpha, 1.5), smoothstep(0.1,0.5,grayScale));\n\
       }";

  const shpBuildMask = build_shaderProgram(
    "attribute vec2 position;\n\
     uniform float rz;\n\
     varying vec2 vUV;\n\
     const float PIVOTY=0.0;\n\
     void main(void){\n\
       float cz = cos(rz),sz = sin(rz);\n\
       vec2 posRz = vec2(0., -PIVOTY)+mat2(cz, sz, -sz, cz)*(position+vec2(0., PIVOTY));\n\
       vec2 posRzOverflow = 1.5 * posRz; // avoid border effect\n\
       gl_Position = vec4(posRzOverflow, 0., 1.);\n\
       vUV = 0.5 + 0.5 * posRzOverflow;\n\
     }",
    
    "precision highp float;\n\
     uniform vec2 offset, scale;\n\
     uniform sampler2D samplerImage;\n\
     varying vec2 vUV;\n\
     \n\
     const float UPPERHEADY =" + SETTINGS.gifHeadForheadY.toFixed(2)+";\n\
     const float LOWERHEADY =" + SETTINGS.gifHeadJawY.toFixed(2)+";\n\
     const float SMOOTHEDGE =" + SETTINGS.gifCropSmoothEdge.toFixed(2)+";\n\
     \n\
     \n\
     void main(void){\n\
       vec2 s2 = 0.5 * scale;\n\
       vec2 isFace = step(vUV, offset+s2) * step(offset-s2, vUV);\n\
       float isNotFace = 1. - isFace.x*isFace.y;\n\
       if (isNotFace>0.01){\n\
         gl_FragColor = texture2D(samplerImage, vUV); return;\n\
       }\n\
       vec3 color = texture2D(samplerImage, vUV).rgb;\n\
       " + alphaShaderChunk + "\
       gl_FragColor = vec4(color, alpha);\n\
       " + ((SETTINGS.debugGifCrop) ? "gl_FragColor = vec4(1.,0.,0.,1.);" : "")+"\n\
     }",

    'BUILD GIF MASK');
  const uRz = GL.getUniformLocation(shpBuildMask, 'rz');
  SHPS.buildMask = set_apShp(shpBuildMask, false);
  SHPS.buildMask.rz = uRz;

  // this SHP is only used to crop the face to compute the hueTexture:
  const shpCutFace = build_shaderProgram("attribute vec2 position;\n\
    uniform vec2 offset, scale;\n\
    varying vec2 vUV;\n\
    void main(void){\n\
      gl_Position=vec4(position, 0., 1.);\n\
      vUV=offset+0.5*position*scale;\n\
    }",

    "precision lowp float;\n\
    uniform sampler2D samplerImage;\n\
    uniform mat2 videoTransformMat2;\n\
    varying vec2 vUV;\n\
    const float BORDER = 0.2;\n\
    \n\
    void main(void){\n\
      vec2 uvCentered = 2.0 * vUV - vec2(1.,1.);\n\
      float ruv = length(uvCentered);\n\
      vec2 uvn = uvCentered/ruv;\n\
      vec2 uvBorder = uvn * (1.-BORDER);\n\
      float isOutside = step(1.-BORDER, ruv);\n\
      uvCentered = mix(uvCentered, uvBorder, isOutside);\n\
      vec2 uvVideoCentered = videoTransformMat2 * uvCentered;\n\
      gl_FragColor = texture2D(samplerImage, 0.5 + uvVideoCentered);\n\
    }",
    'CUT GIF FACE');
  SHPS.cropUserFace = set_apShp(shpCutFace, true);

  // build the copy shader program:
  const shpCopy = build_shaderProgram(copyVertexShaderSource, copyFragmentShaderSource, 'COPY');
  SHPS.copy = {
    program: shpCopy
  };
  let uSamplerImage = GL.getUniformLocation(shpCopy, 'samplerImage');
  GL.useProgram(shpCopy);
  GL.uniform1i(uSamplerImage, 0);

  // build the copyInvX shader program:
  const shpCopyInvX = build_shaderProgram(copyVertexShaderSource.replace('vUV = 0.5 + 0.5 * position', 'vUV = 0.5 + vec2(-0.5,0.5) * position'),
        copyFragmentShaderSource, 'COPYINVX');
  SHPS.copyInvX = {
    program: shpCopyInvX
  };
  uSamplerImage = GL.getUniformLocation(shpCopyInvX, 'samplerImage');
  GL.useProgram(shpCopyInvX);
  GL.uniform1i(uSamplerImage, 0);

  // final render shp:
  const shpRender = build_shaderProgram("attribute vec2 position;\n\
    varying vec2 vUV;\n\
    void main(void){\n\
      gl_Position = vec4(position, 0., 1.);\n\
      vUV = position;\n\
    }",

   "precision highp float;\n\
    uniform sampler2D samplerImage, samplerHueSrc, samplerHueDst;\n\
    uniform mat2 videoTransformMat2;\n\
    uniform vec2 offset, scale;\n\
    uniform float rz;\n\
    varying vec2 vUV;\n\
    \n\
    const vec2 EPSILON2 = vec2(0.001, 0.001);\n\
    \n\
    vec3 rgb2hsv(vec3 c) { // from http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl\n\
      vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);\n\
      vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));\n\
      vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));\n\
      float d = q.x - min(q.w, q.y);\n\
      float e = 1.0e-10;\n\
      return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);\n\
    }\n\
    \n\
    vec3 hsv2rgb(vec3 c) { //from https://github.com/hughsk/glsl-hsv2rgb \n\
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0); \n\
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www); \n\
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y); \n\
      //return c.z * normalize(mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y));\n\
    } \n\
    \n\
    void main(void){\n\
      // flip left-right:\n\
      vec2 uv=vec2(0.5,0.5)+vec2(-0.5,0.5)*vUV;\n\
      float cTheta = cos(rz), sTheta=sin(rz);\n\
      float aspectRatio = scale.y / scale.x;\n\
      vec2 uvRot = vec2(0.5,0.5)+vec2(-0.5,0.5)*(mat2(cTheta, -sTheta/aspectRatio, sTheta*aspectRatio, cTheta)*vUV);\n\
      // get color in HSV format:\n\
      vec2 uvCut = uvRot * scale + offset - scale/2.;\n\
      uvCut = 0.5 + 2.0 * videoTransformMat2 * (uvCut - 0.5);\n\
      vec3 colorRGB = texture2D(samplerImage, uvCut).rgb;\n\
      vec3 colorHSV = rgb2hsv(colorRGB);\n\
      // compute color transform:\n\
      vec3 srcRGB = texture2D(samplerHueSrc, uv).rgb;\n\
      vec3 dstRGB = texture2D(samplerHueDst, uv).rgb;\n\
      vec3 srcHSV = rgb2hsv(srcRGB);\n\
      vec3 dstHSV = rgb2hsv(dstRGB);\n\
      // apply the transform:\n\
      vec2 factorSV = vec2(1.,0.8)*dstHSV.yz/(srcHSV.yz+EPSILON2);\n\
      factorSV = clamp(factorSV, vec2(0.3,0.3), vec2(3,3.));\n\
      //factorSV.x=mix(0., factorSV.x, smoothstep(0.02, 0.3, colorHSV.z) );\n\
      float dHue = dstHSV.x-srcHSV.x;\n\
      vec3 colorHSVout = vec3(mod(1.0+colorHSV.x+dHue, 1.0), colorHSV.yz*factorSV);\n\
      colorHSVout = clamp(colorHSVout, vec3(0.,0.,0.), vec3(1.,1.,1));\n\
      //vec3 colorHSVout2 = vec3(dstHSV.xy, colorHSVout.z);\n\
      //colorHSVout = mix(colorHSVout2, colorHSVout, smoothstep(0.2,0.4,colorHSV.y)); //0.6->0.8\n\
      //colorHSVout = mix(colorHSVout, colorHSVout2, smoothstep(0.8,1.0,colorHSV.z)); //0.6->0.8\n\
      //colorHSVout = mix(colorHSVout, colorHSVout2, smoothstep(0.5,1.,colorHSV.z)); //0.6->0.8\n\
      // reconvert to RGB and output the color:\n\
      colorRGB = hsv2rgb(colorHSVout);\n\
      gl_FragColor = vec4(colorRGB, 1.);\n\
    }",
    'FINAL RENDER FACE'
  );
  SHPS.render = {
    program: shpRender,
    scale: GL.getUniformLocation(shpRender, 'scale'),
    offset: GL.getUniformLocation(shpRender, 'offset'),
    videoTransformMat2: GL.getUniformLocation(shpRender, 'videoTransformMat2'),
    rz: GL.getUniformLocation(shpRender, 'rz')
  };
  uSamplerImage = GL.getUniformLocation(shpRender, 'samplerImage');
  const uSamplerHueSrc = GL.getUniformLocation(shpRender, 'samplerHueSrc');
  const uSamplerHueDst = GL.getUniformLocation(shpRender, 'samplerHueDst');
  GL.useProgram(shpRender);
  GL.uniform1i(uSamplerImage, 0);
  GL.uniform1i(uSamplerHueSrc, 2);
  GL.uniform1i(uSamplerHueDst, 1);
} //end build_shps()


function reset_toVideo(){
  position_userCropCanvas();
  window.addEventListener('resize', position_userCropCanvas, false);

  FFSPECS.canvasElement.width = SETTINGS.videoDetectSizePx;
  FFSPECS.canvasElement.height = SETTINGS.videoDetectSizePx;
  JEELIZFACEFILTER.resize();

  JEELIZFACEFILTER.reset_inputTexture();
  GIF.animation.currentFrameIndex = -1;
  GIF.animation.way = 1; // play forward
  GIF.animation.startTimestamp = Date.now();
  STATE = STATES.DETECTUSERFACE;
}


// compile a shader:
function compile_shader(source, glType, typeString) {
  const glShader = GL.createShader(glType);
  GL.shaderSource(glShader, source);
  GL.compileShader(glShader);
  if (!GL.getShaderParameter(glShader, GL.COMPILE_STATUS)) {
    alert("ERROR IN " + typeString + " SHADER: " + GL.getShaderInfoLog(glShader));
    console.log('Buggy shader source: \n', source);
    return null;
  }
  return glShader;
}


// helper function to build the shader program:
function build_shaderProgram(shaderVertexSource, shaderFragmentSource, id) {
  // compile both shader separately:
  const glShaderVertex = compile_shader(shaderVertexSource, GL.VERTEX_SHADER, "VERTEX " + id);
  const glShaderFragment = compile_shader(shaderFragmentSource, GL.FRAGMENT_SHADER, "FRAGMENT " + id);

  const glShaderProgram = GL.createProgram();
  GL.attachShader(glShaderProgram, glShaderVertex);
  GL.attachShader(glShaderProgram, glShaderFragment);

  // start the linking stage:
  GL.linkProgram(glShaderProgram);
  const aPos = GL.getAttribLocation(glShaderProgram, "position");
  GL.enableVertexAttribArray(aPos);

  return glShaderProgram;
}


function position_userCropCanvas(){
  size_CSSgif();

  console.log('INFO: position_userCropCanvas()');
  const restoredPosition = FFSPECS.canvasElement.style.position;
  FFSPECS.canvasElement.style.position = 'absolute';

  update_positionUserCropCanvas(0);

  FFSPECS.canvasElement.style.position = restoredPosition;
}


function update_positionUserCropCanvas(frameIndex){ // called when the GIF frame changes when played
  // compute topPx an leftPx in the gif canvas image ref:
  let topPx = GIF.image.height * GIF.positionsFace[frameIndex][1];
  let leftPx = GIF.image.width * GIF.positionsFace[frameIndex][0];
  let widthFacePx = GIF.image.width * GIF.scalesFace[frameIndex][0];
  let heightFacePx = GIF.image.height * GIF.scalesFace[frameIndex][1];
  let widthPx = widthFacePx * SETTINGS.videoDetectSizePx / SETTINGS.faceRenderSizePx; // the whole canvas is bigger than the user face rendering
  topPx = GIF.image.height-topPx; // Y axis is inverted between WebGL viewport and CSS

  // take account of the CSS scale factor of the art painting:
  const domRect = DOMGIFCONTAINER.getBoundingClientRect();
  const cssScaleFactor = domRect.width / GIF.image.width;
  topPx *= cssScaleFactor;
  leftPx *= cssScaleFactor;
  widthPx *= cssScaleFactor;
  widthFacePx *= cssScaleFactor;
  heightFacePx *= cssScaleFactor;

  // position corner of the userFace instead of center:
  topPx -= heightFacePx / 2;
  leftPx -= widthFacePx / 2;
  
  FFSPECS.canvasElement.style.top = Math.round(topPx).toString() + 'px';
  FFSPECS.canvasElement.style.left = Math.round(leftPx).toString() + 'px';
  FFSPECS.canvasElement.style.width = Math.round(widthPx).toString() + 'px';

  // reduce canvasNotDetected size if necessary (when it is stretched because height is constraint by maxHeight but maxWidth is not reached)
  const domCanvasNotDetected = document.getElementsByClassName('canvasNotDetected');
  if (domCanvasNotDetected && domCanvasNotDetected.length){
    const bb = domCanvasNotDetected[0].getBoundingClientRect();
    if (bb.width>bb.height){
      domCanvasNotDetected[0].style.width = bb.height.toString() + 'px';
    }
  }

} //end update_positionUserCropCanvas()


// draw in search mode:
function draw_search(detectState){
  GL.useProgram(SHPS.search.program);
  GL.viewport(0,0,FFSPECS.canvasElement.width, FFSPECS.canvasElement.height);
  GL.uniform4f(SHPS.search.uxysw, detectState.x, detectState.y,
        detectState.s, detectState.s*FFSPECS.canvasElement.width/FFSPECS.canvasElement.height);
  GL.uniformMatrix2fv(SHPS.search.videoTransformMat2, false, FFSPECS.videoTransformMat2);
  GL.activeTexture(GL.TEXTURE0);
  GL.bindTexture(GL.TEXTURE_2D, FFSPECS.videoTexture);
  GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0);
}


// draw final render:
function draw_render(detectState){ // detectState is the detectState of the USER (not the GIF)
  // do RTT:
  GL.bindFramebuffer(GLDRAWTARGET, FBO);

  // crop the user's face and put the result to USERCROP.potFaceCutTexture:
  const s = detectState.s / SETTINGS.zoomFactor;
  const xn = detectState.x*0.5 + 0.5 + s * SETTINGS.gifMaskOffset[0]*Math.sin(detectState.ry); // normalized x position
  const yn = detectState.y*0.5 + 0.5 + s * SETTINGS.gifMaskOffset[1];
  const sxn = s * SETTINGS.gifMaskScale[0];
  const syn = s * SETTINGS.gifMaskScale[1];

  GL.useProgram(SHPS.cropUserFace.program);
  GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, USERCROP.potFaceCutTexture, 0);
  GL.uniform2f(SHPS.cropUserFace.offset, xn, yn);
  GL.uniform2f(SHPS.cropUserFace.scale, sxn, syn);
  GL.uniformMatrix2fv(SHPS.cropUserFace.videoTransformMat2, false, FFSPECS.videoTransformMat2);
  GL.viewport(0, 0, SETTINGS.faceRenderSizePx, SETTINGS.faceRenderSizePx);
  GL.bindTexture(GL.TEXTURE_2D, FFSPECS.videoTexture);
  GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0);
  

  // shrink the userface to a SETTINGS.hueTextureSizePx texture:
  GL.useProgram(SHPS.copy.program);
  GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, USERCROP.hueTexture, 0);
  GL.viewport(0, 0, SETTINGS.hueTextureSizePx, SETTINGS.hueTextureSizePx);
  GL.bindTexture(GL.TEXTURE_2D, USERCROP.potFaceCutTexture);
  GL.generateMipmap(GL.TEXTURE_2D);
  GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0);
  

  // final rendering including light correction:
  const rz = GIF.rzsFace[GIF.animation.currentFrameIndex] + detectState.rz;
  GL.bindFramebuffer(GLDRAWTARGET, null);
  GL.useProgram(SHPS.render.program);
  GL.uniform2f(SHPS.render.offset, xn + SETTINGS.rzDriftDx * Math.sin(rz), yn);
  GL.uniform2f(SHPS.render.scale, sxn, syn);
  GL.uniformMatrix2fv(SHPS.render.videoTransformMat2, false, FFSPECS.videoTransformMat2);
  GL.uniform1f(SHPS.render.rz, rz);
  GL.bindTexture(GL.TEXTURE_2D, FFSPECS.videoTexture);
  GL.activeTexture(GL.TEXTURE1);
  GL.bindTexture(GL.TEXTURE_2D, GIF.hueTextures[GIF.animation.currentFrameIndex]);
  //GL.bindTexture(GL.TEXTURE_2D, GIF.potFaceCutTexture); //KILL
  
  GL.activeTexture(GL.TEXTURE2);
  GL.bindTexture(GL.TEXTURE_2D, USERCROP.hueTexture);
  GL.activeTexture(GL.TEXTURE0);
  GL.viewport(0,SETTINGS.videoDetectSizePx-USERCROP.faceCutDims[1],USERCROP.faceCutDims[0], USERCROP.faceCutDims[1]);
  GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0);
}//end draw_render()


function callbackTrack(detectState){
  switch(STATE) {
    case STATES.DETECTGIFFACE: // search for a face
      let isDraw = true;

      ++GIF.testCounter;
      if (GIF.testCounter > SETTINGS.nMaxTestsGif){ // no face has been detected, go to the next frame (face position will be interpolated later)
        GIF.detectedStates.push(null);
        GIF.testCounter = 0;
        GIF.detectCounter = 0;
        if (GIF.detectedStates.length < GIF.frames.length){
          set_gifFrameAsInput(GIF.detectedStates.length);
          isDraw = false;
        }
      }

      if(detectState.detected > SETTINGS.detectGifThreshold){ // the face has been detected
        if (++GIF.detectCounter > SETTINGS.nDetectsGif){
          GIF.detectCounter = 0;
          GIF.testCounter = 0;

          GIF.detectedStates.push(Object.assign({}, detectState));

          if (GIF.detectedStates.length < GIF.frames.length){
            set_gifFrameAsInput(GIF.detectedStates.length);
            isDraw = false;
          }
        } //end if enough good detections
      }

      if (GIF.detectedStates.length===GIF.frames.length){ // the face has been detected on all frame of the gif

        // log detection result to be able to provide it for faster loading:
        const round = function(n) { return Math.round(n*1e3)/1e3; }
        console.log('detectStates = ['+
          GIF.detectedStates.map(function(detectState){
            if (!detectState){
              return 'false';
            }
            return JSON.stringify({
              x:  round(detectState.x),
              y:  round(detectState.y),
              s:  round(detectState.s),
              ry: round(detectState.ry),
              rz: round(detectState.rz)
            }).replace(/"/g, '');
          }).join(',')
          +']');

        STATE = STATES.BUSY;
        interpolate_detectedStates();
        denoise_detectedStates();
        build_gifMasks(GIF.detectedStates);
        reset_toVideo();
        return;
      } //end if face has been detected for all frames of the gif

      if (isDraw){
        draw_search(detectState);
      }
      break;

    case STATES.GIFFACEDETECTPROVIDED:
      STATE = STATES.BUSY;
      build_gifMasks(GIF.detectedStates);
      reset_toVideo();
      break;

    case STATES.DETECTUSERFACE:
      if (ISUSERFACEDETECTED && detectState.detected<SETTINGS.detectionThreshold-SETTINGS.detectionHysteresis){
        // DETECTION LOST
        ISUSERFACEDETECTED = false;
        FFSPECS.canvasElement.classList.remove('canvasDetected');
        FFSPECS.canvasElement.classList.add('canvasNotDetected');
      } else if (!ISUSERFACEDETECTED && detectState.detected>SETTINGS.detectionThreshold+SETTINGS.detectionHysteresis){
        // FACE DETECTED
        ISUSERFACEDETECTED = true;
        FFSPECS.canvasElement.classList.remove('canvasNotDetected');
        FFSPECS.canvasElement.classList.add('canvasDetected');
      }

      // update the gif mask:
      const currentTimestamp = Date.now();
      // restart animation loop if necessary:
      if (currentTimestamp-GIF.animation.startTimestamp>GIF.info.duration){
        GIF.animation.startTimestamp = currentTimestamp;
        if (GIF.mirroredLoop){
          GIF.animation.way *= -1;
        }
      }

      // which is the current frame:
      let currentFrameIndex = Math.floor(GIF.frames.length*(currentTimestamp-GIF.animation.startTimestamp)/GIF.info.duration);
      currentFrameIndex = Math.min(Math.max(currentFrameIndex, 0), GIF.frames.length-1);

      // if mirrored play:
      if (GIF.mirroredLoop && GIF.animation.way===-1){
        currentFrameIndex = GIF.frames.length-1-currentFrameIndex;
      }

      // we should update the mask:
      if (currentFrameIndex !== GIF.animation.currentFrameIndex){
        //console.log(currentFrameIndex);
        GIF.animation.currentFrameIndex = currentFrameIndex;
        if (!GIF.frames[currentFrameIndex]) currentFrameIndex=0;
        if (GIF.frameMasks[currentFrameIndex]){
          GIF.canvasMaskCtx.clearRect(0,0, GIF.canvasMask.width, GIF.canvasMask.height);
          GIF.canvasMaskCtx.drawImage(GIF.frameMasks[currentFrameIndex],0,0);
          update_positionUserCropCanvas(currentFrameIndex);
        } else {
          GIF.canvasMaskCtx.drawImage(GIF.frames[currentFrameIndex],0,0);
        }
      }

      if (ISUSERFACEDETECTED){
        if (GIF.frameMasks[currentFrameIndex]){
          draw_render(detectState);
        }
      } else {
        draw_search(detectState);
      }

      break;
  } //end switch(STATE)
} //end callbackTrack


//BEGIN DEBUG FUNCTIONS (called in the JS console only)

//append all the GIF frame to the DOM for debugging purpose
function debug_gifFrames(){
  GIF.frames.forEach(function(frame){
    frame.style.width = '64px';
    document.body.appendChild(frame);
  });
}


function debug_gifMasks(){
  GIF.frameMasks.forEach(function(frame){
    frame.style.width = '64px';
    document.body.appendChild(frame);
  });
}

//END DEBUG FUNCTIONS

window.addEventListener('load', main);