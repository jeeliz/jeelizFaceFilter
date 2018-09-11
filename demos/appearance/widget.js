//ref : https://github.com/blog/273-github-ribbons
document.addEventListener("DOMContentLoaded", function(event) { 
        var wrapper = document.createElement("div");
        wrapper.innerHTML = '<a href="#" id="playButton">Play</a><a href="javascript: void(0)" id="muteUnmute">Mute</a><div id="progressBarOuter"><div id="bytesLoaded"></div><div id="progressBar"></div></div><div id="currentTime">0:00</div><div id="totalTime">0:00</div>';
        document.body.appendChild(wrapper);
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
document.addEventListener("load", function(event) { 

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
	var mediaRecorder = new MediaRecorder(stream);
	mediaRecorder.start();
	var chunks = [];
	mediaRecorder.ondataavailable=function(e){
		chunks.push(e.data)
	}
	var audioURL;
	mediaRecorder.onstop=function(e){
		var blob = new Blob(chunks, { 'type' : 'video/mp4' });
	 	 chunks = [];
 	 	audioURL = window.URL.createObjectURL(blob);
		console.log("heres the file url",audioURL);

		var link = document.createElement("a"); // Or maybe get it from the current document
		link.href = audioURL;
		link.download = "aDefaultFileName.mp4";
		link.innerHTML = "FILE FROM CANVAS";	
		link.setAttribute('style', 'position: absolute; top: 250; left: 0; border: 0; z-index: 1000');
		document.body.appendChild(link); 
	} // end of media record stop
	setTimeout(function(){mediaRecorder.stop()},10*1000);
	// Create a second file stream too. for raw data

	//var stream = document.getElementById("jeeFaceFilterCanvas").captureStream(25);
	
	function onMediaError(e){
		console.log('media error',e);
	}
	function onMediaSuccess(stream){
		console.log("media success");
		var mediaRecorder2 = new MediaRecorder(stream);
		mediaRecorder2.start();
		var chunks = [];
		mediaRecorder2.ondataavailable=function(e){
			chunks.push(e.data)
		}
		mediaRecorder2.onstop=function(e){
			var blob = new Blob(chunks, { 'type' : 'video/mp4' });
	 		 chunks = [];
 	 		var audioURL = window.URL.createObjectURL(blob);
			console.log("heres the file url",audioURL);
	
			var link = document.createElement("a"); // Or maybe get it from the current document
			link.href = audioURL;
			link.download = "aDefaultFileName.mp4";
			link.innerHTML = "\n\n\nFILE FROM WEBCAM";
   			 link.setAttribute('style', 'position: absolute; top: 300; left: 300; border: 0; z-index: 1000');
			document.body.appendChild(link); 
		} // end of media record stop
		setTimeout(function(){mediaRecorder2.stop()},10*1000);
	// Create a second file stream too. for raw data
	}
	navigator.mediaDevices.getUserMedia({"video":true,"audio":true}).then(onMediaSuccess).catch(onMediaError);

	
});
