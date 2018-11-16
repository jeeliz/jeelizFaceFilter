function addDragEventListener (mesh) {
    // Used when repositioning
    if (THREE) {
        let MOUSEVECTOR = new THREE.Vector3();
        let DIRECTIONVECTOR = new THREE.Vector3();
        let VIEWPORTVECTOR = new THREE.Vector3();
        let _headCenterZ = -1;        
    }

    const _states = {
        idle: 0,
        loading: 1,
        dragging: 2
    }
    let _state=_states.idle; //MT217 : initialize your state always (even with a loading value)

    const canvas = document.getElementById('jeeFaceFilterCanvas')
    let _dP = new THREE.Vector3();

    function updateMeshPosition (event) {
        MOUSEVECTOR = new THREE.Vector3();
        DIRECTIONVECTOR = new THREE.Vector3();
        VIEWPORTVECTOR = new THREE.Vector3();
        _headCenterZ = -1; 

        if (_state !== _states.dragging) return //MT217

        const isTouch=(event.touches && event.touches.length)?true:false//MT217 is touch or mouse event ?

        const xPx = (isTouch)?event.touches[0].clientX:event.clientX; //MT217 : make the distinction between touch and mouse event
        const yPx = (isTouch)?event.touches[0].clientY:event.clientY; //if touch event, consider only the first finger

        const dxPx = xPx - _x0; // en pixels
        const dyPx = yPx - _y0; // en pixels too

        _x0 = xPx;
        _y0 = yPx;

        // calcul des coo de dxPx, dyPx dans le viewport
        // les offsets du canvas s'annulent -> que facteur d'échelle a appliquer
        const dx = -dxPx / canvas.offsetWidth;
        const dy = -dyPx / canvas.offsetHeight;

        MOUSEVECTOR.set(dx, dy);
        VIEWPORTVECTOR.set(dx, dy, 1);

        DIRECTIONVECTOR.copy(VIEWPORTVECTOR);
        DIRECTIONVECTOR.unproject(THREECAMERA);

        DIRECTIONVECTOR.sub(THREECAMERA.position)

        DIRECTIONVECTOR.normalize()

        // we calculate the coefficient that will allow us to find our mesh's position
        const k = _headCenterZ / DIRECTIONVECTOR.z;

        // _dP = displacement in the scene (=world) ref :
        _dP.copy(DIRECTIONVECTOR).multiplyScalar(k);
        _dP.setZ(0); // bcoz we only want to displace in the (0xy) plane
        
        const _quat = new THREE.Quaternion();
        const _eul = new THREE.Euler();
        _eul.setFromQuaternion(_quat);

        // convert _dP to mesh ref to apply it directly to mesh.position :
        // _dP is a vector so apply only the rotation part (not the translation)
        _dP.applyEuler(mesh.getWorldQuaternion(_eul));

        // Boost movement to follow better the mouse/touch
        _dP.multiplyScalar(5)

        // apply _dP
        mesh.position.add(_dP);
    }

    var _x0, _y0;
    function setMousePosition0(event) { // save initial position of the mouse
        const isTouch=(event.touches && event.touches.length)?true:false//MT217 is touch or mouse event ?

        if (isTouch && event.touches.length>1) return; //MT217 if the user put a second finger while dragging

        _x0 = (isTouch)?event.touches[0].clientX:event.clientX; //MT217
        _y0 = (isTouch)?event.touches[0].clientY:event.clientY;
    }

    // SET OUR LISTENERS
    canvas.addEventListener('mousemove', updateMeshPosition, true)
    //canvas.addEventListener('touchmove', createTouchEvent, true)
    canvas.addEventListener('touchmove', updateMeshPosition, true) //MT217


    // BEGINNING OF THE INTERACTION
    canvas.addEventListener('mousedown', (event) => {
        setMousePosition0(event); // MANTIS201
        _state = _states.dragging
    })
    canvas.addEventListener('touchstart', (event) => {
        setMousePosition0(event); //MT217 : faut initializer la position de la souris quand c du touch aussi !
        _state = _states.dragging
    })

    // END OF THE INTERACTION
    canvas.addEventListener('mouseup', () => {
        _state = _states.idle
    })
    canvas.addEventListener('touchend', () => {
        _state = _states.idle
    })

    // ALSO END BUT IN CASE LEAVING CANVAS OR ALERT BOX ECT...
    canvas.addEventListener('mouseout', () => {
        _state = _states.idle
    })
    canvas.addEventListener('touchcancel', () => {
        _state = _states.idle
    })
}