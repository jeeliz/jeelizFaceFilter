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
var THREEVIDEOTEXTURE, THREERENDERER, THREEFACEOBJ3D, THREEFACEOBJ3DPIVOTED, THREESCENE, THREECAMERA, AFRAMEINSTANCE;
var ISDETECTED=false, ISLOADED=false;

//callback : launched if a face is detected or lost. TODO : add a cool particle effect WoW !
function detect_callback(isDetected){
    if (isDetected){
        console.log('INFO in detect_callback() : DETECTED');
    } else {
        console.log('INFO in detect_callback() : LOST');
    }
}

//recursive function to find a specific element in the AFRAME sceneGraph :
function extract_threeChildrenWithId(id, threeElt){
    if (typeof(threeElt)==='undefined') return false;
    if (!threeElt || !threeElt.type) return false;
    if (threeElt.el && threeElt.el.id===id) return [threeElt];
    if (!threeElt.children || threeElt.children.length===0) return false;
    var r=[];
    threeElt.children.forEach(function(threeChild){
        var zou=extract_threeChildrenWithId(id, threeChild);
        if (zou && zou.length){
            r=r.concat(zou);
        }
    });
    return r;
}


//unit modified version of Aframe. called once when Jeeliz Face Filter is OK
function init_aFrame(spec){
    AFRAMEINSTANCE=startAframe({
        context: spec.GL,
        canvas: spec.canvasElement
    });

    //get AFRAME initialized THREE.JS renderer
    THREERENDERER=AFRAMEINSTANCE.renderer;
    init_threeScene(spec);
}

//build the 3D
function init_threeScene(spec){
    //COMPOSITE OBJECT WHICH WILL FOLLOW THE HEAD
    //in fact we create 2 objects to be able to shift the pivot point
    THREEFACEOBJ3D=new THREE.Object3D();
    THREEFACEOBJ3D.frustumCulled=false;
    THREEFACEOBJ3DPIVOTED=new THREE.Object3D();
    THREEFACEOBJ3DPIVOTED.frustumCulled=false;
    THREEFACEOBJ3DPIVOTED.position.set(0, -SETTINGS.pivotOffsetYZ[0], -SETTINGS.pivotOffsetYZ[1]);
    THREEFACEOBJ3DPIVOTED.scale.set(SETTINGS.scale, SETTINGS.scale, SETTINGS.scale);
    THREEFACEOBJ3D.add(THREEFACEOBJ3DPIVOTED);

    //get the scene from A-Frame :
    THREESCENE=AFRAMEINSTANCE.object3D;
    THREESCENE.add(THREEFACEOBJ3D);

    var threeFaceFollowers=extract_threeChildrenWithId('jeelizFaceFilterFollow', THREESCENE);
    if (!threeFaceFollowers || !threeFaceFollowers.length){
        alert('No element with id=jeelizFaceFilterFollow has been found in the A-Frame scene. You should have at least one. Otherwise none of your stuffs will follow the head');
    } else  {
        threeFaceFollowers.forEach(function(threeStuff){
            THREEFACEOBJ3DPIVOTED.add(threeStuff);
        })
    }

    //init video texture with red
    THREEVIDEOTEXTURE=new THREE.DataTexture( new Uint8Array([255,0,0]), 1, 1, THREE.RGBFormat);
    THREEVIDEOTEXTURE.needsUpdate=true;

    //CREATE THE VIDEO BACKGROUND
    var videoMaterial=new THREE.RawShaderMaterial({
        depthWrite: false,
        vertexShader: "attribute vec2 position;\n\
            varying vec2 vUV;\n\
            void main(void){\n\
                gl_Position=vec4(position, 1., 1.);\n\
                vUV=0.5+0.5*position;\n\
            }",
        fragmentShader: "precision lowp float;\n\
            uniform sampler2D samplerVideo;\n\
            varying vec2 vUV;\n\
            void main(void){\n\
                gl_FragColor=texture2D(samplerVideo, vUV);\n\
            }",
         uniforms:{
            samplerVideo: {value: THREEVIDEOTEXTURE}
         }
    });
    var videoGeometry=new THREE.BufferGeometry()
    var videoScreenCorners=new Float32Array([-1,-1,   1,-1,   1,1,   -1,1]);
    videoGeometry.addAttribute( 'position', new THREE.BufferAttribute( videoScreenCorners, 2 ) );
    videoGeometry.setIndex(new THREE.BufferAttribute(new Uint16Array([0,1,2, 0,2,3]), 1));
    var videoMesh=new THREE.Mesh(videoGeometry, videoMaterial);
    videoMesh.onAfterRender=function(){
        //replace THREEVIDEOTEXTURE.__webglTexture by the real video texture
        THREERENDERER.properties.update(THREEVIDEOTEXTURE, '__webglTexture', spec.videoTexture);
        delete(videoMesh.onAfterRender);
    };
    videoMesh.frustumCulled=false;
    THREESCENE.add(videoMesh);

    //CREATE THE CAMERA
    var aspecRatio=spec.canvasElement.width / spec.canvasElement.height;
    THREECAMERA=new THREE.PerspectiveCamera(SETTINGS.cameraFOV, aspecRatio, 0.1, 100);

    //replace the default Aframe camera by our camera :
    AFRAMEINSTANCE.camera=THREECAMERA;

    ISLOADED=true;
} //end init_threeScene()

//launched by body.onload() :
function main(){
    JEEFACEFILTERAPI.init({
        canvasId: 'jeeFaceFilterCanvas',
        NNCpath: '../../../dist/', //root of NNC.json file
        callbackReady: function(errCode, spec){
            if (errCode){
                console.log('AN ERROR HAPPENS. SORRY BRO :( . ERR =', errCode);
                return;
            }

            console.log('INFO : JEEFACEFILTERAPI IS READY');
            init_aFrame(spec);
        }, //end callbackReady()

        //called at each render iteration (drawing loop)
        callbackTrack: function(detectState){
            if (!ISLOADED){
                return;
            }

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
                var tanFOV=Math.tan(THREECAMERA.aspect*THREECAMERA.fov*Math.PI/360); //tan(FOV/2), in radians
                var W=detectState.s;  //relative width of the detection window (1-> whole width of the detection window)
                var D=1/(2*W*tanFOV); //distance between the front face of the cube and the camera
                
                //coords in 2D of the center of the detection window in the viewport :
                var xv=detectState.x;
                var yv=detectState.y;
                
                //coords in 3D of the center of the cube (in the view coordinates system)
                var z=-D-0.5;   // minus because view coordinate system Z goes backward. -0.5 because z is the coord of the center of the cube (not the front face)
                var x=xv*D*tanFOV;
                var y=yv*D*tanFOV/THREECAMERA.aspect;

                //move and rotate the cube
                THREEFACEOBJ3D.position.set(x,y+SETTINGS.pivotOffsetYZ[0],z+SETTINGS.pivotOffsetYZ[1]);
                THREEFACEOBJ3D.rotation.set(detectState.rx+SETTINGS.rotationOffsetX, detectState.ry, detectState.rz, "XYZ");
            }

            //reinitialize the state of THREE.JS because JEEFACEFILTER have changed stuffs
            THREERENDERER.state.reset();

            //trigger the render of the THREE.JS SCENE
            THREERENDERER.render(THREESCENE, THREECAMERA);
        } //end callbackTrack()
    }); //end JEEFACEFILTERAPI.init call
} //end main()

