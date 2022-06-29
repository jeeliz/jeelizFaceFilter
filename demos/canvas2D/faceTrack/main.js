function main(){
  let CVD = null; // return of Canvas2DDisplay

  JEELIZFACEFILTER.init({
    canvasId: 'jeeFaceFilterCanvas',
    NNCPath: '../../../neuralNets/', // root of NN_DEFAULT.json file
    callbackReady: function(errCode, spec){
      if (errCode){
        console.log('AN ERROR HAPPENS. SORRY BRO :( . ERR =', errCode);
        return;
      }

      console.log('INFO: JEELIZFACEFILTER IS READY');
      CVD = JeelizCanvas2DHelper(spec);
      CVD.ctx.strokeStyle = 'yellow';
    },

    // called at each render iteration (drawing loop):
    callbackTrack: function(detectState){
      if (detectState.detected > 0.8){
        // draw a border around the face:
        const faceCoo = CVD.getCoordinates(detectState);
        CVD.ctx.clearRect(0, 0, CVD.canvas.width, CVD.canvas.height);
        CVD.ctx.strokeRect(faceCoo.x, faceCoo.y, faceCoo.w, faceCoo.h);
        CVD.update_canvasTexture();
      }
      CVD.draw();
    }
  }); //end JEELIZFACEFILTER.init call
} //end main()


window.addEventListener('load', main);