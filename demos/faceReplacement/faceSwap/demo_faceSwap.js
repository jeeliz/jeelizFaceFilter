"use strict";


var SETTINGS={
	detectionThreshold: 0.75 //sensibility, between 0 and 1. Less -> more sensitive
}

//some globals
var FACECUT0, FACECUT1;

function main(){ //entry point
	JeelizResizer.size_canvas({
		canvasId: 'jeeFaceFilterCanvas',
		isFullScreen: true,
		isFlipY: true,
		onResize: onResize,
		callback: start
	});
} 

function start(errCode, bestVideoSettings){
	if (errCode){
		alert(errCode);
		return;
	}
	JEEFACEFILTERAPI.init({
		videoSettings: bestVideoSettings,
		maxFacesDetected: 2,
		canvasId: 'jeeFaceFilterCanvas',
		NNCpath: '../../../dist/', //root of NNC.json file
		callbackReady: function(errCode, spec){
			if (errCode){
                alert('AN ERROR HAPPENS. SORRY BRO :( . ERR ='+errCode);
                return;
            }

            console.log('INFO : JEEFACEFILTERAPI IS READY');
            init_view(spec);
		},
		callbackTrack: callbackTrack
	});
} //end start

function onResize(){
	console.log('INFO in demo_faceSwap : resized !');
}

function init_view(spec){
	JeelizFaceCut.init(spec);
	FACECUT0=FaceCut.instance({});
	FACECUT1=FaceCut.instance({});
}

function callbackTrack(detectedStates){
	if (detectedStates[0].detected<SETTINGS.detectionThreshold || detectedStates[1].detected<SETTINGS.detectionThreshold){
		//less than 2 faces are detected
		JeelizFaceCut.draw_search(detectedStates);
	} else {
		//both faces are detected
		FACECUT0.cut(detectedStates[0]);
		FACECUT1.cut(detectedStates[1]);

		JeelizFaceCut.draw_video();
		

	}

}
