function addResizeEventListener(mesh) {
  const canvas = document.getElementById('jeeFaceFilterCanvas')

  // event functions
  const is_touch = function (event) {
    // return (('changedTouches' in event) || event.touches.length);
    return (('changedTouches' in event) || ('touches' in event));
  };

  const extract_touchPosition = function (event, dstVec2, touchIndex) {
    if (event.touches.length > touchIndex) {
      dstVec2[0] = event.touches[touchIndex].pageX;
      dstVec2[1] = event.touches[touchIndex].pageY;
    } else {
      dstVec2[0] = event.changedTouches[touchIndex].pageX;
      dstVec2[1] = event.changedTouches[touchIndex].pageY;
    }
  }; // end extract_touchPosition()

  const extract_position = function (event, dstVec2) {
    const isTouch = is_touch(event);
    if (isTouch) {
      extract_touchPosition(event, dstVec2, 0);
    } else {
      dstVec2[0] = event.pageX;
      dstVec2[1] = event.pageY;
    }
  }; // end extract_position()

  const compute_pinchDistance = function (event) {
    extract_touchPosition(event, _u, 0);
    extract_touchPosition(event, _v, 1);
    return Math.sqrt(_u[0]*_u[0]+_v[0]*_v[0]);
  };

    // event handlers
  const handle_touchDown = function (event) {
    // console.log('down'); return;
    event.preventDefault();
    if (_internalMode !== _internalModes.idle) {
      if (_internalMode === _internalModes.move && !_isMoveStart && is_touch(event)) {
        // we should enable the pinch mode
        _pinchDistance0 = compute_pinchDistance(event);
        if (_pinchDistance0 > _settings.pinchDistanceMin) {
          _internalMode = _internalModes.pinch;
          _pinchScaleOld = 1;
          dispatch_events("pinchStart", null, null, null);
          return;
        } else {
          return;
        }
      } else {
        return;
      }
    } // end if not in idle internalMode
    if (_internalMode === _internalModes.pinch) {
      return;
    }
    _isMoveStart = false;
    extract_position(event, _mousePos0);
    _moveVectorOld[0] = 0;
    _moveVectorOld[1] = 0;
    _internalMode = _internalModes.move;
    _curv = 0;
  }; // end handle_touchDown()

  const handle_touchUp = function (event) {
    dispatch_events('pinchEnd', null, null, null);
  }; // end handle_touchUp()

  const handle_touchMove = function (event) {
    const pinchDistance = compute_pinchDistance(event);
    const pinchScale = pinchDistance / _pinchDistance0;

    dispatch_events('pinch', pinchScale, pinchScale - _pinchScaleOld, null);
    _pinchScaleOld = pinchScale;
  }; // end handle_touchMove()
    
  const handle_mouseWheel = function (event) {
    switch (_mode) {
      case _modes["movePinch"]:
        const dScale = -event.deltaY;
        if (_internalMode === _internalModes.idle) {
          dispatch_events('pinch', -1, dScale * _settings.wheelSensibility, null);
        }
        break;
    }; // end switch _mode
    event.deltaY
    event.preventDefault(); // prevent scrolling
  }; // end handle_mouseWheel()


  // add listeners
  canvas.addEventListener('scroll', handle_mouseWheel)

  canvas.addEventListener('mousedown' || 'touchdown', handle_touchDown)
}
