# JavaScript/WebGL lightweight and robust face tracking library designed for augmented reality face filters


This JavaScript library detects and tracks the face in real time from the webcam video feed captured with WebRTC. Then it is possible to overlay 3D content for augmented reality applications. We provide various demonstrations using main WebGL 3D engines. We have included in this repository the release versions of the 3D engines to work with a determined version (they are in `/libs/<name of the engine>/`).

This library is lightweight and it does not include any 3D engine or third party library. We want to keep it framework agnostic so the outputs of the library are raw: if the a face is detected or not, the position and the scale of the detected face and the rotation Euler angles. But thanks to the featured helpers, examples and boilerplates, you can quickly deal with a higher level context (for motion head tracking, for face filter or face replacement...). We continuously add new demontrations, so stay tuned ! Also, feel free to open an issue if you have any question or suggestion.


## Table of contents

* [Features](#features)
* [Architecture](#architecture)
* [Demonstrations](#demonstrations)
  * [Included in this repository](#included-in-this-repository)
  * [Third party](#third-party)
* [Specifications](#specifications)
  * [Get started](#get-started)
  * [Optionnal init arguments](#optionnal-init-arguments)
  * [Error codes](#error-codes)
  * [The returned objects](#the-returned-objects)
  * [Miscellaneous methods](#miscellaneous-methods)
  * [Multiple faces](#multiple-faces)
  * [Optimization](#optimization)
  * [Changing the 3D engine](#changing-the-3d-engine)
  * [Changing the neural network](#changing-the-neural-network)
  * [Using the ES6 module](#using-the-es6-module)
* [Integration](#integration)
  * [With a bundler](#with-a-bundler)
  * [With JavaScript frontend frameworks](#with-javascript-frontend-frameworks)
  * [Native](#native)
* [Hosting](#hosting)
  * [The development server](#the-development-server)  
  * [Hosting optimization](#hosting-optimization)
* [About the tech](#about-the-tech)
  * [Under the hood](#under-the-hood)
  * [Compatibility](#compatibility)
* [Articles and tutorials](#articles-and-tutorials)
* [Jeeliz Partner Network](#jeeliz-partner-network)
* [See also](#see-also)
* [License](#license)
* [References](#references)


<p align="center">
  <img src='https://user-images.githubusercontent.com/11960872/37533324-cfa3e516-2941-11e8-99a9-96a1e20c80a3.jpg' />
</p>


## Features

Here are the main features of the library:

* face detection,
* face tracking,
* face rotation detection,
* mouth opening detection,
* multiple faces detection and tracking,
* very robust for all lighting conditions,
* video acquisition with HD video ability,
* mobile friendly,
* interfaced with 3D engines like THREE.JS, BABYLON.JS, A-FRAME,
* interfaced with more accessible APIs like CANVAS, CSS3D.


## Architecture

* `/demos/`: source code of the demonstrations, sorted by 2D/3D engine used,
* `/dist/`: heart of the library: 
  * `jeelizFaceFilter.js`: main minified script,
  * `jeelizFaceFilterES6.js`: main minified script for ES6 use (with `import` or `require`),
  * `NNC.json`: file storing the neural network parameters, loaded by the main script,
  * `NNC<xxx>.json`: alternative neural network models,
* `/helpers/`: scripts which can help you to use this library in some specific use cases,
* `/libs/`: 3rd party libraries and 3D engines used in the demos.



## Demonstrations

### Included in this repository

These demonstration are included in this repository. So they are released under the [FaceFilter licence](#license). You will probably find among them the perfect starting point to build your own face based augmented reality application:

* BABYLON.JS based demos:
  * Boilerplate (displays a cube on the user's head): [live demo](https://jeeliz.com/demos/faceFilter/demos/babylonjs/cube/), [source code](/demos/babylonjs/cube/)

* THREE.JS based demos - [specific README about THREE.js based demo problems](demos/threejs/):
  * Boilerplates:
    * Boilerplate (displays a cube on the user's head): [live demo](https://jeeliz.com/demos/faceFilter/demos/threejs/cube/), [source code](/demos/threejs/cube/)
    * Same boilerplate but using `dist/NNClight.json` as neural net: [live demo](https://jeeliz.com/demos/faceFilter/demos/threejs/cubeNNClight/), [source code](/demos/threejs/cubeNNClight/)
    * Same boilerplate but using `dist/NNCwideAngles.json` as neural net: [live demo](https://jeeliz.com/demos/faceFilter/demos/threejs/cubeNNCwideAngles/), [source code](/demos/threejs/cubeNNCwideAngles/)
    * Boilerplate with ES6 instead of ES5: [live demo](https://jeeliz.com/demos/faceFilter/demos/threejs/cubeES6/), [source code](/demos/threejs/cubeES6/)
    * Multiple face tracking: [live demo](https://jeeliz.com/demos/faceFilter/demos/threejs/multiCubes/), [source code](/demos/threejs/multiCubes/)
    * GLTF fullscreen demo with HD video: [live demo](https://jeeliz.com/demos/faceFilter/demos/threejs/gltf_fullScreen/), [source code](/demos/threejs/gltf_fullScreen/)
    * Boilerplate with 2 canvas: 1 for FaceFilter and 1 for THREE.JS (not recommended): [live demo](https://jeeliz.com/demos/faceFilter/demos/threejs/cube2cv/), [source code](/demos/threejs/cube2cv/)
    
  
  * AR 3D demos:
    * Daft Punk (put the iconic helmet): [live demo](https://jeeliz.com/demos/faceFilter/demos/threejs/daft_punk/)
    * Star Wars: Darth Vader: [live demo](https://jeeliz.com/demos/faceFilter/demos/threejs/star_wars/)
    * Harry Potter (say "Lumos!"): [live demo](https://jeeliz.com/demos/faceFilter/demos/threejs/harry_potter/)
    * Halloween Spiders (you've got a spider in your mouth): [live demo](https://jeeliz.com/demos/faceFilter/demos/threejs/halloween_spider/), [source code](/demos/threejs/halloween_spiders)
    * Werewolf (turn yourself into a werewolf): [live demo](https://jeeliz.com/demos/faceFilter/demos/threejs/werewolf/), [source code](/demos/threejs/werewolf)
    * Angel/Demon (discover who of the angel or demon will win in this animated scene): [live demo](https://jeeliz.com/demos/faceFilter/demos/threejs/angel_demon/), [source code](/demos/threejs/angel_demon)
    * Anonymous mask and video effect: [live demo](https://jeeliz.com/demos/faceFilter/demos/threejs/anonymous/), [source code](/demos/threejs/anonymous)
    * Rupy Motorcycle Helmet VTO: [live demo](https://jeeliz.com/demos/faceFilter/demos/threejs/rupy_helmet/), [source code](/demos/threejs/rupy_helmet)
    * Dog: [live demo](https://jeeliz.com/demos/faceFilter/demos/threejs/dog_face/), [source code](/demos/threejs/dog_face)
    * Butterflies animation: [live demo](https://jeeliz.com/demos/faceFilter/demos/threejs/butterflies/), [source code](/demos/threejs/butterflies/)
    * Clouds above the head: [live demo](https://jeeliz.com/demos/faceFilter/demos/threejs/cloud/), [source code](/demos/threejs/cloud/)
    * Casa-de-Papel mask: [live demo](https://jeeliz.com/demos/faceFilter/demos/threejs/casa_de_papel/), [source code](/demos/threejs/casa_de_papel/)
    * Miel Pops glasses and bees: [live demo](https://jeeliz.com/demos/faceFilter/demos/threejs/miel_pops/), [source code](/demos/threejs/miel_pops/)
    * Football makeup: [live demo](https://jeeliz.com/demos/faceFilter/demos/threejs/football_makeup/), [source code](/demos/threejs/football_makeup/)
    * Tiger face filter with mouth opening detection (strong WTF effect): [live demo](https://jeeliz.com/demos/faceFilter/demos/threejs/tiger/), [source code](/demos/threejs/tiger/)
    * Fireworks - particules: [live demo](https://jeeliz.com/demos/faceFilter/demos/threejs/fireworks/), [source code](/demos/threejs/fireworks/)
  
  * face painting or deformation:
    * Face deformation: [live demo](https://jeeliz.com/demos/faceFilter/demos/threejs/faceDeform/), [source code](/demos/threejs/faceDeform/)
    * Face cel shading: [live demo](https://jeeliz.com/demos/faceFilter/demos/threejs/celFace/), [source code](/demos/threejs/celFace/)

  * demos linked with tutorials:
    * Luffy's Hat: [live demo](https://jeeliz.com/demos/faceFilter/demos/threejs/luffys_hat_part2/), [source code part 1](/demos/threejs/luffys_hat_part1/), [tutorial part 1](https://jeeliz.com/blog/creating-a-snapchat-like-filter-with-jeelizs-facefilter-api-part-1-creating-your-first-filter/), [source code part 2](/demos/threejs/luffys_hat_part2/), [tutorial part 2](https://jeeliz.com/blog/creating-a-snapchat-like-filter-with-jeelizs-facefilter-api-part-2-user-interactions-and-particles/)
    * Statue Of Liberty: [live demo](https://jeeliz.com/demos/faceFilter/demos/threejs/multiLiberty/), [source code](/demos/threejs/multiLiberty/), [interactive tutorial](https://webglacademy.jeeliz.com/courses.php?courses=19_25_27_33_34#34)
    * Matrix: [live demo](https://jeeliz.com/demos/faceFilter/demos/threejs/matrix/), [source code](/demos/threejs/matrix/), [tutorial in French](https://xavierbourry.developpez.com/filtre-facial-webcam/), [tutorial in English](https://jeeliz.com/blog/tutorial-javascript-webgl-webcam-facial-filter-on-the-theme-of-matrix/)

  * misc:
    * Head controlled navigation: [live demo](https://jeeliz.com/demos/faceFilter/demos/threejs/headControls/), [source code](/demos/threejs/headControls/)
    * Glasses virtual try-on: [live demo](https://jeeliz.com/demos/faceFilter/demos/threejs/VTO/), [source code](/demos/threejs/VTO/)


* A-FRAME based demos:
  * Boilerplate (displays a cube on the user's head): [live demo](https://jeeliz.com/demos/faceFilter/demos/aFrame/cube/), [source code](/demos/aFrame/cube/)
  
* CSS3D based demos:
  * Boilerplate (displays a `<DIV>` element on the user's head): [live demo](https://jeeliz.com/demos/faceFilter/demos/CSS3D/div/), [source code](/demos/CSS3D/div/)
  * Comedy glasses demo: [live demo](https://jeeliz.com/demos/faceFilter/demos/CSS3D/comedy-glasses/), [source code](/demos/CSS3D/comedy-glasses/)

* Canvas2D based demos:
  * Draw on the face with the mouse: [live demo](https://jeeliz.com/demos/faceFilter/demos/canvas2D/faceDraw/), [source code](/demos/canvas2D/faceDraw/)
  * 2D face detection and tracking - 30 lines of code only !: [live demo](https://jeeliz.com/demos/faceFilter/demos/canvas2D/faceTrack/), [source code](/demos/canvas2D/faceTrack/), [JSfiddle](https://jsfiddle.net/jeeliz/2p34hbeh/)
  * 2D face detection and tracking from a video file instead of webcam video: [live demo](https://jeeliz.com/demos/faceFilter/demos/canvas2D/fromVideoFile/), [source code](/demos/canvas2D/fromVideoFile/)

* CESIUM.JS based demos:
  * 3D view of the Earth with head controlled navigation: [live demo](https://jeeliz.com/demos/faceFilter/demos/cesium/headControls/), [source code](/demos/cesium/headControls/), [article about the demo](https://cesium.com/blog/2018/03/22/jeeliz-and-cesium/)

* Face replacement demos:
  * Insert your face into portrait art painting or film posters: [live demo](https://jeeliz.com/demos/faceFilter/demos/faceReplacement/image), [source code](demos/faceReplacement/image/)
  * Insert your face into an animated gif: [live demo](https://jeeliz.com/demos/faceFilter/demos/faceReplacement/gif), [specific README](/demos/faceReplacement/gif/README.md), [source code](demos/faceReplacement/gif/)
  * The traditional faceSwap, fullscreen and with color correction: [live demo](https://jeeliz.com/demos/faceFilter/demos/faceReplacement/faceSwap/), [source code](demos/faceReplacement/faceSwap/)

* Head motion control:
  * PACMAN game with head controlled navigation: [live demo](https://jeeliz.com/demos/faceFilter/demos/pacman/), [source code](demos/pacman/)
  * Head controlled mouse cursor: [live demo](https://jeeliz.com/demos/faceFilter/demos/headCursor/), [source code](demos/headCursor/)



[comment]:![giphy-downsized-large](https://user-images.githubusercontent.com/11960872/37475622-6a602cf6-2873-11e8-83f0-134b6c1ba666.gif)

If you have not bought a webcam yet, a screenshot video of some of these examples is available [on Youtube](https://youtu.be/jQkaJoMGinQ). You can also subscribe to the [Jeeliz Youtube channel](https://www.youtube.com/channel/UC3XmXH1T3d1XFyOhrRiiUeA) or to the [@StartupJeeliz Twitter account](https://twitter.com/StartupJeeliz) to be kept informed of our cutting edge developments.



### Third party
These amazing applications rely on this library for face detection and tracking:

* [SpiderMan Far From Home AR web application](https://spider-manfarfromhome.herokuapp.com/), made by [Ignite](http://ignitexr.com/). This library is used for the first part of the experience (Edith glasses). Then [8th Wall SLAM engine](https://www.8thwall.com/) is used to display the drones.

* Applications made by [Movable Ink](https://movableink.com/):
  * [Creative studio](https://movableink.com/product/augmented_reality?utm_source=linkedin&utm_medium=social&utm_campaign=q2_2019_arcampaign_productpage): easily create face filters without coding, only drag and drops! 
  * [Find your oasis](https://www.movablecamera.com/1/templates/70c57645-dca1-4a50-b312-0ea3d7c537fd/e1e7aa24-34a5-4818-b487-50ca3852754d.html),
  * [Been there, done that](https://www.movablecamera.com/1/templates/d8f2a1b6-0a73-4645-9e2b-7eb3c85ca2e0/109867fc-1ec0-4545-9bbe-6364ab1a3049.html),
  * [I <3 NY](https://www.movablecamera.com/1/templates/3e9a6b04-2663-4e2e-a8f8-0c675cd429fa/bb03f2fe-1ab0-4b4d-bc94-f146eefe8198.html),
  * [Find your inner creative](https://www.movablecamera.com/1/templates/442bcb7c-3793-49e4-bea2-d56e68e73ec3/df7484bc-211d-4f43-adc1-41b13ca39f32.html),
  * [Ski mask demo, with snow](https://www.movablecamera.com/6454/templates/7ed27eff-5978-4e0e-8345-0d53c7e894a2/d0115266-6d57-4d59-8775-1ac22f90eed6.html?mi_app_key=70ebf69e95809bf0&name=&mi_u=%7B%7Blead.SFDC%20Id%7D%7D),

* [Battle Santa for beard superiority](https://xmas.humanfoundry.com/), made by [Sansho](https://sansho.studio/)

* [VRMjidori](https://vrmjidori.netlify.com/): Replace your head by a manga style character provided in .VRM file format. This demo has been developed by [けしごむ/Nono](https://twitter.com/ke4563)

* [Bose headphones virtual try-on](https://www.bose.com/en_us/products/headphones/over_ear_headphones/quietcomfort-35-ii-wireless-custom.html?EarCap=sps-gloss&EarCup=jet-gloss&InnerBand=com-metallic&OuterBand=com-metallic&Spacer=com-metallic) (click on the TRY-ON button at the bottom right of the screen)

* [FaceVoice](https://github.com/CloffWrangler/facevoice): Control the mouse pointer with your head and by saying *Click*. [Discussion on Reddit](https://www.reddit.com/r/badUIbattles/comments/e1npf6/an_app_where_you_control_the_cursor_by_turning/)

* [Halloween masks](https://halloween.tripod-digital.co.nz/): Amazing halloween masks experience made by [Thorsten Bux](https://twitter.com/thor_bux). The code is published on Github here: [ThorstenBux/halloween-masks](https://github.com/ThorstenBux/halloween-masks).


If you have developped an application or a fun demo using this library, we would love to see it and insert a link here! Just contact us on [Twitter @StartupJeeliz](https://twitter.com/StartupJeeliz) or [LinkedIn](https://www.linkedin.com/company/jeeliz).



## Specifications
Here we describe how to use this library. Although we planned to add new features, we will keep it backward compatible.

### Get started
On your HTML page, you first need to include the main script between the tags `<head>` and `</head>`:

```html
 <script src="dist/jeelizFaceFilter.js"></script>
```

Then you should include a `<canvas>` HTML element in the DOM, between the tags `<body>` and `</body>`. The `width` and `height` properties of the `<canvas>` element should be set. They define the resolution of the canvas and the final rendering will be computed using this resolution. Be careful to not enlarge too much the canvas size using its CSS properties without increasing its resolution, otherwise it may look blurry or pixelated. We advise to fix the resolution to the actual canvas size. Do not forget to call `JEEFACEFILTERAPI.resize()` if you resize the canvas after the initialization step. We strongly encourage you to use our helper `/helpers/JeelizResizer.js` to set the width and height of the canvas (see [Optimization/Canvas and video resolutions](#optimization) section).

```html
<canvas width="600" height="600" id='jeeFaceFilterCanvas'></canvas>
```

This canvas will be used by WebGL both for the computation and the 3D rendering. When your page is loaded you should launch this function:
```javascript
JEEFACEFILTERAPI.init({
  canvasId: 'jeeFaceFilterCanvas',
  NNCpath: '../../../dist/', //path to JSON neural network model (NNC.json by default)
  callbackReady: function(errCode, spec){
    if (errCode){
      console.log('AN ERROR HAPPENS. ERROR CODE =', errCode);
      return;
    }
    // [init scene with spec...]
    console.log('INFO: JEEFACEFILTERAPI IS READY');
  }, //end callbackReady()

  //called at each render iteration (drawing loop)
  callbackTrack: function(detectState){
    // Render your scene here
    // [... do something with detectState]
  } //end callbackTrack()
});//end init call
```

### Optionnal init arguments
* `<boolean> followZRot`: Allow full rotation around depth axis. Default value: `false`. See [Issue 42](https://github.com/jeeliz/jeelizFaceFilter/issues/42) for more details,
* `<integer> maxFacesDetected`: Only for multiple face detection - maximum number of faces which can be detected and tracked. Should be between `1` (no multiple detection) and `8`,
* `<integer> animateDelay`: It is used only in normal rendering mode (not in slow rendering mode). With this statement you can set accurately the number of milliseconds during which the browser wait at the end of the rendering loop before starting another detection. If you use the canvas of this API as a secondary element (for example in *PACMAN* or *EARTH NAVIGATION* demos) you should set a small `animateDelay` value (for example 2 milliseconds) in order to avoid rendering lags.
* `<function> onWebcamAsk`: Function launched just before asking for the user to allow its webcam sharing,
* `<function> onWebcamGet`: Function launched just after the user has accepted to share its video. It is called with the video element as argument,
* `<dict> videoSettings`: override WebRTC specified video settings, which are by default:
```javascript
{
  'videoElement' //not set by default. <video> element used
   //If you specify this parameter,
   //all other settings will be useless
   //it means that you fully handle the video aspect

  'deviceId'            //not set by default
  'facingMode': 'user', //to use the rear camera, set to 'environment'

  'idealWidth': 800,  //ideal video width in pixels
  'idealHeight': 600, //ideal video height in pixels
  'minWidth': 480,    //min video width in pixels
  'maxWidth': 1280,   //max video width in pixels
  'minHeight': 480,   //min video height in pixels
  'maxHeight': 1280,  //max video height in pixels,
  'rotate': 0,        //rotation in degrees possible values: 0,90,-90,180
  'flipX': false      //if we should flip horizontally the video. Default: false
},
```
* `<dict> scanSettings`: override face scan settings - see `set_scanSettings(...)` method for more information.
* `<dict> stabilizationSettings`: override tracking stabilization settings - see `set_stabilizationSettings(...)` method for more information.


If the user has a mobile device in portrait display mode, the width and height of these parameters are automatically inverted for the first camera request. If it does not succeed, we invert the width and height.


### Error codes
The initialization function ( `callbackReady` in the code snippet ) will be called with an error code ( `errCode` ). It can have these values:
* `false`: no error occurs,
* `"GL_INCOMPATIBLE"`: WebGL is not available, or this WebGL configuration is not enough (there is no WebGL2, or there is WebGL1 without OES_TEXTURE_FLOAT or OES_TEXTURE_HALF_FLOAT extension),
* `"ALREADY_INITIALIZED"`: the API has been already initialized,
* `"NO_CANVASID"`: no canvas or canvas ID was specified,
* `"INVALID_CANVASID"`: cannot found the `<canvas>` element in the DOM,
* `"INVALID_CANVASDIMENSIONS"`: the dimensions `width` and `height` of the canvas are not specified,
* `"WEBCAM_UNAVAILABLE"`: cannot get access to the webcam (the user has no webcam, or it has not accepted to share the device, or the webcam is already busy),
* `"GLCONTEXT_LOST"`: The WebGL context was lost. If the context is lost after the initialization, the `callbackReady` function will be launched a second time with this value as error code,
* `"MAXFACES_TOOHIGH"`: The maximum number of detected and tracked faces, specified by the optional init argument `maxFacesDetected`, is too high.


### The returned objects
We detail here the arguments of the callback functions like `callbackReady` or `callbackTrack`. The reference of these objects do not change for memory optimization purpose. So you should copy their property values if you want to keep them unchanged outside the callback functions scopes.

#### The initialization returned object
The initialization callback function ( `callbackReady` in the code snippet ) is called with a second argument, `spec`, if there is no error. `spec` is a dictionnary having these properties:
* `<WebGLRenderingContext> GL`: the WebGL context. The rendering 3D engine should use this WebGL context,
* `<canvas> canvasElement`: the `<canvas>` element,
* `<WebGLTexture> videoTexture`: a WebGL texture displaying the webcam video. It matches the dimensions of the canvas. It can be used as a background,
* `<HTMLVideoElement> videoElement`: the video used as source for the webgl texture `videoTexture`,
* `<int> maxFacesDetected`: the maximum number of detected faces. 


#### The detection state
At each render iteration a callback function is executed ( `callbackTrack` in the code snippet ). It has one argument ( `detectState` ) which is a dictionnary with these properties:
* `<float> detected`: the face detection probability, between `0` and `1`,
* `<float> x`, `<float> y`: The 2D coordinates of the center of the detection frame in the viewport (each between -1 and 1, `x` from left to right and `y` from bottom to top),
* `<float> s`: the scale along the horizontal axis of the detection frame, between 0 and 1 (1 for the full width). The detection frame is always square,
* `<float> rx`, `<float> ry`, `<float> rz`: the Euler angles of the head rotation in radians.
* `<Float32Array> expressions`: array listing the facial expression coefficients:
    * `expressions[0]`: mouth opening coefficient (`0` &rarr; mouth closed, `1` &rarr; mouth fully opened)

In multiface detection mode, `detectState` is an array. Its size is equal to the maximum number of detected faces and each element of this array has the format described just before.


### Miscellaneous methods
After the initialization (ie after that `callbackReady` is launched ) , these methods are available:

* `JEEFACEFILTERAPI.resize()`: should be called after resizing the `<canvas>` element to adapt the cut of the video. It should also be called if the device orientation is changed to take account of new video dimensions,

* `JEEFACEFILTERAPI.toggle_pause(<boolean> isPause, <boolean> isShutOffVideo)`: pause/resume. This method will completely stop the rendering/detection loop. If `isShutOffVideo` is set to `true`, the media stream track will be stopped and the camera light will turn off. It returns a `Promise` object,

* `JEEFACEFILTERAPI.toggle_slow(<boolean> isSlow)`: toggle the slow rendering mode: because this API consumes a lot of GPU resources, it may slow down other elements of the application. If the user opens a CSS menu for example, the CSS transitions and the DOM update can be slow. With this function you can slow down the rendering in order to relieve the GPU. Unfortunately the tracking and the 3D rendering will also be slower but this is not a problem is the user is focusing on other elements of the application. We encourage to enable the slow mode as soon as a the user's attention is focused on a different part of the canvas,

* `JEEFACEFILTERAPI.set_animateDelay(<integer> delay)`: Change the `animateDelay` (see `init()` arguments),

* `JEEFACEFILTERAPI.set_inputTexture(<WebGLTexture> tex, <integer> width, <integer> height)`: Change the video input by a WebGL Texture instance. The dimensions of the texture, in pixels, should be provided,

* `JEEFACEFILTERAPI.reset_inputTexture()`: Come back to the user's video as input texture,

* `JEEFACEFILTERAPI.get_videoDevices(<function> callback)`: Should be called before the `init` method. 2 arguments are provided to the callback function:
  * `<array> mediaDevices`: an array with all the devices founds. Each device is a javascript object having a `deviceId` string attribute. This value can be provided to the `init` method to use a specific webcam. If an error happens, this value is set to `false`,
  * `<string> errorLabel`: if an error happens, the label of the error. It can be: `NOTSUPPORTED`, `NODEVICESFOUND` or `PROMISEREJECTED`.

* `JEEFACEFILTERAPI.set_scanSettings(<object> scanSettings)`: Override scan settings. `scanSettings` is a dictionnary with the following properties:
  * `<float> minScale`: min width of the face search window, relatively to the width of the video. Default value: `0.15`,
  * `<float> maxScale`: max width of the face search window, relatively to the width of the video. Default value: `0.6`, 
  * `<float> borderWidth`: size of the left and right margins, relatively to the width of the window. Default value: `0.2`,
  * `<float> borderHeight`: size of the bottom and right margins, relatively to the height of the window. Default value: `0.2`,
  * `<int> nStepsX`: number of detection steps for each scan line. Default: `6`,
  * `<int> nStepsY`: number of scan lines. Default: `5`,
  * `<int> nStepsScale`: number of detection steps for the scale. Default: `3`,
  * `<int> nDetectsPerLoop`: specify the number of detection per drawing loop. `-1` for adaptative value. Default: `-1`

* `JEEFACEFILTERAPI.set_stabilizationSettings(<object> stabilizationSettings)`: Override detection stabilization settings. The output of the neural network is always noisy, so we need to stabilize it using a floatting average to avoid shaking artifacts. The internal algorithm computes first a stabilization factor `k` between `0` and `1`. If `k==0.0`, the detection is bad and we favor responsivity against stabilization. It happens when the user is moving quickly, rotating the head or when the detection is bad. On the contrary, if `k` is close to `1`, the detection is nice and the user does not move a lot so we can stabilize a lot. `stabilizationSettings` is a dictionnary with the following properties:
  * `[<float> minValue, <float> maxValue] translationFactorRange`: multiply `k` by a factor `kTranslation` depending on the translation speed of the head (relative to the viewport). `kTranslation=0` if `translationSpeed<minValue` and `kTranslation=1` if `translationSpeed>maxValue`. The regression is linear. Default value: `[0.0015, 0.005]`,
  * `[<float> minValue, <float> maxValue] rotationFactorRange`: analogous to `translationFactorRange` but for rotation speed. Default value: `[0.003, 0.02]`,
  * `[<float> minValue, <float> maxValue] qualityFactorRange`: analogous to `translationFactorRange` but for the head detection coefficient. Default value: `[0.9, 0.98]`,
  * `[<float> minValue, <float> maxValue] alphaRange`: it specify how to apply `k`. Between 2 successive detections, we blend the previous `detectState` values with the current detection values using a mixing factor `alpha`. `alpha=<minValue>` if `k<0.0` and `alpha=<maxValue>` if `k>1.0`. Between the 2 values, the variation is quadratic. Default value: `[0.05, 1]`.

* `JEEFACEFILTERAPI.update_videoElement(<video> vid, <function|False> callback)`: change the video element used for the face detection (which can be provided via `VIDEOSETTINGS.videoElement`) by another video element. A callback function can be called when it is done.

* `JEEFACEFILTERAPI.set_videoOrientation(<integer> angle, <boolean> flipX)`: Dynamically change `videoSettings.rotate` and `videoSettings.flipX`. This method should be called after initialization. The default values are `0` and `false`. The angle should be chosen among these values: `0, 90, 180, -90`.


### Optimization

#### Canvas and video resolutions

We strongly recommend the use of the `JeelizResizer` helper in order to size the canvas to the display size in order to not compute more pixels than required. This helper also computes the best camera resolution, which is the closer to the canvas actual size. If the camera resolution is too high compared to the canvas resolution, your application will be unnecessarily slowed because it is quite costly to refresh the WebGL texture for each video frame. And if the video resolution is too low compared to the canvas resolution, the image will be blurry. You can take a look at the THREE.js boilerplate to see how it is used. To use the helper, you first need to include it in the HTML code:
```
<script src="https://appstatic.jeeliz.com/faceFilter/JeelizResizer.js"></script>
```
Then in your main script, before initializing Jeeliz FaceFilter, you should call it to size the canvas to the best resolution and to find the optimal video resolution:
```
JeelizResizer.size_canvas({
  canvasId: 'jeeFaceFilterCanvas',
    callback: function(isError, bestVideoSettings){
      JEEFACEFILTERAPI.init({
        videoSettings: bestVideoSettings,
        //...
        //...
      });
    }
});
```
Take a look at the source code of this helper (in [helpers/JeelizResize.js](helpers/JeelizResize.js)) to get more information.

#### Misc

A few tips:
* In term of optimisation, the WebGL based demos are more optimized than Canvas2D demos, which are still more optimized than CSS3D demos.
* Try to use lighter resources as possibles. Each texture image should have the lowest resolution as possible, use mipmapping for texture minification filtering.
* The more effects you use, the slower it will be. Add the 3D effects gradually to check that they do not penalize too much the frame rate.
* Use low polygon meshes.


### Multiple faces
It is possible to detect and track several faces at the same time. To enable this feature, you only have to specify the optional init parameter `maxFacesDetected`. Its maximum value is `8`. Indeed, if you are tracking for example 8 faces at the same time, the detection will be slower because there is 8 times less computing power per tracked face. If you have set this value to `8` but if there is only `1` face detected, it should not slow down too much compared to the single face tracking.

If multiple face tracking is enabled, the `callbackTrack` function is called with an array of detection states (instead of being executed with a simple detection state). The detection state format is still the same.

You can use our `Three.js` multiple faces detection helper, `helpers/JeelizThreejsHelper.js` to get started and test [this example](https://jeeliz.com/demos/faceFilter/demos/threejs/multiCubes/). The [main script](demos/threejs/multiCubes/demo_multiCubes.js) has only 60 lines of code !



### Changing the 3D engine
It is possible to use another 3D engine than BABYLON.JS or THREE.JS. If you have accomplished this work, we would be interested to add your demonstration in this repository (or link to your code). Just open a pull request.

The 3D engine should share the WebGL context with FaceFilter API. The WebGL context is created by Jeeliz Face Filter. The background video texture is given directly as a `WebGLTexture` object, so it is usable only on the FaceFilter WebGL context. It would be more costly in term of computating time to have a second WebGL context for the 3D rendering, because at each new video frame we should transfert the video data from the `<video>` element to the 2 webgl contexts: the Jeeliz Face Filter WebGL context for processing, and the 3D engine WebGL Context for rendering. Fortunately, with BABYLON.JS or THREE.JS, it is easy to specify an already initialized WebGL context.


### Changing the neural network
Since July 2018 it is possible to change the neural network. When calling `JEEFACEFILTERAPI.init({...})` with `NNCpath: <path of NNC.json>` you set NNCpath value to a specific neural network file:

```javascript
  JEEFACEFILTERAPI.init({
    NNCpath: '../../dist/NNClight.json'
    //...
  })
```
It is also possible to give directly the neural network model JSON file content by using `NNC` property instead of `NNCpath`.

We provide several neural network models:
* `dist/NNC.json`: this is the default neural network. Good tradeoff between size and performances,
* `dist/NNCwideAngles.json`: this neural network is better to detect wide head angles (but less accurate for small angles),
* `dist/NNClight.json`: this is a light version of the neural network. The file is twice lighter and it runs faster but it is less accurate for large head rotation angles,
* `dist/NNCveryLight.json`: even lighter than the previous version: 250Kbytes, and very fast. But not very accurate and robust to all lighting conditions,
* `dist/NNCviewTop.json`: this neural net is perfect if the camera has a bird's eye view (if you use this library for a kiosk setup for example),
* `dist/NNCdeprecated.json`: this is a deprecated version of the neural network (since 2018-07-25),
* `dist/NNCIntel1536.json`: neural network working with Intel 1536 Iris GPUs (there is a graphic driver bug, see [#85](https://github.com/jeeliz/jeelizFaceFilter/issues/85))


### Using the ES6 module
`/dist/jeelizFaceFilterES6.js` is exactly the same than `/dist/jeelizFaceFilter.js` except that it works with ES6, so you can import it directly using:

```javascript
import 'dist/jeelizFaceFilterES6.js'
```

or using `require` ([see issue #72](https://github.com/jeeliz/jeelizFaceFilter/issues/72)):

```javascript
const faceFilter = require('./lib/jeelizFaceFilterES6.js')

faceFilter.init({
  //you can also provide the canvas directly
  //using the canvas property instead of canvasId:
  canvasId: 'jeeFaceFilterCanvas',
  NNCpath: '../../../dist/', //path to JSON neural network model (NNC.json by default)
  callbackReady: function(errCode, spec){
    if (errCode){
      console.log('AN ERROR HAPPENS. ERROR CODE =', errCode);
      return;
    }
    // [init scene with spec...]
    console.log('INFO: JEEFACEFILTERAPI IS READY');
  }, //end callbackReady()

  //called at each render iteration (drawing loop)
  callbackTrack: function(detectState){
      // Render your scene here
      // [... do something with detectState]
  } //end callbackTrack()
});//end init call
```

## Integration

### With a bundler
If you use this library with a bundler (typically *Webpack* or *Parcel*), first you should use the [ES6 version](#using-the-es6-module).

Then, with the standard library, we load the neural network model (specified by `NNCpath` provided as initialization parameter) using AJAX for the following reasons:
* If the user does not accept to share its webcam, or if WebGL is not enabled, we don't have to load the neural network model,
* We suppose that the library is deployed using a static HTTPS server.

With a bundler, it is a bit more complicated. It is easier to load the neural network model using a classical `import` or `require` call and to provide it using the `NNC` init parameter:

```javascript
const faceFilter = require('./lib/jeelizFaceFilterES6.js')
const neuralNetworkModel = require('./dist/NNC.json')

faceFilter.init({
  NNC:  neuralNetworkModel, //instead of NNCpath
  //... other init parameters
});
```

### With JavaScript frontend frameworks
We don't cover here the integration with mainstream JavaScript frontend frameworks (*React*, *Vue*, *Angular*).
If you submit Pull Request adding the boilerplate or a demo integrated with specific frameworks, you are welcome and they will be accepted of course.
We can provide this kind of integration as a specific development service ( please contact us [here](https://jeeliz.com/contact-us/) ). But it is not so hard to do it by yourself. Here is a bunch of submitted issues dealing with *React* integration:

* React integration: [#74](https://github.com/jeeliz/jeelizFaceFilter/issues/74#issuecomment-455624092) and [#122](https://github.com/jeeliz/jeelizFaceFilter/issues/122#issuecomment-533185928)
* [is it possible to use this library in react native project](https://github.com/jeeliz/jeelizFaceFilter/issues/21)
* [Having difficulty using JeelizThreejsHelper in ReactApp](https://github.com/jeeliz/jeelizFaceFilter/issues/137)

You can also take a look at these Github code repositories:
* [ikebastuz/jeelizTest](https://github.com/ikebastuz/jeelizTest): React demo of a CSS3D FaceFilter. It is based on [Create React App](https://github.com/facebook/create-react-app)
* [CloffWrangler/facevoice](https://github.com/CloffWrangler/facevoice): Another demo based on [Create React App]
* [nickydev100/FFMpeg-Angular-Face-Filter](https://github.com/nickydev100/FFMpeg-Angular-Face-Filter): Angular boilerplate

### Native
It is possible to execute a JavaScript application using this library into a *Webview* for a native app integration.
But with IOS the camera access is disabled inside webviews. You have to implement a hack to stream the camera video into the webview using websockets.

His hack has not been implemented into this repository but in a similar Jeeliz Library, [Jeeliz Weboji](https://github.com/jeeliz/jeelizWeboji). Here are the links:

* [Apache Cordova IOS demo (it should also work on Android)](https://github.com/jeeliz/jeelizWeboji/tree/master/demos/cordova)
* [Youtube video of the demo](https://youtu.be/yx9uA1g6-rA)
* [Github submitted issue](https://github.com/jeeliz/jeelizWeboji/issues/27)
* [Linkedin post detailing pros and cons](https://www.linkedin.com/feed/update/urn:li:activity:6587781973287198720)

But it is still a dirty hack introducing a bottleneck. It still run pretty well on a high end device (tested on Iphone XR), but it is better to stick on a full web environment.

## Hosting

This API requires the user's webcam video feed through `MediaStream API`. So your application should be hosted by a HTTPS server (even with a self-signed certificate). It won't work at all with unsecure HTTP, even locally with some web browsers.

### The development server
For development purpose we provide a simple and minimalist HTTPS server in order to check out the demos or develop your very own filters. To launch it, execute in the bash console:

```bash
  python2 httpsServer.py
```
It requires Python 2.X. Then open in your web browser [https://localhost:4443](https://localhost:4443).


### Hosting optimization
You can use our hosted and up to date version of the library, available here:
```
https://appstatic.jeeliz.com/faceFilter/jeelizFaceFilter.js
```
It uses the neuron network `NNC.json` hosted in the same path. The helpers used in these demos (all scripts in [/helpers/](helpers/)) are also hosted on `https://appstatic.jeeliz.com/faceFilter/`.

It is served through a content delivery network (CDN) using gzip compression.
If you host the scripts by yourself, be careful to enable gzip HTTP/HTTPS compression for JSON and JS files. Indeed, the neuron network JSON file, `dist/NNC.json` is quite heavy, but very well compressed with GZIP. You can check the gzip compression of your server [here](https://checkgzipcompression.com/).

The neuron network file, `dist/NNC.json` is loaded using an ajax `XMLHttpRequest` after calling `JEEFACEFILTER.init()`. This loading is proceeded after the user has accepted to share its camera. So we won't load this quite heavy file if the user refuses to share it or if there is no webcam available. The loading can be faster if you systematically preload `dist/NNC.json` using a service worker or a simple raw `XMLHttpRequest` just after the HTML page loading. Then the file will be already in the browser cache when Jeeliz Facefilter API will request it.



## About the tech
### Under the hood
This API uses Jeeliz WebGL Deep Learning technology to detect and track the user's face using a neural network. The accuracy is adaptative: the best is the hardware, the more detections are processed per second. All is done client-side.

### Compatibility
* If `WebGL2` is available, it uses `WebGL2` and no specific extension is required,
* If `WebGL2` is not available but `WebGL1`, we require either `OES_TEXTURE_FLOAT` extension or `OES_TEXTURE_HALF_FLOAT` extension,
* If `WebGL2` is not available, and if `WebGL1` is not available or neither `OES_TEXTURE_FLOAT` or `OES_HALF_TEXTURE_FLOAT` are implemented, the user is not compatible.

In all cases, WebRTC should be implemented in the web browser, otherwise FaceFilter API will not be able to get the webcam video feed. Here are the compatibility tables from [caniuse.com](https://caniuse.com/) here: [WebGL1](https://caniuse.com/#feat=webgl), [WebGL2](https://caniuse.com/#feat=webgl2), [WebRTC](https://caniuse.com/#feat=stream).

If a compatibility error occurred, please post an issue on this repository. If this is a problem with the webcam access, please first retry after closing all applications which could use the camera (Skype, Messenger, other browser tabs and windows, ...). Please include:
* the browser, the version of the browser, the operating system, the version of the operating system, the device model and the GPU if it is a desktop computer,
* a screenshot of [webglreport.com - WebGL1](http://webglreport.com/?v=1) (about your `WebGL1` implementation),
* a screenshot of [webglreport.com - WebGL2](http://webglreport.com/?v=2) (about your `WebGL2` implementation),
* the log from the web console,
* the steps to reproduce the bug, and screenshots.



## Articles and tutorials
We are currently writing a series of tutorial for the API, starting by building some very basic filters and moving to harder ones.

* Creating a Snapchat-like face filter using Jeeliz FaceFilter API and THREE.JS:
  * Part 1: [Creating your first filter](https://jeeliz.com/blog/creating-a-snapchat-like-filter-with-jeelizs-facefilter-api-part-1-creating-your-first-filter/)
  * Part 2: [ User interactions and particles](https://jeeliz.com/blog/creating-a-snapchat-like-filter-with-jeelizs-facefilter-api-part-2-user-interactions-and-particles/)

* [Flying around the Globe with Cesium and Your Head](https://cesium.com/blog/2018/03/22/jeeliz-and-cesium/)

* [Build a multifacial face filter](https://webglacademy.jeeliz.com/courses.php?courses=19_25_27_33_34#34): Interactive step by step tutorial hosted on [WebGL Academy](http://www.webglacademy.com) where you learn to build a Statue of Liberty using THREE.js and this library

* [JSFiddle: Face detection and tracking in 25 lines](https://jsfiddle.net/jeeliz/2p34hbeh/)

* Tutorial: Matrix theme face filter: [French version](https://xavierbourry.developpez.com/filtre-facial-webcam/), [English translation](https://jeeliz.com/blog/tutorial-javascript-webgl-webcam-facial-filter-on-the-theme-of-matrix/)

* Video tutorial: a neat video tutorial about [Headtracking Controls with Three JS](https://youtu.be/_Fs4Sbn2LPc) by [Chris Godber](http://chrisgodber.co.uk/). He also releases other great video tutorials about web development, VR, 3D on [his Youtube channel](https://www.youtube.com/channel/UCdwx6HHyPoDTtL9iq1-sI3A)


## Jeeliz Partner Network
If you are a freelance developer, or if you represent a software company or a web agency able to build projects with this library, you can join the Jeeliz Partner Network (JPN) by filling this [Google Form](https://docs.google.com/forms/d/e/1FAIpQLSccwO9Seyi4ZHkXc_Udn0VRWUhKZfXpO6AGMFamnWVVXOA1hA/viewform?usp=sf_link). We will redirect you development services requests involving this library. We will also provide premium support for integrating and using this library.

Conversely, if you are looking for a reliable development service provider to build your face filter using this library, please [contact us here](https://jeeliz.com/contact-us/).


## See also
Our newest deep learning based library is called *Weboji*. It detects 11 facial expressions in real time from the webcam video feed. Then they are reproduced on an avatar, either in 3D with a THREE.JS renderer or in 2D with a SVG renderer (so you can use it even if you are not a 3D developer). You can access to the github repository [here](https://github.com/jeeliz/jeelizWeboji).

If you just want to detect if the user is looking at the screen or not, [Jeeliz Glance Tracker](https://github.com/jeeliz/jeelizGlanceTracker) is what you are looking for. It can be useful to play and pause a video whether the user is watching or not. This library needs fewer resources and the neural network file is much lighter.

If you want to use this library for glasses virtual try-on (sunglasses, spectacles, ski masks), you can take a look at [Jeeliz VTO widget](https://github.com/jeeliz/jeelizGlassesVTOWidget). It includes a high quality and lightweight 3D engine which implements the following features: deferred shading, PBR, raytraced shadows, normal mapping, ... It also reconstructs the lighting environment around the user (ambient and directional lighting). But the glasses comes from a database hosted in our servers. If you want to add some models, please contact us.


## License
[Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html). This application is free for both commercial and non-commercial use.

We appreciate attribution by including the [Jeeliz logo](https://jeeliz.com/wp-content/uploads/2018/01/LOGO_JEELIZ_BLUE.png) and a link to the [Jeeliz website](https://jeeliz.com) in your application or desktop website. Of course we do not expect a large link to Jeeliz over your face filter, but if you can put the link in the credits/about/help/footer section it would be great.


## References
* [Jeeliz official website](https://jeeliz.com)
* [Babylon.JS official website with documentation, demos, examples...](https://www.babylonjs.com/)
* [Three.JS official website with documentation, demos, examples...](https://threejs.org/)
* [Cesium JS official website](https://cesiumjs.org/)
* [A-Frame official website](https://aframe.io/)
* [Webgl Academy: tutorials about WebGL and THREE.JS](http://www.webglacademy.com)

