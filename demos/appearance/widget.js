//ref : https://github.com/blog/273-github-ribbons
var loaded=false;
var mediaRecorder;
var mediaRecorder2;
var id;
var videoURL;
var audioURL;
var media1Stopped=false;
var media2Stopped=false;
function replay(){
		console.log("replay called");
		
		var canvasParent = document.getElementById("canvasParent");
		
		var audio = document.createElement("video");
		console.log("link2 inside stop recording",audioURL);
		audio.src=audioURL
		audio.loop=true;
		audio.muted=false;
		audio.id="audio";
		document.body.appendChild(audio);
		console.log("about to play");		
		audio.play();
		console.log("audio playing");
		var video = document.createElement("video");
		var canvas = document.getElementById("jeeFaceFilterCanvas");
		video.src = videoURL;
		//video.width="100%";
		video.id="video";
		video.autoPlay=true;
		video.loop=true;
		video.muted=false;
		console.log(canvas.height,canvas.width);
		video.style="position:absolute; height "+canvas.height+"px; width "+canvas.width+"px; margin 0 auto; ";
		
		//var ctx = canvas.getContext('2d');
		canvas.parentNode.removeChild(canvas);
		/*function readyToPlayVideo(event){ // this is a referance to the video
    			// the video may not match the canvas size so find a scale to fit
    			videoContainer.scale = Math.min(
                         canvas.width / this.videoWidth, 
                         canvas.height / this.videoHeight); 
   	 		videoContainer.ready = true;
   			 // the video can be played so hand it off to the display function
    			requestAnimationFrame(updateCanvas);
  			  // add instruction
    			//document.getElementById("playPause").textContent = "Click video to play/pause.";
  	 		 //document.querySelector(".mute").textContent = "Mute";
		}
		function updateCanvas(){
    			//ctx.clearRect(0,0,canvas.width,canvas.height); 
   		 		// only draw if loaded and ready
    			if(videoContainer !== undefined && videoContainer.ready){ 
       				 // find the top left of the video on the canvas
    				    video.muted = muted;
			        var scale = videoContainer.scale;
			        var vidH = videoContainer.video.videoHeight;
			        var vidW = videoContainer.video.videoWidth;
			        var top = canvas.height / 2 - (vidH /2 ) * scale;
			        var left = canvas.width / 2 - (vidW /2 ) * scale;
       				 // now just draw the video the correct size
  			      ctx.drawImage(videoContainer.video, left, top, vidW * scale, vidH * scale);
 	
	    		    }
		} // end of updateCanvas
		*/
		// Create a second file stream too. for raw data
		video.onerror = function(e){
		    document.body.removeChild(canvas);
		    document.body.innerHTML += "<h2>There is a problem loading the video</h2><br>";
		    document.body.innerHTML += "Users of IE9+ , the browser does not support WebM videos used by this demo";
		    document.body.innerHTML += "<br><a href='https://tools.google.com/dlpage/webmmf/'> Download IE9+ WebM support</a> from tools.google.com<br> this includes Edge and Windows 10";
		    
		 }
		//video.play();
		console.log("Starting video now too")
		canvasParent.appendChild(video);
		//video.oncanplay=readyToPlayVideo;
		video.play();
		console.log("Video started");


	}

document.addEventListener("DOMContentLoaded", function(event) { 
        var wrapper = document.createElement("div");
        //wrapper.innerHTML = '<header><i class="material-icons" id="menu-open">menu</i><span class="title">Touch Menu L.A.</span></header><div class="center-icon"><i class="material-icons arrow">keyboard_backspace</i><i class="material-icons">touch_app</i><div class="text">Drag</div></div><div id="menu" class="touch-menu-la"><div class="inner-header">Touch Menu<span>Like Android</span></div><ul class="menu-items"><li><a href="https://github.com/ericktatsui/Touch-Menu-Like-Android"><i class="fa fa-github"></i> Github</a></li><li><a href="mailto:ericktatsui@gmail.com"><i class="fa fa-envelope"></i> ericktatsui@gmail.com</a></li></ul><div class="inner-footer">el risus. Pellentesque facilisis blandit auctor. Maecenas vestibulum vulputate tincidunt. Mauris nec quam libero. Fusce eget ligula non leo varius condimentum quis ac elit.</div><div class="inner-footer"><iframe src="https://ghbtns.com/github-btn.html?user=ericktatsui&repo=Touch-Menu-Like-Android&type=star&count=true" frameborder="0" scrolling="0" width="160px" height="30px"></iframe></div></div>'
	//wrapper.innerHtml='<div id="myProgress" style="width: 100%; background-color: grey;"><div id="myBar" style="width:1%; height:30px; background-color:green;"></div></div>'
        document.body.appendChild(wrapper);
	var stopped=false;
	var replaying=false;
	var moveStarted=false;
	var move = function() {
   		 var elem = document.getElementById("myBar"); 
   		 var width = 1;
   		 var id = setInterval(frame, 10);
    		function frame() {
        		if (width >= 100 || stopped) {
            			clearInterval(id);
				elem.style.width="1%";
        		} else {
           		 	width++; 
        		        elem.style.width = width + '%'; 
        		}
    		}
		
	}
	function CI(){
	
			clearInterval(id);
			stopped=true;
	

	}
	var element;

	var currTime;
	function holdBegin(event){
//		console.log("holdbegin",JSON.stringify(event));
   		event.preventDefault();
		currTime=Date.now();

	    	//var touch = event.touches[0];
		if(loaded){
			mediaRecorder.start();
			mediaRecorder2.start();
			event.preventDefault();
			console.log(JSON.stringify(event));
			if(!replaying){
				stopped=false;// only if x'd after video record
			}
			move();
			moveStarted=true;
    		//	var touch = event.touches[0];
 	  		
		}//element = document.elementFromPoint(touch.pageX,touch.pageY);
	}

	document.addEventListener('touchstart',holdBegin, false);
	document.addEventListener('mousedown',holdBegin, false);

	function holdEnd(event){
		event.preventDefault();
		console.log("holdend",JSON.stringify(event),Date.now()-currTime,loaded);
		if (loaded) {
			mediaRecorder.stop();	
			mediaRecorder2.stop();
			if(Date.now()-currTime>3000){
				console.log("would upload here");
				CI();
				replaying=true;
				function rereplay(){
					setTimeout(function(){
						//console.log("stopped",media1Stopped,media2Stopped);
						if(media1Stopped && media2Stopped){
							replay();
						}else rereplay();
					},100);
				}
				rereplay();
				// is inside mediaRecorder2 now 
				
			}else{
				currTime=Date.now();
				console.warn("Video must be at least 3 seconds to upload");
				CI(); 
			}
    		}
	}
	document.addEventListener('touchmove',holdEnd,false);
	document.addEventListener('mouseup',holdEnd,false);

/*
	 var header=document.createElement('header');
	    header.setAttribute('style', 'background-color: #f3e5f5;  padding: 20px; top 0; ');
		header.innerHtml="Replying to.. 'What did the fox say?'";
	 var footer=document.createElement('footer');
	    footer.setAttribute('style', 'background-color: #f3e5f5;  padding: 20px; bottom 0; ');

	var link1 = document.createElement("a");
	link1.href="https://testface.projectoblio.com:4443/demos"
	link1.innerHtml="All filters";
	link1.setAttribute('style','left 0;');
	var link2 = document.createElement("a");
	link2.href="https://testface.projectoblio.com:4443/demos"
	link2.innerHtml="Some other link";
	link2.setAttribute('style','right 0;');
	footer.appendChild(link1);
	footer.appendChild(link2);
	//document.body.insertBefore(footer,document.body.firstChild);
	document.body.insertBefore(header,document.body.firstChild);
*/
});

document.addEventListener("DOMContentLoaded", function(event) { 
/*    var githubRibbon=document.createElement('a');
    githubRibbon.setAttribute('href', 'https://github.com/jeeliz/jeelizFaceFilter');
    var githubRibbonImage=document.createElement('img');
    githubRibbonImage.setAttribute('src', ' https://camo.githubusercontent.com/82b228a3648bf44fc1163ef44c62fcc60081495e/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f6c6566745f7265645f6161303030302e706e67');
    githubRibbonImage.setAttribute('alt', 'Fork me on GitHub');
    githubRibbonImage.setAttribute('data-canonical-src', 'https://s3.amazonaws.com/github/ribbons/forkme_left_red_aa0000.png');
    githubRibbon.appendChild(githubRibbonImage);

    document.body.appendChild(githubRibbon);
*/
//var script = document.createElement('script');
//script.type = 'text/javascript';
//script.src = 'https://cdn.webrtc-experiment.com/MediaStreamRecorder.js';
//document.head.appendChild(script);
	
	console.log("dom content loaded");
	var stream = document.getElementById("jeeFaceFilterCanvas").captureStream(25);
	mediaRecorder = new MediaRecorder(stream);
	var chunks = [];
	mediaRecorder.ondataavailable=function(e){
		chunks.push(e.data)
	}
	
	mediaRecorder.onstop=function(e){
		var blob = new Blob(chunks, { 'type' : 'video/mp4' });
	 	 chunks = [];
 	 	videoURL = window.URL.createObjectURL(blob);
		console.log("heres the file url",videoURL);
		var link = document.createElement("a"); // Or maybe get it from the current document
		link.href = videoURL;
		link.download = "aDefaultFileName.mp4";
		link.innerHTML = "FILE FROM CANVAS";	
		link.setAttribute('style', 'position: absolute; top: 250; left: 0; border: 0; z-index: 1000');
		document.body.appendChild(link); 
		media1Stopped=true;
		
	} // end of media record stop
	
	function onMediaError(e){
		console.log('media error',e);
	}
	var chunks2;
	var link2;
	function onMediaSuccess(stream){
		console.log("media success");
		mediaRecorder2 = new MediaRecorder(stream);
		//mediaRecorder2.start();
		chunks2 = [];
		mediaRecorder2.ondataavailable=function(e){
			chunks.push(e.data)
		}
		mediaRecorder2.onstop=function(e){
			var blob = new Blob(chunks2, { 'type' : 'video/mp4' });
	 		 chunks2 = [];
 	 		audioURL = window.URL.createObjectURL(blob);
			console.log("heres the file url",audioURL);
			link2 = document.createElement("a"); // Or maybe get it from the current document
			link2.href = audioURL;
			link2.download = "aDefaultFileName.mp4";
			link2.innerHTML = "FILE FROM WEBCAM";
   			 link2.setAttribute('style', 'position: absolute; top: 300; left: 300; border: 0; z-index: 1000');
			document.body.appendChild(link2); 
			media2Stopped=true;
		} // end of media record stop
	
	// Create a second file stream too. for raw data
	}
	navigator.mediaDevices.getUserMedia({"video":true,"audio":true}).then(onMediaSuccess).catch(onMediaError);

	loaded=true;
});
