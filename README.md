# jeelizFaceFilter

This API allow you to detect and track the face in real time from a video stream, and to overlay 3D content for augmented reality application. We provide some demonstration using THREE.js 3D engine. Thanks to *Jeeliz Face Filter*, you can build your own augmented reality web application.

You can test it with these demos (included in this repo) :
* [Boilerplate (display a cube on the user's head)](https://jeeliz.com/demos/faceFilter/demos/threejs/cube/)
* [Face deformation](https://jeeliz.com/demos/faceFilter/demos/threejs/faceDeform/)
* [Face cel shading](https://jeeliz.com/demos/faceFilter/demos/threejs/celFace/)


## Integration
On your HTML page, you first need to include the main script between the tags `<head>` and `</head>` :
```
 <script type="text/javascript" src="dist/jeelizFaceFilter.js"></script>
```
Then you should include a `CANVAS` HTML element in the DOM, between the tags `<body>` and `</body>`. The `width` and `height` properties of the canvas element should be set :
```
<canvas width="600" height="600" id='jeeFaceFilterCanvas'></canvas>
```
This canvas will be used by WebGL both for the computation and the 3D rendering. When your page is loaded you should launch this function :
```
JEEFACEFILTERAPI.init({
    canvasId: 'jeeFaceFilterCanvas',
    NNCpath: '../../../dist/', //root of NNC.json file
    callbackReady: function(errCode, spec){
        if (errCode){
            console.log('AN ERROR HAPPENS. ERROR CODE =', errCode);
            return;
        }
        [init scene with spec...]
        console.log('INFO : JEEFACEFILTERAPI IS READY');
    }, //end callbackReady()

    //called at each render iteration (drawing loop)
    callbackTrack: function(detectState){
        //render your scene here
        [... do something with detectState]
    } //end callbackTrack()
```

## Error codes
The initialization function ( `callbackReady` in the code snippet ) will be called with an error code ( `errCode` ). It can have these values :
* `false` : no error occurs,
* `"GL_INCOMPATIBLE"` : WebGL is not available, or this WebGL configuration is not enough (there is no WebGL2, or there is WebGL1 without OES_TEXTURE_FLOAT or OES_TEXTURE_HALF_FLOAT extension),
* `"ALREADY_INITIALIZED"` : the API has been already initialized,
* `"NO_CANVASID"` : no canvas ID was specified,
* `"INVALID_CANVASID"` : cannot found the \<canvas\> element in the DOM,
* `"INVALID_CANVASDIMENSIONS"` : the dimensions `width` and `height` of the canvas are not specified,
* `"WEBCAM_UNAVAILABLE"` : cannot get access to the webcam (the user has no webcam, or it has not accepted to share the device, or the webcam is already busy),
* `"GLCONTEXT_LOST"` : The WebGL context was lost. If the context is lost after the initialization, the `callbackReady` function will be launched a second time with this value as error code.


## Initialization object
The initialization callback function ( `callbackReady` in the code snippet ) is called with a second argument, `spec`, if there is no error. `spec` is a dictionnary with these properties :
* `GL` : the WebGL context. The rendering 3D engine should use this WebGL context,
* `canvasElement` the \<canvas\> element,
* `videoTexture` a WebGL texture displaying the webcam video. It matches the dimensions of the canvas. It can be used as a background.


## The detection state
At each render iteration a callback function is called ( `callbackTrack` in the code snippet ). It has one argument ( `detectState` ) which is a dictionnary with these properties :
* `detected` : the face detection probability, between 0 and 1,
* `x`, `y` : The 2D coordinates of the center of the detection frame in the viewport (each between -1 and 1, `x` from left to right and `y` from bottom to top),
* `s` : the scale along the horizontal axis of the detection frame, between 0 and 1 (1 for the full width). The detection frame is always square,
* `rx`, `ry`, `rz` : the Euler angles of the head rotation in radians.


## Other methods
After the initialization (ie after that `callbackReady` is launched ) , these methods are available :

* `JEEFACEFILTERAPI.resize()` : should be called after resizing the canvas,

* `JEEFACEFILTERAPI.toggle_pause(<boolean> isPause)` : pause/resume,

* `JEEFACEFILTERAPI.toggle_slow(<boolean> isSlow)` : toggle the slow rendering mode : because this API consumes a lot of GPU resources, it may slow down other elements of the application. If the user opens a CSS menu for example, the CSS transitions and the DOM update can be slow. With this function you can slow down the rendering in order to relief the GPU. The tracking will also be slower unfortunately. We encourage to enable the slow mode as soon as a the user's attention is focused on a part other than the canvas.


## Integration sample
In the path `/demos`, you will find an integration sample. Just serve it through a HTTPS server.


## Changing the 3D Engine
It is possible to use another 3D engine than THREE.JS. If you did this work, we would be interested to add your demonstration in this repository (or link to your code). We may add Babylon.js and Pixi.js boilerplates later.

It is important that the 3D engine shares the same WebGL context. The WebGL context is created by Jeeliz Face Filter. The background video texture is given directly as a `WebGLTexture` object, so it is usable only on the Jeeliz Face Filter WebGL context. It would be more costly to have a second WebGL context for the 3D rendering, because at each new video frame we should transfert the video data from the `<video>` element to the 2 webgl contexts : the Jeeliz Face Filter WebGL context for processing, and the 3D engine WebGL Context. Fortunately, with THREE.JS, it is easy to specify an already initalized WebGL context.


## Hosting
### HTTPS only !
Because this API requires the user's webcam stream through `MediaStream API`, your application should be served through HTTPS (even with a self-signed certificate). It won't work at all with unsecure HTTP, even locally.


### The scripts
You can use our hosted and up to date version of the library, available here :
```
https://appstatic.jeeliz.com/faceFilter/jeelizFaceFilter.js
```
It is served through a content delivery network (CDN) using gzip compression.
If you host the scripts by yourself, be careful to enable gzip HTTP/HTTPS compression for JSON and JS files. Indeed, the neuron network JSON file, `dist/NNC.json` is quite heavy, but very well compressed with GZIP. You can check the gzip compression of your server [here](https://checkgzipcompression.com/).


## About the tech
This API uses Jeeliz WebGL Deep Learning technology to detect and track the user's face using a deep learning network. The accuracy is adaptative : the better the hardware, the more detection are processed per second. All is done client-side.


## License
[Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html). This application is free for both commercial and non-commercial use.

We appreciate attribution by including the Jeeliz logo and link to the [Jeeliz website](https://jeeliz.com) in your application.


## References
* [Jeeliz official website](https://jeeliz.com)
* [Three.JS official website with documentation, demos, examples...](https://threejs.org/)
* [Webgl Academy : tutorials about WebGL and THREE.JS](http://www.webglacademy.com)

