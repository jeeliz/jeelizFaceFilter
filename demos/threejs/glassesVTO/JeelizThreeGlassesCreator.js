/*
  Build 3D glasses.
  spec properties: 
     * <string> envMapURL: url of the envMap
     * <string> frameMeshURL: url of the mesh used for the glasses frames
     * <string> lensesMeshURL: url of the mesh of the lenses
     * <string> occluderURL: url of the occluder
*/

const JeelizThreeGlassesCreator = function(spec){
  const threeGlasses = new THREE.Object3D();
  
  // envMap texture:
  const textureEquirec = new THREE.TextureLoader().load( spec.envMapURL );
  textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
  textureEquirec.magFilter = THREE.LinearFilter;
  textureEquirec.minFilter = THREE.LinearMipMapLinearFilter;

  // glasses frames:
  new THREE.BufferGeometryLoader().load(spec.frameMeshURL, function(glassesFramesGeometry){
    glassesFramesGeometry.computeVertexNormals();

    // custom material with fading at the end of the branches:
    const us = THREE.ShaderLib.standard.uniforms;
    const uniforms = {
        roughness: {value: 0},
        metalness: {value: 0.05},
        reflectivity: {value: 1},
        envMap: {value: textureEquirec},
        envMapIntensity: {value: 1},
        diffuse: {value: new THREE.Color().setHex(0xffffff)},
        uBranchFading: {value: new THREE.Vector2(-90, 60)} // first value: position (lower -> to the back), second: transition brutality
      };

    // tweak vertex shader to give the Z of the current point:
    let vertexShaderSource = "varying float vPosZ;\n" + THREE.ShaderLib.standard.vertexShader;
    vertexShaderSource = vertexShaderSource.replace('#include <fog_vertex>', 'vPosZ = position.z;');

    // tweak fragment shader to apply transparency at the end of the branches:
    let fragmentShaderSource = "uniform vec2 uBranchFading;\n varying float vPosZ;\n" + THREE.ShaderLib.standard.fragmentShader;
    const GLSLcomputeAlpha = 'gl_FragColor.a = smoothstep(uBranchFading.x - uBranchFading.y*0.5, uBranchFading.x + uBranchFading.y*0.5, vPosZ);'
    fragmentShaderSource = fragmentShaderSource.replace('#include <fog_fragment>', GLSLcomputeAlpha);

    const mat = new THREE.ShaderMaterial({
      vertexShader: vertexShaderSource,
      fragmentShader: fragmentShaderSource,
      uniforms: uniforms,
      flatShading: false,
      transparent: true,
      extensions: { // fix for https://github.com/jeeliz/jeelizFaceFilter/issues/154
        //derivatives: true,
        //shaderTextureLOD: true
      }
    });

    mat.envMap = textureEquirec;
    const glassesFramesMesh = new THREE.Mesh(glassesFramesGeometry, mat);
    threeGlasses.add(glassesFramesMesh);

    window.debugMatFrames = mat; // to debug the material il the JS console
  });

  // glasses lenses:
  new THREE.BufferGeometryLoader().load(spec.lensesMeshURL, function(glassesLensesGeometry){
    glassesLensesGeometry.computeVertexNormals();
    const mat = new THREE.MeshBasicMaterial({
      envMap: textureEquirec,
      opacity: 0.7,
      color: new THREE.Color().setHex(0x2233aa),
      transparent: true,
      fog: false
    });
    const glassesLensesMesh = new THREE.Mesh(glassesLensesGeometry, mat);
    threeGlasses.add(glassesLensesMesh);

    window.debugMatLens = mat; // to debug the material il the JS console
  });

  const occluderMesh = JeelizThreeHelper.create_threejsOccluder(spec.occluderURL);
  
  return {
    glasses: threeGlasses,
    occluder: occluderMesh
  };
}
