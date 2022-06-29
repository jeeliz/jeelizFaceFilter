const SETTINGS = {
  detectionThreshold: 0.75 // sensibility, between 0 and 1. Less -> more sensitive
}

// some globals:
let FACECUT0 = null, FACECUT1 = null;


function main(){ // entry point
  JeelizResizer.size_canvas({
    canvasId: 'jeeFaceFilterCanvas',
    isFullScreen: true,
    CSSFlipX: true,
    onResize: onResize,
    callback: start
  });
}


function start(errCode, bestVideoSettings){
  if (errCode){
    alert(errCode);
    return;
  }
  JEELIZFACEFILTER.init({
    videoSettings: bestVideoSettings,
    maxFacesDetected: 2,
    canvasId: 'jeeFaceFilterCanvas',
    NNCPath: '../../../neuralNets/', // root of NN_DEFAULT.json file
    //NNCPath: '../../../../../../../',
    callbackReady: function(errCode, spec){
      if (errCode){
        alert('AN ERROR HAPPENS. SORRY BRO :( . ERR =' + errCode);
        return;
      }

      console.log('INFO: JEELIZFACEFILTER IS READY');
      init_view(spec);
    },
    callbackTrack: callbackTrack
  });
} //end start


function onResize(){
  console.log('INFO in demo_faceSwap: resized!');
}


function init_view(spec){
  JeelizFaceCut.init(spec);
  const faceCutSettings = {sizePx: 64, hueSizePx: 4};
  FACECUT0 = JeelizFaceCut.instance(faceCutSettings);
  FACECUT1 = JeelizFaceCut.instance(faceCutSettings);
}


function callbackTrack(detectedStates){
  // for debug:
  // FACECUT0.cut(detectedStates[0]); JeelizFaceCut.draw_video(); FACECUT0.render(FACECUT0); return;
  //console.log(detectedStates[0].detected, detectedStates[1].detected);

  if (detectedStates[0].detected<SETTINGS.detectionThreshold || detectedStates[1].detected<SETTINGS.detectionThreshold){
    // less than 2 faces are detected
    JeelizFaceCut.draw_search(detectedStates);
  } else {
    // both faces are detected
    FACECUT0.cut(detectedStates[0]);
    FACECUT1.cut(detectedStates[1]);

    JeelizFaceCut.draw_video();
    FACECUT0.render(FACECUT1);
    FACECUT1.render(FACECUT0);
  }
}


window.addEventListener('load', main);