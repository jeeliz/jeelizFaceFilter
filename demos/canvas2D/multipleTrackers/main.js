function main(){ // entry point
  const videoElement = document.getElementById('myVideo');

  if (videoElement['currentTime'] && videoElement['videoWidth'] && videoElement['videoHeight']){
    start_videoFile(videoElement);
    start_camera();
  } else {
    setTimeout(main, 100);
    videoElement['play']();
  }
}


function start_videoFile(videoElement){
  start(JEELIZFACEFILTER, 'jeeFaceFilterCanvas', videoElement, 'yellow');
}


function start_camera(){
  const JEELIZFACEFILTER2 = JEELIZFACEFILTER.create_new();
  start(JEELIZFACEFILTER2, 'jeeFaceFilterCanvas2', null, 'lime');
}


function start(jeeFaceFilterAPIInstance, canvasId, videoElement, borderColor){
  let cvd = null; // return of Canvas2DDisplay

  jeeFaceFilterAPIInstance.init({
    canvasId: canvasId,
    videoSettings: {
      videoElement: videoElement
    },
    NNCPath: '../../../neuralNets/', // root of NN_DEFAULT.json file
    callbackReady: function(errCode, spec){
      if (errCode){
        console.log('AN ERROR HAPPENS. SORRY BRO :( . ERR =', errCode);
        return;
      }

      console.log('INFO: JEELIZFACEFILTER IS READY');
      cvd = JeelizCanvas2DHelper(spec);
      cvd.ctx.strokeStyle = borderColor;
    },

    // called at each render iteration (drawing loop):
    callbackTrack: function(detectState){
      if (detectState.detected>0.6){
        // draw a border around the face:
        const faceCoo = cvd.getCoordinates(detectState);
        cvd.ctx.clearRect(0,0,cvd.canvas.width, cvd.canvas.height);
        cvd.ctx.strokeRect(faceCoo.x, faceCoo.y, faceCoo.w, faceCoo.h);
        cvd.update_canvasTexture();
      }
      cvd.draw();
    }
  });
}


window.addEventListener('load', main);