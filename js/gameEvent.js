
//  Copyright (C) 2024 Gi Tae Cho laon.makers@yahoo.com
//    This file is a part of the Smart Home WiFi Web Server project.
//    This project can not be copied and/or distributed without the express permission of Gi Tae Cho laon.makers@yahoo.com.
// 
//  Author: G.T. Cho (a Laon maker/artist in Laon Creators' Group)
//    Version: 1.0
//    Last update: Jan. 17, 2022
//
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

//////////////////////////////////////////////////////////////////////////////
function GetCh() {
    let c = '';
    c = prompt(instruction, '');
    if ( c == undefined ) {
        return c;
    }

    if (c.length > 0) {
        return c[0];
    }

    return c;
}

//////////////////////////////////////////////////////////////////////////////
function scanUserKey() {
    let c = null;

    if( keyEvt.down == true ) {
        keyEvt.down = false;
    } else if (keyEvt.up == true) {
        keyEvt.up = false;
        c = keyEvt.which;
        keyEvt.which = null;
    }

    return c;
}

//////////////////////////////////////////////////////////////////////////////
function phantomEscapeKeyEvent() {
    keyEvt.down = true;
    keyEvt.key = 'Escape';
    keyEvt.which = KEY_ESC;
    keyEvt.up = true;
}

//////////////////////////////////////////////////////////////////////////////
function timerExpiry() {
    bTimerExpired = true;
    clearInterval(invadingChInterval);
}

//////////////////////////////////////////////////////////////////////////////
function setNewTimerExpiry(t) {
    if ( t > 0 ) {
        timerExpiryTime = t;

        if( bTimerExpired == false ) {
            if(invadingChInterval != undefined) {
               clearInterval(invadingChInterval);
            }
        } else {
            bTimerExpired = false;
        }

        invadingChInterval = setInterval(timerExpiry, timerExpiryTime);

    }
}

//////////////////////////////////////////////////////////////////////////////
function isTimerExpired() {
    return bTimerExpired;
}

//////////////////////////////////////////////////////////////////////////////
function GetUniqueRandomKey( playGround, limit, len) {
    let ky;
    let bExist;

    while(true) {
        bExist = false;
        ky = String.fromCharCode(Math.floor(Math.random() * limit) + VIRTUAL_KEY_A2Z_BASE);

        if(len == 0 ) return ky;

        for(let i = 0; i < len; i++){
            for(let j = 0; j < PLAYGROUND_WIDTH; j++){
                if(ky == playGround[i][j]) {
                    bExist = true;
                    break;
                }
            }
            if(bExist == true) break;
        }

        if(bExist == false) break;
    }

    return ky;
}

//////////////////////////////////////////////////////////////////////////////
function GetUniqueRandomKey2(playGround, limit, last) {
    let ky;
    let bExist = true;
    let len, ix;

    while(bExist == true) {
        bExist = false;

        if(last >= tail) len = last - tail;
        else len = PLAYGROUND_HEIGHT - tail + last;
        len++;
        ix = tail;

        ky = String.fromCharCode(Math.floor(Math.random() * limit) + VIRTUAL_KEY_A2Z_BASE);

        for(let i = 0; i < len; i++){
            for(let j = 0; j < PLAYGROUND_WIDTH; j++){
                if(ky == playGround[ix][j]) {
                    bExist = true;
                    break;
                }
            }
            if(bExist == true) break;

            ix = (ix+1)%PLAYGROUND_HEIGHT;
        }
    }

    return ky;
}

//////////////////////////////////////////////////////////////////////////////
function GetRandomValue(limit) {
    let v = Math.floor(Math.random() * limit);    
    return v;
}
