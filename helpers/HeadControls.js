/*
    Use PROJECT OBLIO API to control the movements of a camera
    This script has been put into shared because it can be used with different 3D engines
    We have at least 2 integration examples :
      - with CesiumJS for a head controlled Google Earth like demo
      - with THREE.JS for a camera controller (THREE.HeadControls)

 
	==== INITIALIZATION ====
	HeadControls.init(spec) with spec =
	spec (*-> mandatory): 
	  - settings: object. override default settings if specified
      - canvasId* : id of the canvas where the JEEFITAPI will be initialized. We will draw the face tracking on it
      - callbackReady: callback launched when the controller is ready. launched with errCode if error, false otherwise
      - callbackMove*: function to move the camera
      - disableRestPosition: do not offset the face position with a rest position. Default: false
      - NNCpath* : path of the NN net

    ==== OTHER METHODS ====
    HeadControls.toggle(<boolean>onOff) : toggle on or off the HeadControls

*/
"use strict";
var HeadControls=(function(){
	var _defaultSettings={
		detectionThreshold: 0.85, //sensibility, between 0 and 1. Less -> more sensitive
    	detectionHysteresis: 0.05,
    	tol: {
    		rx: 5,//do not move if head turn more than this value (in degrees) from head rest position
    		ry: 5,
    		s: 5 //do not move forward/backward if head is larger/smaller than this percent from the rest position
    	},
    	sensibility: {
    		rx: 1,
    		ry: 1,
    		s: 1
    	}
	};

	//private variables :
	var _settings;
	var _returnValue={
		dRx:0, dRy: 0,
		dZ: 0
	};

	//internal state :
	var _state={
		isLoaded: false,
		isDetected:false,
		isEnabled: false,
		restHeadPosition: { //position of the head matching with No Move
			needsUpdate: false,
			s: 0,
			rx: 0,
			ry: 0
		}
	};

	var _lastTimestamp=0;
	var _gl, _cv, _videoTexture, _headSearchDrawShaderProgram, _headSearchUniformXys;
	var _disableRestPosition=false;

	//private functions :
	function compute_delta(ref, val, tol, sensibility){
		if (Math.abs(ref-val)<tol){
			return 0;
		}
		return (val-ref)*sensibility;
	}

	function compile_shader(source, type, typeString) {
	    var shader = _gl.createShader(type);
	    _gl.shaderSource(shader, source);
	    _gl.compileShader(shader);
	    if (!_gl.getShaderParameter(shader, _gl.COMPILE_STATUS)) {
	      alert("ERROR IN "+typeString+ " SHADER : " + _gl.getShaderInfoLog(shader));
	      return false;
	    }
	    return shader;
	};

	function init_headSearchDraw(){
		//build _headSearchDrawShaderProgram
		var shader_vertex_source="\n\
			attribute vec2 aat_position;\n\
			varying vec2 vUV;\n\
			\n\
			void main(void) {\n\
			    gl_Position=vec4(aat_position, 0., 1.);\n\
			    vUV=(aat_position*0.5)+vec2(0.5,0.5);\n\
			    vUV.x=1.-vUV.x; //mirror diplay\n\
			}";
		var shader_fragment_source="\n\
			precision lowp float;\n\
			varying vec2 vUV;\n\
			uniform sampler2D samplerVideo;\n\
			uniform vec3 uxys;\n\
			\n\
			void main(void) {\n\
				vec3 colorVideo=texture2D(samplerVideo, vUV).rgb;\n\
				vec2 pos=vUV*2.-vec2(1.,1.);\n\
				vec2 isInside=step(uxys.xy-uxys.z*vec2(1.,1.), pos);\n\
				isInside*=step(pos, uxys.xy+uxys.z*vec2(1.,1.));\n\
				vec2 blendCenterFactor=abs(pos-uxys.xy)/uxys.z;\n\
				float alpha=isInside.x*isInside.y*pow(max(blendCenterFactor.x, blendCenterFactor.y), 3.);\n\
				vec3 color=mix(colorVideo, vec3(0.,0.6,1.), alpha);\n\
				gl_FragColor=vec4(color,1.);\n\
			}";

		var shader_vertex=compile_shader(shader_vertex_source, _gl.VERTEX_SHADER, 'VERTEX');
		var shader_fragment=compile_shader(shader_fragment_source, _gl.FRAGMENT_SHADER, 'FRAGMENT');

		_headSearchDrawShaderProgram=_gl.createProgram();
  		_gl.attachShader(_headSearchDrawShaderProgram, shader_vertex);
  		_gl.attachShader(_headSearchDrawShaderProgram, shader_fragment);

  		_gl.linkProgram(_headSearchDrawShaderProgram);
  		var samplerVideo=_gl.getUniformLocation(_headSearchDrawShaderProgram, 'samplerVideo');
  		_headSearchUniformXys=_gl.getUniformLocation(_headSearchDrawShaderProgram, 'uxys');

  		_gl.useProgram(_headSearchDrawShaderProgram);
  		_gl.uniform1i(samplerVideo, 0);
	} //end init_headSearchDraw()

	function draw_headSearch(detectState){
		//unbind the current FBO and set the viewport as the whole canvas
		_gl.viewport(0,0,_cv.width, _cv.height);

		//use the head draw shader program and sync uniforms
		_gl.useProgram(_headSearchDrawShaderProgram);
		_gl.activeTexture(_gl.TEXTURE0);
		_gl.bindTexture(_gl.TEXTURE_2D, _videoTexture);
		_gl.uniform3f(_headSearchUniformXys, detectState.x, detectState.y, detectState.s);

		//draw the square looking for the head
		//the VBO filling the whole screen is still bound to the context
		//fill the viewPort
		_gl.drawElements(_gl.TRIANGLES, 3, _gl.UNSIGNED_SHORT, 0);
	}

	function compute_cameraMove(detectState){
		if (_state.isDetected && detectState.detected<_settings.detectionThreshold-_settings.detectionHysteresis){
            //DETECTION LOST
            
            _state.isDetected=false;
            _returnValue.dRx=0;
        	_returnValue.dRy=0;
        	_returnValue.dZ=0;
        } else if (!_state.isDetected && detectState.detected>_settings.detectionThreshold+_settings.detectionHysteresis){
            //FACE DETECTED
            _state.isDetected=true;
        }

        if (_state.isEnabled){
        	draw_headSearch(detectState);
        }

        if (!_state.isEnabled || !_state.isDetected || !_state.isLoaded){
        	return _returnValue; //no camera move
        }

        if (_state.restHeadPosition.needsUpdate && !_disableRestPosition){
        	_state.restHeadPosition.needsUpdate=false;
        	_state.restHeadPosition.rx=detectState.rx;
        	_state.restHeadPosition.ry=detectState.ry;
        	_state.restHeadPosition.s=detectState.s;
        	_lastTimestamp=Date.now();
        }

        //compute movement of the camera
        var ts=Date.now();
        var dt=ts-_lastTimestamp;
        _returnValue.dRx=dt*compute_delta(_state.restHeadPosition.rx, detectState.rx, _settings.tol.rx, _settings.sensibility.rx);
		_returnValue.dRy=dt*compute_delta(_state.restHeadPosition.ry, detectState.ry, _settings.tol.ry, _settings.sensibility.ry);
        _returnValue.dZ=dt*compute_delta(_state.restHeadPosition.s, detectState.s, _settings.tol.s, _settings.sensibility.s);
        
        _lastTimestamp=ts;
        return _returnValue;
	} //end compute_cameraMove()

	//public methods :
	var that={
		init: function(spec){
			// set settings :
			if (typeof(spec.settings)==='undefined') spec.settings={};
			_disableRestPosition=(typeof(spec.disableRestPosition)==='undefined')?false:spec.disableRestPosition;
			_settings=Object.assign({}, _defaultSettings, spec.settings);
			_settings.tol.rx*=Math.PI/180; //convert from degrees to radians
			_settings.tol.ry*=Math.PI/180;
			_settings.tol.s/=100;

			//init the API
			 JEEFACEFILTERAPI.init({
		        canvasId: spec.canvasId,
		        NNCpath: spec.NNCpath, //root of NNC.json file
		        callbackReady: function(errCode, jeeFaceFilterObj){
		            if (errCode){
		                console.log('AN ERROR HAPPENS. SORRY BRO :( . ERR =', errCode);
		                if (spec.callbackReady){
		                	spec.callbackReady(errCode);
		                }
		                return;
		            }
		            _gl=jeeFaceFilterObj['GL'];
		            _videoTexture=jeeFaceFilterObj['videoTexture'];
		            _cv=jeeFaceFilterObj['canvasElement'];

		            init_headSearchDraw();

		            if (spec.callbackReady){
	                	spec.callbackReady(false);
	                }
		            _state.isLoaded=true;
		        }, //end callbackReady()

		        //called at each render iteration (drawing loop)
		        callbackTrack: function(detectState){
		        	var mv=compute_cameraMove(detectState);
		        	mv.expressions=detectState.expressions;
		        	if (!_state.isEnabled){
		        		return;
		        	}
		        	if (mv.dRx!==0 || mv.dRy!==0 || mv.dZ!==0){
		        		spec.callbackMove(mv);
		        	}
		        }
		    }); //end JEEFACEFILTERAPI.init call
		}, //end init()

		toggle: function(isEnabled){
			if (_state.isEnabled===isEnabled){
				return true;
			} else if (!isEnabled){ //disable
				_state.isEnabled=false;
				return true;
			} else {
				_state.isEnabled=true;
				_state.restHeadPosition.needsUpdate=true;
				return true;
			}
		},

		reset_restHeadPosition: function(){
			_state.restHeadPosition.needsUpdate=true;
		}
	}; //end that
	return that;
})();
