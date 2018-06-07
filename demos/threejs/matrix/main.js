"use strict";

//globals :
var THREECAMERA, MASKMATERIAL, CANVAS, THREERENDERER;

//entry point :
function main(){
	//set canvas fullscreen with JeelizResizer.js helper :
	JeelizResizer.size_canvas({
		canvasId: 'matrixCanvas',
		isFlipY: true,
		isFullScreen: true,
		callback: start,
		onResize: function(){
			if (THREECAMERA){
				THREECAMERA.aspect=CANVAS.width/CANVAS.height;
				THREECAMERA.updateProjectionMatrix();
			}
			if (MASKMATERIAL){
				MASKMATERIAL.uniforms.resolution.value.set(CANVAS.width,CANVAS.height);
			}
		}
	}); //end size_canvas call
}

//called when the canvas is resized
function start(){
	//initialise Jeeliz Facefilter :
	JEEFACEFILTERAPI.init({
      canvasId: 'matrixCanvas',
      //path of NNC.json :
      NNCpath: '../../../dist/',
      callbackReady: function(errCode, spec){ 
        if (errCode){
            console.log('HEY, IL Y A EU UNE ERREUR =', errCode);
            return;
        }
        console.log('JEEFACEFILTERAPI MARCHE YEAH !');
        init_scene(spec);
      }, //end callbackReady()

      callbackTrack: callbackTrack
	});
} 

function init_scene(spec){
	CANVAS=spec.canvasElement;
	var threeInstances=THREE.JeelizHelper.init(spec);
	THREERENDERER=threeInstances.renderer;

	//create a camera with a 20° FoV
  	var aspecRatio=spec.canvasElement.width / spec.canvasElement.height;
  	THREECAMERA=new THREE.PerspectiveCamera(20, aspecRatio, 0.1, 100);

  	//create the background video texture :
  	var video=document.createElement('video');
	video.src='matrixRain.mp4';
	video.setAttribute('loop', 'true');
	video.setAttribute('preload', 'true');
	video.setAttribute('autoplay', 'true');
	var videoTexture = new THREE.VideoTexture( video );
	videoTexture.magFilter=THREE.LinearFilter;
	videoTexture.minFilter=THREE.LinearFilter;

	threeInstances.videoMesh.material.uniforms.samplerVideo.value=videoTexture;

	try{ //workaround otherwise chrome do not want to play the video sometimes...
		video.play();
	} catch(e){
	}
	var playVideo=function(){
	  video.play();
	  window.removeEventListener('mousemove', playVideo);
	  window.removeEventListener('touchmove', playVideo);
	}
	window.addEventListener('mousedown', playVideo, false);
	window.addEventListener('touchdown', playVideo, false);

	//import the mesh :
	new THREE.BufferGeometryLoader().load('maskMesh.json', function(maskGeometry){
	  maskGeometry.computeVertexNormals();
	  
	  //creation du matériau personnalisé
	  MASKMATERIAL=new THREE.ShaderMaterial({
	  vertexShader: "\n\
	    varying vec3 vNormalView, vPosition;\n\
	    void main(void){\n\
	      #include <beginnormal_vertex>\n\
	      #include <defaultnormal_vertex>\n\
	      #include <begin_vertex>\n\
	      #include <project_vertex>\n\
	      vNormalView=vec3(viewMatrix*vec4(normalize( transformedNormal ),0.));\n\
		  vPosition=position;\n\
	    }",

	  fragmentShader: "precision lowp float;\n\
	    uniform vec2 resolution;\n\
	    uniform sampler2D samplerWebcam, samplerVideo;\n\
	    varying vec3 vNormalView, vPosition;\n\
	    void main(void){\n\
	      float isNeck=1.-smoothstep(-1.2, -0.85, vPosition.y);\n\
	      float isTangeant=pow(length(vNormalView.xy),3.);\n\
	      float isInsideFace=(1.-isTangeant)*(1.-isNeck);\n\
	      vec2 uv=gl_FragCoord.xy/resolution;\n\
	      vec3 colorWebcam=texture2D(samplerWebcam, uv).rgb;\n\
	      float colorWebcamVal=dot(colorWebcam, vec3(0.299,0.587,0.114));\n\
	      colorWebcam=colorWebcamVal*vec3(0.0,1.5,0.0);\n\
	      vec3 refracted=refract(vec3(0.,0.,-1.), vNormalView, 0.3);\n\
		  vec2 uvRefracted=uv+0.1*refracted.xy;\n\
		  uvRefracted=mix(uv, uvRefracted, smoothstep(0.,1.,isInsideFace));\n\
	      vec3 colorLineCode=texture2D(samplerVideo, uvRefracted).rgb;\n\
	      colorWebcam+=vec3(1.,1.,1.)*smoothstep(0.3,0.6,colorWebcamVal);\n\
	      vec3 finalColor=colorWebcam*isInsideFace+colorLineCode;\n\
	      gl_FragColor=vec4(finalColor, 1.); //1 pour l'alpha\n\
	    }",

	  uniforms:{
	    samplerWebcam: {value: THREE.JeelizHelper.get_threeVideoTexture()},
	    samplerVideo: {value: videoTexture},
	    resolution: {value: new THREE.Vector2(spec.canvasElement.width,
	                                             spec.canvasElement.height)}
	    }
	  });
	  
	  var maskMesh=new THREE.Mesh(maskGeometry, MASKMATERIAL);
	  maskMesh.position.set(0, 0.3,-0.35);
	  threeInstances.faceObject.add(maskMesh);

	  THREE.JeelizHelper.apply_videoTexture(maskMesh);
	});
}

function callbackTrack(detectState){
	THREE.JeelizHelper.render(detectState, THREECAMERA);
}