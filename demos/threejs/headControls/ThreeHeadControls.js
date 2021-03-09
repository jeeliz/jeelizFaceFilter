if (typeof(JEELIZFACEFILTER)==='undefined'){
  throw new Error('Cannot found JEELIZFACEFILTER. Was jeelizFaceFilter.js included before this script ?');
} 

if (typeof(HeadControls)==='undefined'){
  throw new Error('Cannot found HeadControls. helpers/HeadControls.js included before this script ?');
}

if (typeof(THREE)==='undefined'){
  throw new Error('Cannot found THREE.JS');
}

THREE.HeadControls = function ( threeCamera, canvasId, NNCPath ) {
  this.enableZoom = true;
  this.sensibilityZ = 1;
  this.sensibilityRotateX = 0.001;
  this.sensibilityRotateY = 0.001;
  
  threeCamera.rotation.order = 'YXZ';
  
  const that = this;
  function callbackMove(mv){
    if (that.enableZoom && mv.dZ!==0) { // move head forward/backward
      threeCamera.translateZ(-mv.dZ*that.sensibilityZ);
    }
    if (mv.dRx!==0) { // turn head up-down
      threeCamera.rotation.x+=-mv.dRx*that.sensibilityRotateX;
    }
    if (mv.dRy!==0) { // turn head left-right
      threeCamera.rotation.y+=mv.dRy*that.sensibilityRotateY;
    }
  }

  HeadControls.init({
    canvasId: canvasId,
    callbackMove: callbackMove,
    callbackReady: function(errCode){
      if (errCode){
      console.log('ERROR: THREE.HeadControls NOT READY. errCode =', errCode);
      } else {
      console.log('INFO: THREE.HeadControls ARE READY :)');
      HeadControls.toggle(true);
      }
    },
    NNCPath: NNCPath,
    animateDelay: 2 //avoid DOM lags
  }); //end HeadControls.init params
}