# Helpers

Helper scripts used by several categories of demos. They mask the complexity of the lib.
* `Canvas2DDisplay.js` : cf [canvas 2D - face detection and tracking demo](https://jeeliz.com/demos/faceFilter/demos/canvas2D/faceTrack/). Helper for Canvas2D rendering.
* `HeadControls.js` : cf Head controlled demos ([Head controlled Pacman](https://jeeliz.com/demos/faceFilter/demos/pacman/) for example)
* `JeelizThreejsHelper.js` : cf [THREE.JS multiple face tracking demo](https://jeeliz.com/demos/faceFilter/demos/threejs/multiCubes/)
* `JeelizResize.js` : Helper to find the best canvas and webcam resolutions. Explained [in the Optimization section of the main README](https://github.com/jeeliz/jeelizFaceFilter#optimization)
* `JeelizFaceCut.js` : Helper to cut the face in 2D from the video, and processing color correction. It is used in the [FaceSwap demo](https://jeeliz.com/demos/faceFilter/demos/faceReplacement/faceSwap/)