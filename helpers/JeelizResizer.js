/*
This helper can help for :
* adjusting the canvas resolution to the good size -> this is crucial to
optimize the code because if the canvas is too large,
there are too much pixels to compute => it will be slow

* to mirror horizontally or not the canvas -> if the front camera is used we
need it flipped (mirror effect), while if the rear camera is used we need it not flipped

* to get the best camera resolution (either above the canvas resolution or closer)
to balance between performance and quality
*/ 
"use strict";

var JeelizResizer=(function(){
    //private vars :
    var _domCanvas, _whCanvasPx, _resizeAttemptsCounter=0, _overSamplingFactor=1, _isFullScreen=false, _timerFullScreen=false, _callbackResize=false;
    var _cameraResolutions=[ //all resolutions should be in landscape mode
        [640,480],
        [768,480],
        [800,600],
        [960,640],
        [960,720],
        [1024,768],
        [1280,720]
    ];
    var _isInvFullscreenWH=false;

    //private functions
    function add_CSStransform(domElement, CSS){
        var CSStransform=domElement.style.transform;
        if (CSStransform.indexOf(CSS)!==-1) return;
        domElement.style.transform=CSS+' '+CSStransform;
    }

    //compute overlap between 2 rectangles A and B
    //characterized by their width and their height in pixels
    //the rectangles are centered
    //return the ratio (pixels overlaped)/(total pixels)
    function compute_overlap(whA, whB){ 
        var aspectRatioA=whA[0]/whA[1], aspectRatioB=whB[0]/whB[1]; //higher aspectRatio -> more landscape
        var whLandscape, whPortrait;
        if (aspectRatioA>aspectRatioB){ 
            whLandscape=whA, whPortrait=whB;
        } else {
            whLandscape=whB, whPortrait=whA;
        }

        //the overlapped area will be always a rectangle
        var areaOverlap=Math.min(whLandscape[0], whPortrait[0])*Math.min(whLandscape[1], whPortrait[1]);
        
        var areaTotal;
        if (whLandscape[0]>=whPortrait[0] && whLandscape[1]>=whPortrait[1]){ //union is a rectangle
            areaTotal=whLandscape[0]*whLandscape[1];
        } else if (whPortrait[0]>whLandscape[0] && whPortrait[1]>whLandscape[1]){ //union is a rectangle
            areaTotal=whPortrait[0]*whPortrait[1];
        } else { //union is a cross
            areaTotal=whLandscape[0]*whLandscape[1];
            areaTotal+=(whPortrait[1]-whLandscape[1])*whPortrait[0];
        }

        return areaOverlap/areaTotal;
    } //end compute_overlap()

    function update_sizeCanvas(){
        var domRect = _domCanvas.getBoundingClientRect();
        _whCanvasPx=[
            Math.round(_overSamplingFactor*domRect.width),
            Math.round(_overSamplingFactor*domRect.height)
        ];
        _domCanvas.setAttribute('width',  _whCanvasPx[0]);
        _domCanvas.setAttribute('height', _whCanvasPx[1]);
    }

    function on_windowResize(){
        if (_timerFullScreen){
            clearTimeout(_timerFullScreen);
        }
        _timerFullScreen=setTimeout(resize_fullScreen, 50);
    }

    function resize_canvasToFullScreen(){
        _whCanvasPx=[window['innerWidth'], window['innerHeight']];
        if (_isInvFullscreenWH){
            _whCanvasPx.reverse();
        }
        _domCanvas.setAttribute('width',  _whCanvasPx[0]);
        _domCanvas.setAttribute('height', _whCanvasPx[1]);
    }

    function resize_fullScreen(){
        resize_canvasToFullScreen();
        JEEFACEFILTERAPI.resize();
        _timerFullScreen=false;
        if (_callbackResize) {
            _callbackResize();
        }
    }

    //public methods :
    var that={ //return true or false if the device is in portrait or landscape mode
        is_portrait: function(){ //https://stackoverflow.com/questions/4917664/detect-viewport-orientation-if-orientation-is-portrait-display-alert-message-ad
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

        //size canvas to the right resolution
        //should be called after the page loading
        //when the canvas has already the right size
        //options:
        // - <string> canvasId: id of the canvas
        // - <function> callback: function to launch if there was an error or not
        // - <float> overSamplingFactor: facultative. If 1, same resolution than displayed size (default). 
        //   If 2, resolution twice higher than real size
        // - <boolean> isFlipY: if we should flip the canvas or not. Default: false
        // - <boolean> isFullScreen: if we should set the canvas fullscreen. Default : false
        // - <function> onResize: function called when the window is resized. Only enabled if isFullScreen=true
        // - <boolean> isInvWH: if we should invert width and height for fullscreen mode only. default=false
        size_canvas: function(options){
            _domCanvas=document.getElementById(options.canvasId);
            _isFullScreen=(typeof(options.isFullScreen)!=='undefined' && options.isFullScreen);
            _isInvFullscreenWH=(typeof(options.isInvWH)!=='undefined' && options.isInvWH);

            if (_isFullScreen){
                //we are in fullscreen mode
                if (typeof(options.onResize)!=='undefined'){
                    _callbackResize=options.onResize;
                }
                resize_canvasToFullScreen();
                window.addEventListener('resize', on_windowResize, false);
            } else { //not fullscreen mode

                //get display size of the canvas
                var domRect = _domCanvas.getBoundingClientRect();
                if (domRect.width===0 || domRect.height===0){
                    console.log('WARNING in JeelizResize.size_canvas() : the canvas has its width or its height null, Retry a bit later...');
                    if (++_resizeAttemptsCounter>20){
                        options.callback('CANNOT_RESIZECANVAS');
                        return;
                    }
                    setTimeout(that.size_canvas.bind(null, options), 50);
                    return;
                }

                //do resize canvas :
                _resizeAttemptsCounter=0;
                _overSamplingFactor=(typeof(options.overSamplingFactor)==='undefined')?1:options.overSamplingFactor;
                update_sizeCanvas();
            }

            //flip horizontally if required :
            if (typeof(options.isFlipY)!=='undefined' && options.isFlipY){
                add_CSStransform(_domCanvas, 'rotateY(180deg)');
            }

            //compute the best camera resolutions :
            var allResolutions=_cameraResolutions.slice(0);

            //if we are in portrait mode, the camera is also in portrait mode
            //so we need to set all resolutions to portrait mode
            if (that.is_portrait()){
                allResolutions.forEach(function(wh){
                    wh.reverse();
                });
            }

            //sort camera resolutions from the best to the worst :
            allResolutions.sort(function(resA, resB){
                return compute_overlap(resB, _whCanvasPx)-compute_overlap(resA, _whCanvasPx);
            });

            //pick the best camera resolution
            var bestCameraResolution={
                'idealWidth': allResolutions[0][0],
                'idealHeight':allResolutions[0][1]
            };

            //launch the callback function after a small interval to let it
            //some time to size
            setTimeout(options.callback.bind(null, false, bestCameraResolution), 1);
        }, //end size_canvas()

        resize_canvas: function(){ //should be called if the canvas is resized to update the canvas resolution
            if (_isFullScreen){
                return;
            }
            update_sizeCanvas();
        }
    }; //end that
    return that;
})();
