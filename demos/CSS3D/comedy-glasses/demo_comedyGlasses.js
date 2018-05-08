"use strict";


//SETTINGS of this demo :
var SETTINGS={
    rotationOffsetX: 0, //negative -> look upper. in radians
    cameraFOV: 40,      //in degrees, 3D camera FOV
    pivotOffsetYZ: [-0.15,-0.15], //position the rotation pivot along Y and Z axis
    detectionThreshold: 0.75, //sensibility, between 0 and 1. Less -> more sensitive
    detectionHysteresis: 0.05,
    mouthOpeningThreshold: 0.5, //sensibility of mouth opening, between 0 and 1
    mouthOpeningHysteresis: 0.05,
    scale: [1.3,1.3], //scale of the DIV along horizontal and vertical axis
    positionOffset: [0,0.1,-0.2] //set a 3D position fofset to the div
};

//some globalz :
var ISDETECTED=false, ISMOUTHOPENED=false, GL, VIDEOSCREENSHADERPROGRAM, VIDEOTEXTURE, DIV, CAMERA, MOVEMENT;

//some handy functions to avoid jquery
//source : https://jaketrent.com/post/addremove-classes-raw-javascript/
function hasClass(el, className) {
  if (el.classList)
    return el.classList.contains(className)
  else
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

function addClass(el, className) {
  if (el.classList)
    el.classList.add(className)
  else if (!hasClass(el, className)) el.className += " " + className
}

function removeClass(el, className) {
  if (el.classList)
    el.classList.remove(className)
  else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className=el.className.replace(reg, ' ')
  }
}


//callback : launched if a face is detected or lost. TODO : add a cool particle effect WoW !
function detect_callback(isDetected){
    if (isDetected){
        console.log('INFO in detect_callback() : DETECTED');
    } else {
        console.log('INFO in detect_callback() : LOST');
    }
}

//apply a THREE.Matrix4 to a DOMElement with CSS3D :
//see https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/translate3d
function apply_matrix(threeMatrix, DOMElement){
    var cssVal="perspective("+DOMElement.style.perspective+')'
          +" matrix3d("+threeMatrix.elements.join(',')+")";
    DOMElement.style.transform=cssVal;
    DOMElement.style['-webkit-transform']=cssVal;
}

function apply_perspective(perspectivePx, DOMElement){
    DOMElement.style.perspective=perspectivePx.toString()+'px';
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
    var domRect = spec.canvasElement.getBoundingClientRect();
    var width=domRect.width;
    var height=domRect.height;

    //set DIV CSS style :
    DIV.style.position='fixed';
    DIV.style.transformStyle='preserve-3d';
    DIV.style.left=domRect.left.toString()+'px';
    DIV.style.top=domRect.top.toString()+'px';
    DIV.style.width=width.toString()+'px';
    DIV.style.height=height.toString()+'px';
    DIV.style.display='none';
    
    var aspectRatio=width / height;
    var w2=width/2, h2=height/2;
    var perspectivePx=Math.round(Math.pow( w2*w2 + h2*h2, 0.5 ) / Math.tan( SETTINGS.cameraFOV * Math.PI / 180 ));
    apply_perspective(perspectivePx, DIV);
    CAMERA={
        scale: new THREE.Vector3(width, height, perspectivePx/2.0),
        aspect: aspectRatio,
        fov: SETTINGS.cameraFOV
    };

    //movement matrix
    MOVEMENT={
        scale: new THREE.Vector3(SETTINGS.scale[0], SETTINGS.scale[1], 1),
        position: new THREE.Vector3(),
        matrix: new THREE.Matrix4(),
        euler: new THREE.Euler(),
        positionOffset: new THREE.Vector3().fromArray(SETTINGS.positionOffset),
        pivotOffset: new THREE.Vector3(),
        pivotOffset0: new THREE.Vector3(0,-SETTINGS.pivotOffsetYZ[0], -SETTINGS.pivotOffsetYZ[1])
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
        animateDelay: 2, //let small delay to avoid DOM freeze
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
                DIV.style.display='none';
            } else if (!ISDETECTED && detectState.detected>SETTINGS.detectionThreshold+SETTINGS.detectionHysteresis){
                //FACE DETECTED
                detect_callback(true);
                ISDETECTED=true;
                DIV.style.display='block';
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

                //compute position and rotation in 3D
                MOVEMENT.euler.set(-detectState.rx-SETTINGS.rotationOffsetX, -detectState.ry, detectState.rz, "XYZ");
                
                MOVEMENT.position.set(-x, -y+SETTINGS.pivotOffsetYZ[0], z+SETTINGS.pivotOffsetYZ[1]);
                MOVEMENT.pivotOffset.copy(MOVEMENT.pivotOffset0).sub(MOVEMENT.positionOffset);
                MOVEMENT.pivotOffset.applyEuler(MOVEMENT.euler);
                MOVEMENT.position.add(MOVEMENT.pivotOffset);
                MOVEMENT.position.multiplyVectors(MOVEMENT.position, CAMERA.scale);

                //compute the movement matrix
                MOVEMENT.matrix.makeRotationFromEuler(MOVEMENT.euler); //warning : reset the position
                MOVEMENT.matrix.setPosition(MOVEMENT.position);
                MOVEMENT.matrix.scale(MOVEMENT.scale);

                //apply the matrix to the DIV
                apply_matrix(MOVEMENT.matrix, DIV);

                //detects mouth opening
                var mouthOpening=detectState.expressions[0];
                if (ISMOUTHOPENED && mouthOpening<SETTINGS.mouthOpeningThreshold-SETTINGS.mouthOpeningHysteresis){
                    //user closes mouth
                    removeClass(DIV, 'mouthOpened');
                    addClass(DIV, 'mouthClosed');
                    ISMOUTHOPENED=false;
                } else if (!ISMOUTHOPENED && mouthOpening>SETTINGS.mouthOpeningThreshold+SETTINGS.mouthOpeningHysteresis){
                    //user opens mouth
                    removeClass(DIV, 'mouthClosed');
                    addClass(DIV, 'mouthOpened');
                    ISMOUTHOPENED=true;
                }
            } //end if user detected

            GL.useProgram(VIDEOSCREENSHADERPROGRAM);
            GL.activeTexture(GL.TEXTURE0);
            GL.bindTexture(GL.TEXTURE_2D, VIDEOTEXTURE);

            //FILL VIEWPORT
            GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0);

        } //end callbackTrack()
    }); //end JEEFACEFILTERAPI.init call
} //end main()

