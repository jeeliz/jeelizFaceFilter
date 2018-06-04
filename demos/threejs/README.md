# THREE.js based demos

This README is specific to THREE.js problems. I had many questions more about THREE.js than FaceFilter.

## Blender exporter
The original blender files are provided for all demonstration. They are usually in the `/demoPath/dev/` path. If there are not provided, please open a new issue on this repository. The first step is to select the mesh in *Object* mode :
<p align="center">
<img src='https://jeeliz.com/uploads/BlenderSelectionObjet.png' />
</p>

Then here are the options we usualy choose to export the model to a JSON file :
<p align="center">
<img src='https://jeeliz.com/uploads/BlenderExportOptions.png' />
</p>

In this case we do not export the geometry normals, so we need to compute them on JavaScript side using `ourGeometry.computeVertexNormals()`. The `UVs` option in the `GEOMETRY` box is selected only if the object is textured using a specific UV mapping.

3D programming is not easy and we strongly encourage you to do some tutorials about THREE.js before making your own face filters using THREE.js. You can start with the interactive tutorials on [webglacademy.com](https://webglacademy.jeeliz.com). You can start with the 10 first tutorials about vanilla WebGL programming ( [WebGL Basis](https://webglacademy.jeeliz.com/courses.php?courses=0_1_20_2_3_4_23_5_6_7_10) ), then learn THREE.js with the [WebGL Academy THREE.js tutorials](https://webglacademy.jeeliz.com/courses.php?courses=19_25_27_33_34).