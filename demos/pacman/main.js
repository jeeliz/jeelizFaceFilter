"use strict";

function callbackMove(mv){ // called each time a head movement is detected
  if (PACMAN){
    PACMAN.update_mv(mv);
  }
}

// entry point:
function main(){
  pacmanStart(headControlStart);
}

function pacmanStart(callback){
  const el = document.getElementById("pacman");
  if (Modernizr.canvas && Modernizr.localstorage && 
    Modernizr.audio && (Modernizr.audio.ogg || Modernizr.audio.mp3)) {
    window.setTimeout(function () { 
      PACMAN.init(el, "./");
      callback();
    }, 0);
  } else { 
    el.innerHTML = "Sorry, needs a decent browser<br /><small>" + 
    "(firefox 3.6+, Chrome 4+, Opera 10+ and Safari 4+)</small>";
  }
}

function headControlStart(){
  HeadControls.init({
    settings: {
      tol: {
        rx: 1,//do not move if head turn more than this value (in degrees) from head rest position
        ry: 3,
        s: 5 //do not move forward/backward if head is larger/smaller than this percent from the rest position
      },
      sensibility: {
        rx: 1.5,
        ry: 1,
        s: 1
      }
    },
    canvasId: 'headControlsCanvas',
    callbackMove: callbackMove,
    callbackReady: function(errCode){
      if (errCode){
        switch(errCode){
          case 'WEBCAM_UNAVAILABLE':
            alert('Cannot found or use the webcam. You should accept to share the webcam bro otherwise we cannot detect your face !');
            break;
        }
        console.log('ERROR: HEAD CONTROLS NOT READY. errCode =', errCode);
      } else {
        console.log('INFO: HEAD CONTROLS ARE READY :)');
        HeadControls.toggle(true);
        const domStartButton = document.getElementById('start');
        domStartButton.style.display = 'inline-block';
        domStartButton.onclick = function(){
          if (PACMAN){
            HeadControls.reset_restHeadPosition();
            PACMAN.start();
            domStartButton.style.display = 'none';
          }
        }
      }
    },
    NNCPath: '../../neuralNets/', // where to find NN_DEFAULT.json from the current path
    animateDelay: 2 // avoid DOM lags
  }); //end HeadControls.init params
}