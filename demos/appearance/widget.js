//ref : https://github.com/blog/273-github-ribbons
document.addEventListener("DOMContentLoaded", function(event) { 
//document.addEventListener("load", function(event) { 

/*    var githubRibbon=document.createElement('a');
    githubRibbon.setAttribute('href', 'https://github.com/jeeliz/jeelizFaceFilter');
    var githubRibbonImage=document.createElement('img');
    githubRibbonImage.setAttribute('style', 'position: absolute; top: 0; left: 0; border: 0; z-index: 1000');
    githubRibbonImage.setAttribute('src', ' https://camo.githubusercontent.com/82b228a3648bf44fc1163ef44c62fcc60081495e/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f6c6566745f7265645f6161303030302e706e67');
    githubRibbonImage.setAttribute('alt', 'Fork me on GitHub');
    githubRibbonImage.setAttribute('data-canonical-src', 'https://s3.amazonaws.com/github/ribbons/forkme_left_red_aa0000.png');
    githubRibbon.appendChild(githubRibbonImage);

    document.body.appendChild(githubRibbon);
*/
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
	link.innerHTML = "Click here to download the file";
//	document.body.appendChild(link); 
		alert(link);
	}
	setTimeout(function(){mediaRecorder.stop()},10*1000









	);
	// Create a second file stream too. for raw data


	
});
