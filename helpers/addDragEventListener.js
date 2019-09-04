/* eslint-disable no-underscore-dangle */

const _states = {
  idle     : 0,
  loading  : 1,
  dragging : 2
}
let _state = _states.idle // MT217 : initialize your state always (even with a loading value)

let _dP = new window.THREE.Vector3()
let _x0; let _y0
let _scenes
let boundFunction

function updateMeshPosition(canvas, event) {
  const MOUSEVECTOR = new window.THREE.Vector3()
  const DIRECTIONVECTOR = new window.THREE.Vector3()
  const VIEWPORTVECTOR = new window.THREE.Vector3()
  const _headCenterZ = -1
  let mesh

  if (_state !== _states.dragging) return // MT217

  const isTouch = !!((event.touches && event.touches.length))// MT217 is touch or mouse event ?

  const xPx = (isTouch) ? event.touches[0].clientX : event.clientX // MT217 : make the distinction between touch and mouse event
  const yPx = (isTouch) ? event.touches[0].clientY : event.clientY // if touch event, consider only the first finger

  const dxPx = xPx - _x0 // en pixels
  const dyPx = yPx - _y0 // en pixels too

  _x0 = xPx
  _y0 = yPx

  // calcul des coo de dxPx, dyPx dans le viewport
  // les offsets du canvas s'annulent -> que facteur d'échelle a appliquer
  const dx = -dxPx / canvas.offsetWidth
  const dy = -dyPx / canvas.offsetHeight

  // Only check intersects if object is visible
  let i = 0
  do {
    if (_scenes[i].parent.visible) {
      // TODO: Check if a child geometry is an occlusion object. If so remove it from the intersection list
      let meshesToCheck = _scenes[i].children
      // if (_scenes[i].userData.hasOcclusionChild) {
      //   meshesToCheck = _scenes[i].children.find(child => child.userData.occlusion !== true)
      //   meshesToCheck = Array.isArray(meshesToCheck) ? meshesToCheck : [meshesToCheck]
      // }
      // Find mesh under mouse
      // Invert x mouse position because Jeeliz 3D objects have x inverted
      MOUSEVECTOR.set(-(xPx / canvas.offsetWidth) * 2 + 1, -(yPx / canvas.offsetHeight) * 2 + 1, 0.5)
      const raycaster = new window.THREE.Raycaster()
      raycaster.setFromCamera(MOUSEVECTOR, window.THREECAMERA)

      const intersects = raycaster.intersectObjects(meshesToCheck)
      if (intersects.length > 0) {
        mesh = intersects[0].object.parent
        i = _scenes.length  // End loop
      }
    }
    i++
  } while (i < _scenes.length)

  if (!mesh) {
    return
  }

  VIEWPORTVECTOR.set(dx, dy, 1)

  DIRECTIONVECTOR.copy(VIEWPORTVECTOR)
  DIRECTIONVECTOR.unproject(window.THREECAMERA)

  DIRECTIONVECTOR.sub(window.THREECAMERA.position)

  DIRECTIONVECTOR.normalize()

  // we calculate the coefficient that will allow us to find our mesh's position
  const k = _headCenterZ / DIRECTIONVECTOR.z

  // _dP = displacement in the scene (=world) ref :
  _dP.copy(DIRECTIONVECTOR).multiplyScalar(k)
  _dP.setZ(0) // bcoz we only want to displace in the (0xy) plane

  const _quat = new window.THREE.Quaternion()
  const _eul = new window.THREE.Euler()
  _eul.setFromQuaternion(_quat)

  // convert _dP to mesh ref to apply it directly to mesh.position :
  // _dP is a vector so apply only the rotation part (not the translation)
  _dP.applyEuler(mesh.getWorldQuaternion(_eul))

  // Boost movement to follow better the mouse/touch
  _dP.multiplyScalar(20)

  // apply _dP
  mesh.position.add(_dP)
  mesh = undefined
}

function setMousePosition0(event) { // save initial position of the mouse
  const isTouch = !!((event.touches && event.touches.length))// MT217 is touch or mouse event ?

  if (isTouch && event.touches.length > 1) return // MT217 if the user put a second finger while dragging

  _x0 = (isTouch) ? event.touches[0].clientX : event.clientX // MT217
  _y0 = (isTouch) ? event.touches[0].clientY : event.clientY
}

function mouseDown(event) {
  setMousePosition0(event) // MANTIS201
  _state = _states.dragging
}

function mouseUp() {
  _state = _states.idle
}

function addDragEventListener(scenes, canvasId, remove) {
  _scenes = Array.isArray(scenes) ? scenes : [scenes]
  const canvas = document.getElementById(canvasId)
  _state = _states.idle // MT217 : initialize your state always (even with a loading value)

  _dP = new window.THREE.Vector3()
  _x0 = undefined; _y0 = undefined
  if (remove) {
    // REMOVE OUR LISTENERS
    canvas.removeEventListener('mousemove', boundFunction, true)
    canvas.removeEventListener('touchmove', boundFunction, true)

    // BEGINNING OF THE INTERACTION
    canvas.removeEventListener('mousedown', mouseDown)
    canvas.removeEventListener('touchstart', mouseDown)

    // END OF THE INTERACTION
    canvas.removeEventListener('mouseup', mouseUp)
    canvas.removeEventListener('touchend', mouseUp)

    // ALSO END BUT IN CASE LEAVING CANVAS OR ALERT BOX ECT...
    canvas.removeEventListener('mouseout', mouseUp)
    canvas.removeEventListener('touchcancel', mouseUp)
  } else {
    // SET OUR LISTENERS
    boundFunction = updateMeshPosition.bind(this, canvas)
    canvas.addEventListener('mousemove', boundFunction, true)
    // canvas.addEventListener('touchmove', createTouchEvent, true)
    canvas.addEventListener('touchmove', boundFunction, true) // MT217

    // BEGINNING OF THE INTERACTION
    canvas.addEventListener('mousedown', mouseDown)
    canvas.addEventListener('touchstart', mouseDown)

    // END OF THE INTERACTION
    canvas.addEventListener('mouseup', mouseUp)
    canvas.addEventListener('touchend', mouseUp)

    // ALSO END BUT IN CASE LEAVING CANVAS OR ALERT BOX ECT...
    canvas.addEventListener('mouseout', mouseUp)
    canvas.addEventListener('touchcancel', mouseUp)
  }
}
