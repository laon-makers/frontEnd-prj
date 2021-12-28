//  Copyright (C) 2024 Gi Tae Cho laon.makers@yahoo.com
//    This file is a part of the Smart Home WiFi Web Server project.
//    This project can not be copied and/or distributed without the express permission of Gi Tae Cho laon.makers@yahoo.com.
// 
//  Author: G.T. Cho (a Laon maker/artist in Laon Creators' Group)
//    Version: 1.0
//    Last update: Jan. 17, 2022
//
//const GETCHAR_2BYTES = 1;

const KEY_ENTER         = 0x0D;
const KEY_0             = 0x30;
const KEY_9             = 0x39;
const KEY_A_OR_a        = 0x41;
const KEY_O_OR_o        = 0x4F;

const KEY_EQUAL_OR_PLUS = 0x3D;
const KEY_MINUS_OR_UNDERSCORE = 0xAD;
const KEY_ESC           = 0x1B;
const KEY_SHIFT         = 0x10;
const KEY_CTRL          = 0x11;
const KEY_ALT           = 0x12;

const KEY_RIGHT_ARROW   = 0x27;
const KEY_LEFT_ARROW    = 0x25;
const KEY_DOWN_ARROW    = 0x28;
const KEY_UP_ARROW      = 0x26;
const KEY_F1            = 0x70;
const KEY_F12           = 0x7B;


const bPRINT_ON_CONSOLE = false;
const PRJ_PARAM                     = 5;
const MOVE_CHAR_WIDTH               = 30;
const MOVE_CHAR_HEIGHT              = 15;
const PLAYGROUND_WIDTH_MAX          = 50;
const PLAYGROUND_HEIGHT_MAX         = 30;
const PLAYGROUND_MAX_FENCE_WIDTH    = (PLAYGROUND_WIDTH_MAX+3);
const PLAYGROUND_WIDTH_INCREAMENT   = 5;
const PLAYGROUND_HEIGHT_INCREAMENT  = 5;

const PLAYGROUND_X_OFFSET_MAX       = 60;
const PLAYGROUND_Y_OFFSET_MAX       = 30;
const PLAYGROUND_X_OFFSET_INCREAMENT = 5;
const PLAYGROUND_Y_OFFSET_INCREAMENT = 5;
const MAX_MSG_BOARD_LINES            = 31;
const NOF_SOLUTION                   = 29;

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
let rowLocId = document.getElementById('rowLocId');
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
let row, column, fence, plygdWidth, plygdHeight;
let movingChIx;
let fenceCh;
let bFence;
let spaceXY;

const movingChar = [')','!','@','#','$','%','^','&','*','('];

let movChInterval;
let keyEvt = {key:'', which:null, ctrl:false, alt: false, shift:false, down:false, up:false };

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
            initSolOptions();
            document.getElementById('solId').selectedIndex = solIndex + 1;

            bGameInitialized = false;
            launchMovingChar();
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
function printResultInArray(ma) {
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
        else numChar.textContent = numX.toString();
    }
}

//////////////////////////////////////////////////////////////////////////////
function printResultInArrayNoCur(ma) {
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
        else numChar.textContent = numX.toString();
    }
}
//////////////////////////////////////////////////////////////////////////////
function printResultInArraySingleChar(ma) {    

    if( bPRINT_ON_CONSOLE == true ) {
        console.log(ma);    
    } else {

        if( msgLineCnt >= MAX_MSG_BOARD_LINES ) {
            pgndTxt = ma + "<br\>";
            msgLineCnt = 0;
        } else {
            pgndTxt += ma.trim() + "<br\>";
            msgLineCnt += 1;
        }

        msgBoard.innerHTML = pgndTxt;

        numChar.textContent = numX.toString();
    }
}


//////////////////////////////////////////////////////////////////////////////
function resetGame() {
    clearMsgBoard();
    keyEvt.down = true;
    keyEvt.key = 'Escape';
    keyEvt.which = KEY_ESC;
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
function initSolOptions() {
    if( bPRINT_ON_CONSOLE == false ) {
        let sid = document.getElementById('solId');
        let newOp;

        for( let i = 0; i < (NOF_SOLUTION + 1); i++) {
            newOp = document.createElement('option');
            newOp.textContent = i.toString();
            sid.appendChild(newOp);
        }
        
    }
}

//////////////////////////////////////////////////////////////////////////////
function nextMovingCh() {
    solIndex = solIndex + 1;
    if( solIndex > NOF_SOLUTION ) solIndex = 0;
    document.getElementById('solId').value = solIndex.toString();
    //movingCh(solIndex);
    selectedMovingCh();
}

//////////////////////////////////////////////////////////////////////////////
function lastMovingCh() {
    solIndex = NOF_SOLUTION;
    runSelectedMovingChar();
}

//////////////////////////////////////////////////////////////////////////////
function launchMovingChar() {

    if( projectIx == 1) {
        pgdTopBottomLine  = new Array(PLAYGROUND_MAX_FENCE_WIDTH); // char pgdTopBottomLine[PLAYGROUND_MAX_FENCE_WIDTH];
        pgdEmptyLine  = new Array(PLAYGROUND_MAX_FENCE_WIDTH);     // char pgdEmptyLine[PLAYGROUND_MAX_FENCE_WIDTH];
        pgdActiveLine = new Array(PLAYGROUND_WIDTH_MAX+2); //.join(''); //char pgdActiveLine[PLAYGROUND_WIDTH_MAX+2];
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
    
    //==> Initialize for non-blocking keyboard input.
    bGameInitialized = false;
    newKey = null;
    numX = 1,
    inCnt = 0;
    plygdWidth = MOVE_CHAR_WIDTH; plygdHeight = MOVE_CHAR_HEIGHT; // rectangular size
    row = 1; column = 1;
    movingChIx = 2; //int movingChIx = 2;
    fenceCh = '#'; //char fenceCh = '#';
    //spXY = [0,0];
    spaceXY = [0,0];
    bFence = false;
    //<==

    configSolutionStart();
    if( projectIx == 0 ) {
        movChInterval = setInterval(movingChByPollingKeys, 50);
    } else if ( projectIx == 1 ) {
        movChInterval = setInterval(moveCharInRectArrayByPollingKeys, 50);
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
        instruction = "Hit '0' to exit.  Project: Moving Char II   ID:" + solIndex.toString();
    } else if ( projectIx == 1 ) {
        if(solIndex < 25 ) {
            instruction = "Hit 'ESC' key to exit.  Project: Moving Char II (Array).   ID:" + solIndex.toString();
        } else {
            instruction = "ESC to Exit.  F1 for Menu.  Project: Moving Char II (Array).   ID:" + solIndex.toString();
        }
    }

    document.getElementById('instruction').textContent = instruction;
    document.getElementById('solId').disabled = true;
    document.getElementById('runSelSol').disabled = true;
    document.getElementById('chbExtraBtn').disabled = true;
    document.getElementById('extraBtn').hidden = true;
}

//////////////////////////////////////////////////////////////////////////////
function configSolutionEnd() {
    document.getElementById('instruction').textContent = '';
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
// It is fully functional in any web browser. Keyboard input is detected like
//  unblocking key scan.
function movingChByPollingKeys() {
    
    let i, ix = solIndex;    
    let msg = '';    

    initMessageBoard();

    switch(ix){
    case 0:
        numX = 0;
        newKey = scanUserKey();    

        if( (newKey != null) && (newKey != KEY_ENTER)) {
        //if( newKey != null ) {
            printResult(newKey.toString());
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
            //console.log("@");
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
        // ACTION: it places the character '@' based on the location index numX.
        for(i = 0; i<numX; i++) {
            msg = msg + "@";
        }

        if( newKey != KEY_ENTER ) printResult(msg);

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
        // ACTION: it places the character '@' based on the location index numX.
        for(i = 0; i<numX; i++) {
            msg = msg + "@";
        }

        if( newKey != KEY_ENTER ) printResult(msg);

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
        // ACTION: it places the character '@' based on the location index numX.
        for(i = 0; i<numX; i++) {
            msg = msg + "@";
        }

        if( newKey != KEY_ENTER ) printResult(msg);

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

        // ACTION: it places the character '@' based on the location index numX.
        msg = '';

        for(i = 0; i<numX; i++) {
            msg = msg + "@";
        }
        if( newKey != KEY_ENTER ) printResult(msg);

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

        for(i = 0; i<numX; i++) {
            msg = msg + "@";
        }

        if( newKey != KEY_ENTER ) printResult(msg);

        // note that it is 'getch()' for DevC++ while _getch() for Visual Studio.
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
        for(i = 0; i<numX; i++) {
            msg = msg + "@";
        }
        if( newKey != KEY_ENTER ) printResult(msg);

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
            for(i = 0; i<numX; i++) {
                msg = msg + "@";
            }
            
            if( newKey != KEY_ENTER ) {
                clearMsgBoard();
                //printResult(msg, false);
                printResultNoCur(msg);
            }
            
            newKey = scanUserKey(); // note that it is 'getch()' for DevC++ while _getch() for Visual Studio.

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
        //console.log("The task ID %d is not available.\n");
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
    //const plygdWidth = MOVE_CHAR_WIDTH; // rectangular/playground width
    
    initMessageBoard();

    switch(ix){
    case 0:
        alert("Invalid Solution ID !");        
        break;
    case 1:
        
        for( i=0; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = ' ';
        pgdActiveLine[0] = '@';

        while ((c != KEY_0) && (c != null) ) {

            c = GetCh();

            if( c != null) {
                if( c == KEY_ENTER) {
                    printResultInArray("");
                } else {
                    printResultInArray(pgdActiveLine.join(''));
                }
            }
            
        }        
        break;

    case 2:

        for( i=0; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = ' ';
        
        pgdActiveLine[0] = '@';
        
        while ((c != KEY_0) && (c != null) ) {

            c = GetCh();
            if(c == KEY_EQUAL_OR_PLUS ) {
                printResultInArray(pgdActiveLine.join(''));
            }
        }
        break;

    case 3:
        for( i=0; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = ' ';
        pgdActiveLine[0] = '@';

        while ((c != KEY_0) && (c != null) ) {

            // ACTION: it places the character '@' based on the location index x.
            printResultInArray(pgdActiveLine.join(''));

            // INPUT: user key input
            c = GetCh(); inCnt++;

            // CONTROL: controls the location of the character '@'.
            if(c == KEY_EQUAL_OR_PLUS ) {
                pgdActiveLine[x] = '@';
                x++;
            }
        }
        break;

    case 4:

        for( i=0; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = ' ';
        pgdActiveLine[0] = '@';

        while ((c != KEY_0) && (c != null) ) {

            printResultInArray(pgdActiveLine.join(''));

            c = GetCh(); inCnt++;
            if(c == KEY_EQUAL_OR_PLUS ){
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
        for( i=0; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = ' ';
        pgdActiveLine[0] = '@';

        while ((c != KEY_0) && (c != null) ) {

            printResultInArray(pgdActiveLine.join(''));

            c = GetCh(); inCnt++;
            if(c == KEY_EQUAL_OR_PLUS){
                if(x < plygdWidth) {
                    pgdActiveLine[x] = '@';
                    x++;
                }
                //  else
                //     console.log("\7");
            } else if (c == KEY_MINUS_OR_UNDERSCORE) {
                if(x > 0) {
                    x--;
                    pgdActiveLine[x] = ' ';
                }
                //else MessageBeep(MB_ICONASTERISK);
            }
        }
        break;

    case 6:
    case 7:
        for( i=0; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = ' ';
        pgdActiveLine[0] = '@';

        while ((c != KEY_0) && (c != null) ) {

            printResultInArray(pgdActiveLine.join(''));

            c = GetCh(); inCnt++;
            if(c == KEY_EQUAL_OR_PLUS){
                if(x < plygdWidth) {
                    pgdActiveLine[x] = '@';
                    x++;
                }
                // else
                //    console.log("\7");
            } else if (c == KEY_MINUS_OR_UNDERSCORE) {
                if(x > 1) {
                    x--;
                    pgdActiveLine[x] = ' ';
                } //else MessageBeep(MB_ICONASTERISK);
            }
        }
        break;

    case 8:
    case 9:
        for( i=0; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = ' ';
        pgdActiveLine[0] = '@';
        while ((c != KEY_0) && (c != null) ) {

            printResultInArray(pgdActiveLine.join(''));

            c = GetCh(); inCnt++;
            if(c == KEY_EQUAL_OR_PLUS){
                if(x < plygdWidth) {
                    pgdActiveLine[x] = '@';
                    x++;
                } else {
                    x = 1;
                    pgdActiveLine[0] = '@';

                    for( i = x; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = ' ';
                }
            } else if (c == KEY_MINUS_OR_UNDERSCORE) {
                if(x > 1) {
                    x--;
                    pgdActiveLine[x] = ' ';
                } //else MessageBeep(MB_ICONASTERISK);
            }
        }
        break;


    case 10:
    case 11:
        for( i=0; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = ' ';
        pgdActiveLine[0] = '@';

        while ((c != KEY_0) && (c != null) ) {

            printResultInArray(pgdActiveLine.join(''));

            c = GetCh(); inCnt++;
            if(c == KEY_EQUAL_OR_PLUS){
                if(x < plygdWidth) {
                    pgdActiveLine[x] = '@';
                    x++;
                } else {
                    x = 1;
                    pgdActiveLine[0] = '@';
                    for( i = x; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = ' ';
                }
            } else if (c == KEY_MINUS_OR_UNDERSCORE) {
                if(x > 1) {
                    x--;
                    pgdActiveLine[x] = ' ';
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
        for( i=0; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = ' ';
        pgdActiveLine[0] = '@';

        while ((c != KEY_0) && (c != null) ) {            
            clearMsgBoard();
            printResultInArrayNoCur(pgdActiveLine.join(''));

            c = GetCh();
            if(c == KEY_EQUAL_OR_PLUS){
                if(x < plygdWidth) {
                    pgdActiveLine[x] = '@';
                    x++;
                } else {
                    x = 1;
                    pgdActiveLine[0] = '@';
                    for( i = x; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = ' ';
                }
            } else if (c == KEY_MINUS_OR_UNDERSCORE) {
                if(x > 0) {
                    x--;
                    pgdActiveLine[x] = ' ';
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
        printResultInArray("The task ID %d is not available.\n");
        break;
    }

    configSolutionEnd();
    return 0;
}


//////////////////////////////////////////////////////////////////////////////
function moveCharInRectArrayByPollingKeys()
{
    let i, ix = solIndex;
    let y = 1; // int numX = 1, y = 1, i, inCnt = 0; 
    
    initMessageBoard();


    switch(ix){
    case 1:

        if( bGameInitialized == false ) {
            bGameInitialized = true;
            pgdActiveLine[0] = '@';            
            for( i = 1; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';
            printResultInArray(pgdActiveLine.join(''));
        }

        if( (newKey != null) && (newKey != KEY_ENTER)) {
            // ACTION: it places the character '@' based on the location index numX.
            printResultInArray(pgdActiveLine.join(''));
        }

        newKey = scanUserKey(); inCnt++;
        
        // CONTROL: controls the location of the character '@'.
        if(newKey == KEY_RIGHT_ARROW){
            if(numX >= plygdWidth) {
                numX = 0;
                for( i = 1; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            }
            pgdActiveLine[numX] = '@';
            numX++;

        } else if (newKey == KEY_LEFT_ARROW) {
            if(numX > 1) {
                numX--;
                pgdActiveLine[numX] = ' ';
            } else {
                numX = plygdWidth; //plygdWidth == 30
                for(i=0; i < numX; i++){
                    pgdActiveLine[i] = '@';
                }
            }
        }

        if (newKey == KEY_ESC ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 2:
        if( bGameInitialized == false ) {
            bGameInitialized = true;
            pgdActiveLine[0] = '@';
            for( i = 1; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';
            printResultInArrayNoCur(pgdActiveLine.join(''));
        }

        if( (newKey != null) && (newKey != KEY_ENTER)) {
            // ACTION: it places the character '@' based on the location index numX.
            clearMsgBoard();
            printResultInArrayNoCur(pgdActiveLine.join(''));
        }

        newKey = scanUserKey(); inCnt++;
        
        // CONTROL: controls the location of the character '@'.
        if(newKey == KEY_RIGHT_ARROW){
            if(numX >= plygdWidth) {
                numX = 0;
                for( i = 1; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            }
            pgdActiveLine[numX] = '@';
            numX++;

        } else if (newKey == KEY_LEFT_ARROW) {
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

        if (newKey == KEY_ESC ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 3:
    case 4:
    case 5:
    case 6:
        
        if( bGameInitialized == false ) {
            bGameInitialized = true;
            pgdActiveLine[0] = '@';
            for( i = 1; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';
            
            //pgdActiveLine[1] += numX.toString();
            printResultInArraySingleChar(pgdActiveLine.join(''));
        }

        if( (newKey != null) && (newKey != KEY_ENTER)) {
            // ACTION: it places the character '@' based on the location index numX.
            clearMsgBoard();
            printResultInArraySingleChar(pgdActiveLine.join(''));
        }

        newKey = scanUserKey(); inCnt++;
        
        // for debugging...
        //document.getElementById('instruction').textContent += newKey;

        // CONTROL: controls the location of the character '@'.
        
        if(newKey == KEY_RIGHT_ARROW){
            if(numX < plygdWidth) {
                pgdActiveLine[numX - 1] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[numX] = '@';
                numX++;
            } else {
                numX = 1;
                pgdActiveLine[0] = '@';
                for( i = numX; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            }

        } else if (newKey == KEY_LEFT_ARROW) {
            if(numX > 1) {
                numX--;
                pgdActiveLine[numX] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[numX - 1] = '@';
            } else {
                
                numX = plygdWidth; //plygdWidth == 30
                for( i = 0; i < numX - 1; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[i] = '@';
            }
        }

        if (newKey == KEY_ESC ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 7:

        if( bGameInitialized == false ) {
            bGameInitialized = true;
            pgdActiveLine[0] = '@';
            for( i = 1; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';

            DrawCharacterInPlayground(pgdActiveLine.join(''), ix);
        }

        if( (newKey != null) && (newKey != KEY_ENTER)) {
            // ACTION: it places the character '@' based on the location index numX.
            clearMsgBoard();
            DrawCharacterInPlayground(pgdActiveLine.join(''), ix);
        }

        // INPUT: user key input.
        newKey = scanUserKey(); inCnt++;
    

        // CONTROL: controls the location of the character '@'.
        if(newKey == KEY_RIGHT_ARROW){            
            if(numX < plygdWidth) {
                pgdActiveLine[numX - 1] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[numX] = '@';
                numX++;
            } else {
                numX = 1;
                pgdActiveLine[0] = '@';
                for( i = numX; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            }
        } else if (newKey == KEY_LEFT_ARROW) {
            if(numX > 1) {
                numX--;
                pgdActiveLine[numX] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[numX - 1] = '@';
            } else {
                
                numX = plygdWidth; //plygdWidth == 30
                for( i = 0; i < numX - 1; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[i] = '@';
            }
        } 

        if (newKey == KEY_ESC ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;


    case 8:

        if( bGameInitialized == false ) {
            bGameInitialized = true;
            pgdActiveLine[0] = '@';
            for( i = 1; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';

            row = 1;
            DrawCharacterInPlayground(pgdActiveLine.join(''), ix);
        }

        if( (newKey != null) && (newKey != KEY_ENTER)) {
            // ACTION: it places the character '@' based on the location index numX.
            clearMsgBoard();
            DrawCharacterInPlayground(pgdActiveLine.join(''), ix);
        }

        // INPUT: user key input.
        newKey = scanUserKey(); inCnt++;
    

        // CONTROL: controls the location of the character '@'.
        if(newKey == KEY_RIGHT_ARROW){
            if(numX < plygdWidth) {
                pgdActiveLine[numX - 1] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[numX] = '@';
                numX++;
            } else {
                numX = 1;
                pgdActiveLine[0] = '@';
                for( i = numX; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            }
        } else if (newKey == KEY_LEFT_ARROW) {
            if(numX > 1) {
                numX--;
                pgdActiveLine[numX] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[numX - 1] = '@';
            } else {
                
                numX = plygdWidth; //plygdWidth == 30
                for( i = 0; i < numX - 1; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[i] = '@';
            }
        } else if (newKey == KEY_DOWN_ARROW){
            row++;
        }

        if (newKey == KEY_ESC ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 9:
    case 10:

        if( bGameInitialized == false ) {
            bGameInitialized = true;
            pgdActiveLine[0] = '@';
            for( i = 1; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';

            row = 1;
            DrawCharacterInPlayground(pgdActiveLine.join(''), ix);
        }

        if( (newKey != null) && (newKey != KEY_ENTER)) {
            // ACTION: it places the character '@' based on the location index numX.
            clearMsgBoard();
            DrawCharacterInPlayground(pgdActiveLine.join(''), ix);
        }

        // INPUT: user key input.
        newKey = scanUserKey(); inCnt++;
    

        // CONTROL: controls the location of the character '@'.
        if(newKey == KEY_RIGHT_ARROW){
            if(numX < plygdWidth) {
                pgdActiveLine[numX - 1] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[numX] = '@';
                numX++;
            } else {
                numX = 1;
                pgdActiveLine[0] = '@';
                for( i = numX; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            }
        } else if (newKey == KEY_LEFT_ARROW) {
            if(numX > 1) {
                numX--;
                pgdActiveLine[numX] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[numX - 1] = '@';
            } else {
                
                numX = plygdWidth; //plygdWidth == 30
                for( i = 0; i < numX - 1; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[i] = '@';
            }
        } else if (newKey == KEY_DOWN_ARROW){
            if(row < plygdHeight)
                row++;
            else row = 1;
        }

        if (newKey == KEY_ESC ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }

        break;

    case 11:
        
        if( bGameInitialized == false ) {
            bGameInitialized = true;
            pgdActiveLine[0] = '@';
            for( i = 1; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';

            row = 1;
            DrawCharacterInPlayground(pgdActiveLine.join(''), ix);
        }

        if( (newKey != null) && (newKey != KEY_ENTER)) {
            // ACTION: it places the character '@' based on the location index numX.
            clearMsgBoard();
            DrawCharacterInPlayground(pgdActiveLine.join(''), ix);
        }

        // INPUT: user key input.
        newKey = scanUserKey(); inCnt++;
    

        // CONTROL: controls the location of the character '@'.
        if(newKey == KEY_RIGHT_ARROW){
            if(numX < plygdWidth) {
                pgdActiveLine[numX - 1] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[numX] = '@';
                numX++;
            } else {
                numX = 1;
                pgdActiveLine[0] = '@';
                for( i = numX; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            }
        } else if (newKey == KEY_LEFT_ARROW) {
            if(numX > 1) {
                numX--;
                pgdActiveLine[numX] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[numX - 1] = '@';
            } else {
                
                numX = plygdWidth; //plygdWidth == 30
                for( i = 0; i < numX - 1; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[i] = '@';
            }
        } else if (newKey == KEY_DOWN_ARROW){
            if(row < plygdHeight)
                row++;
            else row = 1;

        } else if (newKey == KEY_UP_ARROW){
            if(row > 1)
                row--;
        }

        if (newKey == KEY_ESC ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 12:
    case 13:
    case 14:        

        if( bGameInitialized == false ) {
            bGameInitialized = true;
            pgdActiveLine[0] = '@';
            for( i = 1; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';

            row = 1;
            DrawCharacterInPlayground(pgdActiveLine.join(''), ix);
        }

        if( (newKey != null) && (newKey != KEY_ENTER)) {
            // ACTION: it places the character '@' based on the location index numX.
            clearMsgBoard();
            DrawCharacterInPlayground(pgdActiveLine.join(''), ix);
        }

        // INPUT: user key input.
        newKey = scanUserKey(); inCnt++;
    

        // CONTROL: controls the location of the character '@'.
        if(newKey == KEY_RIGHT_ARROW){
            if(numX < plygdWidth) {
                pgdActiveLine[numX - 1] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[numX] = '@';
                numX++;
            } else {
                numX = 1;
                pgdActiveLine[0] = '@';
                for( i = numX; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            }
        } else if (newKey == KEY_LEFT_ARROW) {
            if(numX > 1) {
                numX--;
                pgdActiveLine[numX] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[numX - 1] = '@';
            } else {
                
                numX = plygdWidth; //plygdWidth == 30
                for( i = 0; i < numX - 1; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[i] = '@';
            }
        } else if (newKey == KEY_DOWN_ARROW){
            if(row < plygdHeight)
                row++;
            else row = 1;

        } else if (newKey == KEY_UP_ARROW){
            if(row > 1)
                row--;
            else
                row = plygdHeight;
        }

        if (newKey == KEY_ESC ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 15:

        if( bGameInitialized == false ) {
            bGameInitialized = true;
            pgdActiveLine[0] = '@';
            for( i = 1; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';

            row = 1;
            DrawCharacterInPlayground(pgdActiveLine.join(''), ix);
        }

        if( (newKey != null) && (newKey != KEY_ENTER)) {
            // ACTION: it places the character '@' based on the location index numX.
            clearMsgBoard();
            DrawCharacterInPlayground(pgdActiveLine.join(''), ix);
        }

        // INPUT: user key input.
        newKey = scanUserKey(); inCnt++;
    

        // CONTROL: controls the location of the character '@'.
        if(newKey == KEY_RIGHT_ARROW){
            if(numX < plygdWidth) {
                pgdActiveLine[numX - 1] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[numX] = '@';
                numX++;
            } else {
                numX = 1;
                if(row < plygdHeight)
                    row++;
                pgdActiveLine[0] = '@';
                for( i = numX; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            }
        } else if (newKey == KEY_LEFT_ARROW) {
            if(numX > 1) {
                numX--;
                pgdActiveLine[numX] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[numX - 1] = '@';
            } else {
                
                numX = plygdWidth; //plygdWidth == 30
                if(row > 1)
                    row--;
                for( i = 0; i < numX - 1; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[i] = '@';
            }
        } else if (newKey == KEY_DOWN_ARROW){
            if(row < plygdHeight)
                row++;
            else row = 1;

        } else if (newKey == KEY_UP_ARROW){
            if(row > 1)
                row--;
            else
                row = plygdHeight;
        }

        if (newKey == KEY_ESC ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 16:

        if( bGameInitialized == false ) {
            bGameInitialized = true;
            pgdActiveLine[0] = '@';
            for( i = 1; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';

            row = 1;
            DrawCharacterInPlayground(pgdActiveLine.join(''), ix);
        }

        if( (newKey != null) && (newKey != KEY_ENTER)) {
            // ACTION: it places the character '@' based on the location index numX.
            clearMsgBoard();
            DrawCharacterInPlayground(pgdActiveLine.join(''), ix);
        }

        // INPUT: user key input.
        newKey = scanUserKey(); inCnt++;
    

        // CONTROL: controls the location of the character '@'.
        if(newKey == KEY_RIGHT_ARROW){
            if(numX < plygdWidth) {
                pgdActiveLine[numX - 1] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[numX] = '@';
                numX++;
            } else {
                numX = 1;
                if(row < plygdHeight)
                    row++;
                else
                    row = 1;
                pgdActiveLine[0] = '@';
                for( i = numX; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            }
        } else if (newKey == KEY_LEFT_ARROW) {
            if(numX > 1) {
                numX--;
                pgdActiveLine[numX] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[numX - 1] = '@';
            } else {
                
                numX = plygdWidth; //plygdWidth == 30
                if(row > 1)
                    row--;
                else
                    row = plygdHeight;
                for( i = 0; i < numX - 1; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[i] = '@';
            }
        } else if (newKey == KEY_DOWN_ARROW){
            if(row < plygdHeight)
                row++;
            else row = 1;

        } else if (newKey == KEY_UP_ARROW){
            if(row > 1)
                row--;
            else
                row = plygdHeight;
        }

        if (newKey == KEY_ESC ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 17:
        
        if( bGameInitialized == false ) {
            bGameInitialized = true;
            pgdActiveLine[0] = '@';
            for( i = 1; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';

            row = 1;
            DrawCharacterInPlayground(pgdActiveLine.join(''), ix);
        }

        if( (newKey != null) && (newKey != KEY_ENTER)) {
            // ACTION: it places the character '@' based on the location index numX.
            clearMsgBoard();
            DrawCharacterInPlayground(pgdActiveLine.join(''), ix);
        }

        // INPUT: user key input.
        newKey = scanUserKey(); inCnt++;
    

        // CONTROL: controls the location of the character '@'.
        if(newKey == KEY_RIGHT_ARROW){
            if(numX < plygdWidth) {
                pgdActiveLine[numX - 1] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[numX] = '@';
                numX++;
            } else {
                numX = 1;
                if(row < plygdHeight)
                    row++;
                else
                    row = 1;
                pgdActiveLine[0] = '@';
                for( i = numX; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            }
        } else if (newKey == KEY_LEFT_ARROW) {
            if(numX > 1) {
                numX--;
                pgdActiveLine[numX] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[numX - 1] = '@';
            } else {
                
                numX = plygdWidth; //plygdWidth == 30
                if(row > 1)
                    row--;
                else
                    row = plygdHeight;
                for( i = 0; i < numX - 1; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[i] = '@';
            }
        } else if (newKey == KEY_DOWN_ARROW){
            if(row < plygdHeight)
                row++;
            else {
                row = 1;
                if(numX < plygdWidth){
                    if(numX>0) pgdActiveLine[numX-1] = PLAYGROUND_SPACE_CHAR;
                    pgdActiveLine[numX] = '@';
                    numX++;
                }
            }

        } else if (newKey == KEY_UP_ARROW){
            if(row > 1)
                row--;
            else {
                row = plygdHeight;
                if(numX > 1) {
                    numX--;
                    pgdActiveLine[numX] = PLAYGROUND_SPACE_CHAR;
                    pgdActiveLine[numX-1] = '@';
                }
            }
        }

        if (newKey == KEY_ESC ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;
    case 18:
        
        if( bGameInitialized == false ) {
            bGameInitialized = true;
            pgdActiveLine[0] = '@';
            for( i = 1; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';

            row = 1;
            DrawCharacterInPlayground(pgdActiveLine.join(''), ix);
        }

        if( (newKey != null) && (newKey != KEY_ENTER)) {
            // ACTION: it places the character '@' based on the location index numX.
            clearMsgBoard();
            DrawCharacterInPlayground(pgdActiveLine.join(''), ix);
        }

        // INPUT: user key input.
        newKey = scanUserKey(); inCnt++;
    

        // CONTROL: controls the location of the character '@'.
        if(newKey == KEY_RIGHT_ARROW){
            if(numX < plygdWidth) {
                pgdActiveLine[numX - 1] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[numX] = '@';
                numX++;
            } else {
                numX = 1;
                if(row < plygdHeight)
                    row++;
                else
                    row = 1;
                pgdActiveLine[0] = '@';
                for( i = numX; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            }
        } else if (newKey == KEY_LEFT_ARROW) {
            if(numX > 1) {
                numX--;
                pgdActiveLine[numX] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[numX - 1] = '@';
            } else {
                
                numX = plygdWidth; //plygdWidth == 30
                if(row > 1)
                    row--;
                else
                    row = plygdHeight;
                for( i = 0; i < numX - 1; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[i] = '@';
            }
        } else if (newKey == KEY_DOWN_ARROW){
            if(row < plygdHeight)
                row++;
            else {
                row = 1;
                if(numX < plygdWidth){
                    if(numX>0) pgdActiveLine[numX-1] = PLAYGROUND_SPACE_CHAR;
                    pgdActiveLine[numX] = '@';
                    numX++;
                } else {
                    numX = 1;
                    pgdActiveLine[0] = '@';
                    for( i = numX; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
                }
            }

        } else if (newKey == KEY_UP_ARROW){
            if(row > 1)
                row--;
            else {
                row = plygdHeight;
                if(numX > 1) {
                    numX--;
                    pgdActiveLine[numX] = PLAYGROUND_SPACE_CHAR;
                    pgdActiveLine[numX-1] = '@';
                } else {
                    numX = plygdWidth;
                    for(i=0; i < plygdWidth-1; i++){
                        pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
                    }

                    pgdActiveLine[i] = '@';
                }
            }
        }

        if (newKey == KEY_ESC ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;


    case 19:
        if( bGameInitialized == false ) {
            bGameInitialized = true;
            pgdActiveLine[0] = '@';
            for( i = 1; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';

            row = 1;
            DrawCharacterInPlayground(pgdActiveLine.join(''), ix);
        }

        if( (newKey != null) && (newKey != KEY_ENTER)) {
            // ACTION: it places the character '@' based on the location index numX.
            clearMsgBoard();
            DrawCharacterInPlayground(pgdActiveLine.join(''), ix);
        }

        // INPUT: user key input.
        newKey = scanUserKey(); inCnt++;
    

        // CONTROL: controls the location of the character '@'.
        if(newKey == KEY_RIGHT_ARROW){
            if(numX < plygdWidth) {
                pgdActiveLine[numX - 1] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[numX] = movingChar[movingChIx];
                numX++;
            } else {
                numX = 1;
                if(row < plygdHeight)
                    row++;
                else
                    row = 1;
                pgdActiveLine[0] = movingChar[movingChIx];
                for( i = numX; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            }
        } else if (newKey == KEY_LEFT_ARROW) {
            if(numX > 1) {
                numX--;
                pgdActiveLine[numX] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[numX - 1] = movingChar[movingChIx];
            } else {
                
                numX = plygdWidth; //plygdWidth == 30
                if(row > 1)
                    row--;
                else
                    row = plygdHeight;
                for( i = 0; i < numX - 1; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
                pgdActiveLine[i] = movingChar[movingChIx];
            }
        } else if (newKey == KEY_DOWN_ARROW){
            if(row < plygdHeight)
                row++;
            else {
                row = 1;
                if(numX < plygdWidth){
                    if(numX>0) pgdActiveLine[numX-1] = PLAYGROUND_SPACE_CHAR;
                    pgdActiveLine[numX] = movingChar[movingChIx];
                    numX++;
                } else {
                    numX = 1;
                    pgdActiveLine[0] = movingChar[movingChIx];
                    for( i = numX; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
                }
            }

        } else if (newKey == KEY_UP_ARROW){
            if(row > 1)
                row--;
            else {
                row = plygdHeight;
                if(numX > 1) {
                    numX--;
                    pgdActiveLine[numX] = PLAYGROUND_SPACE_CHAR;
                    pgdActiveLine[numX-1] = movingChar[movingChIx];
                } else {
                    numX = plygdWidth;
                    for(i=0; i < plygdWidth-1; i++){
                        pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
                    }

                    pgdActiveLine[i] = movingChar[movingChIx];
                }
            }
        } else if ((newKey >= KEY_0) && (newKey <= KEY_9)) {
            movingChIx = newKey - KEY_0;
            pgdActiveLine[numX-1] = movingChar[movingChIx];
        }

        if (newKey == KEY_ESC ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 20:
    case 21:

        if( bGameInitialized == false ) {
            bGameInitialized = true;
            pgdActiveLine[0] = '@';
            for( i = 1; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
            for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';

            row = 1;
            //column = numX;

            if(bFence == true) {
                if(ix == 20) DrawChInPlaygroundWithFence(pgdActiveLine.join(''), ix, row, numX, '#', plygdWidth, plygdHeight); 
                else DrawChInPlaygroundWithFence2(pgdActiveLine.join(''), ix, row, numX, '#', plygdWidth, plygdHeight); 
            } else {
                DrawCharacterInPlayground(pgdActiveLine.join(''), ix);
            }
        }

        if( (newKey != null) && (newKey != KEY_ENTER)) {
            // ACTION: it places the character '@' based on the location index numX.
            clearMsgBoard();
            if(bFence == true) {
                if(ix == 20) DrawChInPlaygroundWithFence(pgdActiveLine.join(''), ix, row, numX, '#', plygdWidth, plygdHeight); 
                else DrawChInPlaygroundWithFence2(pgdActiveLine.join(''), ix, row, numX, '#', plygdWidth, plygdHeight); 
            } else {
                DrawCharacterInPlayground(pgdActiveLine.join(''), ix);
            }
        }

        // INPUT: user key input.
        newKey = scanUserKey(); inCnt++;
    

        // CONTROL: controls the location of the character '@'.
        if(newKey == KEY_RIGHT_ARROW){
            
            pgdActiveLine[numX - 1] = PLAYGROUND_SPACE_CHAR;
            if(numX < plygdWidth) {
                
                pgdActiveLine[numX] = movingChar[movingChIx];
                numX++;
            } else {
                numX = 1;
                if(row < plygdHeight)
                    row++;
                else
                    row = 1;

                pgdActiveLine[0] = movingChar[movingChIx];
                for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';
            }
        } else if (newKey == KEY_LEFT_ARROW) {
            pgdActiveLine[numX - 1] = PLAYGROUND_SPACE_CHAR;
            if(numX > 1) {
                numX--;
                pgdActiveLine[numX - 1] = movingChar[movingChIx];
            } else {
                numX = plygdWidth; //plygdWidth == 30
                if(row > 1)
                    row--;
                else
                    row = plygdHeight;

                pgdActiveLine[numX - 1] = movingChar[movingChIx];
            }
        } else if (newKey == KEY_DOWN_ARROW){
            if(row < plygdHeight)
                row++;
            else {
                row = 1;

                if(numX>0) pgdActiveLine[numX-1] = PLAYGROUND_SPACE_CHAR;
                if(numX < plygdWidth){
                    pgdActiveLine[numX] = movingChar[movingChIx];
                    numX++;
                } else {
                    numX = 1;
                    pgdActiveLine[0] = movingChar[movingChIx];
                    for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';
                }
            }

        } else if (newKey == KEY_UP_ARROW){
            if(row > 1)
                row--;
            else {
                row = plygdHeight;
                pgdActiveLine[numX-1] = PLAYGROUND_SPACE_CHAR;
                if(numX > 1) {
                    numX--;
                    pgdActiveLine[numX-1] = movingChar[movingChIx];
                } else {
                    numX = plygdWidth;

                    pgdActiveLine[numX-1] = movingChar[movingChIx];
                    for(i=plygdWidth; i < pgdActiveLine.length; i++) pgdActiveLine[i] = '';
                }
            }
        } else if ((newKey >= KEY_0) && (newKey <= KEY_9)) {
            movingChIx = newKey - KEY_0;
            pgdActiveLine[numX-1] = movingChar[movingChIx];
        } else if (newKey == KEY_O_OR_o) { // 'o'
            if(bFence == true) bFence = false;
            else {
                bFence = true;
            }
        }

        if (newKey == KEY_ESC ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;


    case 22:

        if( bGameInitialized == false ) {
            bGameInitialized = true;
            bFence = true;
            row = 1;

            if(bFence == true) {
                InitPgdActiveLine(plygdWidth, PLAYGROUND_SPACE_CHAR);

                pgdActiveLine[0] = movingChar[movingChIx]; 

                DrawChInPlaygroundWithFence2(pgdActiveLine.join(''), ix, row, numX, fenceCh, plygdWidth, plygdHeight); 
            } else {
                pgdActiveLine[0] = movingChar[movingChIx]; 
                for( i = 1; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
                for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';

                DrawCharacterInPlayground(pgdActiveLine.join(''), ix);
            }

            
        }

        if( (newKey != null) && (newKey != KEY_ENTER)) {
            // ACTION: it places the character '@' based on the location index numX.
            clearMsgBoard();
            if(bFence == true) {
                DrawChInPlaygroundWithFence2(pgdActiveLine.join(''), ix, row, numX, fenceCh, plygdWidth, plygdHeight); 
            } else {
                DrawCharacterInPlayground(pgdActiveLine.join(''), ix);
            }
        }

        // INPUT: user key input.
        newKey = scanUserKey(); inCnt++;
    

        // CONTROL: controls the location of the character '@'.
        if(newKey == KEY_RIGHT_ARROW){
            
            pgdActiveLine[numX - 1] = PLAYGROUND_SPACE_CHAR;
            if(numX < plygdWidth) {
                
                pgdActiveLine[numX] = movingChar[movingChIx];
                numX++;
            } else {
                numX = 1;
                if(row < plygdHeight)
                    row++;
                else
                    row = 1;

                pgdActiveLine[0] = movingChar[movingChIx];
                for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';
            }
        } else if (newKey == KEY_LEFT_ARROW) {
            pgdActiveLine[numX - 1] = PLAYGROUND_SPACE_CHAR;
            if(numX > 1) {
                numX--;
                pgdActiveLine[numX - 1] = movingChar[movingChIx];
            } else {
                numX = plygdWidth; //plygdWidth == 30
                if(row > 1)
                    row--;
                else
                    row = plygdHeight;

                pgdActiveLine[numX - 1] = movingChar[movingChIx];
            }
        } else if (newKey == KEY_DOWN_ARROW){
            if(row < plygdHeight)
                row++;
            else {
                row = 1;

                if(numX>0) pgdActiveLine[numX-1] = PLAYGROUND_SPACE_CHAR;
                if(numX < plygdWidth){
                    pgdActiveLine[numX] = movingChar[movingChIx];
                    numX++;
                } else {
                    numX = 1;
                    pgdActiveLine[0] = movingChar[movingChIx];
                    for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';
                }
            }

        } else if (newKey == KEY_UP_ARROW){
            if(row > 1)
                row--;
            else {
                row = plygdHeight;
                pgdActiveLine[numX-1] = PLAYGROUND_SPACE_CHAR;
                if(numX > 1) {
                    numX--;
                    pgdActiveLine[numX-1] = movingChar[movingChIx];
                } else {
                    numX = plygdWidth;

                    pgdActiveLine[numX-1] = movingChar[movingChIx];
                    for(i=plygdWidth; i < pgdActiveLine.length; i++) pgdActiveLine[i] = '';
                }
            }
        } else if ((newKey >= KEY_0) && (newKey <= KEY_9)) {
            movingChIx = newKey - KEY_0;
            pgdActiveLine[numX-1] = movingChar[movingChIx];
        } else if (newKey == KEY_O_OR_o) { // 'o'
            if(bFence == true) {
                bFence = false;
            } else {
                bFence = true;
            }
        } else if ( (newKey >= 0x41) && (newKey <= 0x5A)) {
            if( (keyEvt.ctrl != true) && (keyEvt.alt != true) ) fenceCh = keyEvt.key;
        }    

        if (newKey == KEY_ESC ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 23:

        if( bGameInitialized == false ) {
            bGameInitialized = true;
            bFence = true;
            row = 1;

            if(bFence == true) {
                InitPgdActiveLine(plygdWidth, PLAYGROUND_SPACE_CHAR);

                pgdActiveLine[0] = movingChar[movingChIx]; 

                DrawChInPlaygroundWithFence2(pgdActiveLine.join(''), ix, row, numX, fenceCh, plygdWidth, plygdHeight); 
            } else {
                pgdActiveLine[0] = movingChar[movingChIx]; 
                for( i = 1; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
                for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';


                DrawCharacterInPlayground(pgdActiveLine.join(''), ix);
            }

            
        }

        if( (newKey != null) && (newKey != KEY_ENTER)) {
            // ACTION: it places the character '@' based on the location index numX.
            clearMsgBoard();
            if(bFence == true) {
                DrawChInPlaygroundWithFence2(pgdActiveLine.join(''), ix, row, numX, fenceCh, plygdWidth, plygdHeight); 
            } else {
                DrawCharacterInPlayground(pgdActiveLine.join(''), ix);
            }
        }

        // INPUT: user key input.
        newKey = scanUserKey(); inCnt++;
    

        // CONTROL: controls the location of the character '@'.
        switch(newKey) {
        case KEY_RIGHT_ARROW:
            pgdActiveLine[numX - 1] = PLAYGROUND_SPACE_CHAR;
            if(numX < plygdWidth) {
                
                pgdActiveLine[numX] = movingChar[movingChIx];
                numX++;
            } else {
                numX = 1;
                if(row < plygdHeight)
                    row++;
                else
                    row = 1;

                pgdActiveLine[0] = movingChar[movingChIx];
                for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';
            }            
            break;

        case KEY_LEFT_ARROW:
            pgdActiveLine[numX - 1] = PLAYGROUND_SPACE_CHAR;
            if(numX > 1) {
                numX--;
                pgdActiveLine[numX - 1] = movingChar[movingChIx];
            } else {
                numX = plygdWidth; //plygdWidth == 30
                if(row > 1)
                    row--;
                else
                    row = plygdHeight;

                pgdActiveLine[numX - 1] = movingChar[movingChIx];
            }
            break;

        case KEY_DOWN_ARROW:
            if(row < plygdHeight)
                row++;
            else {
                row = 1;

                if(numX>0) pgdActiveLine[numX-1] = PLAYGROUND_SPACE_CHAR;
                if(numX < plygdWidth){
                    pgdActiveLine[numX] = movingChar[movingChIx];
                    numX++;
                } else {
                    numX = 1;
                    pgdActiveLine[0] = movingChar[movingChIx];
                    for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';
                }
            }
            break;

        case KEY_UP_ARROW:
            if(row > 1)
                row--;
            else {
                row = plygdHeight;
                pgdActiveLine[numX-1] = PLAYGROUND_SPACE_CHAR;
                if(numX > 1) {
                    numX--;
                    pgdActiveLine[numX-1] = movingChar[movingChIx];
                } else {
                    numX = plygdWidth;

                    pgdActiveLine[numX-1] = movingChar[movingChIx];
                    for(i=plygdWidth; i < pgdActiveLine.length; i++) pgdActiveLine[i] = '';
                }
            }
            break;

        case KEY_O_OR_o: // 'o'
            if(bFence == true) {
                bFence = false;
            } else {
                bFence = true;
            }
            break;

        case KEY_ESC:
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
            break;

        default:
            if ((newKey >= KEY_0) && (newKey <= KEY_9)) {
                movingChIx = newKey - KEY_0;
                pgdActiveLine[numX-1] = movingChar[movingChIx];
            
            } else if ( (newKey >= 0x41) && (newKey <= 0x5A)) {
                if( (keyEvt.ctrl != true) && (keyEvt.alt != true) ) fenceCh = keyEvt.key;
            }
            break;
        }
        break;

    case 24:
    case 25:

        if( bGameInitialized == false ) {
            bGameInitialized = true;
            bFence = true;
            row = 1;

            if(bFence == true) {
                InitPgdActiveLine(plygdWidth, PLAYGROUND_SPACE_CHAR);
                pgdActiveLine[0] = movingChar[movingChIx]; 
                
                DrawChInShiftedPlaygdWithFence(pgdActiveLine.join(''), ix, row, numX, fenceCh, plygdWidth, plygdHeight, spaceXY); 
            } else {
                pgdActiveLine[0] = movingChar[movingChIx]; 
                for( i = 1; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
                for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';

                DrawCharacterInShiftedPlaygd(pgdActiveLine.join(''), ix, row, numX, spaceXY);
            }

            
        }

        if( (newKey != null) && (newKey != KEY_ENTER)) {
            // ACTION: it places the character '@' based on the location index numX.
            clearMsgBoard();
            if(bFence == true) {
                DrawChInShiftedPlaygdWithFence(pgdActiveLine.join(''), ix, row, numX, fenceCh, plygdWidth, plygdHeight, spaceXY); 
            } else {
                DrawCharacterInShiftedPlaygd(pgdActiveLine.join(''), ix, row, numX, spaceXY);
            }
        }

        // INPUT: user key input.
        newKey = scanUserKey(); inCnt++;
    

        // CONTROL: controls the location of the character '@'.
        switch(newKey) {
        case KEY_RIGHT_ARROW:
            if( keyEvt.ctrl == true) { // Playground location change
                if(spaceXY[0] < PLAYGROUND_X_OFFSET_MAX) spaceXY[0]++;
            } else if (keyEvt.shift == true) {
                if(spaceXY[0] < (PLAYGROUND_X_OFFSET_MAX - PLAYGROUND_X_OFFSET_INCREAMENT)) spaceXY[0] += PLAYGROUND_X_OFFSET_INCREAMENT;
                else spaceXY[0] = PLAYGROUND_X_OFFSET_MAX - 1;
            } else {
                pgdActiveLine[numX - 1] = PLAYGROUND_SPACE_CHAR;
                if(numX < plygdWidth) {
                    
                    pgdActiveLine[numX] = movingChar[movingChIx];
                    numX++;
                } else {
                    numX = 1;
                    if(row < plygdHeight)
                        row++;
                    else
                        row = 1;

                    pgdActiveLine[0] = movingChar[movingChIx];
                    for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';
                }    
            }
            break;

        case KEY_LEFT_ARROW:
            if( keyEvt.ctrl == true) {
                if(spaceXY[0] > 0) spaceXY[0]--;
            } else if (keyEvt.shift == true) {
                if(spaceXY[0] > PLAYGROUND_X_OFFSET_INCREAMENT) spaceXY[0] -= PLAYGROUND_X_OFFSET_INCREAMENT;
                else spaceXY[0] = 0;
            } else {

                pgdActiveLine[numX - 1] = PLAYGROUND_SPACE_CHAR;
                if(numX > 1) {
                    numX--;
                    pgdActiveLine[numX - 1] = movingChar[movingChIx];
                } else {
                    numX = plygdWidth; //plygdWidth == 30
                    if(row > 1)
                        row--;
                    else
                        row = plygdHeight;

                    pgdActiveLine[numX - 1] = movingChar[movingChIx];
                }
            }
            break;

        case KEY_DOWN_ARROW:
            if( keyEvt.ctrl == true) {
                if(spaceXY[1] < PLAYGROUND_Y_OFFSET_MAX) spaceXY[1]++;
            } else if (keyEvt.shift == true) {
                if(spaceXY[1] < (PLAYGROUND_Y_OFFSET_MAX - PLAYGROUND_Y_OFFSET_INCREAMENT)) spaceXY[1] += PLAYGROUND_Y_OFFSET_INCREAMENT;
                else spaceXY[1] = PLAYGROUND_Y_OFFSET_MAX - 1;
            } else {
                if(row < plygdHeight)
                    row++;
                else {
                    row = 1;

                    if(numX>0) pgdActiveLine[numX-1] = PLAYGROUND_SPACE_CHAR;
                    if(numX < plygdWidth){
                        pgdActiveLine[numX] = movingChar[movingChIx];
                        numX++;
                    } else {
                        numX = 1;
                        pgdActiveLine[0] = movingChar[movingChIx];
                        for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';
                    }
                }
            }
            break;

        case KEY_UP_ARROW:
            if( keyEvt.ctrl == true) {
                if(spaceXY[1] > 0) spaceXY[1]--;
            } else if (keyEvt.shift == true) {
                if(spaceXY[1] > PLAYGROUND_Y_OFFSET_INCREAMENT) spaceXY[1] -= PLAYGROUND_Y_OFFSET_INCREAMENT;
                else spaceXY[1] = 0;
            } else {
                if(row > 1)
                    row--;
                else {
                    row = plygdHeight;
                    pgdActiveLine[numX-1] = PLAYGROUND_SPACE_CHAR;
                    if(numX > 1) {
                        numX--;
                        pgdActiveLine[numX-1] = movingChar[movingChIx];
                    } else {
                        numX = plygdWidth;

                        pgdActiveLine[numX-1] = movingChar[movingChIx];
                        for(i=plygdWidth; i < pgdActiveLine.length; i++) pgdActiveLine[i] = '';
                    }
                }
            }
            break;

        case KEY_O_OR_o: // 'o'
            if(bFence == true) {
                bFence = false;
            } else {
                bFence = true;
            }
            break;
            
        case KEY_ESC:
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
            break;

        default:
            if ((newKey >= KEY_0) && (newKey <= KEY_9)) {
                movingChIx = newKey - KEY_0;
                pgdActiveLine[numX-1] = movingChar[movingChIx];
            
            } else if ( (newKey >= 0x41) && (newKey <= 0x5A)) {
                if( (keyEvt.ctrl != true) && (keyEvt.alt != true) ) fenceCh = keyEvt.key;
            }
            break;
        }
        break;



    case 26:

        if( bGameInitialized == false ) {
            bGameInitialized = true;
            bFence = true;
            row = 1;

            if(bFence == true) {
                InitPgdActiveLine(plygdWidth, PLAYGROUND_SPACE_CHAR);

                pgdActiveLine[0] = movingChar[movingChIx];
                
                DrawChInShiftedPlaygdWithFence(pgdActiveLine.join(''), ix, row, numX, fenceCh, plygdWidth, plygdHeight, spaceXY);
            } else {
                pgdActiveLine[0] = movingChar[movingChIx];
                for( i = 1; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
                for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';

                DrawCharacterInShiftedPlaygd(pgdActiveLine.join(''), ix, row, numX, spaceXY);
            }

            
        }

        if( (newKey != null) && (newKey != KEY_ENTER)) {
            // ACTION: it places the character '@' based on the location index numX.
            clearMsgBoard();
            if(bFence == true) {
                DrawChInShiftedPlaygdWithFence(pgdActiveLine.join(''), ix, row, numX, fenceCh, plygdWidth, plygdHeight, spaceXY);
            } else {
                DrawCharacterInShiftedPlaygd(pgdActiveLine.join(''), ix, row, numX, spaceXY);
            }
        }

        // INPUT: user key input.
        newKey = scanUserKey(); inCnt++;
    

        // CONTROL: controls the location of the character '@'.
        switch(newKey) {
        case KEY_RIGHT_ARROW:
            if( keyEvt.ctrl == true) { // Playground location change
                if (keyEvt.alt == true) {
                    if(plygdWidth < PLAYGROUND_WIDTH_MAX) plygdWidth++;
                    if(plygdHeight < PLAYGROUND_HEIGHT_MAX) plygdHeight++;
                    for(i = numX; i<plygdWidth; i++) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR
                } else if(spaceXY[0] < PLAYGROUND_X_OFFSET_MAX) {
                    spaceXY[0]++;
                }
            } else if (keyEvt.shift == true) {
                if(spaceXY[0] < (PLAYGROUND_X_OFFSET_MAX - PLAYGROUND_X_OFFSET_INCREAMENT)) spaceXY[0] += PLAYGROUND_X_OFFSET_INCREAMENT;
                else spaceXY[0] = PLAYGROUND_X_OFFSET_MAX - 1;
            } else if (keyEvt.alt == true) {
                if(plygdWidth < PLAYGROUND_WIDTH_MAX) plygdWidth++;
                for(i = numX; i<plygdWidth; i++) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR
            } else {
                pgdActiveLine[numX - 1] = PLAYGROUND_SPACE_CHAR;
                if(numX < plygdWidth) {
                    
                    pgdActiveLine[numX] = movingChar[movingChIx];
                    numX++;
                } else {
                    numX = 1;
                    if(row < plygdHeight)
                        row++;
                    else
                        row = 1;

                    pgdActiveLine[0] = movingChar[movingChIx];
                    for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';
                }
            }
            break;

        case KEY_LEFT_ARROW:
            if( keyEvt.ctrl == true) {
                if (keyEvt.alt == true) {
                    if(plygdWidth > 1) plygdWidth--;
                    if(plygdHeight > 1) plygdHeight--;

                    if(numX > plygdWidth) {
                        numX = plygdWidth;
                        pgdActiveLine[numX-1] = movingChar[movingChIx];
                    }
                    if(row > plygdHeight) row = plygdHeight;
                    for(i = numX; i<plygdWidth; i++) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
                    for(i = plygdWidth; i<pgdActiveLine.length; i++) pgdActiveLine[i] = '';

                } else if(spaceXY[0] > 0) {
                    spaceXY[0]--;
                } 
            } else if (keyEvt.shift == true) {
                if(spaceXY[0] > PLAYGROUND_X_OFFSET_INCREAMENT) spaceXY[0] -= PLAYGROUND_X_OFFSET_INCREAMENT;
                else spaceXY[0] = 0;
            } else if (keyEvt.alt == true) {
                if(plygdWidth > 1) plygdWidth--;
                if(numX > plygdWidth) {
                    numX = plygdWidth;
                    pgdActiveLine[numX-1] = movingChar[movingChIx];                    
                }
               for(i = numX; i<plygdWidth; i++) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR
               for(i = plygdWidth; i<pgdActiveLine.length; i++) pgdActiveLine[i] = '';
            } else {

                pgdActiveLine[numX - 1] = PLAYGROUND_SPACE_CHAR;
                if(numX > 1) {
                    numX--;
                    pgdActiveLine[numX - 1] = movingChar[movingChIx];
                } else {
                    numX = plygdWidth; //plygdWidth == 30
                    if(row > 1)
                        row--;
                    else
                        row = plygdHeight;

                    pgdActiveLine[numX - 1] = movingChar[movingChIx];
                }
            }
            break;

        case KEY_DOWN_ARROW:
            if( keyEvt.ctrl == true) {
                if (keyEvt.alt == true) {
                    if(plygdWidth < (PLAYGROUND_WIDTH_MAX - PLAYGROUND_WIDTH_INCREAMENT)) plygdWidth += PLAYGROUND_WIDTH_INCREAMENT;
                    else plygdWidth = PLAYGROUND_WIDTH_MAX;

                    if(plygdHeight < (PLAYGROUND_HEIGHT_MAX - PLAYGROUND_HEIGHT_INCREAMENT)) plygdHeight += PLAYGROUND_HEIGHT_INCREAMENT;
                    else plygdHeight = PLAYGROUND_HEIGHT_MAX;
                    for(i = numX; i<plygdWidth; i++) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR

                } else if(spaceXY[1] < PLAYGROUND_Y_OFFSET_MAX) {
                    spaceXY[1]++;
                }
            } else if (keyEvt.shift == true) {
                if(spaceXY[1] < (PLAYGROUND_Y_OFFSET_MAX - PLAYGROUND_Y_OFFSET_INCREAMENT)) spaceXY[1] += PLAYGROUND_Y_OFFSET_INCREAMENT;
                else spaceXY[1] = PLAYGROUND_Y_OFFSET_MAX - 1;
            } else if (keyEvt.alt == true) {
                if(plygdHeight < PLAYGROUND_HEIGHT_MAX) plygdHeight++;
            } else {
                if(row < plygdHeight)
                    row++;
                else {
                    row = 1;

                    if(numX>0) pgdActiveLine[numX-1] = PLAYGROUND_SPACE_CHAR;
                    if(numX < plygdWidth){
                        pgdActiveLine[numX] = movingChar[movingChIx];
                        numX++;
                    } else {
                        numX = 1;
                        pgdActiveLine[0] = movingChar[movingChIx];
                        for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';
                    }
                }
            }
            break;

        case KEY_UP_ARROW:
            if( keyEvt.ctrl == true) {
                if (keyEvt.alt == true) {
                    if(plygdWidth > PLAYGROUND_WIDTH_INCREAMENT) plygdWidth -= PLAYGROUND_WIDTH_INCREAMENT;
                    else plygdWidth = 1;

                    if(plygdHeight > PLAYGROUND_HEIGHT_INCREAMENT) plygdHeight -= PLAYGROUND_HEIGHT_INCREAMENT;
                    else plygdHeight = 1;

                    if(numX > plygdWidth) {
                        numX = plygdWidth;
                        pgdActiveLine[numX-1] = movingChar[movingChIx];
                    }
                    if(row > plygdHeight) row = plygdHeight;
                    for(i = numX; i<plygdWidth; i++) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
                    for(i = plygdWidth; i<pgdActiveLine.length; i++) pgdActiveLine[i] = '';
                } else if(spaceXY[1] > 0) {
                    spaceXY[1]--;
                }
            } else if (keyEvt.shift == true) {
                if(spaceXY[1] > PLAYGROUND_Y_OFFSET_INCREAMENT) spaceXY[1] -= PLAYGROUND_Y_OFFSET_INCREAMENT;
                else spaceXY[1] = 0;

            } else if (keyEvt.alt == true) {
                if(plygdHeight > 1) plygdHeight--;
                if(row > plygdHeight) row = plygdHeight;

            } else {
                if(row > 1)
                    row--;
                else {
                    row = plygdHeight;
                    pgdActiveLine[numX-1] = PLAYGROUND_SPACE_CHAR;
                    if(numX > 1) {
                        numX--;
                        pgdActiveLine[numX-1] = movingChar[movingChIx];
                    } else {
                        numX = plygdWidth;

                        pgdActiveLine[numX-1] = movingChar[movingChIx];
                        for(i=plygdWidth; i < pgdActiveLine.length; i++) pgdActiveLine[i] = '';
                    }
                }
            }
            break;

        case KEY_O_OR_o: // 'o'
            if(bFence == true) {
                bFence = false;
            } else {
                bFence = true;
            }
            break;
            
        case KEY_ESC:
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
            break;

        default:
            if ((newKey >= KEY_0) && (newKey <= KEY_9)) {
                movingChIx = newKey - KEY_0;
                pgdActiveLine[numX-1] = movingChar[movingChIx];
            
            } else if ( (newKey >= 0x41) && (newKey <= 0x5A)) {
                if( (keyEvt.ctrl != true) && (keyEvt.alt != true) ) fenceCh = keyEvt.key;
            }
            break;
        }
        break;


    case 27:
    case 28:
    case 29:
        
        if( bGameInitialized == false ) {
            bGameInitialized = true;
            bFence = true;
            row = 1;

            if(bFence == true) {
                InitPgdActiveLine(plygdWidth, PLAYGROUND_SPACE_CHAR);

                pgdActiveLine[0] = movingChar[movingChIx];
                
                DrawChInShiftedPlaygdWithFence(pgdActiveLine.join(''), ix, row, numX, fenceCh, plygdWidth, plygdHeight, spaceXY);
            } else {
                pgdActiveLine[0] = movingChar[movingChIx];
                for( i = 1; i < plygdWidth; i++ ) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
                for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';

                DrawCharacterInShiftedPlaygd(pgdActiveLine.join(''), ix, row, numX, spaceXY);
            }
        }

        if( (newKey != null) && (newKey != KEY_ENTER)) {
            // ACTION: it places the character '@' based on the location index numX.
            clearMsgBoard();
            if(bFence == true) {
                DrawChInShiftedPlaygdWithFence(pgdActiveLine.join(''), ix, row, numX, fenceCh, plygdWidth, plygdHeight, spaceXY);
            } else {
                column = numX;
                DrawCharacterInShiftedPlaygd(pgdActiveLine.join(''), ix, row, numX, spaceXY);
            }
        }

        // INPUT: user key input.
        newKey = scanUserKey(); inCnt++;
    

        // CONTROL: controls the location of the character '@'.
        switch(newKey) {
        case KEY_RIGHT_ARROW:
            if( keyEvt.ctrl == true) { // Playground location change
                if (keyEvt.alt == true) {
                    if(plygdWidth < PLAYGROUND_WIDTH_MAX) plygdWidth++;
                    if(plygdHeight < PLAYGROUND_HEIGHT_MAX) plygdHeight++;
                    for(i = numX; i<plygdWidth; i++) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR
                } else if(spaceXY[0] < PLAYGROUND_X_OFFSET_MAX) {
                    spaceXY[0]++;
                }
            } else if (keyEvt.shift == true) {
                if(spaceXY[0] < (PLAYGROUND_X_OFFSET_MAX - PLAYGROUND_X_OFFSET_INCREAMENT)) spaceXY[0] += PLAYGROUND_X_OFFSET_INCREAMENT;
                else spaceXY[0] = PLAYGROUND_X_OFFSET_MAX - 1;
            } else if (keyEvt.alt == true) {
                if(plygdWidth < PLAYGROUND_WIDTH_MAX) plygdWidth++;
                for(i = numX; i<plygdWidth; i++) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR
            } else {
                pgdActiveLine[numX - 1] = PLAYGROUND_SPACE_CHAR;
                if(numX < plygdWidth) {
                    
                    pgdActiveLine[numX] = movingChar[movingChIx];
                    numX++;
                } else {
                    numX = 1;
                    if(row < plygdHeight)
                        row++;
                    else
                        row = 1;

                    pgdActiveLine[0] = movingChar[movingChIx];
                    for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';
                }
            }
            break;

        case KEY_LEFT_ARROW:
            if( keyEvt.ctrl == true) {
                if (keyEvt.alt == true) {
                    if(plygdWidth > 1) plygdWidth--;
                    if(plygdHeight > 1) plygdHeight--;

                    if(numX > plygdWidth) {
                        numX = plygdWidth;
                        pgdActiveLine[numX-1] = movingChar[movingChIx];
                    }
                    if(row > plygdHeight) row = plygdHeight;
                    for(i = numX; i<plygdWidth; i++) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
                    for(i = plygdWidth; i<pgdActiveLine.length; i++) pgdActiveLine[i] = '';

                } else if(spaceXY[0] > 0) {
                    spaceXY[0]--;
                } 
            } else if (keyEvt.shift == true) {
                if(spaceXY[0] > PLAYGROUND_X_OFFSET_INCREAMENT) spaceXY[0] -= PLAYGROUND_X_OFFSET_INCREAMENT;
                else spaceXY[0] = 0;
            } else if (keyEvt.alt == true) {
                if(plygdWidth > 1) plygdWidth--;
                if(numX > plygdWidth) {
                    numX = plygdWidth;
                    pgdActiveLine[numX-1] = movingChar[movingChIx];
                }
               for(i = numX; i<plygdWidth; i++) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
               for(i = plygdWidth; i<pgdActiveLine.length; i++) pgdActiveLine[i] = '';
            } else {

                pgdActiveLine[numX - 1] = PLAYGROUND_SPACE_CHAR;
                if(numX > 1) {
                    numX--;
                    pgdActiveLine[numX - 1] = movingChar[movingChIx];
                } else {
                    numX = plygdWidth; //plygdWidth == 30
                    if(row > 1)
                        row--;
                    else
                        row = plygdHeight;

                    pgdActiveLine[numX - 1] = movingChar[movingChIx];
                }
            }
            break;

        case KEY_DOWN_ARROW:
            if( keyEvt.ctrl == true) {
                if (keyEvt.alt == true) {
                    if(plygdWidth < (PLAYGROUND_WIDTH_MAX - PLAYGROUND_WIDTH_INCREAMENT)) plygdWidth += PLAYGROUND_WIDTH_INCREAMENT;
                    else plygdWidth = PLAYGROUND_WIDTH_MAX;

                    if(plygdHeight < (PLAYGROUND_HEIGHT_MAX - PLAYGROUND_HEIGHT_INCREAMENT)) plygdHeight += PLAYGROUND_HEIGHT_INCREAMENT;
                    else plygdHeight = PLAYGROUND_HEIGHT_MAX;
                    for(i = numX; i<plygdWidth; i++) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR

                } else if(spaceXY[1] < PLAYGROUND_Y_OFFSET_MAX) {
                    spaceXY[1]++;
                }
            } else if (keyEvt.shift == true) {
                if(spaceXY[1] < (PLAYGROUND_Y_OFFSET_MAX - PLAYGROUND_Y_OFFSET_INCREAMENT)) spaceXY[1] += PLAYGROUND_Y_OFFSET_INCREAMENT;
                else spaceXY[1] = PLAYGROUND_Y_OFFSET_MAX - 1;
            } else if (keyEvt.alt == true) {
                if(plygdHeight < PLAYGROUND_HEIGHT_MAX) plygdHeight++;
            } else {
                if(row < plygdHeight)
                    row++;
                else {
                    row = 1;

                    if(numX>0) pgdActiveLine[numX-1] = PLAYGROUND_SPACE_CHAR;
                    if(numX < plygdWidth){
                        pgdActiveLine[numX] = movingChar[movingChIx];
                        numX++;
                    } else {
                        numX = 1;
                        pgdActiveLine[0] = movingChar[movingChIx];
                        for( i = plygdWidth; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = '';
                    }
                }
            }
            break;

        case KEY_UP_ARROW:
            if( keyEvt.ctrl == true) {
                if (keyEvt.alt == true) {
                    if(plygdWidth > PLAYGROUND_WIDTH_INCREAMENT) plygdWidth -= PLAYGROUND_WIDTH_INCREAMENT;
                    else plygdWidth = 1;

                    if(plygdHeight > PLAYGROUND_HEIGHT_INCREAMENT) plygdHeight -= PLAYGROUND_HEIGHT_INCREAMENT;
                    else plygdHeight = 1;

                    if(numX > plygdWidth) {
                        numX = plygdWidth;
                        pgdActiveLine[numX-1] = movingChar[movingChIx];
                    }
                    if(row > plygdHeight) row = plygdHeight;
                    for(i = numX; i<plygdWidth; i++) pgdActiveLine[i] = PLAYGROUND_SPACE_CHAR;
                    for(i = plygdWidth; i<pgdActiveLine.length; i++) pgdActiveLine[i] = '';
                    
                } else if(spaceXY[1] > 0) {
                    spaceXY[1]--;
                }
            } else if (keyEvt.shift == true) {
                if(spaceXY[1] > PLAYGROUND_Y_OFFSET_INCREAMENT) spaceXY[1] -= PLAYGROUND_Y_OFFSET_INCREAMENT;
                else spaceXY[1] = 0;

            } else if (keyEvt.alt == true) {
                if(plygdHeight > 1) plygdHeight--;
                if(row > plygdHeight) row = plygdHeight;

            } else {
                if(row > 1)
                    row--;
                else {
                    row = plygdHeight;
                    pgdActiveLine[numX-1] = PLAYGROUND_SPACE_CHAR;
                    if(numX > 1) {
                        numX--;
                        pgdActiveLine[numX-1] = movingChar[movingChIx];
                    } else {
                        numX = plygdWidth;

                        pgdActiveLine[numX-1] = movingChar[movingChIx];
                        for(i=plygdWidth; i < pgdActiveLine.length; i++) pgdActiveLine[i] = '';
                    }
                }
            }
            break;

        case KEY_O_OR_o: // 'o'
            if(bFence == true) {
                bFence = false;

            } else {
                bFence = true;
            }
            break;
            
        case KEY_ESC:
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
            break;

        // Help menu
        case KEY_F1:
            PrintListOfSpecialKeys(ix);
            newKey = null;
            break;

        default:
            if ((newKey >= KEY_0) && (newKey <= KEY_9)) {
                movingChIx = newKey - KEY_0;
                pgdActiveLine[numX-1] = movingChar[movingChIx];
            
            } else if ( (newKey >= 0x41) && (newKey <= 0x5A)) {
                if( (keyEvt.ctrl != true) && (keyEvt.alt != true) ) fenceCh = keyEvt.key;
            }
            break;
        }
        break;
    default:
        alert("The task ID " + solIndex.toString() + " is not available.");
        break;
    }

}

//////////////////////////////////////////////////////////////////////////////
function InitBuffer(buf, size, ch)
{
    for(let i = 0; i < size; i++) {
        buf[i] = ch;
    }
}

//////////////////////////////////////////////////////////////////////////////
function InitPgdActiveLine(size, ch)
{
    for(let i = 0; i < size; i++) {
        pgdActiveLine[i] = ch;
    }
}

//////////////////////////////////////////////////////////////////////////////
function PrintListOfSpecialKeys(ix)
{
    let i = 1; //int i = 1;
    let msg;
    clearMsgBoard();

    msg = "  ** A list of special Function Keys:<br/>&emsp;";
    msg += "=====================================================================================<br/>&emsp;";
    msg += (i++).toString() + ") F1: Help. It lists a list of special function keys.<br/>&emsp;";
    if( ix == 30 ) {
        msg += (i++).toString() + ") F4: It toggles all of background character, fence character,<br/>&emsp;    and the character to move within the playground.<br/>&emsp;";
    }
    msg += (i++).toString() + ") CTRL + LEFT ARROW:  Move the playground left by one line.<br/>&emsp;";
    msg += (i++).toString() + ") CTRL + UP ARROW:    Move the playground up by one line.<br/>&emsp;";
    msg += (i++).toString() + ") CTRL + DOWN ARROW:  Move the playground down by one line.<br/>&emsp;";
    msg += (i++).toString() + ") CTRL + RIGHT ARROW: Move the playground right by one line.\n<br/>&emsp;";

    msg += (i++).toString() + ") Shift + UP ARROW:    Move the playground up by 5 lines.<br/>&emsp;";
    msg += (i++).toString() + ") Shift + LEFT ARROW:  Move the playground left by 5 lines.<br/>&emsp;";
    msg += (i++).toString() + ") Shift + DOWN ARROW:  Move the playground down by 5 lines.<br/>&emsp;";
    msg += (i++).toString() + ") Shift + RIGHT ARROW: Move the playground right by 5 lines.\n<br/>&emsp;";

    msg += (i++).toString() + ") ALT + LEFT ARROW:  Shrink the playground width by one line.<br/>&emsp;";
    msg += (i++).toString() + ") ALT + UP ARROW:    Shrink the playground height by one line.<br/>&emsp;";
    msg += (i++).toString() + ") ALT + DOWN ARROW:  Expand the playground height by one line.<br/>&emsp;";
    msg += (i++).toString() + ") ALT + RIGHT ARROW: Expand the playground width by one line.\n<br/>&emsp;";

    msg += (i++).toString() + ") CTRL + ALT + LEFT ARROW:  Shrink both the width and height of the playground by one line.<br/>&emsp;";
    msg += (i++).toString() + ") CTRL + ALT + UP ARROW:    Shrink both the width and height of the playground by 5 lines.<br/>&emsp;";
    msg += (i++).toString() + ") CTRL + ALT + DOWN ARROW:  Expand both the width and height of the playground by 5 lines.<br/>&emsp;";
    msg += (i++).toString() + ") CTRL + ALT + RIGHT ARROW: Expand both the width and height of the playground by one line.<br/>&emsp;";
    msg += (i++).toString() + ") 'o': Toggle the fence of playground between show and hide.<br/>&emsp;";
    msg += "=====================================================================================<br/>&emsp;";
    msg += "Press 'space' bar to go back to the playground.<br/>";

    msgBoard.innerHTML = msg;
}

//////////////////////////////////////////////////////////////////////////////
function DrawCharacterInPlayground(plygdRow, id)
{
    //static bool bInit = false;
    let i, j, r;
    let msg = '';

    if( bPRINT_ON_CONSOLE == true ) {
        console.log(plygdRow);    
    } else {

        clearMsgBoard();
        
        //==> Optional
        if(bInit == false) {
            bInit = true;
        }
        //<==

        j = 0;

        for( i=1; i<row; i++) {
            msg += "<br\>";
            j += 1;
        }
        
        j += 1; // increase it beforehand for the last line which has the character '@'.
        
        r = '';
        if( (msgLineCnt + j) >= MAX_MSG_BOARD_LINES ) {
            msgLineCnt = j;
            msg = plygdRow + "<br\>";
        } else {
            
            msgLineCnt += j;
            msg += plygdRow + "<br\>";
        }

        msgBoard.innerHTML = msg;

        if(plygdRow.length == 0) numChar.textContent = '0';
        else numChar.textContent = numX.toString();

        if(id > 7) {
            rowLocId.textContent = row.toString();
        }
    }

}

//////////////////////////////////////////////////////////////////////////////
function DrawChInPlaygroundWithFence(plygdRow, id, row, column, fence, plygdWidth, plygdHeight)
{
    //static bool bInitF = false;
    let i, j, ln; //int i, j;
    let msg = '';

    if( bPRINT_ON_CONSOLE == true ) {
        console.log(plygdRow);    
    } else {

        clearMsgBoard();

        //==> Optional
            if(bInitF == false) {
                //if( id >= 24) system("color 0a"); // Color change gets started when the task is optional.
                bInitF = true;
            }
        //<==

        r = '';
        for(j=0; j<plygdWidth; j++) r += PLAYGROUND_SPACE_CHAR;
        ln = plygdWidth * 2;    // ln = r.length;

        //Top line of the fence
        for(i = 0; i<(ln+2); i++) msg += fence;
        msg += '<br/>';
        j = 1;

        for(i = 1; i<row; i++) {
            msg += fence + r + fence + '<br/>';
            j += 1;
        }

        if(row <= plygdHeight) {
            
            msg += fence + plygdRow + fence + "<br/>";
            j += 1;

            r = '';
            for(i=0; i<plygdWidth; i++) r += PLAYGROUND_SPACE_CHAR;

            for(i = row+1; i <= plygdHeight; i++) {

                msg += fence + r + fence + '<br/>';
                j += 1;
            }
        }

        r = '';
        for(i = 0; i<(ln+2); i++) r += fence; //The bottom line of the fence.
        j += 1;
        msgLineCnt += j;
        msg += r;

        msgBoard.innerHTML = msg;

        if(column == 0) numChar.textContent = '0';
        else numChar.textContent = column.toString();

        if(id > 7) {
            rowLocId.textContent = row.toString();
        }
    }
}

//////////////////////////////////////////////////////////////////////////////
function DrawChInPlaygroundWithFence2( plygdRow, id, row, column, fence, plygdWidth, plygdHeight)
{
    let i, j, ln;
    let r = '';

    if( bPRINT_ON_CONSOLE == true ) {
        console.log(plygdRow);    
    } else {
        clearMsgBoard();
        let msg = '';
        ln = plygdWidth << 1;

        for(i = 0; i<(ln+2); i++) pgdTopBottomLine[i] = fence;
        pgdTopBottomLine[i] = '<br/>';

        pgdEmptyLine[0] = fence;
        j = plygdWidth + 1;
        for(i = 1; i < j; i++) pgdEmptyLine[i] = PLAYGROUND_SPACE_CHAR;        
        pgdEmptyLine[i] = fence + '<br/>';

        
        msg += pgdTopBottomLine.join('');
        for(i = 1; i < row; i++) msg += pgdEmptyLine.join('');

        if(row <= plygdHeight) {
            
            msg += fence + plygdRow + fence + "<br/>";

            r = '';
            for(i = row+1; i <= plygdHeight; i++) {
                r += pgdEmptyLine.join('');
            }
            msg += r;
        }

        msg += pgdTopBottomLine.join('');
        msgBoard.innerHTML = msg;

        if(column == 0) numChar.textContent = '0';
        else numChar.textContent = column.toString();

        if(id > 7) {
            rowLocId.textContent = row.toString();
        }
    }
}


//////////////////////////////////////////////////////////////////////////////
function DrawCharacterInShiftedPlaygd( plygdRow, id, row, column, spXY)
{
    let i, j, ln; //int i, j;
    let r = '', sp = '';

    if( bPRINT_ON_CONSOLE == true ) {
        console.log(plygdRow);    
    } else {
        clearMsgBoard();

        let msg = '';
        ln = plygdWidth << 1;

        for(i = 0; i < plygdWidth; i++) pgdEmptyLine[i] = PLAYGROUND_SPACE_CHAR;        
        pgdEmptyLine[i] = '<br/>';
        for(i += 1; i < pgdEmptyLine.length; i++) pgdEmptyLine[i] = '';
        
        for( i = 0; i < spXY[1]; i++) {
            msg += '<br/>';
        }

        for( i = 0; i < spXY[0]; i++) {
            sp += PLAYGROUND_SPACE_CHAR;
        }

        for(i = 1; i < row; i++) msg += sp + pgdEmptyLine.join('');

        if(row <= plygdHeight) {
            msg += sp + plygdRow + "<br/>";

            r = '';
            for(i = row+1; i <= plygdHeight; i++) {
                r += sp + pgdEmptyLine.join('');
            }
            msg += r;
        }

        msgBoard.innerHTML = msg;

        if(column == 0) numChar.textContent = '0';
        else numChar.textContent = column.toString();

        if(id > 7) {
            rowLocId.textContent = row.toString();
        }
    }
}


//////////////////////////////////////////////////////////////////////////////
function DrawChInShiftedPlaygdWithFence( plygdRow, id, row, column, fence, plygdWidth, plygdHeight, spXY)
{
    let i, j, ln; //int i, j;
    //let _bInit = bInit; //bool _bInit = false;
    let r = '', sp = '';

    if( bPRINT_ON_CONSOLE == true ) {
        console.log(plygdRow);    
    } else {
        clearMsgBoard();
        let msg = '';
        ln = plygdWidth << 1;

        for(i = 0; i<(ln+2); i++) pgdTopBottomLine[i] = fence;
        pgdTopBottomLine[i] = '<br/>';

        for(i++; i < pgdTopBottomLine.length; i++) pgdTopBottomLine[i] = '';
        ln = pgdTopBottomLine.length;
        if(ln > i) pgdTopBottomLine = pgdTopBottomLine.slice(i, ln);

        pgdEmptyLine[0] = fence;
        j = plygdWidth + 1;
        for(i = 1; i < j; i++) pgdEmptyLine[i] = PLAYGROUND_SPACE_CHAR;        
        pgdEmptyLine[i] = fence + '<br/>';

        for(i++; i < pgdEmptyLine.length; i++) pgdEmptyLine[i] = '';

        ln = pgdEmptyLine.length;
        if(ln > i) pgdEmptyLine = pgdEmptyLine.slice(i, ln);
        
        for( i = 0; i < spXY[1]; i++) {
            msg += '<br/>';
        }

        for( i = 0; i < spXY[0]; i++) {
            sp += PLAYGROUND_SPACE_CHAR;
        }

        msg += sp + pgdTopBottomLine.join('');
        for(i = 1; i < row; i++) msg += sp + pgdEmptyLine.join('');

        if(row <= plygdHeight) {

            msg += sp + fence + plygdRow + fence + "<br/>";

            r = '';
            for(i = row+1; i <= plygdHeight; i++) {
                r += sp + pgdEmptyLine.join('');
            }
            msg += r;
        }

        msg += sp + pgdTopBottomLine.join('');
        msgBoard.innerHTML = msg;

        if(column == 0) numChar.textContent = '0';
        else numChar.textContent = column.toString();

        if(id > 7) {
            rowLocId.textContent = row.toString();
        }
    }
}



