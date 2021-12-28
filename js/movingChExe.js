/*  Copyright (C) 2024 Gi Tae Cho laon.makers@yahoo.com
    This file is a part of the Smart Home WiFi Web Server project.
    This project can not be copied and/or distributed without the express permission of Gi Tae Cho laon.makers@yahoo.com.

    Author: G.T. Cho (a Laon maker/artist in Laon Creators' Group)
    Version: 1.5
    Last update: Jan. 17, 2022
*/
const KEY_ENTER         = 0x0D;
const KEY_0             = 0x30;
const KEY_A             = 0x41;
const KEY_a             = 0x61;
const KEY_EQUAL_OR_PLUS = 0x3D;
const KEY_MINUS_OR_UNDERSCORE = 0xAD;
const KEY_ESC           = 0x1B; //27;
const KEY_SHIFT         = 0x10;
const KEY_CTRL          = 0x11;
const KEY_ALT           = 0x12;

const KEY_RIGHT_ARROW   = 0x27;
const KEY_LEFT_ARROW    = 0x25;
const KEY_DOWN_ARROW    = 0x28;
const KEY_UP_ARROW      = 0x26
// const 'o' = ;
const KEY_F1        = 0x70;     // Playground location change
const KEY_F12       = 0x7B;

const bPRINT_ON_CONSOLE = false;  // true: to print characters on the console or when you run this code in VS Code. false: to print characters on the web page (black board) or when you run it with hta file.
const PRJ_PARAM                     = 5;
const MOVE_CHAR_WIDTH               = 30;
const MOVE_CHAR_HEIGHT              = 15;
const PLAYGROUND_WIDTH_MAX          = 60;
const PLAYGROUND_HEIGHT_MAX         = 30;
const PLAYGROUND_MAX_FENCE_WIDTH    = (PLAYGROUND_WIDTH_MAX+3);
const PLAYGROUND_WIDTH_INCREAMENT   = 5;
const PLAYGROUND_HEIGHT_INCREAMENT  = 5;

const PLAYGROUND_X_OFFSET_MAX       = 60;
const PLAYGROUND_Y_OFFSET_MAX       = 30;
const PLAYGROUND_X_OFFSET_INCREAMENT = 5;
const PLAYGROUND_Y_OFFSET_INCREAMENT = 5;
const MAX_MSG_BOARD_LINES            = 31;    // used to clear the message board.
const NOF_SOLUTION                   = 11;

const PLAYGROUND_SPACE_CHAR          = '&emsp;';

let projectIx = 0;
let solIndex = 0;
let chIndex = 0;

let instruction = '';
let pground;
let pgndTxt = '';
let msgToPrint = '';
let msgBoard;
let msgLineCnt = 0;
let numChar = document.getElementById('numChar');
let bMessageBoardInitialized = false;
let numX = 1, inCnt = 0;
let newKey = null;
let pgdActiveLine;
let pgdTopBottomLine;
let pgdEmptyLine;
let spaceCh = ' ';
let bGameInitialized = false;
let bInit = false;
let bInitF = false;

let movChInterval;
let keyEvt = {myKey:null, key:'', which:null, ctrl:false, alt: false, shift:false, down:false, up:false };

if( bPRINT_ON_CONSOLE == true ) {
    console.clear();
}

let param = location.search.substring(1).split("&");
let arg = param[0].split("=");

if( arg.length > 1 ) {
    projectIx = parseInt(arg[1]);
    if( param.length > 1 ) {
        arg = param[1].split("=");
        if( arg.length > 1 ) {
            solIndex = parseInt(arg[1]);
            document.getElementById('solId').selectedIndex = solIndex + 1;

            bGameInitialized = false;
            if( mcConfig["noneBlockingKey"] == false) {
                document.getElementById('nonBlockKey').checked = false;
                configSolutionStart();
                setTimeout(launchMovingChar, 1000);
            } else {
                document.getElementById('nonBlockKey').checked = true;
                launchMovingChar();                
            }
        }
    }
}

//////////////////////////////////////////////////////////////////////////////
function printResult(m) {

    if( bPRINT_ON_CONSOLE == true ) {
        console.log(m);    
    } else {

        if( msgLineCnt >= MAX_MSG_BOARD_LINES ) {
            pgndTxt = m + "<br\>";
            msgLineCnt = 0;
        } else {
            pgndTxt += m + "<br\>";
            msgLineCnt += 1;
        }

        msgBoard.innerHTML = pgndTxt + "_";

        if(m == '') numChar.textContent = '0';
        else numChar.textContent = m.length.toString();
    }
}

//////////////////////////////////////////////////////////////////////////////
function printResultNoCur(m) {

    if( bPRINT_ON_CONSOLE == true ) {
        console.log(m);    
    } else {

        if( msgLineCnt >= MAX_MSG_BOARD_LINES ) {
            pgndTxt = m + "<br\>";
            msgLineCnt = 0;
        } else {
            pgndTxt += m + "<br\>";
            msgLineCnt += 1;
        }

        msgBoard.innerHTML = pgndTxt;

        if(m == '') numChar.textContent = '0';
        else numChar.textContent = m.length.toString();
    }
}

//////////////////////////////////////////////////////////////////////////////
function printResultInArray(ma, n) {
    ma = ma.trim();

    if( bPRINT_ON_CONSOLE == true ) {
        console.log(ma);    
    } else {

        if( msgLineCnt >= MAX_MSG_BOARD_LINES ) {
            pgndTxt = ma + "<br\>";
            msgLineCnt = 0;
        } else {
            pgndTxt += ma + "<br\>";
            msgLineCnt += 1;
        }

        msgBoard.innerHTML = pgndTxt + "_";

        if(ma.length == 0) numChar.textContent = '0';
        else numChar.textContent = n.toString();
    }
}

//////////////////////////////////////////////////////////////////////////////
function printResultInArrayNoCur(ma, n) {
    ma = ma.trim();

    if( bPRINT_ON_CONSOLE == true ) {
        console.log(ma);    
    } else {

        if( msgLineCnt >= MAX_MSG_BOARD_LINES ) {
            pgndTxt = ma + "<br\>";
            msgLineCnt = 0;
        } else {
            pgndTxt += ma + "<br\>";
            msgLineCnt += 1;
        }

        msgBoard.innerHTML = pgndTxt;

        if(ma.length == 0) numChar.textContent = '0';
        else numChar.textContent = n.toString();
    }
}

//////////////////////////////////////////////////////////////////////////////
function resetGame() {
    clearMsgBoard();
    keyEvt.down = true;
    keyEvt.key = '0';
    keyEvt.which = 0x30;
    keyEvt.up = true;
}

//////////////////////////////////////////////////////////////////////////////
function clearMsgBoard() {
    if( bPRINT_ON_CONSOLE == true ) {
        console.clear();
    } else {
        msgBoard.innerHTML = '';
        pgndTxt = '';
        msgLineCnt = 0;
    }
}

//////////////////////////////////////////////////////////////////////////////
function resetMovingCh(ix) {
    clearMsgBoard();
    chIndex = 0;
    keyCode = '';
}

//////////////////////////////////////////////////////////////////////////////
function initMessageBoard() {
    if( bPRINT_ON_CONSOLE == false ) {
        if( bMessageBoardInitialized == false ) {
            pground = document.getElementById('playground');
        
            newP = document.createElement('p');
            newP.id = 'msgbd';
            pground.appendChild(newP);
            msgBoard = document.getElementById('msgbd');
            bMessageBoardInitialized = true;
        }
    }
}


//////////////////////////////////////////////////////////////////////////////
function movingCh(ix) {
    let x = 1, i1;
    let c = 1;
    const plygdWidth = MOVE_CHAR_WIDTH, plygdHeight = MOVE_CHAR_HEIGHT; // rectangular size
    let msg = '';    

    initMessageBoard();

    instruction = "Hit \'0\' to exit.  Project: Moving Char.   ID:" + ix.toString() + "\n";

    switch(ix){
    case 0:
        x = 0;
        while ((c != '0') &&(c != null) ) {

            c = GetCh();

            if( c != null) {
                printResult(c.toString());
            }
        }
        break;

    case 1:
        x = 0;
        while ((c != '0') &&(c != null) ) {

            c = GetCh();

            if( c != null) {
                if( c == '') {
                    printResult("");
                } else {
                    printResult("@");
                }
            }
        }
        break;

    case 2:
        x = 0;
        while ((c != '0') &&(c != null) ) {

            c = GetCh();

            if((c == '+') || (c == '=') ) {
                printResult("@");
            }
        }
        break;

    case 3:
        while ((c != '0') &&(c != null) ) {
            msg = '';
            // ACTION: it places the character '@' based on the location index x.
            for(i1 = 0; i1<x; i1++) {
                msg = msg + "@";
            }
            
            printResult(msg);

            // INPUT: user key input
            c = GetCh(); inCnt++;

            // CONTROL: controls the location of the character '@'.
            if((c == '+') || (c == '=') )
                x++;
        }
        break;

    case 4:

        while ((c != '0') &&(c != null) ) {

            msg = '';
            // ACTION: it places the character '@' based on the location index x.
            for(i1 = 0; i1<x; i1++) {
                msg = msg + "@";
            }
            printResult(msg);

            // INPUT: user key input
            c = GetCh(); inCnt++;

            // CONTROL: controls the location of the character '@'.
            if((c == '+') || (c == '=') ){
                if(x < plygdWidth)
                    x++;
                //else
                //    console.log("\7");
            }
        }
        break;

    case 5:
        while ((c != '0') &&(c != null) ) {

            msg = '';
            // ACTION: it places the character '@' based on the location index x.
            for(i1 = 0; i1<x; i1++) {
                msg = msg + "@";
            }
            printResult(msg);

            // INPUT: user key input
            c = GetCh(); inCnt++;

            // CONTROL: controls the location of the character '@'.
            if((c == '+') || (c == '=')){
                if(x < plygdWidth)
                    x++;
                //lse
                //    console.log("\7");
            } else if ((c == '-') || (c == '_')) {
                if(x > 0)
                    x--;
                //else
                //    MessageBeep(MB_ICONASTERISK);
            }
        }
        break;

    case 6:
    case 7:

        while ((c != '0') &&(c != null) ) {
            // ACTION: it places the character '@' based on the location index x.
            msg = '';

            for(i1 = 0; i1<x; i1++) {
                msg = msg + "@";
            }
            printResult(msg);

            // INPUT: user key input
            c = GetCh(); inCnt++;

            // CONTROL: controls the location of the character '@'.
            if((c == '+') || (c == '=')){
                if(x < plygdWidth)
                    x++;
                //else
                //    console.log("\7");
            } else if ((c == '-') || (c == '_')) {
                if(x > 1)
                    x--;
                //else
                //    MessageBeep(MB_ICONASTERISK);
            }
        }
        break;

    case 8:
    case 9:

        while ((c != '0') &&(c != null) ) {

            msg = '';

            for(i1 = 0; i1<x; i1++) {
                msg = msg + "@";
            }
            printResult(msg);

            c = GetCh(); inCnt++;

            if((c == '+') || (c == '=')){
                if(x < plygdWidth)
                    x++;
                else
                    x = 1;
            } else if ((c == '-') || (c == '_')) {
                if(x > 1)
                    x--;
                //else
                //    MessageBeep(MB_ICONASTERISK);
            }
        }
        break;


    case 10:
    case 11:

        while ((c != '0') &&(c != null) ) {
            msg = '';
            for(i1 = 0; i1<x; i1++) {
                msg = msg + "@";
            }
            printResult(msg);

            c = GetCh(); inCnt++;

            if((c == '+') || (c == '=')){
                if(x < plygdWidth)
                    x++;
                else
                    x = 1;
            } else if ((c == '-') || (c == '_')) {
                if(x > 1)
                    x--;
                else
                    x = plygdWidth;
            }
        }
        break;

    case 12:
        
        while ((c != '0') &&(c != null) ) {

            clearMsgBoard();

            msg = '';
            for(i1 = 0; i1<x; i1++) {
                msg = msg + "@";
            }
            
            printResultNoCur(msg);
            
            c = GetCh();

            if((c == '+') || (c == '=')){
                if(x < plygdWidth)
                    x++;
                else
                    x = 1;
            } else if ((c == '-') || (c == '_')) {
                if(x > 1)
                    x--;
                else
                    x = plygdWidth;
            }
        }
        break;
    default:
        printResult("The task ID %d is not available.\n");
        break;
    }

    configSolutionEnd();
    return 0;
}



//////////////////////////////////////////////////////////////////////////////
function nextMovingCh() {
    solIndex = solIndex + 1;
    if( solIndex > NOF_SOLUTION ) solIndex = 0;
    document.getElementById('solId').value = solIndex.toString();
    selectedMovingCh();
}

//////////////////////////////////////////////////////////////////////////////
function lastMovingCh() {
    solIndex = NOF_SOLUTION + 1;
    runSelectedMovingChar();
}

//////////////////////////////////////////////////////////////////////////////
function launchMovingChar() {

    if( projectIx == 1) {
        pgdTopBottomLine  = new Array(PLAYGROUND_MAX_FENCE_WIDTH);
        pgdEmptyLine  = new Array(PLAYGROUND_MAX_FENCE_WIDTH);
        pgdActiveLine = new Array(PLAYGROUND_WIDTH_MAX+2);
    }

    selectedMovingCh();
}

//////////////////////////////////////////////////////////////////////////////
function selectedMovingCh() {
    id = document.getElementById('solId');
    solIndex = parseInt(id.value);
    if( solIndex > NOF_SOLUTION ) solIndex = 0;

    runSelectedMovingChar();
}

//////////////////////////////////////////////////////////////////////////////
function runSelectedMovingChar() {
    let _bNb = document.getElementById('nonBlockKey').checked;

    bGameInitialized = false;
    newKey = null;
    numX = 1,
    inCnt = 0;

    configSolutionStart();
    if( projectIx == 0 ) {
        if( _bNb == false ) {
            movingCh(solIndex);
        } else {
            movChInterval = setInterval(movingChByPollingKeys, 50);
        }
    } else if ( projectIx == 1 ) {
        if( _bNb == false ) {
            moveCharInRectArray(solIndex);
        } else {
            movChInterval = setInterval(moveCharInRectArrayByPollingKeys, 50);
        }
    }    
}
//////////////////////////////////////////////////////////////////////////////
function showHideExtraButton(me) {    
    if( me.checked == true ) {
        document.getElementById('extraBtn').hidden = false;
    } else {
        document.getElementById('extraBtn').hidden = true;
    }

}

//////////////////////////////////////////////////////////////////////////////
function firstMovingCh() {
    if( projectIx == 0 ) {
        document.getElementById('solId').value = '0';        
    } else {
        document.getElementById('solId').value = '1';
    }
    selectedMovingCh();
}

//////////////////////////////////////////////////////////////////////////////
function configSolutionStart() {
    if( projectIx == 0 ) {
        instruction = "Hit \'0\' to exit.  Project: Moving Char.   ID:" + solIndex.toString() + "\n";
    } else if ( projectIx == 1 ) {
        instruction = "Hit \'0\' to exit.  Project: Moving Char (Array).   ID:" + solIndex.toString() + "\n";
    }

    document.getElementById('instruction').textContent = instruction;
    document.getElementById('nonBlockKey').disabled = true;
    document.getElementById('solId').disabled = true;
    document.getElementById('runSelSol').disabled = true;
    document.getElementById('chbExtraBtn').disabled = true;
    document.getElementById('extraBtn').hidden = true;
}

//////////////////////////////////////////////////////////////////////////////
function configSolutionEnd() {
    document.getElementById('instruction').textContent = '';
    document.getElementById('nonBlockKey').disabled = false;
    document.getElementById('solId').disabled = false;
    document.getElementById('runSelSol').disabled = false;
    document.getElementById('chbExtraBtn').disabled = false;
    if( document.getElementById('chbExtraBtn').checked == true) {
        document.getElementById('extraBtn').hidden = false;
    }
}


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
function movingChByPollingKeys() {
    
    let i, ix = solIndex;
    const plygdWidth = MOVE_CHAR_WIDTH, plygdHeight = MOVE_CHAR_HEIGHT; // rectangular size
    let msg = '';    

    initMessageBoard();

    switch(ix){
    case 0:
        numX = 0;
        newKey = scanUserKey();

        if( (newKey != null) && (newKey != KEY_ENTER)) {
            printResult(keyEvt.key);
        }

        if (newKey == KEY_0 ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 1:
        numX = 0;
        newKey = scanUserKey();

        if( (newKey != null) && (newKey != KEY_ENTER)) {
            printResult("@");
        }

        if (newKey == KEY_0 ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 2:
        numX = 0;

        newKey = scanUserKey();

        if(newKey == KEY_EQUAL_OR_PLUS ) {
            printResult("@");
        }
        
        if (newKey == KEY_0 ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 3:
        msg = '';
        

        if( bGameInitialized == false ) {
            bGameInitialized = true;
            // ACTION: it places the character '@' based on the location index numX.
            for(i = 0; i<numX; i++) {
                msg = msg + "@";
            }
            printResult(msg);
        }


        if( (newKey != null) && (newKey != KEY_ENTER )) {
            // ACTION: it places the character '@' based on the location index numX.
            for(i = 0; i<numX; i++) {
                msg = msg + "@";
            }
            printResult(msg);
        }

        // INPUT: user key input
        newKey = scanUserKey(); inCnt++;

        // CONTROL: controls the location of the character '@'.
        if(newKey == KEY_EQUAL_OR_PLUS )
            numX++;

        if (newKey == KEY_0 ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 4:
        
        msg = '';
        if( bGameInitialized == false ) {
            bGameInitialized = true;
            // ACTION: it places the character '@' based on the location index numX.
            for(i = 0; i<numX; i++) {
                msg = msg + "@";
            }
            printResult(msg);
        }
        

        if( (newKey != null) && (newKey != KEY_ENTER )) {
            // ACTION: it places the character '@' based on the location index numX.
            for(i = 0; i<numX; i++) {
                msg = msg + "@";
            }
            printResult(msg);
        }

        // INPUT: user key input
        newKey = scanUserKey(); inCnt++;

        // CONTROL: controls the location of the character '@'.
        if(newKey == KEY_EQUAL_OR_PLUS ){
            if(numX < plygdWidth)
                numX++;
            //else
            //    console.log("\7");
        }

        if (newKey == KEY_0 ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 5:

        msg = '';
        if( bGameInitialized == false ) {
            bGameInitialized = true;
            // ACTION: it places the character '@' based on the location index numX.
            for(i = 0; i<numX; i++) {
                msg = msg + "@";
            }
            printResult(msg);
        }


        if( (newKey != null) && (newKey != KEY_ENTER )) {
            // ACTION: it places the character '@' based on the location index numX.
            for(i = 0; i<numX; i++) {
                msg = msg + "@";
            }
            printResult(msg);
        }
        // INPUT: user key input
        newKey = scanUserKey(); inCnt++;

        // CONTROL: controls the location of the character '@'.
        if(newKey == KEY_EQUAL_OR_PLUS){
            if(numX < plygdWidth)
                numX++;
            //lse
            //    console.log("\7");
        } else if (newKey == KEY_MINUS_OR_UNDERSCORE) {
            if(numX > 0)
                numX--;
            //else
            //    MessageBeep(MB_ICONASTERISK);
        }
        if (newKey == KEY_0 ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 6:
    case 7:

        msg = '';

        if( bGameInitialized == false ) {
            bGameInitialized = true;
            // ACTION: it places the character '@' based on the location index numX.
            for(i = 0; i<numX; i++) {
                msg = msg + "@";
            }
            printResult(msg);
        }


        if( (newKey != null) && (newKey != KEY_ENTER )) {
            // ACTION: it places the character '@' based on the location index numX.
            for(i = 0; i<numX; i++) {
                msg = msg + "@";
            }
            printResult(msg);
        }

        // INPUT: user key input
        newKey = scanUserKey(); inCnt++;

        // CONTROL: controls the location of the character '@'.
        if(newKey == KEY_EQUAL_OR_PLUS){
            if(numX < plygdWidth)
                numX++;
            //else
            //    console.log("\7");
        } else if (newKey == KEY_MINUS_OR_UNDERSCORE) {
            if(numX > 1)
                numX--;
            //else
            //    MessageBeep(MB_ICONASTERISK);
        }

        if (newKey == KEY_0 ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 8:
    case 9:

        msg = '';

        if( bGameInitialized == false ) {
            bGameInitialized = true;
            // ACTION: it places the character '@' based on the location index numX.
            for(i = 0; i<numX; i++) {
                msg = msg + "@";
            }
            printResult(msg);
        }


        if( (newKey != null) && (newKey != KEY_ENTER )) {
            // ACTION: it places the character '@' based on the location index numX.
            for(i = 0; i<numX; i++) {
                msg = msg + "@";
            }
            printResult(msg);
        }

        newKey = scanUserKey(); inCnt++;

        if(newKey == KEY_EQUAL_OR_PLUS){
            if(numX < plygdWidth)
                numX++;
            else
                numX = 1;
        } else if (newKey == KEY_MINUS_OR_UNDERSCORE) {
            if(numX > 1)
                numX--;
            //else
            //    MessageBeep(MB_ICONASTERISK);
        }

        if (newKey == KEY_0 ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;


    case 10:
    case 11:

        msg = '';
        if( bGameInitialized == false ) {
            bGameInitialized = true;
            // ACTION: it places the character '@' based on the location index numX.
            for(i = 0; i<numX; i++) {
                msg = msg + "@";
            }
            printResult(msg);
        }


        if( (newKey != null) && (newKey != KEY_ENTER )) {
            // ACTION: it places the character '@' based on the location index numX.
            for(i = 0; i<numX; i++) {
                msg = msg + "@";
            }
            printResult(msg);
        }

        newKey = scanUserKey(); inCnt++;

        if(newKey == KEY_EQUAL_OR_PLUS){
            if(numX < plygdWidth)
                numX++;
            else
                numX = 1;
        } else if (newKey == KEY_MINUS_OR_UNDERSCORE) {
            if(numX > 1)
                numX--;
            else
                numX = plygdWidth; //plygdWidth == 30
        }

        if (newKey == KEY_0 ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 12:

        msg = '';
        if( bGameInitialized == false ) {
            bGameInitialized = true;
            // ACTION: it places the character '@' based on the location index numX.
            for(i = 0; i<numX; i++) {
                msg = msg + "@";
            }
            printResult(msg);
        }


        if( (newKey != null) && (newKey != KEY_ENTER )) {
            // ACTION: it places the character '@' based on the location index numX.
            for(i = 0; i<numX; i++) {
                msg = msg + "@";
            }

            clearMsgBoard();
            printResultNoCur(msg);
        }
        
        
        newKey = scanUserKey();

        if(newKey == KEY_EQUAL_OR_PLUS){
            if(numX < plygdWidth)
                numX++;
            else
                numX = 1;
        } else if (newKey == KEY_MINUS_OR_UNDERSCORE) {
            if(numX > 1)
                numX--;
            else
                numX = plygdWidth; //plygdWidth == 30
        }

        if (newKey == KEY_0 ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;
    default:
        printResult("The task ID %d is not available.\n");
        break;
    }
    return 0;
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
function moveCharInRectArray(ix)
{

    let c = 1;
    let x = 1, i;
    const plygdWidth = MOVE_CHAR_WIDTH; // rectangular/playground width
    
    initMessageBoard();

    switch(ix){
    case 0:
        alert("Invalid Solution ID !");        
        break;
    case 1:

        pgdActiveLine[0] = '@';
        for( i=1; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
        

        while ((c != '0') && (c != null) ) {

            c = GetCh();

            if( c != null) {
                if( c == '') {
                    printResultInArray("", 0);
                } else {
                    printResultInArray(pgdActiveLine.join(''), 1);
                }
            }
            
        }        
        break;

    case 2:

        pgdActiveLine[0] = '@';
        for( i=1; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
        
        while ((c != '0') && (c != null) ) {

            c = GetCh();
            if((c == '+') || (c == '=') ) {
                printResultInArray(pgdActiveLine.join(''), 1);
            }
        }
        break;

    case 3:
        pgdActiveLine[0] = '@';
        for( i=1; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;

        while ((c != '0') && (c != null) ) {

            // ACTION: it places the character '@' based on the location index x.
            printResultInArray(pgdActiveLine.join(''), x);

            // INPUT: user key input
            c = GetCh(); inCnt++;

            // CONTROL: controls the location of the character '@'.
            if((c == '+') || (c == '=') ) {
                pgdActiveLine[x] = '@';
                x++;
            }
        }
        break;

    case 4:

        pgdActiveLine[0] = '@';
        for( i=1; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;

        while ((c != '0') && (c != null) ) {

            printResultInArray(pgdActiveLine.join(''), x);

            c = GetCh(); inCnt++;
            if((c == '+') || (c == '=') ){
                if(x < plygdWidth) {
                    pgdActiveLine[x] = '@';
                    x++;
                }
                // else
                //    console.log("\7");
            }
        }
        break;

    case 5:
        pgdActiveLine[0] = '@';
        for( i=1; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;

        while ((c != '0') && (c != null) ) {

            printResultInArray(pgdActiveLine.join(''), x);

            c = GetCh(); inCnt++;
            if((c == '+') || (c == '=')){
                if(x < plygdWidth) {
                    pgdActiveLine[x] = '@';
                    x++;
                }
                //  else
                //     console.log("\7");
            } else if ((c == '-') || (c == '_')) {
                if(x > 0) {
                    x--;
                    pgdActiveLine[x] = PLAYGROUND_SPACE_CHAR;
                }
                //else MessageBeep(MB_ICONASTERISK);
            }
        }
        break;

    case 6:
    case 7:
        pgdActiveLine[0] = '@';
        for( i=1; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;

        while ((c != '0') && (c != null) ) {

            printResultInArray(pgdActiveLine.join(''), x);

            c = GetCh(); inCnt++;
            if((c == '+') || (c == '=')){
                if(x < plygdWidth) {
                    pgdActiveLine[x] = '@';
                    x++;
                }
                // else
                //    console.log("\7");
            } else if ((c == '-') || (c == '_')) {
                if(x > 1) {
                    x--;
                    pgdActiveLine[x] = PLAYGROUND_SPACE_CHAR;
                } //else MessageBeep(MB_ICONASTERISK);
            }
        }
        break;

    case 8:
    case 9:
        pgdActiveLine[0] = '@';
        for( i=1; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;

        while ((c != '0') && (c != null) ) {

            printResultInArray(pgdActiveLine.join(''), x);

            c = GetCh(); inCnt++;
            if((c == '+') || (c == '=')){
                if(x < plygdWidth) {
                    pgdActiveLine[x] = '@';
                    x++;
                } else {
                    
                    x = 1;
                    pgdActiveLine[0] = '@';

                    for( i = x; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
                }
            } else if ((c == '-') || (c == '_')) {
                if(x > 1) {
                    x--;
                    pgdActiveLine[x] = PLAYGROUND_SPACE_CHAR;
                } //else MessageBeep(MB_ICONASTERISK);
            }
        }
        break;


    case 10:
    case 11:
        pgdActiveLine[0] = '@';
        for( i=1; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;

        while ((c != '0') && (c != null) ) {

            printResultInArray(pgdActiveLine.join(''), x);

            c = GetCh(); inCnt++;
            if((c == '+') || (c == '=')){
                if(x < plygdWidth) {
                    pgdActiveLine[x] = '@';
                    x++;
                } else {
                    x = 1;
                    pgdActiveLine[0] = '@';
                    for( i = x; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
                }
            } else if ((c == '-') || (c == '_')) {
                if(x > 1) {
                    x--;
                    pgdActiveLine[x] = PLAYGROUND_SPACE_CHAR;
                } else {
                    x = plygdWidth; //plygdWidth == 30
                    for(i=0; i < x; i++){
                        pgdActiveLine[i] = '@';
                    }
                }
            }
        }
        break;

    case 12:
        pgdActiveLine[0] = '@';
        for( i=1; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;

        while ((c != '0') && (c != null) ) {            
            clearMsgBoard();
            printResultInArrayNoCur(pgdActiveLine.join(''), x);

            c = GetCh();
            if((c == '+') || (c == '=')){
                if(x < plygdWidth) {
                    pgdActiveLine[x] = '@';
                    x++;
                } else {
                    x = 1;
                    pgdActiveLine[0] = '@';
                    for( i = x; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
                }
            } else if ((c == '-') || (c == '_')) {
                if(x > 0) {
                    x--;
                    pgdActiveLine[x] = PLAYGROUND_SPACE_CHAR;
                } else {
                    x = plygdWidth; //plygdWidth == 30
                    for(i=0; i < x; i++){
                        pgdActiveLine[i] = '@';
                    }
                }
            }
            
        }
        break;
    default:
        //console.log("The task ID %d is not available.\n");
        printResultInArray("The task ID %d is not available.", 0);
        break;
    }

    configSolutionEnd();
    return 0;
}

//////////////////////////////////////////////////////////////////////////////
function moveCharInRectArrayByPollingKeys()
{
    let i, ix = solIndex;    
    let plygdWidth = MOVE_CHAR_WIDTH; // rectangular/playground width
    
    initMessageBoard();

    switch(ix){
    case 0:
        alert("Invalid Solution ID !");        
        break;
    case 1:
    
        if( bGameInitialized == false ) {
            bGameInitialized = true;
            pgdActiveLine[0] = '@';
            for( i=1; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
        }

        newKey = scanUserKey();

        if( (newKey != null) && (newKey != KEY_ENTER)) {
            printResultInArray(pgdActiveLine.join(''), 1);
        }
        
        if (newKey == KEY_0 ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 2:
        if( bGameInitialized == false ) {
            bGameInitialized = true;
            pgdActiveLine[0] = '@';
            for( i=1; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
        }
        
        newKey = scanUserKey();

        if(newKey == KEY_EQUAL_OR_PLUS ) {
            printResultInArray(pgdActiveLine.join(''), 1);
        }

        if (newKey == KEY_0 ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 3:

        if( bGameInitialized == false ) {
            bGameInitialized = true;
            for( i=0; i < numX; i++ ) pgdActiveLine[i] = '@';
            for( i = numX; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';
            printResultInArray(pgdActiveLine.join(''), numX);
        }

        if( (newKey != null ) && (newKey != KEY_ENTER) ) {
            // ACTION: it places the character '@' based on the location index numX.
            printResultInArray(pgdActiveLine.join(''), numX);
        }

        newKey = scanUserKey(); inCnt++;

        // CONTROL: controls the location of the character '@'.
        if(newKey == KEY_EQUAL_OR_PLUS ) {
            pgdActiveLine[numX] = '@';
            numX++;
        }

        if (newKey == KEY_0 ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 4:

        if( bGameInitialized == false ) {
            bGameInitialized = true;
            for( i=0; i < numX; i++ ) pgdActiveLine[i] = '@';
            for( i = numX; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';
            printResultInArray(pgdActiveLine.join(''), numX);
        }

        if( (newKey != null ) && (newKey != KEY_ENTER) ) {
            // ACTION: it places the character '@' based on the location index numX.
            printResultInArray(pgdActiveLine.join(''), numX);
        }

        newKey = scanUserKey(); inCnt++;

        // CONTROL: controls the location of the character '@'.
        if(newKey == KEY_EQUAL_OR_PLUS ) {
            if(numX < plygdWidth) {
                pgdActiveLine[numX] = '@';
                numX++;
            }
        }

        if (newKey == KEY_0 ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 5:
        
        if( bGameInitialized == false ) {
            bGameInitialized = true;
            for( i=0; i < numX; i++ ) pgdActiveLine[i] = '@';
            for( i = numX; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';
            printResultInArray(pgdActiveLine.join(''), numX);
        }

        if( (newKey != null ) && (newKey != KEY_ENTER) ) {
            // ACTION: it places the character '@' based on the location index numX.
            printResultInArray(pgdActiveLine.join(''), numX);
        }

        newKey = scanUserKey(); inCnt++;

        // CONTROL: controls the location of the character '@'.
        if(newKey == KEY_EQUAL_OR_PLUS ) {
            if(numX < plygdWidth) {
                pgdActiveLine[numX] = '@';
                numX++;
            }
        } else if (newKey == KEY_MINUS_OR_UNDERSCORE) {
            if(numX > 0) {
                numX--;
                pgdActiveLine[numX] = PLAYGROUND_SPACE_CHAR;
            }
        }

        if (newKey == KEY_0 ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 6:
    case 7:

        if( bGameInitialized == false ) {
            bGameInitialized = true;
            for( i=0; i < numX; i++ ) pgdActiveLine[i] = '@';
            for( i = numX; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';
            printResultInArray(pgdActiveLine.join(''), numX);
        }

        if( (newKey != null ) && (newKey != KEY_ENTER) ) {
            // ACTION: it places the character '@' based on the location index numX.
            printResultInArray(pgdActiveLine.join(''), numX);
        }

        newKey = scanUserKey(); inCnt++;

        // CONTROL: controls the location of the character '@'.
        if(newKey == KEY_EQUAL_OR_PLUS ) {
            if(numX < plygdWidth) {
                pgdActiveLine[numX] = '@';
                numX++;
            }
        } else if (newKey == KEY_MINUS_OR_UNDERSCORE) {
            if(numX > 1) {
                numX--;
                pgdActiveLine[numX] = PLAYGROUND_SPACE_CHAR;
            }
        }

        if (newKey == KEY_0 ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 8:
    case 9:

        if( bGameInitialized == false ) {
            bGameInitialized = true;
            for( i=0; i < numX; i++ ) pgdActiveLine[i] = '@';
            for( i = numX; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';
            printResultInArray(pgdActiveLine.join(''), numX);
        }

        if( (newKey != null ) && (newKey != KEY_ENTER) ) {
            // ACTION: it places the character '@' based on the location index numX.
            printResultInArray(pgdActiveLine.join(''), numX);
        }

        newKey = scanUserKey(); inCnt++;

        // CONTROL: controls the location of the character '@'.
        if(newKey == KEY_EQUAL_OR_PLUS ) {
            if(numX < plygdWidth) {
                pgdActiveLine[numX] = '@';
                numX++;
            } else {
                numX = 1;
                pgdActiveLine[0] = '@';

                for( i = numX; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            }
        } else if (newKey == KEY_MINUS_OR_UNDERSCORE) {
            if(numX > 1) {
                numX--;
                pgdActiveLine[numX] = PLAYGROUND_SPACE_CHAR;
            } //else MessageBeep(MB_ICONASTERISK);
        }

        if (newKey == KEY_0 ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;


    case 10:
    case 11:
        if( bGameInitialized == false ) {
            bGameInitialized = true;
            for( i=0; i < numX; i++ ) pgdActiveLine[i] = '@';
            for( i = numX; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';
            printResultInArray(pgdActiveLine.join(''), numX);
        }

        if( (newKey != null ) && (newKey != KEY_ENTER) ) {
            // ACTION: it places the character '@' based on the location index numX.
            printResultInArray(pgdActiveLine.join(''), numX);
        }

        newKey = scanUserKey(); inCnt++;

        // CONTROL: controls the location of the character '@'.
        if(newKey == KEY_EQUAL_OR_PLUS ) {
            if(numX < plygdWidth) {
                pgdActiveLine[numX] = '@';
                numX++;
            } else {
                numX = 1;
                pgdActiveLine[0] = '@';

                for( i = numX; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            }
        } else if (newKey == KEY_MINUS_OR_UNDERSCORE) {
            if(numX > 1) {
                numX--;
                pgdActiveLine[numX] = PLAYGROUND_SPACE_CHAR;
            } else {
                numX = plygdWidth; //plygdWidth == 30
                for(i=0; i < numX; i++){
                    pgdActiveLine[i] = '@';
                }
            }
        }

        if (newKey == KEY_0 ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 12:        
        
        if( bGameInitialized == false ) {
            bGameInitialized = true;
            for( i=0; i < numX; i++ ) pgdActiveLine[i] = '@';
            for( i = numX; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';
            printResultInArray(pgdActiveLine.join(''), numX);
        }

        if( (newKey != null ) && (newKey != KEY_ENTER) ) {
            clearMsgBoard();
            // ACTION: it places the character '@' based on the location index numX.
            printResultInArrayNoCur(pgdActiveLine.join(''), numX);
        }

        newKey = scanUserKey(); //inCnt++;

        // CONTROL: controls the location of the character '@'.
        if(newKey == KEY_EQUAL_OR_PLUS ) {
            if(numX < plygdWidth) {
                pgdActiveLine[numX] = '@';
                numX++;
            } else {
                numX = 1;
                pgdActiveLine[0] = '@';

                for( i = numX; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            }
        } else if (newKey == KEY_MINUS_OR_UNDERSCORE) {
            if(numX > 1) {
                numX--;
                pgdActiveLine[numX] = PLAYGROUND_SPACE_CHAR;
            } else {
                numX = plygdWidth; //plygdWidth == 30
                for(i=0; i < numX; i++){
                    pgdActiveLine[i] = '@';
                }
            }
        }

        if (newKey == KEY_0 ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    default:
        printResultInArray("The task ID %d is not available.", 0);
        break;
    }
    return 0;
}
