/*  Author: Laon Maker (Laon Creators' Group)
    Version: 1.0
    Last update: Dec. 27, 2021
*/

const bPRINT_ON_CONSOLE = false;  // true: to print characters on the console or when you run this code in VS Code. false: to print characters on the web page (black board) or when you run it with hta file.
const PRJ_PARAM = 5;
const MOVE_CHAR_WIDTH = 30;
const MOVE_CHAR_HEIGHT = 15;
const PLAYGROUND_WIDTH_MAX = 60;
const PLAYGROUND_HEIGHT_MAX    = 30;
const PLAYGROUND_WIDTH_INCREAMENT = 5;
const PLAYGROUND_HEIGHT_INCREAMENT = 5;

const PLAYGROUND_X_OFFSET_MAX = 60;
const PLAYGROUND_Y_OFFSET_MAX = 30;
const PLAYGROUND_X_OFFSET_INCREAMENT = 5;
const PLAYGROUND_Y_OFFSET_INCREAMENT = 5;
const MAX_MSG_BOARD_LINES            = 16;    // used to clear the message board.

let chIndex = 0;
let solIndex = 0; // indicate which solution was requested to run.

let projectIx = 0; // 0 to indicate currrent project is 'movingCh'.
let keyCode = '';
let instruction = '';
let pground;
let pgndTxt = '';
let msgToPrint = '';
let msgBoard;
let msgLineCnt = 0;
let numChar = document.getElementById('numChar');

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
            setTimeout(selectedMovingCh, 1000);
        }
    }
}

//////////////////////////////////////////////////////////////////////////////
function movingChKeyEvent(e) {
    switch( projectIx ) {
    case 0: // moving Character
    
        switch(e.key) {
        case 'ArrowLeft':
            
            break;
        case 'ArrowRight':
            break;
        case 'ArrowUp':
            break;
        case 'ArrowDown':
            break;
        default:
            break;
        }

        if(keyCode == '') keyCode = e.key;
        break;
    case 1: // invading Characters
        break;
    }
}

//////////////////////////////////////////////////////////////////////////////
function printResult(m) {
    if( bPRINT_ON_CONSOLE == true ) {
        //console.log(""); // added to get the same character printed.
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
function GetCh() {
    //let c = prompt(instruction, '');
    let c = prompt(instruction);

    if ( c == undefined ) {        
        return c;
    }

    if (c.length > 0) {        
        return c[0];
    }
    return c;
}


//////////////////////////////////////////////////////////////////////////////
function movingCh(ix) {
    let x = 1, i1, inCnt = 0;
    let c = 1;
    let plygdWidth = MOVE_CHAR_WIDTH, plygdHeight = MOVE_CHAR_HEIGHT; // rectangular size
    let msg = '';    

    if( bPRINT_ON_CONSOLE == false ) {
        pground = document.getElementById('playground');
    
        newP = document.createElement('p');
        newP.id = 'msgbd';
        pground.appendChild(newP);
        msgBoard = document.getElementById('msgbd');
    }

    instruction = "Hit \'0\' to exit.  ID:" + ix.toString() + "\n";

    switch(ix){
    case 0:
        x = 0;
        while ((c != '0') &&(c != null) ) {

            c = GetCh(ix);    // note that it is 'getch()' for DevC++ while _getch() for Visual Studio. 
            if( c != null) {                
                printResult(c.toString());
            }
        }
        break;

    case 1:
        x = 0;
        while ((c != '0') &&(c != null) ) {

            c = GetCh();    // note that it is 'getch()' for DevC++ while _getch() for Visual Studio. 
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

            c = GetCh();    // note that it is 'getch()' for DevC++ while _getch() for Visual Studio.

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
            c = GetCh(ix); inCnt++;

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

            // INPUT: user key input
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

            // note that it is 'getch()' for DevC++ while _getch() for Visual Studio.
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
                    x = plygdWidth; //plygdWidth == 30
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
            
            printResult(msg);
            
            c = GetCh(); // note that it is 'getch()' for DevC++ while _getch() for Visual Studio.

            if((c == '+') || (c == '=')){
                if(x < plygdWidth)
                    x++;
                else
                    x = 1;
            } else if ((c == '-') || (c == '_')) {
                if(x > 1)
                    x--;
                else
                    x = plygdWidth; //plygdWidth == 30
            }
        }
        break;
    default:
        printResult("The task ID %d is not available.\n");
        break;
    }
    return 0;
}


function nextMovingCh() {
    solIndex = solIndex + 1;
    if( solIndex > 12 ) solIndex = 0;
    movingCh(solIndex);
}

function selectedMovingCh() {
    id = document.getElementById('solId');
    solIndex = parseInt(id.value);

    if( solIndex > 11 ) solIndex = 0;
    movingCh(solIndex);
}

function movingChReq() {
    id = document.getElementById('movingChReq');
    solIndex = parseInt(id.innerText);
    if( solIndex > 11 ) solIndex = 0;
    movingCh(solIndex);
}