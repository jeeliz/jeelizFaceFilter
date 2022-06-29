let camera = null, controls = null, scene = null, renderer = null;


function main() {

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xcccccc );
  scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );

  const container = document.getElementById( 'container' );
  container.appendChild( renderer.domElement );

  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.z = 500;


  // instantiate HEAD CONTROLS:
  const NNCPath = '../../../neuralNets/'; // where to find NN_DEFAULT.json from the current path
  controls = new THREE.HeadControls( camera, 'headControlsCanvas', NNCPath );
  //controls.enableZoom = false;
  
  // tweak sensibility parameters:
  controls.sensibilityZ = 1.5;
  controls.sensibilityRotateX = 0.003;
  controls.sensibilityRotateY = 0.003;

  // world

  const geometry = new THREE.CylinderGeometry( 0, 10, 30, 4, 1 );
  const material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );

  for ( let i = 0; i < 500; ++ i ) {

    const mesh = new THREE.Mesh( geometry, material );
    mesh.position.x = ( Math.random() - 0.5 ) * 1000;
    mesh.position.y = ( Math.random() - 0.5 ) * 1000;
    mesh.position.z = ( Math.random() - 0.5 ) * 1000;
    mesh.updateMatrix();
    mesh.matrixAutoUpdate = false;
    scene.add( mesh );

  }

  // lights:
  const light0 = new THREE.DirectionalLight( 0xffffff );
  light0.position.set( 1, 1, 1 );
  
  const light1 = new THREE.DirectionalLight( 0x002288 );
  light1.position.set( -1, -1, -1 );
  
  const light2 = new THREE.AmbientLight( 0x222222 );        
  scene.add( light0, light1, light2 );

  window.addEventListener( 'resize', onWindowResize, false );

  animate(0);
}


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}


function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
}


window.addEventListener('load', main);