# Jeeliz Face Filter: Build your own augmented reality web application

This javascript library detects and tracks the face in real time from the video stream of the webcam captured with WebRTC. Then it is possible to overlay 3D content for augmented reality application. We provide various demonstrations using main WebGL 3D engines. We always include the production version of the 3D engine in the repository to work with a fixed version.

This library is lightweight and it does not include any 3D engine or third party library. We want to keep it framework agnostic so the outputs of the library are raw : if the a face is detected or not, the position and the scale of the detected face and the rotation Euler angles. But thanks to the featured examples and boilerplates, you can quickly use it in a more usable context (for motion head tracking, for face filter or face replacement...). We continuously add new demontrations, so stay tuned ! Also, feel free to open an issue if you have any question or suggestion.   


![facefilter demo jeeliz small](https://user-images.githubusercontent.com/11960872/37533324-cfa3e516-2941-11e8-99a9-96a1e20c80a3.jpg)

You can test it with these demos (included in this repo) :
* BABYLON.JS based demos :
  * [Boilerplate (displays a cube on the user's head)](https://jeeliz.com/demos/faceFilter/demos/babylonjs/cube/)

* THREE.JS based demos :
  * [Boilerplate (displays a cube on the user's head)](https://jeeliz.com/demos/faceFilter/demos/threejs/cube/)
  * [Anonymous mask and video effect](https://jeeliz.com/demos/faceFilter/demos/threejs/anonymous/)
  * [Dog-Face filter](https://jeeliz.com/demos/faceFilter/demos/threejs/dog_face/)
  * [Butterflies animation](https://jeeliz.com/demos/faceFilter/demos/threejs/butterflies/)
  * [Clouds above the head](https://jeeliz.com/demos/faceFilter/demos/threejs/cloud/)
  * [Casa-de-Papel mask](https://jeeliz.com/demos/faceFilter/demos/threejs/casa_de_papel/)
  * [Miel Pops glasses and bees](https://jeeliz.com/demos/faceFilter/demos/threejs/miel_pops/)
  * [Football-fan Makeup](https://jeeliz.com/demos/faceFilter/demos/threejs/football_makeup/)
  * [Face deformation](https://jeeliz.com/demos/faceFilter/demos/threejs/faceDeform/)
  * [Face cel shading](https://jeeliz.com/demos/faceFilter/demos/threejs/celFace/)
  * [Head controlled navigation](https://jeeliz.com/demos/faceFilter/demos/threejs/headControls/)
  * [Tiger face filter with mouth opening detection (strong WTF effect)](https://jeeliz.com/demos/faceFilter/demos/threejs/tiger/)
  * [Fireworks - particules](https://jeeliz.com/demos/faceFilter/demos/threejs/fireworks/)
  * [Luffy's Hat](https://jeeliz.com/demos/faceFilter/demos/threejs/luffys_hat_part2/)
  * [GLTF fullscreen demo with HD video](https://jeeliz.com/demos/faceFilter/demos/threejs/gltf_fullScreen/)


* A-FRAME based demos :
  * [Boilerplate (displays a cube on the user's head)](https://jeeliz.com/demos/faceFilter/demos/aFrame/cube/)
  
* CSS3D based demos :
  * [Boilerplate (displays a `<DIV>` element on the user's head)](https://jeeliz.com/demos/faceFilter/demos/CSS3D/div/)
  * [Comedy glasses demo](https://jeeliz.com/demos/faceFilter/demos/CSS3D/comedy-glasses/)

* Canvas2D based demos :
  * [Draw on the face with the mouse](https://jeeliz.com/demos/faceFilter/demos/canvas2D/faceDraw/)

* CESIUM.JS based demos :
  * [3D view of the Earth with head controlled navigation](https://jeeliz.com/demos/faceFilter/demos/cesium/headControls/)

* MISC demos :
  * [PACMAN game with head controlled navigation](https://jeeliz.com/demos/faceFilter/demos/pacman/)
  * [Insert your face into portrait art painting or film posters](https://jeeliz.com/demos/faceFilter/demos/faceReplacement/)


[comment]:![giphy-downsized-large](https://user-images.githubusercontent.com/11960872/37475622-6a602cf6-2873-11e8-83f0-134b6c1ba666.gif)

If you have not bought a webcam yet, a screenshot video of some of these examples is available [on Youtube](https://youtu.be/jQkaJoMGinQ). You can also subscribe to the [Jeeliz Youtube channel](https://www.youtube.com/channel/UC3XmXH1T3d1XFyOhrRiiUeA) or to the [@StartupJeeliz Twitter account](https://twitter.com/StartupJeeliz) to be kept informed of our cutting edge developments.


## Integration
On your HTML page, you first need to include the main script between the tags `<head>` and `</head>` :
```html
 <script type="text/javascript" src="dist/jeelizFaceFilter.js"></script>
```
Then you should include a `CANVAS` HTML element in the DOM, between the tags `<body>` and `</body>`. The `width` and `height` properties of the canvas element should be set. They define the resolution of the canvas and the final rendering will be computed using this resolution. Be careful to not enlarge too much the canvas size using its CSS properties without increasing its resolution, otherwise it may look blurry or pixelated. We advise to fix the resolution to the actual canvas size. Do not forget to call `JEEFACEFILTERAPI.resize()` if you resize the canvas after the initialization step.
```html
<canvas width="600" height="600" id='jeeFaceFilterCanvas'></canvas>
```
This canvas will be used by WebGL both for the computation and the 3D rendering. When your page is loaded you should launch this function :
```javascript
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
});//end init call
```

## Optionnal `init()` arguments :
* `<integer> animateDelay` : It is used only in normal rendering mode (not in slow rendering mode). With this statement you can set accurately the number of milliseconds during which the browser wait at the end of the rendering loop before starting another detection. If you use the canvas of this API as a secondary element (for example in *PACMAN* or *EARTH NAVIGATION* demos) you should set a small `animateDelay` value (for example 2 milliseconds) in order to avoid rendering lags.
* `<function> onWebcamAsk` : Function launched just before asking for the user to allow its webcam sharing,
* `<function> onWebcamGet` : Function launched just after the user has accepted to share its video. It is called with the video element as argument,
* `<dict> videoSetting` : override WebRTC specified video settings, which are by default :
```javascript
{
  'idealWidth': 800,  //ideal video width in pixels
  'idealHeight': 600, //ideal video height in pixels
  'minWidth': 800,    //min video width in pixels
  'maxWidth': 1280,   //max video width in pixels
  'minHeight': 600,   //min video height in pixels
  'maxHeight': 1280   //max video height in pixels
}
```
If the user has a mobile device in portrait display, we invert the width and height of these parameters for the first camera request. If it does not succeed, we revert the width and height.


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
* `expressions` : `Float32Array` listing the facial expression coefficients :
    * `expressions[0]` : mouth opening coefficient (0 -> mouth closed, 1 -> mouth fully opened)


## Other methods
After the initialization (ie after that `callbackReady` is launched ) , these methods are available :

* `JEEFACEFILTERAPI.resize()` : should be called after resizing the canvas,

* `JEEFACEFILTERAPI.toggle_pause(<boolean> isPause)` : pause/resume,

* `JEEFACEFILTERAPI.toggle_slow(<boolean> isSlow)` : toggle the slow rendering mode : because this API consumes a lot of GPU resources, it may slow down other elements of the application. If the user opens a CSS menu for example, the CSS transitions and the DOM update can be slow. With this function you can slow down the rendering in order to relief the GPU. The tracking will also be slower unfortunately. We encourage to enable the slow mode as soon as a the user's attention is focused on a part other than the canvas,

* `JEEFACEFILTERAPI.set_animateDelay(<integer> delay)` : Change the `animateDelay` (see `init()` arguments),

* `set_inputTexture(<WebGLTexture> tex, <integer> width, <integer> height)` : Change the video input by a WebGL Texture instance. The dimensions of the texture, in pixels, should be provided,

* `reset_inputTexture()` : Come back to the user's video as input texture.


## Integration sample
In the path `/demos`, you will find an integration sample. Just serve it through a HTTPS server.


## Changing the 3D Engine
It is possible to use another 3D engine than BABYLON.JS or THREE.JS. If you did this work, we would be interested to add your demonstration in this repository (or link to your code). We may add Babylon.js and Pixi.js boilerplates later.

It is important that the 3D engine shares the same WebGL context. The WebGL context is created by Jeeliz Face Filter. The background video texture is given directly as a `WebGLTexture` object, so it is usable only on the Jeeliz Face Filter WebGL context. It would be more costly to have a second WebGL context for the 3D rendering, because at each new video frame we should transfert the video data from the `<video>` element to the 2 webgl contexts : the Jeeliz Face Filter WebGL context for processing, and the 3D engine WebGL Context. Fortunately, with BABYLON.JS or THREE.JS, it is easy to specify an already initalized WebGL context.


## Hosting
### HTTPS only !
Because this API requires the user's webcam stream through `MediaStream API`, your application should be served through HTTPS (even with a self-signed certificate). It won't work at all with unsecure HTTP, even locally.


## Development
We provide a simple and minimalist HTTPS server in order to check out the demos or develop your very own filters. To launch it, execute in the console :

```bash
  python2 httpsServer.py
```
then visit [https://localhost:4443](https://localhost:4443).


### The scripts
You can use our hosted and up to date version of the library, available here :
```
https://appstatic.jeeliz.com/faceFilter/jeelizFaceFilter.js
```
It is served through a content delivery network (CDN) using gzip compression.
If you host the scripts by yourself, be careful to enable gzip HTTP/HTTPS compression for JSON and JS files. Indeed, the neuron network JSON file, `dist/NNC.json` is quite heavy, but very well compressed with GZIP. You can check the gzip compression of your server [here](https://checkgzipcompression.com/).

The neuron network file, `dist/NNC.json` is loaded using an ajax `XMLHttpRequest` after calling `JEEFACEFILTER.init()` method and after the user has accepted the sharing of its webcam. We proceed this way to avoid to load this quite heavy file if the user refuses to share its webcam or if there is no webcam available. The loading will be faster if you systematically preload `dist/NNC.json` using a service worker or a simple raw `XMLHttpRequest` just after the HTML page loading. Then the file will be already in the browser cache when Jeeliz Facefilter API will need it.


## About the tech
### Under the hood
This API uses Jeeliz WebGL Deep Learning technology to detect and track the user's face using a deep learning network. The accuracy is adaptative : the better the hardware, the more detections are processed per second. All is done client-side.

### Compatibility
* If WebGL2 is available, it uses WebGL2 and no specific extension is required,
* If WebGL2 is not available but WebGL1, we require either `OES_TEXTURE_FLOAT` extension or `OES_TEXTURE_HALF_FLOAT` extension,
* If WebGL2 is not available, and if WebGL1 is not available or neither `OES_TEXTURE_FLOAT` or `OES_HALF_TEXTURE_FLOAT` are implemented, the user is not compatible.
If you meet a compatibility error, please post an issue on this repository. If this is a problem with the webcam access, please first retry after closing all the application which could use your device (Skype, Messenger, other browser windows, ...). Please include :
* a screenshot of [webglreport.com - WebGL1](http://webglreport.com/?v=1) (about your WebGL1 implementation),
* a screenshot of [webglreport.com - WebGL2](http://webglreport.com/?v=2) (about your WebGL2 implementation),
* the log from the web console,
* the steps to reproduce the bug, and screenshots.


## Articles
We are currently writing a series of tutorial for the API, starting by building some very basic filters and moving to harder ones.
### Part 1: Creating your first filter
  * on [Medium](https://medium.com/@StartupJeeliz/creating-a-snapchat-like-filter-with-jeelizs-facefilter-api-part-1-creating-your-first-filter-1e7a5000543c)
  * on [our website](https://jeeliz.com/blog/creating-a-snapchat-like-filter-with-jeelizs-facefilter-api-part-1-creating-your-first-filter/)


## License
[Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html). This application is free for both commercial and non-commercial use.

We appreciate attribution by including the Jeeliz logo and link to the [Jeeliz website](https://jeeliz.com) in your application.


## References
* [Jeeliz official website](https://jeeliz.com)
* [Babylon.JS official website with documentation, demos, examples...](https://www.babylonjs.com/)
* [Three.JS official website with documentation, demos, examples...](https://threejs.org/)
* [Cesium JS official website](https://cesiumjs.org/)
* [A-Frame official website](https://aframe.io/)
* [Webgl Academy : tutorials about WebGL and THREE.JS](http://www.webglacademy.com)

