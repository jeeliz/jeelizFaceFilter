"use strict";

//SETTINGS of this demo :
var SETTINGS={
    gltfModelURL: 'DamagedHelmet/glTF/DamagedHelmet.gltf',
    cubeMapURL: 'Bridge2/',
    rotationOffsetX: 0, //negative -> look upper. in radians
    cameraFOV: 40,      //in degrees, 3D camera FOV
    pivotOffsetYZ: [0.2,0.2], //XYZ of the distance between the center of the cube and the pivot
    detectionThreshold: 0.75, //sensibility, between 0 and 1. Less -> more sensitive
    detectionHysteresis: 0.05,
    offsetYZ: [0.3,0], //offset of the model in 3D along vertical and depth axis
    scale: 2.2 //width in 3D of the GLTF model
};

//some globalz :
var THREEVIDEOTEXTURE, THREERENDERER, THREEFACEOBJ3D, THREEFACEOBJ3DPIVOTED, THREESCENE, THREECAMERA, CANVASELEMENT;
var ISDETECTED=false;

//callback : launched if a face is detected or lost. TODO : add a cool particle effect WoW !
function detect_callback(isDetected){
    if (isDetected){
        THREEFACEOBJ3D.visible=true;
        console.log('INFO in detect_callback() : DETECTED');
    } else {
        THREEFACEOBJ3D.visible=false;
        console.log('INFO in detect_callback() : LOST');
    }
}



//build the 3D. called once when Jeeliz Face Filter is OK
function init_threeScene(spec){
    CANVASELEMENT=spec.canvasElement;

    //INIT THE THREE.JS context
    THREERENDERER=new THREE.WebGLRenderer({
        context: spec.GL,
        canvas: CANVASELEMENT
    });

    //COMPOSITE OBJECT WHICH WILL FOLLOW THE HEAD
    //in fact we create 2 objects to be able to shift the pivot point
    THREEFACEOBJ3D=new THREE.Object3D();
    THREEFACEOBJ3D.frustumCulled=false;
    THREEFACEOBJ3DPIVOTED=new THREE.Object3D();
    THREEFACEOBJ3DPIVOTED.frustumCulled=false;
    THREEFACEOBJ3DPIVOTED.position.set(0, -SETTINGS.pivotOffsetYZ[0], -SETTINGS.pivotOffsetYZ[1]);
    THREEFACEOBJ3D.add(THREEFACEOBJ3DPIVOTED);

    //CREATE THE ENVMAP
    var path = SETTINGS.cubeMapURL;
    var format = '.jpg';
    var envMap = new THREE.CubeTextureLoader().load( [
        path + 'posx' + format, path + 'negx' + format,
        path + 'posy' + format, path + 'negy' + format,
        path + 'posz' + format, path + 'negz' + format
    ] );

    //IMPORT THE GLTF MODEL
    //from https://threejs.org/examples/#webgl_loader_gltf
    var gltfLoader = new THREE.GLTFLoader();
    gltfLoader.load( SETTINGS.gltfModelURL, function ( gltf ) {
        gltf.scene.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.material.envMap = envMap;
            }
        } );
        gltf.scene.frustumCulled=false;
        
        //center and scale the object
        var bbox=new THREE.Box3().expandByObject(gltf.scene);

        //center the model :
        var centerBBox=bbox.getCenter(new THREE.Vector3());
        gltf.scene.position.add(centerBBox.multiplyScalar(-1));
        gltf.scene.position.add(new THREE.Vector3(0,SETTINGS.offsetYZ[0], SETTINGS.offsetYZ[1]));

        //scale the model according to its width
        var sizeX=bbox.getSize(new THREE.Vector3()).x;
        gltf.scene.scale.multiplyScalar(SETTINGS.scale/sizeX);

        //dispatch the model
        THREEFACEOBJ3DPIVOTED.add( gltf.scene );
    } ); //end gltfLoader.load callback

    //CREATE THE SCENE
    THREESCENE=new THREE.Scene();
    THREESCENE.add(THREEFACEOBJ3D);

    //init video texture with red
    THREEVIDEOTEXTURE=new THREE.DataTexture( new Uint8Array([255,0,0]), 1, 1, THREE.RGBFormat);
    THREEVIDEOTEXTURE.needsUpdate=true;

    //CREATE THE VIDEO BACKGROUND
    var videoMaterial=new THREE.RawShaderMaterial({
        depthWrite: false,
        depthTest: false,
        vertexShader: "attribute vec2 position;\n\
            varying vec2 vUV;\n\
            void main(void){\n\
                gl_Position=vec4(position, 0., 1.);\n\
                vUV=0.5+vec2(-0.5,0.5)*position; //inverse X axis for mirror\n\
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
        THREEVIDEOTEXTURE.magFilter=THREE.LinearFilter;
        THREEVIDEOTEXTURE.minFilter=THREE.LinearFilter;
        delete(videoMesh.onAfterRender);
    };
    videoMesh.renderOrder=-1000; //render first
    videoMesh.frustumCulled=false;
    THREESCENE.add(videoMesh);

    //CREATE THE CAMERA
    THREECAMERA=new THREE.PerspectiveCamera(SETTINGS.cameraFOV, 1, 0.1, 100);
    set_fullScreen();
} //end init_threeScene()

//update the resolution of the canvas
//can be used for your other fullscreen demos
function set_fullScreen(){
    var timerResize=false;
    function on_canvasResizeCSS(){
        var canvasRect=CANVASELEMENT.getBoundingClientRect();
        CANVASELEMENT.width=Math.round(canvasRect.width);
        CANVASELEMENT.height=Math.round(canvasRect.height);
        var aspecRatio=CANVASELEMENT.width / CANVASELEMENT.height;
        THREECAMERA.aspect=aspecRatio;
        THREECAMERA.updateProjectionMatrix();
        JEEFACEFILTERAPI.resize();
    }
    function on_canvasResizeCSSTimeout(){ //to avoid to resize the canvas too often
        if (timerResize){
            clearTimeout(timerResize);
        }
        timerResize = setTimeout(function(){
            on_canvasResizeCSS();
            timerResize=false;
        }, 100);
    }
    on_canvasResizeCSS();
    window.addEventListener('resize', on_canvasResizeCSSTimeout, false);
} //end set_fullScreen()

//launched by body.onload() :
function main(){
    JEEFACEFILTERAPI.init({ 
        videoSettings:{ //increase the default video resolution since we are in full screen
            'idealWidth': 1280,  //ideal video width in pixels
            'idealHeight': 800, //ideal video height in pixels
            'maxWidth': 1920,   //max video width in pixels
            'maxHeight': 1920   //max video height in pixels
        },
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
                var xv=-detectState.x;
                var yv=detectState.y;
                
                //coords in 3D of the center of the cube (in the view coordinates system)
                var z=-D-0.5;   // minus because view coordinate system Z goes backward. -0.5 because z is the coord of the center of the cube (not the front face)
                var x=xv*D*tanFOV;
                var y=yv*D*tanFOV/THREECAMERA.aspect;

                //move and rotate the cube
                THREEFACEOBJ3D.position.set(x,y+SETTINGS.pivotOffsetYZ[0],z+SETTINGS.pivotOffsetYZ[1]);
                THREEFACEOBJ3D.rotation.set(detectState.rx+SETTINGS.rotationOffsetX, -detectState.ry, detectState.rz, "XYZ");
            }

            //reinitialize the state of THREE.JS because JEEFACEFILTER have changed stuffs
            THREERENDERER.state.reset();

            //trigger the render of the THREE.JS SCENE
            THREERENDERER.render(THREESCENE, THREECAMERA);
        } //end callbackTrack()
    }); //end JEEFACEFILTERAPI.init call
} //end main()

