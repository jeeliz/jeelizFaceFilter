/*
	Helper for Three.js
*/ 
"use strict";

THREE.JeelizHelper=(function(){
	//internal settings
	var _settings={
		rotationOffsetX: 0, //negative -> look upper. in radians
	    pivotOffsetYZ: [0.2,0.2], //XYZ of the distance between the center of the cube and the pivot
	    detectionThreshold: 0.75, //sensibility, between 0 and 1. Less -> more sensitive
	    detectionHysteresis: 0.05
	};

	//private vars :
	var _threeRenderer, _threeScene, _maxFaces, _isMultiFaces, _threeCompositeObjects=[], _threePivotedObjects=[], _detect_callback=null,
		_threeVideoMesh, _glVideoTexture, _threeVideoTexture, _isVideoTextureReady=false;

	//private funcs :
	function create_threeCompositeObjects(){
		for (var i=0; i<_maxFaces; ++i){
	    	//COMPOSITE OBJECT WHICH WILL FOLLOW A DETECTED FACE
		    //in fact we create 2 objects to be able to shift the pivot point
		    var threeCompositeObject=new THREE.Object3D();
		    threeCompositeObject.frustumCulled=false;
		    threeCompositeObject.visible=false;

		    var threeCompositeObjectPIVOTED=new THREE.Object3D(); 
		    threeCompositeObjectPIVOTED.frustumCulled=false;
		    threeCompositeObjectPIVOTED.position.set(0, -_settings.pivotOffsetYZ[0], -_settings.pivotOffsetYZ[1]);
		    threeCompositeObject.add(threeCompositeObjectPIVOTED);

		    _threeCompositeObjects.push(threeCompositeObject);
		    _threePivotedObjects.push(threeCompositeObjectPIVOTED);
		    _threeScene.add(threeCompositeObject);
	    }
	}

	function create_videoScreen(){
		//init video texture with red
	    _threeVideoTexture=new THREE.DataTexture( new Uint8Array([255,0,0]), 1, 1, THREE.RGBFormat);
	    _threeVideoTexture.needsUpdate=true;

	    //CREATE THE VIDEO BACKGROUND
	    var videoMaterial=new THREE.RawShaderMaterial({
	        depthWrite: false,
	        depthTest: false,
	        vertexShader: "attribute vec2 position;\n\
	            varying vec2 vUV;\n\
	            void main(void){\n\
	                gl_Position=vec4(position, 0., 1.);\n\
	                vUV=0.5+0.5*position;\n\
	            }",
	        fragmentShader: "precision lowp float;\n\
	            uniform sampler2D samplerVideo;\n\
	            varying vec2 vUV;\n\
	            void main(void){\n\
	                gl_FragColor=texture2D(samplerVideo, vUV);\n\
	            }",
	         uniforms:{
	            samplerVideo: {value: _threeVideoTexture}
	         }
	    });
	    var videoGeometry=new THREE.BufferGeometry()
	    var videoScreenCorners=new Float32Array([-1,-1,   1,-1,   1,1,   -1,1]);
	    videoGeometry.addAttribute( 'position', new THREE.BufferAttribute( videoScreenCorners, 2 ) );
	    videoGeometry.setIndex(new THREE.BufferAttribute(new Uint16Array([0,1,2, 0,2,3]), 1));
	    _threeVideoMesh=new THREE.Mesh(videoGeometry, videoMaterial);
	    that.apply_videoTexture(_threeVideoMesh);
	    _threeVideoMesh.renderOrder=-1000; //render first
	    _threeVideoMesh.frustumCulled=false;
	    _threeScene.add(_threeVideoMesh);
	} //end create_videoScreen()

	function detect(detectState){
		_threeCompositeObjects.forEach(function(threeCompositeObject, i){
			var isDetected=threeCompositeObject.visible;
			var ds=detectState[i];
			if (isDetected && ds.detected<_settings.detectionThreshold-_settings.detectionHysteresis){
	                //DETECTION LOST
	            if (_detect_callback) _detect_callback(i, false);
	            threeCompositeObject.visible=false;
	        } else if (!isDetected && ds.detected>_settings.detectionThreshold+_settings.detectionHysteresis){
	            //FACE DETECTED
	            if (_detect_callback) _detect_callback(i, true);
	            threeCompositeObject.visible=true;
	        }
		}); //end loop on all detection slots
	}

	function update_positions3D(ds, threeCamera){
		var tanFOV=Math.tan(threeCamera.aspect*threeCamera.fov*Math.PI/360); //tan(FOV/2), in radians
                 
		_threeCompositeObjects.forEach(function(threeCompositeObject, i){
			if (!threeCompositeObject.visible) return;
			var detectState=ds[i];
			
			//move the cube in order to fit the head
	        var W=detectState.s;  //relative width of the detection window (1-> whole width of the detection window)
	        var D=1/(2*W*tanFOV); //distance between the front face of the cube and the camera
	        
	        //coords in 2D of the center of the detection window in the viewport :
	        var xv=detectState.x;
	        var yv=detectState.y;
	        
	        //coords in 3D of the center of the cube (in the view coordinates system)
	        var z=-D-0.5;   // minus because view coordinate system Z goes backward. -0.5 because z is the coord of the center of the cube (not the front face)
	        var x=xv*D*tanFOV;
	        var y=yv*D*tanFOV/threeCamera.aspect;

	        //move and rotate the cube
	        threeCompositeObject.position.set(x,y+_settings.pivotOffsetYZ[0],z+_settings.pivotOffsetYZ[1]);
	        threeCompositeObject.rotation.set(detectState.rx+_settings.rotationOffsetX, detectState.ry, detectState.rz, "XYZ");
		}); //end loop on composite objects
	}

	//public methods :
	var that={
		init: function(spec, detectCallback){ //launched with the same spec object than callbackReady
			_maxFaces=spec.maxFacesDetected;
			_glVideoTexture=spec.videoTexture;
			_isMultiFaces=(_maxFaces>1);

			if (typeof(detectCallback)!=='undefined'){
				_detect_callback=detectCallback;
			}

			 //INIT THE THREE.JS context
		    _threeRenderer=new THREE.WebGLRenderer({
		        context: spec.GL,
		        canvas: spec.canvasElement
		    });

		    _threeScene=new THREE.Scene();

		    create_threeCompositeObjects();
		    create_videoScreen();
		    
		    var returnedDict = {
		    	videoMesh: _threeVideoMesh,
		    	renderer: _threeRenderer,
		    	scene: _threeScene
		    };
		    if (_isMultiFaces){
		    	returnedDict.faceObjects=_threePivotedObjects;
		    } else {
		    	returnedDict.faceObject=_threePivotedObjects[0];
		    }
		    return returnedDict;
		}, //end that.init()

		render: function(detectState, threeCamera){
			var ds=(_isMultiFaces)?detectState:[detectState];

			//update detection states
			detect(ds);
			update_positions3D(ds, threeCamera);

			//reinitialize the state of THREE.JS because JEEFACEFILTER have changed stuffs
            _threeRenderer.state.reset();

            //trigger the render of the THREE.JS SCENE
            _threeRenderer.render(_threeScene, threeCamera);
		},

		sortFaces: function(bufferGeometry, axis, isInv){ //sort faces long an axis
			//useful when a bufferGeometry has alpha : we should render the last faces first
			var axisOffset={X:0, Y:1, Z:2}[axis.toUpperCase()];
			var sortWay=(isInv)?-1:1;

			//fill the faces array
			var nFaces=bufferGeometry.index.count/3;
			var faces=new Array(nFaces);
			for (var i=0; i<nFaces; ++i){
				faces[i]=[bufferGeometry.index.array[3*i], bufferGeometry.index.array[3*i+1], bufferGeometry.index.array[3*i+2]];
			}

			//compute centroids :
			var aPos=bufferGeometry.attributes.position.array;
			var centroids=faces.map(function(face, faceIndex){
				return [
					(aPos[3*face[0]]+aPos[3*face[1]]+aPos[3*face[2]])/3, //X
					(aPos[3*face[0]+1]+aPos[3*face[1]+1]+aPos[3*face[2]+1])/3, //Y
					(aPos[3*face[0]+2]+aPos[3*face[1]+2]+aPos[3*face[2]+2])/3, //Z
					face
				];
			});

			//sort centroids
			centroids.sort(function(ca, cb){
				return (ca[axisOffset]-cb[axisOffset])*sortWay;
			});

			//reorder bufferGeometry faces :
			centroids.forEach(function(centroid, centroidIndex){
				var face=centroid[3];
				bufferGeometry.index.array[3*centroidIndex]=face[0];
				bufferGeometry.index.array[3*centroidIndex+1]=face[1];
				bufferGeometry.index.array[3*centroidIndex+2]=face[2];
			});
		}, //end sortFaces

		get_threeVideoTexture: function(){
			return _threeVideoTexture;
		},

		apply_videoTexture: function(threeMesh){
			if (_isVideoTextureReady){
				return;
			}
			threeMesh.onAfterRender=function(){
		        //replace _threeVideoTexture.__webglTexture by the real video texture
		        try {
		        	_threeRenderer.properties.update(_threeVideoTexture, '__webglTexture', _glVideoTexture);
		        	_threeVideoTexture.magFilter=THREE.LinearFilter;
		        	_threeVideoTexture.minFilter=THREE.LinearFilter;
		        	_isVideoTextureReady=true;
		        } catch(e){
		        	console.log('WARNING in THREE.JeelizHelper : the glVideoTexture is not fully initialized');
		        }
		        delete(threeMesh.onAfterRender);
		    };
		}
	}
	return that;
})();