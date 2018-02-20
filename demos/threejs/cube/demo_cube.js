

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
var THREERENDERER, THREEFACEOBJ3D, THREEFACEOBJ3DPIVOTED, THREESCENE, THREECAMERA;
var ISDETECTED=false;

//callback : launched if a face is detected or lost. TODO : add a cool particle effect WoW !
function detect_callback(isDetected){
    if (isDetected){
        console.log('INFO in detect_callback() : DETECTED');
    } else {
        console.log('INFO in detect_callback() : LOST');
    }
}

//build the 3D. called once when Jeeliz Face Filter is OK
function init_threeScene(spec){
    //INIT THE THREE.JS context
    THREERENDERER=new THREE.WebGLRenderer({
        context: spec.GL
    });

    //COMPOSITE OBJECT WHICH WILL FOLLOW THE HEAD
    //in fact we create 2 objects to be able to shift the pivot point
    THREEFACEOBJ3D=new THREE.Object3D();
    THREEFACEOBJ3D.frustumCulled=false;
    THREEFACEOBJ3DPIVOTED=new THREE.Object3D();
    THREEFACEOBJ3DPIVOTED.frustumCulled=false;
    THREEFACEOBJ3DPIVOTED.position.set(0, -SETTINGS.pivotOffsetYZ[0], -SETTINGS.pivotOffsetYZ[1]);
    THREEFACEOBJ3DPIVOTED.scale.set(SETTINGS.scale, SETTINGS.scale, SETTINGS.scale);
    THREEFACEOBJ3D.add(THREEFACEOBJ3DPIVOTED);

    //CREATE A CUBE
    var cubeGeometry=new THREE.BoxGeometry(1,1,1);
    var cubeMaterial=new THREE.MeshNormalMaterial();
    var threeCube=new THREE.Mesh(cubeGeometry, cubeMaterial);
    threeCube.frustumCulled=false;
    THREEFACEOBJ3DPIVOTED.add(threeCube);

    //CREATE THE SCENE
    THREESCENE=new THREE.Scene();
    THREESCENE.add(THREEFACEOBJ3D);

    //CREATE THE VIDEO BACKGROUND
    var videoMaterial=new THREE.RawShaderMaterial({
        depthWrite: false,
        depthTest: false,
        vertexShader: "attribute vec3 position;\n\
            varying vec2 vUV;\n\
            void main(void){\n\
                gl_Position=vec4(position,1.);\n\
                vUV=0.5+0.5*position.xy;\n\
            }",
        fragmentShader: "precision lowp float;\n\
            uniform sampler2D videoSampler;\n\
            varying vec2 vUV;\n\
            void main(void){\n\
                gl_FragColor=texture2D(videoSampler, vUV);\n\
            }"
    });
    var videoGeometry=new THREE.BufferGeometry()
    var videoScreenCorners=new Float32Array([-1,-1,0,   1,-1,0,   1,1,0,   -1,1,0]);
    videoGeometry.addAttribute( 'position', new THREE.BufferAttribute( videoScreenCorners, 3 ) );
    videoGeometry.setIndex(new THREE.BufferAttribute(new Uint16Array([0,1,2, 0,2,3]), 1));
    var videoMesh=new THREE.Mesh(videoGeometry, videoMaterial);
    videoMesh.onBeforeRender=function(){
        //tweak to give directly the video texture to three.JS
        spec.GL.activeTexture(spec.GL.TEXTURE0);
        spec.GL.bindTexture(spec.GL.TEXTURE_2D, spec.videoTexture);
    };
    videoMesh.renderOrder=-1000; //render first
    videoMesh.frustumCulled=false;
    THREESCENE.add(videoMesh);

    //CREATE THE CAMERA
    var aspecRatio=spec.canvasElement.width / spec.canvasElement.height;
    THREECAMERA=new THREE.PerspectiveCamera(SETTINGS.cameraFOV, aspecRatio, 0.1, 100);
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
            init_threeScene(spec);
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

            //trigger the render of the THREE.JS SCENE
            THREERENDERER.render(THREESCENE, THREECAMERA);
        } //end callbackTrack()
    }); //end JEEFACEFILTERAPI.init call
} //end main()

