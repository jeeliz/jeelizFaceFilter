# JavaScript/WebGL lightweight and robust face tracking library designed for augmented reality face filters


This JavaScript library detects and tracks the face in real time from the webcam video feed captured with WebRTC. Then it is possible to overlay 3D content for augmented reality applications. We provide various demonstrations using main WebGL 3D engines. We have included in this repository the release versions of the 3D engines to work with a determined version (they are in `/libs/<name of the engine>/`).

This library is lightweight and it does not include any 3D engine or third party library. We want to keep it framework agnostic so the outputs of the library are raw: if the a face is detected or not, the position and the scale of the detected face and the rotation Euler angles. But thanks to the featured helpers, examples and boilerplates, you can quickly deal with a higher level context (for motion head tracking, for face filter or face replacement...). We continuously add new demontrations, so stay tuned ! Also, feel free to open an issue if you have any question or suggestion.


## Table of contents

* [Features](#features)
* [Architecture](#architecture)
* [Demonstrations](#demonstrations)
* [Specifications](#specifications)
  * [Get started](#get-started)
  * [Optionnal init arguments](#optionnal-init-arguments)
  * [Error codes](#error-codes)
  * [The returned objects](#the-returned-objects)
  * [Miscellaneous methods](#miscellaneous-methods)
  * [Multiple faces](#multiple-faces)
  * [Optimization](#optimization)
  * [Changing the 3D Engine](#changing-the-3d-engine)
* [Hosting](#hosting)
  * [The development server](#the-development-server)  
  * [Hosting optimization](#hosting-optimization)
* [About the tech](#about-the-tech)
  * [Under the hood](#under-the-hood)
  * [Compatibility](#compatibility)
* [Articles and tutorials](#articles-and-tutorials)
* [License](#license)
* [See also](#see-also)
* [References](#references)


<p align="center">
<img src='https://user-images.githubusercontent.com/11960872/37533324-cfa3e516-2941-11e8-99a9-96a1e20c80a3.jpg' />
</p>


## Features

Here are the main features of the library :

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

* `/demos/`: source code of demonstrations, sorted by 2D/3D engine used,
* `/dist/`: heart of the library: 
  * `jeelizFaceFilter.js`: main minified script,
  * `NNC.json`: file storing the neural network parameters, loaded by the main script,
* `/helpers/`: scripts which can help you to use this library in some specific use cases,
* `/libs/`: 3rd party libraries and 3D engines used in the demos.



## Demonstrations

You can test it with these demos (all included in this repository in the `/demos` directory). You will find among them the perfect starting point to build your own face based augmented reality application :

* BABYLON.JS based demos :
  * [Boilerplate (displays a cube on the user's head)](https://jeeliz.com/demos/faceFilter/demos/babylonjs/cube/)

* THREE.JS based demos - [specific README about THREE.js based demo problems](demos/threejs/) :
  * [Boilerplate (displays a cube on the user's head)](https://jeeliz.com/demos/faceFilter/demos/threejs/cube/)
  * [Multiple face tracking](https://jeeliz.com/demos/faceFilter/demos/threejs/multiCubes/)
  * [Star Wars: Darth Vader](https://jeeliz.com/demos/faceFilter/demos/threejs/star_wars/)
  * [Anonymous mask and video effect](https://jeeliz.com/demos/faceFilter/demos/threejs/anonymous/)
  * [Dog-Face filter](https://jeeliz.com/demos/faceFilter/demos/threejs/dog_face/)
  * [Butterflies animation](https://jeeliz.com/demos/faceFilter/demos/threejs/butterflies/)
  * [Clouds above the head](https://jeeliz.com/demos/faceFilter/demos/threejs/cloud/)
  * [Casa-de-Papel mask](https://jeeliz.com/demos/faceFilter/demos/threejs/casa_de_papel/)
  * [Miel Pops glasses and bees](https://jeeliz.com/demos/faceFilter/demos/threejs/miel_pops/)
  * [World Cup 2018 Football Fan](https://jeeliz.com/demos/faceFilter/demos/threejs/world_cup_2018/)
  * [Face deformation](https://jeeliz.com/demos/faceFilter/demos/threejs/faceDeform/)
  * [Face cel shading](https://jeeliz.com/demos/faceFilter/demos/threejs/celFace/)
  * [Head controlled navigation](https://jeeliz.com/demos/faceFilter/demos/threejs/headControls/)
  * [Tiger face filter with mouth opening detection (strong WTF effect)](https://jeeliz.com/demos/faceFilter/demos/threejs/tiger/)
  * [Fireworks - particules](https://jeeliz.com/demos/faceFilter/demos/threejs/fireworks/)
  * [Luffy's Hat](https://jeeliz.com/demos/faceFilter/demos/threejs/luffys_hat_part2/)
  * [GLTF fullscreen demo with HD video](https://jeeliz.com/demos/faceFilter/demos/threejs/gltf_fullScreen/)
  * [Statue Of Liberty](https://jeeliz.com/demos/faceFilter/demos/threejs/multiLiberty/)
  * [Matrix](https://jeeliz.com/demos/faceFilter/demos/threejs/matrix/)

* A-FRAME based demos :
  * [Boilerplate (displays a cube on the user's head)](https://jeeliz.com/demos/faceFilter/demos/aFrame/cube/)
  
* CSS3D based demos :
  * [Boilerplate (displays a `<DIV>` element on the user's head)](https://jeeliz.com/demos/faceFilter/demos/CSS3D/div/)
  * [Comedy glasses demo](https://jeeliz.com/demos/faceFilter/demos/CSS3D/comedy-glasses/)

* Canvas2D based demos :
  * [Draw on the face with the mouse](https://jeeliz.com/demos/faceFilter/demos/canvas2D/faceDraw/)
  * [2D face detection and tracking - 30 lines of code only !](https://jeeliz.com/demos/faceFilter/demos/canvas2D/faceTrack/)
  * [2D face detection and tracking from a video file instead of webcam video](https://jeeliz.com/demos/faceFilter/demos/canvas2D/fromVideoFile/)

* CESIUM.JS based demos :
  * [3D view of the Earth with head controlled navigation](https://jeeliz.com/demos/faceFilter/demos/cesium/headControls/)

* Face replacement demos :
  * [Insert your face into portrait art painting or film posters](https://jeeliz.com/demos/faceFilter/demos/faceReplacement/image)
  * [Insert your face into an animated gif](https://jeeliz.com/demos/faceFilter/demos/faceReplacement/gif), [specific README](demos/faceReplacement/gif/)
  * [The traditional faceSwap, fullscreen and with color correction](https://jeeliz.com/demos/faceFilter/demos/faceReplacement/faceSwap/)

* MISC demos :
  * [PACMAN game with head controlled navigation](https://jeeliz.com/demos/faceFilter/demos/pacman/)
  * [Head controlled mouse cursor](https://jeeliz.com/demos/faceFilter/demos/headCursor/)





[comment]:![giphy-downsized-large](https://user-images.githubusercontent.com/11960872/37475622-6a602cf6-2873-11e8-83f0-134b6c1ba666.gif)

If you have not bought a webcam yet, a screenshot video of some of these examples is available [on Youtube](https://youtu.be/jQkaJoMGinQ). You can also subscribe to the [Jeeliz Youtube channel](https://www.youtube.com/channel/UC3XmXH1T3d1XFyOhrRiiUeA) or to the [@StartupJeeliz Twitter account](https://twitter.com/StartupJeeliz) to be kept informed of our cutting edge developments.

If you have developped an application or a fun demo using this library, we would love to see it and insert a link here ! Just contact us on [Twitter @StartupJeeliz](https://twitter.com/StartupJeeliz) or [LinkedIn](https://www.linkedin.com/company/jeeliz).



## Specifications
Here we describe how to use this library. Although we planned to add new features, we will keep it backward compatible.

### Get started
On your HTML page, you first need to include the main script between the tags `<head>` and `</head>` :
```html
 <script type="text/javascript" src="dist/jeelizFaceFilter.js"></script>
```
Then you should include a `<canvas>` HTML element in the DOM, between the tags `<body>` and `</body>`. The `width` and `height` properties of the canvas element should be set. They define the resolution of the canvas and the final rendering will be computed using this resolution. Be careful to not enlarge too much the canvas size using its CSS properties without increasing its resolution, otherwise it may look blurry or pixelated. We advise to fix the resolution to the actual canvas size. Do not forget to call `JEEFACEFILTERAPI.resize()` if you resize the canvas after the initialization step. We strongly encourage you to use our helper `/helpers/JeelizResizer.js` to set the width and height of the canvas (see [Optimization/Canvas and video resolutions](#optimization) section).
```html
<canvas width="600" height="600" id='jeeFaceFilterCanvas'></canvas>
```
This canvas will be used by WebGL both for the computation and the 3D rendering. When your page is loaded you should launch this function :
```javascript
JEEFACEFILTERAPI.init({
    canvasId: 'jeeFaceFilterCanvas',
    NNCpath: '../../../dist/', //path to JSON neural network model (NNC.json by default)
    callbackReady: function(errCode, spec){
        if (errCode){
            console.log('AN ERROR HAPPENS. ERROR CODE =', errCode);
            return;
        }
        [init scene with spec...]
        console.log('INFO: JEEFACEFILTERAPI IS READY');
    }, //end callbackReady()

    //called at each render iteration (drawing loop)
    callbackTrack: function(detectState){
        //render your scene here
        [... do something with detectState]
    } //end callbackTrack()
});//end init call
```

### Optionnal init arguments
* `<integer> maxFacesDetected`: Only for multiple face detection - maximum number of faces which can be detected and tracked. Should be between `1` (no multiple detection) and `8`,
* `<integer> animateDelay`: It is used only in normal rendering mode (not in slow rendering mode). With this statement you can set accurately the number of milliseconds during which the browser wait at the end of the rendering loop before starting another detection. If you use the canvas of this API as a secondary element (for example in *PACMAN* or *EARTH NAVIGATION* demos) you should set a small `animateDelay` value (for example 2 milliseconds) in order to avoid rendering lags.
* `<function> onWebcamAsk`: Function launched just before asking for the user to allow its webcam sharing,
* `<function> onWebcamGet`: Function launched just after the user has accepted to share its video. It is called with the video element as argument,
* `<dict> videoSetting`: override WebRTC specified video settings, which are by default :
```javascript
{
  'videoElement' //not set by default. <video> element used
   //If you specify this parameter,
   //all other settings will be useless
   //it means that you fully handle the video aspect

  'deviceId'             //not set by default
  'facingMode': 'user', //to use the rear camera, set to 'environment'

  'idealWidth': 800,  //ideal video width in pixels
  'idealHeight': 600, //ideal video height in pixels
  'minWidth': 480,    //min video width in pixels
  'maxWidth': 1280,   //max video width in pixels
  'minHeight': 480,   //min video height in pixels
  'maxHeight': 1280   //max video height in pixels
}
```
If the user has a mobile device in portrait display mode, the width and height of these parameters are automatically inverted for the first camera request. If it does not succeed, we invert the width and height.


### Error codes
The initialization function ( `callbackReady` in the code snippet ) will be called with an error code ( `errCode` ). It can have these values :
* `false`: no error occurs,
* `"GL_INCOMPATIBLE"`: WebGL is not available, or this WebGL configuration is not enough (there is no WebGL2, or there is WebGL1 without OES_TEXTURE_FLOAT or OES_TEXTURE_HALF_FLOAT extension),
* `"ALREADY_INITIALIZED"`: the API has been already initialized,
* `"NO_CANVASID"`: no canvas ID was specified,
* `"INVALID_CANVASID"`: cannot found the \<canvas\> element in the DOM,
* `"INVALID_CANVASDIMENSIONS"`: the dimensions `width` and `height` of the canvas are not specified,
* `"WEBCAM_UNAVAILABLE"`: cannot get access to the webcam (the user has no webcam, or it has not accepted to share the device, or the webcam is already busy),
* `"GLCONTEXT_LOST"`: The WebGL context was lost. If the context is lost after the initialization, the `callbackReady` function will be launched a second time with this value as error code,
* `"MAXFACES_TOOHIGH"`: The maximum number of detected and tracked faces, specified by the optional init argument `maxFacesDetected`, is too high.


### The returned objects
We detail here the arguments of the callback functions like `callbackReady` or `callbackTrack`. The reference of these objects do not change for memory optimization purpose. So you should copy their property values if you want to keep them unchanged outside the callback functions scopes.

### The initialization returned object
The initialization callback function ( `callbackReady` in the code snippet ) is called with a second argument, `spec`, if there is no error. `spec` is a dictionnary having these properties :
* `GL`: the WebGL context. The rendering 3D engine should use this WebGL context,
* `canvasElement`: the \<canvas\> element,
* `videoTexture`: a WebGL texture displaying the webcam video. It matches the dimensions of the canvas. It can be used as a background,
* `maxFacesDetected`: the maximum number of detected faces. 


### The detection state
At each render iteration a callback function is executed ( `callbackTrack` in the code snippet ). It has one argument ( `detectState` ) which is a dictionnary with these properties :
* `detected`: the face detection probability, between `0` and `1`,
* `x`, `y`: The 2D coordinates of the center of the detection frame in the viewport (each between -1 and 1, `x` from left to right and `y` from bottom to top),
* `s`: the scale along the horizontal axis of the detection frame, between 0 and 1 (1 for the full width). The detection frame is always square,
* `rx`, `ry`, `rz`: the Euler angles of the head rotation in radians.
* `expressions`: `Float32Array` listing the facial expression coefficients :
    * `expressions[0]`: mouth opening coefficient (`0` &rarr; mouth closed, `1` &rarr; mouth fully opened)


### Miscellaneous methods
After the initialization (ie after that `callbackReady` is launched ) , these methods are available :

* `JEEFACEFILTERAPI.resize()`: should be called after resizing the `<canvas>` element to adapt the cut of the video,

* `JEEFACEFILTERAPI.toggle_pause(<boolean> isPause)`: pause/resume,

* `JEEFACEFILTERAPI.toggle_slow(<boolean> isSlow)`: toggle the slow rendering mode: because this API consumes a lot of GPU resources, it may slow down other elements of the application. If the user opens a CSS menu for example, the CSS transitions and the DOM update can be slow. With this function you can slow down the rendering in order to relieve the GPU. Unfortunately the tracking and the 3D rendering will also be slower but this is not a problem is the user is focusing on other elements of the application. We encourage to enable the slow mode as soon as a the user's attention is focused on a different part of the canvas,

* `JEEFACEFILTERAPI.set_animateDelay(<integer> delay)`: Change the `animateDelay` (see `init()` arguments),

* `set_inputTexture(<WebGLTexture> tex, <integer> width, <integer> height)`: Change the video input by a WebGL Texture instance. The dimensions of the texture, in pixels, should be provided,

* `reset_inputTexture()`: Come back to the user's video as input texture,

* `get_videoDevices(<function> callback)`: Should be called before the `init` method. 2 arguments are provided to the callback function:
  * `<array> mediaDevices`: an array with all the devices founds. Each device is a javascript object having a `deviceId` string attribute. This value can be provided to the `init` method to use a specific webcam. If an error happens, this value is set to `false`,
  * `<string> errorLabel`: if an error happens, the label of the error. It can be: `NOTSUPPORTED`, `NODEVICESFOUND` or `PROMISEREJECTED`.



### Optimization

#### Canvas and video resolutions

We strongly recommend the use of the `JeelizResizer` helper in order to size the canvas to the display size in order to not compute more pixels than required. This helper also computes the best camera resolution, which is the closer to the canvas actual size. If the camera resolution is too high compared to the canvas resolution, your application will be unnecessarily slowed because it is quite costly to refresh the WebGL texture for each video frame. And if the video resolution is too low compared to the canvas resolution, the image will be blurry. You can take a look at the THREE.js boilerplate to see how it is used. To use the helper, you first need to include it in the HTML code :
```
<script type="text/javascript" src="https://appstatic.jeeliz.com/faceFilter/JeelizResizer.js"></script>
```
Then in your main script, before initializing Jeeliz FaceFilter, you should call it to size the canvas to the best resolution and to find the optimal video resolution :
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

A few tips :
* In term of optimisation, the WebGL based demos are more optimized than Canvas2D demos, which are still more optimized than CSS3D demos.
* Try to use lighter resources as possibles. Each texture image should have the lowest resolution as possible, use mipmapping for texture minification filtering.
* The more effects you use, the slower it will be. Add the 3D effects gradually to check that they do not penalize too much the frame rate.
* Use low polygon meshes.


### Multiple faces
It is possible to detect and track several faces at the same time. To enable this feature, you only have to specify the optional init parameter `maxFacesDetected`. Its maximum value is `8`. Indeed, if you are tracking for example 8 faces at the same time, the detection will be slower because there is 8 times less computing power per tracked face. If you have set this value to `8` but if there is only `1` face detected, it should not slow down too much compared to the single face tracking.

If multiple face tracking is enabled, the `callbackTrack` function is called with an array of detection states (instead of being executed with a simple detection state). The detection state format is still the same.

You can use our `Three.js` multiple faces detection helper, `helpers/JeelizThreejsHelper.js` to get started and test [this example](https://jeeliz.com/demos/faceFilter/demos/threejs/multiCubes/). The [main script](demos/threejs/multiCubes/demo_multiCubes.js) has only 60 lines of code !



### Changing the 3D Engine
It is possible to use another 3D engine than BABYLON.JS or THREE.JS. If you have accomplished this work, we would be interested to add your demonstration in this repository (or link to your code). Just open a pull request.

The 3D engine should share the WebGL context with FaceFilter API. The WebGL context is created by Jeeliz Face Filter. The background video texture is given directly as a `WebGLTexture` object, so it is usable only on the FaceFilter WebGL context. It would be more costly in term of computating time to have a second WebGL context for the 3D rendering, because at each new video frame we should transfert the video data from the `<video>` element to the 2 webgl contexts: the Jeeliz Face Filter WebGL context for processing, and the 3D engine WebGL Context for rendering. Fortunately, with BABYLON.JS or THREE.JS, it is easy to specify an already initialized WebGL context.



## Hosting

This API requires the user's webcam video feed through `MediaStream API`. So your application should be hosted by a HTTPS server (even with a self-signed certificate). It won't work at all with unsecure HTTP, even locally with some web browsers.

### The development server
For development purpose we provide a simple and minimalist HTTPS server in order to check out the demos or develop your very own filters. To launch it, execute in the bash console :

```bash
  python2 httpsServer.py
```
It requires Python 2.X. Then open in your web browser [https://localhost:4443](https://localhost:4443).


### Hosting optimization
You can use our hosted and up to date version of the library, available here :
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

If a compatibility error is triggered, please post an issue on this repository. If this is a problem with the webcam access, please first retry after closing all applications which could use your device (Skype, Messenger, other browser tabs and windows, ...). Please include :
* a screenshot of [webglreport.com - WebGL1](http://webglreport.com/?v=1) (about your `WebGL1` implementation),
* a screenshot of [webglreport.com - WebGL2](http://webglreport.com/?v=2) (about your `WebGL2` implementation),
* the log from the web console,
* the steps to reproduce the bug, and screenshots.



## Articles and tutorials
We are currently writing a series of tutorial for the API, starting by building some very basic filters and moving to harder ones.

* Creating a Snapchat-like face filter using Jeeliz FaceFilter API and THREE.JS :
  * Part 1: [Creating your first filter](https://jeeliz.com/blog/creating-a-snapchat-like-filter-with-jeelizs-facefilter-api-part-1-creating-your-first-filter/)
  * Part 2: [ User interactions and particles](https://jeeliz.com/blog/creating-a-snapchat-like-filter-with-jeelizs-facefilter-api-part-2-user-interactions-and-particles/)

* [Flying around the Globe with Cesium and Your Head](https://cesium.com/blog/2018/03/22/jeeliz-and-cesium/)

* [Build a multifacial face filter](https://webglacademy.jeeliz.com/courses.php?courses=19_25_27_33_34#34): Interactive step by step tutorial hosted on [WebGL Academy](http://www.webglacademy.com) where you learn to build a Statue of Liberty using THREE.js and this library

* [JSFiddle: Face detection and tracking in 25 lines](https://jsfiddle.net/jeeliz/2p34hbeh/)


## License
[Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html). This application is free for both commercial and non-commercial use.

We appreciate attribution by including the [Jeeliz logo](https://jeeliz.com/wp-content/uploads/2018/01/LOGO_JEELIZ_BLUE.png) and a link to the [Jeeliz website](https://jeeliz.com) in your application or desktop website. Of course we do not expect a large link to Jeeliz over your face filter, but if you can put the link in the credits/about/help/footer section it would be great.


## See also
Our newest deep learning based library is called *Weboji*. It detects 11 facial expressions in real time from the webcam video feed. Then they are reproduced on an avatar, either in 3D with a THREE.JS renderer or in 2D with a SVG renderer (so you can use it even if you are not a 3D developer). You can access to the github repository [here](https://github.com/jeeliz/jeelizWeboji).

If you just want to detect if the user is looking at the screen or not, [Jeeliz Glance Tracker](https://github.com/jeeliz/jeelizGlanceTracker) is what you are looking for. It can be useful to play and pause a video whether the user is watching or not. This library needs fewer resources and the neural network file is much lighter.

If you want to use this library for glasses virtual try-on (sunglasses, spectacles, ski masks), you can take a look at [Jeeliz VTO widget](https://github.com/jeeliz/jeelizGlassesVTOWidget). It includes a high quality and lightweight 3D engine which implements the following features: deferred shading, PBR, raytraced shadows, normal mapping, ... It also reconstructs the lighting environment around the user (ambient and directional lighting). But the glasses comes from a database hosted in our servers. If you want to add some models, please contact us.


## References
* [Jeeliz official website](https://jeeliz.com)
* [Babylon.JS official website with documentation, demos, examples...](https://www.babylonjs.com/)
* [Three.JS official website with documentation, demos, examples...](https://threejs.org/)
* [Cesium JS official website](https://cesiumjs.org/)
* [A-Frame official website](https://aframe.io/)
* [Webgl Academy: tutorials about WebGL and THREE.JS](http://www.webglacademy.com)

