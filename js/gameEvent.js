// This script must be loaded after '.movingCh.js' is loaded.

document.addEventListener('keydown', movingChKeyDownEvent);
document.addEventListener('keyup', movingChKeyUpEvent);

//////////////////////////////////////////////////////////////////////////////
function movingChKeyDownEvent(e) {
    if (!e) {
        e = window.event; // for IE
        e.returnValue = false;
    } else {
        e.preventDefault();
    }

    if( (KEY_SHIFT != e.which) && (KEY_CTRL != e.which) && (KEY_ALT != e.which) ) {

        keyEvt.down = true;
        keyEvt.key = e.key;
        keyEvt.which = e.which;

        keyEvt.ctrl = e.ctrlKey;
        keyEvt.alt = e.altKey;
        keyEvt.shift = e.shiftKey;
    }
}


//////////////////////////////////////////////////////////////////////////////
function movingChKeyUpEvent(e) {
    if (!e) {
        e = window.event; // for IE
        e.returnValue = false;
    } else {
        e.preventDefault();
    }

    keyEvt.up = true;    
}

