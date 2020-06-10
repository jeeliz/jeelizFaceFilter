/*
This helper can help for:
* adjusting the canvas resolution to the good size -> this is crucial to
optimize the code because if the canvas is too large,
there are too much pixels to compute => it will be slow

* to mirror horizontally or not the canvas -> if the front camera is used we
need it flipped (mirror effect), while if the rear camera is used we need it not flipped

* to get the best camera resolution (either above the canvas resolution or closer)
to balance between performance and quality
*/ 
"use strict";

var JeelizResizer = (function(){
  // private vars:
  let _domCanvas = null,
      _whCanvasPx = null,
      _resizeAttemptsCounter = 0,
      _overSamplingFactor = 1,
      _isFullScreen = false,
      _timerFullScreen = false,
      _callbackResize = false,
      _isInvFullscreenWH = false;

  const _cameraResolutions = [ //all resolutions should be in landscape mode
    [640,480],
    [768,480],
    [800,600],
    [960,640],
    [960,720],
    [1024,768],
    [1280,720],
    [1920, 1080]
  ];
  
  //private functions
  function add_CSStransform(domElement, CSS){
    const CSStransform = domElement.style.transform;
    if (CSStransform.indexOf(CSS) !== -1) return;
    domElement.style.transform = CSS + ' ' + CSStransform;
  }

  // Compute overlap between 2 rectangles A and B
  // characterized by their width and their height in pixels
  // the rectangles are centered
  // return the ratio (pixels overlaped)/(total pixels)
  function compute_overlap(whA, whB){ 
    const aspectRatioA = whA[0] / whA[1];
    const aspectRatioB = whB[0] / whB[1]; //higher aspectRatio -> more landscape
    
    var whLandscape, whPortrait;
    if (aspectRatioA > aspectRatioB){ 
      whLandscape = whA, whPortrait = whB;
    } else {
      whLandscape = whB, whPortrait = whA;
    }

    // The overlapped area will be always a rectangle
    const areaOverlap = Math.min(whLandscape[0], whPortrait[0]) * Math.min(whLandscape[1], whPortrait[1]);
    
    var areaTotal;
    if (whLandscape[0]>=whPortrait[0] && whLandscape[1]>=whPortrait[1]){ //union is a rectangle
      areaTotal = whLandscape[0]*whLandscape[1];
    } else if (whPortrait[0]>whLandscape[0] && whPortrait[1]>whLandscape[1]){ //union is a rectangle
      areaTotal = whPortrait[0]*whPortrait[1];
    } else { //union is a cross
      areaTotal = whLandscape[0]*whLandscape[1];
      areaTotal += (whPortrait[1]-whLandscape[1])*whPortrait[0];
    }

    return areaOverlap / areaTotal;
  } //end compute_overlap()

  function update_sizeCanvas(){
    const domRect = _domCanvas.getBoundingClientRect();
    _whCanvasPx = [
      Math.round(_overSamplingFactor * domRect.width),
      Math.round(_overSamplingFactor * domRect.height)
    ];
    _domCanvas.setAttribute('width',  _whCanvasPx[0]);
    _domCanvas.setAttribute('height', _whCanvasPx[1]);
  }

  function on_windowResize(){
    if (_timerFullScreen){
      clearTimeout(_timerFullScreen);
    }
    _timerFullScreen = setTimeout(resize_fullScreen, 50);
  }

  function resize_canvasToFullScreen(){
    _whCanvasPx = [window['innerWidth'], window['innerHeight']];
    if (_isInvFullscreenWH){
      _whCanvasPx.reverse();
    }
    _domCanvas.setAttribute('width',  _whCanvasPx[0]);
    _domCanvas.setAttribute('height', _whCanvasPx[1]);
  }

  function resize_fullScreen(){
    resize_canvasToFullScreen();
    JEEFACEFILTERAPI.resize();
    _timerFullScreen = false;
    if (_callbackResize) {
      _callbackResize();
    }
  }

  // public methods:
  const that = {
    // return true or false if the device is in portrait or landscape mode
    // see https://stackoverflow.com/questions/4917664/detect-viewport-orientation-if-orientation-is-portrait-display-alert-message-ad
    is_portrait: function(){
      try{
        if (window['matchMedia']("(orientation: portrait)")['matches']){
          return true;
        } else {
          return false;
        }
      } catch(e){
        return (window['innerHeight'] > window['innerWidth']);
      }
    },

    // check whether the user is using IOS or not
    // see https://stackoverflow.com/questions/9038625/detect-if-device-is-ios
    check_isIOS: function(){
      const isIOS = /iPad|iPhone|iPod/.test(navigator['userAgent']) && !window['MSStream'];
      return isIOS;
    },

    // Should be called only if IOS was detected
    // see https://stackoverflow.com/questions/8348139/detect-ios-version-less-than-5-with-javascript
    get_IOSVersion: function(){ 
      const v = (navigator['appVersion']).match(/OS (\d+)_(\d+)_?(\d+)?/);
      return (v.length > 2) ? [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)] : [0, 0, 0];
    },

    // Check whether the user is using Android or not
    // see https://stackoverflow.com/questions/6031412/detect-android-phone-via-javascript-jquery
    check_isAndroid: function(){
      const ua = navigator['userAgent'].toLowerCase();
      return (ua.indexOf('android') !== -1);
    },

    // Should be called only if Android was detected
    // see https://stackoverflow.com/questions/7184573/pick-up-the-android-version-in-the-browser-by-javascript
    get_androidVersion: function(){
      const ua = navigator['userAgent'].toLowerCase(); 
      const match = ua.match(/android\s([0-9\.]*)/i);
      if (!match || match.length<2){
        return [0,0,0];
      }
      const v = match[1].split('.');
      return [
        parseInt(v[0], 10),
        parseInt(v[1], 10),
        parseInt(v[2] || 0, 10)
      ];
    },

    // to get a video of 480x640 (480 width and 640 height)
    // with a mobile phone in portrait mode, the default implementation
    // should require a 480x640 video (Chrome, Firefox)
    // but bad implementations needs to always request landscape resolutions (so 640x480)
    // see https://github.com/jeeliz/jeelizFaceFilter/issues/144
    require_flipVideoWHIfPortrait: function(){
      // disabled because of https://github.com/jeeliz/jeelizFaceFilter/issues/144
      // seems quite a mess though...
      
      /* if (that.check_isIOS()){
        //the user is using IOS
        const version = that.get_IOSVersion();
        if (version[0] >= 13){
          if (version[1] <= 1 // IOS 13.0.X
              || (version[1] === 1 && version[2] < 3)){ // IOS 13.1.X with X<3
            return false;
          }
        }
      }

      if (that.check_isAndroid()){
        const version = that.get_androidVersion();
        if (version[0] >= 9){ // Android 9+
          return false;
        }
      } */

      // normal implementation
      return true;
    },

    // size canvas to the right resolution
    // should be called after the page loading
    // when the canvas has already the right size
    // options:
    //  - <string> canvasId: id of the canvas
    //  - <HTMLCanvasElement> canvas: if canvasId is not provided
    //  - <function> callback: function to launch if there was an error or not
    //  - <float> overSamplingFactor: facultative. If 1, same resolution than displayed size (default). 
    //    If 2, resolution twice higher than real size
    //  - <boolean> CSSFlipX: if we should flip the canvas or not. Default: false
    //  - <boolean> isFullScreen: if we should set the canvas fullscreen. Default: false
    //  - <function> onResize: function called when the window is resized. Only enabled if isFullScreen=true
    //  - <boolean> isInvWH: if we should invert width and height for fullscreen mode only. default=false
    size_canvas: function(options){
      _domCanvas = (options.canvas) ? options.canvas : document.getElementById(options.canvasId);
      _isFullScreen = (typeof(options.isFullScreen)!=='undefined' && options.isFullScreen);
      _isInvFullscreenWH = (typeof(options.isInvWH)!=='undefined' && options.isInvWH);

      if (_isFullScreen){
        // we are in fullscreen mode
        if (typeof(options.onResize) !== 'undefined'){
          _callbackResize = options.onResize;
        }
        resize_canvasToFullScreen();
        window.addEventListener('resize', on_windowResize, false);
        window.addEventListener('orientationchange', on_windowResize, false);
        
      } else { //not fullscreen mode

        // get display size of the canvas:
        const domRect = _domCanvas.getBoundingClientRect();
        if (domRect.width===0 || domRect.height===0){
          console.log('WARNING in JeelizResize.size_canvas(): the canvas has its width or its height null, Retry a bit later...');
          if (++_resizeAttemptsCounter > 20){
            options.callback('CANNOT_RESIZECANVAS');
            return;
          }
          setTimeout(that.size_canvas.bind(null, options), 50);
          return;
        }

        // do resize canvas:
        _resizeAttemptsCounter=0;
        _overSamplingFactor = (typeof(options.overSamplingFactor) === 'undefined') ? 1 : options.overSamplingFactor;
        update_sizeCanvas();
      }

      // flip horizontally if required:
      if (typeof(options.CSSFlipX)!=='undefined' && options.CSSFlipX){
        add_CSStransform(_domCanvas, 'rotateY(180deg)');
      }

      // compute the best camera resolutions:
      const allResolutions = _cameraResolutions.map(function(x){
        return x.slice(0)
      });

      // if we are in portrait mode, the camera is also in portrait mode
      // so we need to set all resolutions to portrait mode
      if (that.is_portrait() && that.require_flipVideoWHIfPortrait()){
        allResolutions.forEach(function(wh){
          wh.reverse();
        });
      }

      // scale canvas size to device pixel ratio:
      // (To find the correct resolution, especially for iOS one should consider the window.devicePixelRatio factor)
      const dpr = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
      const whCanvasPxScaled = [_whCanvasPx[0] * dpr, _whCanvasPx[1] * dpr];

      // sort camera resolutions from the best to the worst:
      allResolutions.sort(function(resA, resB){
        return compute_overlap(resB, whCanvasPxScaled) - compute_overlap(resA, whCanvasPxScaled);        
      });

      // pick the best camera resolution:
      const bestCameraResolution = {
        'idealWidth':  allResolutions[0][0],
        'idealHeight': allResolutions[0][1]
      };

      console.log('INFO in JeelizResizer: bestCameraResolution =', bestCameraResolution);

      // launch the callback function after a small interval to let it
      // some time to size:
      setTimeout(options.callback.bind(null, false, bestCameraResolution), 1);
    }, //end size_canvas()

    // Should be called if the canvas is resized to update the canvas resolution:
    resize_canvas: function(){
      if (_isFullScreen){
        return;
      }
      update_sizeCanvas();
    }
  }; //end that
  return that;
})();
