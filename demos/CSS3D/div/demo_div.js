"use strict";


//SETTINGS of this demo :
var SETTINGS={
    rotationOffsetX: 0, //negative -> look upper. in radians
    cameraFOV: 40,      //in degrees, 3D camera FOV
    pivotOffsetYZ: [0.2,0.2], //XYZ of the distance between the center of the cube and the pivot
    detectionThreshold: 0.5, //sensibility, between 0 and 1. Less -> more sensitive
    detectionHysteresis: 0.1,
    scale: 1 //scale of the 3D cube
};

//some globalz :
var ISDETECTED=false, GL, VIDEOSCREENSHADERPROGRAM, VIDEOTEXTURE, DIV, CAMERA, MOVEMENT;

//callback : launched if a face is detected or lost. TODO : add a cool particle effect WoW !
function detect_callback(isDetected){
    if (isDetected){
        console.log('INFO in detect_callback() : DETECTED');
    } else {
        console.log('INFO in detect_callback() : LOST');
    }
}

//create a perspective projection matrix :
function create_perspectiveCameraMatrix(fov, aspectRatio, zMin, zMax){
    var tan=Math.tan(fov*Math.PI/180),
        A=-(zMax+zMin)/(zMax-zMin),
          B=(-2*zMax*zMin)/(zMax-zMin);

    var m=new THREE.Matrix4();
    m.set(0.5/tan, 0 ,0, 0,
          0, 0.5*aspectRatio/tan,  0, 0,
          0, 0,         A, -1,
          0, 0,         B, 0);


     m.set(0.5/tan, 0 ,0, 0,
          0, 0.5*aspectRatio/tan,  0, 0,
          0, 0,         A, B,
          0, 0,         -1, 0);

    return m;
}

//apply a THREE.Matrix4 to a DOMElement with CSS3D :
function apply_matrix(threeMatrix, DOMElement){
    DOMElement.style.transform="matrix3d("+threeMatrix.elements.join(',')+")";
}

//compile a shader
function compile_shader(source, type, typeString) {
    var shader = GL.createShader(type);
    GL.shaderSource(shader, source);
    GL.compileShader(shader);
    if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
        alert("ERROR IN "+typeString+ " SHADER : " + GL.getShaderInfoLog(shader));
        console.log('Buggy shader source : \n', source);
        return false;
    }
    return shader;
};

//helper function to build the shader program :
function build_shaderProgram(shaderVertexSource, shaderFragmentSource, id) {
    //compile both shader separately
    var shaderVertex=compile_shader(shaderVertexSource, GL.VERTEX_SHADER, "VERTEX "+id);
    var shaderFragment=compile_shader(shaderFragmentSource, GL.FRAGMENT_SHADER, "FRAGMENT "+id);

    var shaderProgram=GL.createProgram();
    GL.attachShader(shaderProgram, shaderVertex);
    GL.attachShader(shaderProgram, shaderFragment);

    //start the linking stage :
    GL.linkProgram(shaderProgram);

    return shaderProgram;
} //end build_shaderProgram()


//build the 3D. called once when Jeeliz Face Filter is OK
function init_scene(spec){
    GL=spec.GL;
    VIDEOTEXTURE=spec.videoTexture;

    //CREATE THE VIDEO BACKGROUND
    VIDEOSCREENSHADERPROGRAM=build_shaderProgram(
        "attribute vec2 position;\n\
            varying vec2 vUV;\n\
            void main(void){\n\
                gl_Position=vec4(position, 0., 1.);\n\
                vUV=0.5+0.5*position;\n\
            }",
        "precision lowp float;\n\
            uniform sampler2D samplerVideo;\n\
            varying vec2 vUV;\n\
            void main(void){\n\
                gl_FragColor=texture2D(samplerVideo, vUV);\n\
            }",
        'VIDEOSCREEN');
    var samplerVideo=GL.getUniformLocation(VIDEOSCREENSHADERPROGRAM, 'samplerVideo');
    GL.useProgram(VIDEOSCREENSHADERPROGRAM);
    GL.uniform1i(samplerVideo, 0);

    //init projection parameters
    var aspectRatio=spec.canvasElement.width / spec.canvasElement.height;
    CAMERA={
        aspect: aspectRatio,
        fov: SETTINGS.cameraFOV,
        matrix: create_perspectiveCameraMatrix(SETTINGS.cameraFOV, aspectRatio, 0.1, 100)
    }

    //movement matrix
    MOVEMENT={
        matrix: new THREE.Matrix4(),
        euler: new THREE.Euler(),
        stackMatrix: new THREE.Matrix4()
    };
} //end init_scene()

//launched by body.onload() :
function main(){
    DIV=document.getElementById('jeelizFaceFilterFollow');
    if (!DIV){
        alert('ERROR : You should have an element which id=jeelizFaceFilterFollow in the DOM. Abort.');
        return;
    }

    JEEFACEFILTERAPI.init({
        canvasId: 'jeeFaceFilterCanvas',
        NNCpath: '../../../dist/', //root of NNC.json file
        callbackReady: function(errCode, spec){
            if (errCode){
                console.log('AN ERROR HAPPENS. SORRY BRO :( . ERR =', errCode);
                return;
            }

            console.log('INFO : JEEFACEFILTERAPI IS READY');
            init_scene(spec);
        }, //end callbackReady()

        //called at each render iteration (drawing loop)
        callbackTrack: function(detectState){
            if (ISDETECTED && detectState.detected<SETTINGS.detectionThreshold-SETTINGS.detectionHysteresis){
                //DETECTION LOST
                detect_callback(false);
                ISDETECTED=false;
            } else if (!ISDETECTED && detectState.detected>SETTINGS.detectionThreshold+SETTINGS.detectionHysteresis){
                //FACE DETECTED
                detect_callback(true);
                ISDETECTED=true;
            }

            if (ISDETECTED){
                //move the cube in order to fit the head
                var tanFOV=Math.tan(CAMERA.aspect*CAMERA.fov*Math.PI/360); //tan(FOV/2), in radians
                var W=detectState.s;  //relative width of the detection window (1-> whole width of the detection window)
                var D=1/(2*W*tanFOV); //distance between the front face of the cube and the camera
                
                //coords in 2D of the center of the detection window in the viewport :
                var xv=detectState.x;
                var yv=detectState.y;
                
                //coords in 3D of the center of the cube (in the view coordinates system)
                var z=-D-0.5;   // minus because view coordinate system Z goes backward. -0.5 because z is the coord of the center of the cube (not the front face)
                var x=xv*D*tanFOV;
                var y=yv*D*tanFOV/CAMERA.aspect;

                //move and rotate the div
                MOVEMENT.matrix.setPosition(x,y+SETTINGS.pivotOffsetYZ[0],z+SETTINGS.pivotOffsetYZ[1]);
                MOVEMENT.euler.set(detectState.rx+SETTINGS.rotationOffsetX, detectState.ry, detectState.rz, "XYZ");
                MOVEMENT.matrix.makeRotationFromEuler(MOVEMENT.euler);

               // MOVEMENT.stackMatrix.multiplyMatrices(CAMERA.matrix, MOVEMENT.matrix);
                MOVEMENT.stackMatrix.multiplyMatrices(MOVEMENT.matrix, CAMERA.matrix);
                apply_matrix(MOVEMENT.stackMatrix, DIV);
                //THREEFACEOBJ3D.position.set(x,y+SETTINGS.pivotOffsetYZ[0],z+SETTINGS.pivotOffsetYZ[1]);
                //THREEFACEOBJ3D.rotation.set(detectState.rx+SETTINGS.rotationOffsetX, detectState.ry, detectState.rz, "XYZ");
            }

            GL.useProgram(VIDEOSCREENSHADERPROGRAM);
            GL.activeTexture(GL.TEXTURE0);
            GL.bindTexture(GL.TEXTURE_2D, VIDEOTEXTURE);

            //FILL VIEWPORT
            GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0);

        } //end callbackTrack()
    }); //end JEEFACEFILTERAPI.init call
} //end main()

