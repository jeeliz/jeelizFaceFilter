# THREE.js demos

This README is specific to THREE.js issues.


## Blender exporter to Three.js legacy JSON format

**The oldest demos are relying on the deprecated THREE.js JSON legacy format, which has been removed from THREE.js from `THREE.js release 99`.
You can still find the Blender exporter plugin in this repository [here](https://github.com/jeeliz/jeelizFaceFilter/tree/master/libs/three/blenderExporter), but we don't maintain or provide support for it. We strongly encourage to use GLTF file format instead.**

If you still want to use the JSON Three.js legacy file format, here are some tips:

The original blender files are provided for all demonstrations. They are usually in the `/demoPath/dev/` path. The first step is to select the mesh in *Object* mode:


<p align="center">
<img src='https://jeeliz.com/uploads/BlenderSelectionObjet.png' />
</p>

Then here are the options we usualy choose to export the model to a JSON file :
<p align="center">
<img src='https://jeeliz.com/uploads/BlenderExportOptions.png' />
</p>

In this case we do not export the geometry normals, so we need to compute them on JavaScript side using `ourGeometry.computeVertexNormals()`. The `UVs` option in the `GEOMETRY` box is selected only if the object is textured using a specific UV mapping.


## 1 or 2 canvas?

Althought most of the demos are using only 1 canvas, for both Jeeliz FaceFilter and THREE.js (then they share the same WebGL context), it is better to use 2 separate canvas for the latest versions of THREE.js to avoid any WebGL state share related bugs. One is displayed on the background and is used to run Jeeliz FaceFilter and displays the video from the camera. The other canvas is displayed in front and renders the THREE.js scene with a transparent background. The [cube2cv](cube2cv/) demo can be used as a boilerplate.


## Resources

3D programming is not easy and we strongly encourage you to do some tutorials about THREE.js before making your own face filters using THREE.js. You can start with the interactive tutorials on [webglacademy.com](https://webglacademy.jeeliz.com). You can start with the 10 first tutorials about vanilla WebGL programming ( [WebGL Basis](https://webglacademy.jeeliz.com/courses.php?courses=0_1_20_2_3_4_23_5_6_7_10) ), then learn THREE.js with the [WebGL Academy THREE.js tutorials](https://webglacademy.jeeliz.com/courses.php?courses=19_25_27_33_34).