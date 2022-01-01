// This script must be loaded after '.movingCh.js' is loaded.
//let keyEvt = {key:'', chCode:'', code: -1, down:false, up:false };

//document.attachEventHandler('keydown', movingChKeyDownEvent);
document.addEventListener('keydown', movingChKeyDownEvent);
//document.addEventListener('keydown', movingChKeyDownEvent, false);
//document.addEventListener('keydown', function() {movingChKeyDownEvent();}, false);
//document.removeEventListener('keydown', movingChKeyEvent);
//document.attachEventHandler('keyup', movingChKeyUpEvent);
document.addEventListener('keyup', movingChKeyUpEvent);
//document.addEventListener('keyup', movingChKeyUpEvent, false);
//document.addEventListener('keyup', function () {movingChKeyUpEvent();}, false);

//document.onkeydown = movingChKeyDownEvent;
//document.onkeyup = movingChKeyUpEvent;


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

