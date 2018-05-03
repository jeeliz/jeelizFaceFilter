function addDragEventListener (mesh) {
    const canvas = document.getElementById('jeeFaceFilterCanvas')
    var _dP=new THREE.Vector3();
    function updateMeshPosition (event) {
        //const x = (-2 * (event.layerX - event.offsetX ) / canvas.offsetWidth) 
        //const y = (-2 * (event.clientY - canvas.offsetTop) / canvas.offsetHeight + 1 )

        const xPx=event.clientX;
        const yPx=event.clientY;

        const dxPx=xPx-_x0; //en pixels
        const dyPx=yPx-_y0; //en pixels too

        _x0=xPx;
        _y0=yPx;

        //calcul des coo de dxPx, dyPx dans le viewport
        //les offsets du canvas s'annulent -> que facteur d'échelle a appliquer
        const dx=-dxPx/canvas.offsetWidth;
        const dy=-dyPx/canvas.offsetHeight;


       // debugger;
        // FORMULES XAVIER
        /*
        const x = (-2 * (event.clientX - canvas.offsetLeft ) / canvas.offsetWidth - 1 ) 
        const y = (-2 * (event.clientY - canvas.offsetTop) / canvas.offsetHeight + 1 )
        */

        MOUSEVECTOR.set(dx, dy);
        VIEWPORTVECTOR.set(dx, dy, 1);

        DIRECTIONVECTOR.copy(VIEWPORTVECTOR);
        DIRECTIONVECTOR.unproject(THREECAMERA);

        DIRECTIONVECTOR.sub(THREECAMERA.position)

        DIRECTIONVECTOR.normalize()

        // we calculate the coefficient that will allow us to find our mesh's position
        const k = _headCenterZ / DIRECTIONVECTOR.z;

        //_dP = displacement in the scene (=world) ref :
        _dP.copy(DIRECTIONVECTOR).multiplyScalar(k);
        _dP.setZ(0); //bcoz we only want to displace in the (0xy) plane
        
        //convert _dP to mesh ref to apply it directly to mesh.position :
        //_dP is a vector so apply only the rotation part (not the translation)
        _dP.applyEuler(mesh.getWorldRotation());

        //apply _dP
        mesh.position.add(_dP);
    }

    function createTouchEvent (event) {
        const touch = event.changedTouches[0]; // get the position information
        const mouseEvent = new MouseEvent( // create event
            'mousemove',   // type of event
            {
                view: event.target.ownerDocument.defaultView,
                bubbles: true,
                cancelable: true,
                screenX: touch.screenX,  // get the touch coords
                screenY: touch.screenY,  // and add them to the
                clientX: touch.clientX,  // mouse event
                clientY: touch.clientY,
            })
        touch.target.dispatchEvent(mouseEvent)
    }

    var _x0, _y0;
    function setMousePosition0(event){ //save initial position of the mouse
        _x0=event.clientX;
        _y0=event.clientY;
    }

    // BEGINNING OF THE INTERACTION
    canvas.addEventListener('mousedown', (event) => {
        setMousePosition0(event); //MANTIS201
        canvas.addEventListener('mousemove', updateMeshPosition, true)
    })
    canvas.addEventListener('touchstart', (event) => {
        canvas.addEventListener('mousemove', updateMeshPosition, true)
        canvas.addEventListener('touchmove', createTouchEvent, true)
    })

    // END OF THE INTERACTION
    canvas.addEventListener('mouseup', () => {
        canvas.removeEventListener('mousemove', updateMeshPosition, true)
    })
    canvas.addEventListener('touchend', (event) => {
        canvas.removeEventListener('mousemove', updateMeshPosition, true)
        canvas.removeEventListener('touchmove', createTouchEvent, true)
    })

    // ALSO END BUT IN CASE LEAVING CANVAS OR ALERT BOX ECT...
    canvas.addEventListener('mouseout', () => {
        canvas.removeEventListener('mousemove', updateMeshPosition, true)
    })
    canvas.addEventListener('touchcancel', (event) => {
        canvas.removeEventListener('mousemove', updateMeshPosition, true)
        canvas.removeEventListener('touchmove', createTouchEvent, true)
    })
}