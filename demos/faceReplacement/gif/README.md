# FaceReplacement in GIF demo

This demonstration deserves some additionnal information because it is more complex than the others.

## GIF parsing
We use 2 libraries to extract informations from the GIF :
* [gif-frames](https://github.com/benwiley4000/gif-frames) to extract GIF frames into separate `canvas` elements,
* [gify](https://github.com/rfrench/gify/blob/master/example.html) to read GIF metadata (animation duration, resolutions, ...)

To improve the demonstration it may be interesting to merge these 2 libraries (which are both released under MIT license) into 1 library which extract gif metadata and reads frames.

## Face detection
The main code of the demo is in `main.js`. It begins with a dictionnary, `SETTINGS`, to set custom settings. The URL of the gif can be provided. If `SETTINGS.detectedStates` is not provided we first search for the face in every GIF frame before starting the face replacement rendering. This search can be a bit long. Indeed,
  * If a face is detected in the frame we confirm the detection during `SETTINGS.nDetectsGif` iterations,
  * If a face is not detected we run `SETTINGS.nMaxTestsGif` iterations before admitting that the face cannot be found and process the next frame. It can be long...
At the end of the detection, an object is loggued in the web console. This is the detection state :
```
detectStates = [{x:-0.475,y:-0.152,s:0.278,ry:0.225,rz:0},{x:-0.457,y:-0.17,s:0.287,ry:0.206,rz:-0.011},false]
```
It is an array with as many elements as frame. Each element is the face detection state for a GIF frame. If the face is not detected it is set to `false`. Each frame detection state includes this properties :
* `x` : the position of the center of the head along the horizontal axis, between `-1` and `1`, from left to right,
* `y` : the position of the center of the head along the vertical axis, between `-1` and `1`, from bottom to top,
* `s` : the relative scale of the head, between `0` and `1` (fills the whole viewport along the horizontal axis),
* `ry` : the head rotation angle around the vertical axis, in radians,
* `rz` : the head rotation angle around the depth axis, in radians.

You can copy this object from the console and provide it directly to avoid the search step. You can also compute it with another algorithm or declare it manually if the detection of the face in the GIF is not good. For example if you want to do face replacement on a Chewbacca gif `FaceFilter API` will not work because CHewbacca's face is too far from a standard human face so you will have to provide the `detectedStates` object.

By default, if the face is not detected in a frame, we will interpolate the detection state using the first frame where the face is detected before and after. You can change this behaviour by playing with `SETTINGS.hideIfNotDetectedDuringNframes`. If you set this value at `3` for example, there is no face replacement if no face is detected in `3` consecutive frames or more.


## Color correction
In order to compute a color transformation to homogenize the color between the gif frame and the webcam image, 
* We first detect the head in both sources and we reduce it to a square texture of `SETTINGS.hueTextureSizePx` pixels (typically `SETTINGS.hueTextureSizePx=4`). The reduction is proceeded using mipmapping, so this value should be PoT,
* Then during the final rendering, in the fragment shader,
    * We fetch a texel from the reduced gif frame image (the destination of the color transformation) and we compute it in the HSV normalized color space,
    * We fetch a texel from the user reduced face cropped (the source of the color transformation) and we compute it in the HSV normalized color space,
    * We compute the color transform by computing the hue offset and the ratio between source and destination saturation and values,
    * We fetch a texel from the cropped user image (not reduced), we compute it in the normalized HSV color space, we apply the transformation and we output the color value back in the RGB color space. That's it !

To compute the color transformation, we work with very reduced images to avoid artifacts due to the high frequency face patterns.


## Try with your own GIFs
Even if you can try with your own GIFs, `FaceFilter API` often has trouble detecting the face from the GIF. This is because
* GIFs are often very low resolution (the input of the face detection neural network is 64x64 pixels). For example is you try with a GIF which is 80 pixels heights, and if the face measures 1/4 of the total height, the face resolution is around 20x20 pixels, which is really low,
* GIFs uses 8 bits (or less) indexed color palette, so there are color quantization errors, which can makes either borders if there is no [color dithering](https://en.wikipedia.org/wiki/Dither) or noise if dithering is applied. It tends to disturb `Jeeliz Facefilter API`.

The result is not good if the face in the GIF is too often turned.



## Take control
If you want to master and change this demonstration, I strongly advice to :
* First masterize `FaceFilter API` by reading the main `README`, and playing with the boilerplates,
* Take a look at the face replacement in a simple image demo (in `../image/`). It is easier because it does not handle the animation,
* Then this demonstration is written using vanilla WebGL. You can learn it on [WebGL Academy](http://www.webglacademy.com) and practice it on [Shadertoy](https://www.shadertoy.com/).