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

var JeelizResize=(function(){
	//private vars :
	var _domCanvas, _resizeAttemptsCounter=0;

	//private functions
	function set_CSStransform(){
		
	}

	//public methods :
	var that={
		//size canvas to the right resolution
		//should be called after the page loading
		//when the canvas has already the right size
		//options :
		// - <string> canvasId : id of the canvas
		// - <function> callback : function to launch if there was an error or not
		// - <float> overSamplingFactor : facultative. If 1, same resolution than displayed size (default). 
		//   If 2, resolution twice higher than real size
		// - <boolean> isFlipY : if we should flip the canvas or not. Default: false
		size_canvas: function(options){
			_domCanvas=document.getElementById(options.canvasId);
			var domRect = element.getBoundingClientRect();
			if (domRect.width===0 || domRect.height===0){
				console.log('WARNING in JeelizResize.size_canvas() : the canvas has its width or its height null, Retry a bit later...');
				if (++_resizeAttemptsCounter>20){
					options.callback('CANNOT_RESIZECANVAS');
					return;
				}
				setTimeout(that.size_canvas.bind(null, options), 100);
				return;
			}

			//do resize canvas :
			_resizeAttemptsCounter=0;
			var overSamplingFactor=(typeof(options.overSamplingFactor)==='undefined')?1:options.overSamplingFactor;
			_domCanvas.setAttribute('width', Math.round(overSamplingFactor*domRect.width));
			_domCanvas.setAttribute('height', Math.round(overSamplingFactor*domRect.height));

			//flip horizontally if required :
			if (typeof(spec.isFlipY)!=='undefined' && spec.isFlipY){
				_domCanvas.style.
			}

			//launch 

			
		} //end size_canvas()
	}; //end that
	return that;
})();
