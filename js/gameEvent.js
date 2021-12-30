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

    //switch( projectIx ) {
    //case 0: // moving Character

        // switch(e.key) {
        // case 'ArrowLeft':
            
        //     break;
        // case 'ArrowRight':
        //     break;
        // case 'ArrowUp':
        //     break;
        // case 'ArrowDown':
        //     break;0
        // default:
        //     break;
        // }

        if(keyEvt.down == false) {
            //if( keyEvt.up == false ) {
                keyEvt.down = true;
                keyEvt.key = e.key;
                keyEvt.chCode = e.charCode;
                //keyEvt.up = false;
                //if(keyEvt.up == false ) keyEvt.key = e.key;
            //}
        }
    //    break;
    // case 1: // invading Characters
    //     break;
    //}
}


//////////////////////////////////////////////////////////////////////////////
function movingChKeyUpEvent(e) {
    if (!e) {
        e = window.event; // for IE
        e.returnValue = false;
    } else {
        e.preventDefault();
    }

    //switch( projectIx ) {
    //case 0: // moving Character

        // switch(e.key) {
        // case 'ArrowLeft':
            
        //     break;
        // case 'ArrowRight':
        //     break;
        // case 'ArrowUp':
        //     break;
        // case 'ArrowDown':
        //     break;
        // default:
        //     break;
        // }

        //keyEvt.down = false;
        keyEvt.up = true;
    //   break;

    // case 1: // invading Characters
    //     break;
    //}
}

