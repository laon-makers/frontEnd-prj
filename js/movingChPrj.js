/*  Author: Laon Maker (Laon Creators' Group)
    Version: 1.1
    Last update: Dec. 29, 2021
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
let numX = 1, rptX, inCnt = 0;
let newKey = 1;

let movChInterval;
let keyEvt = {key:'', chCode:'', code: -1, down:false, up:false };

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

            if( mcConfig["noneBlockingKey"] == false) {
                configSolutionStart();
                setTimeout(selectedMovingCh, 1000);
            } else {
                document.getElementById('nonBlockKey').checked = true;
                selectedMovingCh();                
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
        else numChar.textContent = ma.length.toString();
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
        else numChar.textContent = ma.length.toString();
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
    let c = '';

    switch( projectIx ) {

    case 0: // moving Character
        c = prompt(instruction, '');
        if ( c == undefined ) {
            return c;
        }
    
        if (c.length > 0) {
            return c[0];
        }

        break;
    case 1: // moving Characters (Array)
        c = prompt(instruction, '');
        if ( c == undefined ) {
            return c;
        }
    
        if (c.length > 0) {
            return c[0];
        }

        break;
    }

    return c;
}

//////////////////////////////////////////////////////////////////////////////
function scanUserKey() {
    let c = '';

    switch( projectIx ) {

    case 0: // moving Character
            
        if( keyEvt.down == true ) {
            keyEvt.down = false;
        } else if (keyEvt.up == true) {
            keyEvt.up = false;
            c = keyEvt.key;
            keyEvt.key = '';
        }
        break;
    case 1: // moving Characters (Array)
            
        if( keyEvt.down == true ) {
            keyEvt.down = false;
        } else if (keyEvt.up == true) {
            keyEvt.up = false;
            c = keyEvt.key;
            keyEvt.key = '';
        }
        break;
    }

    return c;
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
    let x = 1, i1, inCnt = 0;
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
    if( solIndex > 11 ) solIndex = 0;
    document.getElementById('solId').value = solIndex.toString();
    selectedMovingCh();
}

//////////////////////////////////////////////////////////////////////////////
function lastMovingCh() {
    solIndex = 12;
    runSelectedMovingChar();
}

//////////////////////////////////////////////////////////////////////////////
function selectedMovingCh() {
    id = document.getElementById('solId');
    solIndex = parseInt(id.value);
    if( solIndex > 11 ) solIndex = 0;

    runSelectedMovingChar();
}

//////////////////////////////////////////////////////////////////////////////
function runSelectedMovingChar() {
    let _bNb = document.getElementById('nonBlockKey').checked;
    numX = 1,
    rptX,
    inCnt = 0;
    newKey = 1;

    configSolutionStart();
    if( projectIx == 0 ) {
        if( _bNb == false ) {
            movingCh(solIndex);
        } else {
            movChInterval = setInterval(movingChByPollingKeys, 50);
        }
    } else if ( projectIx == 1 ) {
        moveCharInRectArray(solIndex);
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
    document.getElementById('runSelSol').disabled = true;
    document.getElementById('extraBtn').hidden = true;
}

//////////////////////////////////////////////////////////////////////////////
function configSolutionEnd() {
    document.getElementById('instruction').textContent = '';
    document.getElementById('runSelSol').disabled = false;
    if( document.getElementById('chbExtraBtn').checked == true) {
        document.getElementById('extraBtn').hidden = false;
    }
}


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
function movingChByPollingKeys() {
    
    let ix = solIndex;
    const plygdWidth = MOVE_CHAR_WIDTH, plygdHeight = MOVE_CHAR_HEIGHT; // rectangular size
    let msg = '';    

    initMessageBoard();

    switch(ix){
    case 0:
        numX = 0;
        newKey = scanUserKey();

        if( (newKey != null) && (newKey != '')) {
            printResult(newKey.toString());
        }

        if ((newKey == '0') || (newKey == null) ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 1:
        numX = 0;
        newKey = scanUserKey();

        if( (newKey != null) && (newKey != '')) {
            printResult("@");
        }

        if ((newKey == '0') || (newKey == null) ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 2:
        numX = 0;

        newKey = scanUserKey();

        if((newKey == '+') || (newKey == '=') ) {
            printResult("@");
        }

        if ((newKey == '0') || (newKey == null) ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 3:
        msg = '';
        // ACTION: it places the character '@' based on the location index numX.
        for(rptX = 0; rptX<numX; rptX++) {
            msg = msg + "@";
        }
        if( newKey != '' ) printResult(msg);

        // INPUT: user key input
        newKey = scanUserKey(); inCnt++;

        // CONTROL: controls the location of the character '@'.
        if((newKey == '+') || (newKey == '=') )
            numX++;

        if ((newKey == '0') || (newKey == null) ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 4:
        
        msg = '';
        // ACTION: it places the character '@' based on the location index numX.
        for(rptX = 0; rptX<numX; rptX++) {
            msg = msg + "@";
        }
        if( newKey != '' ) printResult(msg);

        // INPUT: user key input
        newKey = scanUserKey(); inCnt++;

        // CONTROL: controls the location of the character '@'.
        if((newKey == '+') || (newKey == '=') ){
            if(numX < plygdWidth)
                numX++;
            //else
            //    console.log("\7");
        }
        if ((newKey == '0') || (newKey == null) ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 5:
        msg = '';
        // ACTION: it places the character '@' based on the location index numX.
        for(rptX = 0; rptX<numX; rptX++) {
            msg = msg + "@";
        }
        if( newKey != '' ) printResult(msg);

        // INPUT: user key input
        newKey = scanUserKey(); inCnt++;

        // CONTROL: controls the location of the character '@'.
        if((newKey == '+') || (newKey == '=')){
            if(numX < plygdWidth)
                numX++;
            //lse
            //    console.log("\7");
        } else if ((newKey == '-') || (newKey == '_')) {
            if(numX > 0)
                numX--;
            //else
            //    MessageBeep(MB_ICONASTERISK);
        }

        if ((newKey == '0') || (newKey == null) ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 6:
    case 7:

        // ACTION: it places the character '@' based on the location index numX.
        msg = '';

        for(rptX = 0; rptX<numX; rptX++) {
            msg = msg + "@";
        }
        if( newKey != '' ) printResult(msg);

        // INPUT: user key input
        newKey = scanUserKey(); inCnt++;

        // CONTROL: controls the location of the character '@'.
        if((newKey == '+') || (newKey == '=')){
            if(numX < plygdWidth)
                numX++;
            //else
            //    console.log("\7");
        } else if ((newKey == '-') || (newKey == '_')) {
            if(numX > 1)
                numX--;
            //else
            //    MessageBeep(MB_ICONASTERISK);
        }

        if ((newKey == '0') || (newKey == null) ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 8:
    case 9:


        msg = '';

        for(rptX = 0; rptX<numX; rptX++) {
            msg = msg + "@";
        }
        if( newKey != '' ) printResult(msg);

        newKey = scanUserKey(); inCnt++;

        if((newKey == '+') || (newKey == '=')){
            if(numX < plygdWidth)
                numX++;
            else
                numX = 1;
        } else if ((newKey == '-') || (newKey == '_')) {
            if(numX > 1)
                numX--;
            //else
            //    MessageBeep(MB_ICONASTERISK);
        }

        if ((newKey == '0') || (newKey == null) ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;


    case 10:
    case 11:

        msg = '';
        for(rptX = 0; rptX<numX; rptX++) {
            msg = msg + "@";
        }
        if( newKey != '' ) printResult(msg);

        newKey = scanUserKey(); inCnt++;

        if((newKey == '+') || (newKey == '=')){
            if(numX < plygdWidth)
                numX++;
            else
                numX = 1;
        } else if ((newKey == '-') || (newKey == '_')) {
            if(numX > 1)
                numX--;
            else
                numX = plygdWidth;
        }

        if ((newKey == '0') || (newKey == null) ) {
            clearInterval(movChInterval);
            alert("Game Over!");
            configSolutionEnd();
        }
        break;

    case 12:
    
        msg = '';
        for(rptX = 0; rptX<numX; rptX++) {
            msg = msg + "@";
        }
        
        if( newKey != '' ) {
            clearMsgBoard();
            printResultNoCur(msg);
        }
        
        newKey = scanUserKey();

        if((newKey == '+') || (newKey == '=')){
            if(numX < plygdWidth)
                numX++;
            else
                numX = 1;
        } else if ((newKey == '-') || (newKey == '_')) {
            if(numX > 1)
                numX--;
            else
                numX = plygdWidth;
        }

        if ((newKey == '0') || (newKey == null) ) {
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

let pgdTopBottomLine  = new Array(PLAYGROUND_MAX_FENCE_WIDTH);
let pgdEmptyLine  = new Array(PLAYGROUND_MAX_FENCE_WIDTH);
let spaceCh = ' ';
let bInit = false;
let bInitF = false;

//////////////////////////////////////////////////////////////////////////////
function moveCharInRectArray(ix)
{

    let c = 1;
    let pgdActiveLine = new Array(PLAYGROUND_WIDTH_MAX+2);
    let x = 1, i, inCnt = 0;
    let plygdWidth = MOVE_CHAR_WIDTH;
    
    initMessageBoard();

	switch(ix){
    case 0:
        alert("Invalid Solution ID !");        
        break;
    case 1:
        
        for( i=0; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = ' ';
    	pgdActiveLine[0] = '@';

    	while ((c != '0') && (c != null) ) {

			c = GetCh();

            if( c != null) {
                if( c == '') {
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
    	
		while ((c != '0') && (c != null) ) {

			c = GetCh();
			if((c == '+') || (c == '=') ) {
                printResultInArray(pgdActiveLine.join(''));
			}
		}
		break;

    case 3:
        for( i=0; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = ' ';
    	pgdActiveLine[0] = '@';

    	while ((c != '0') && (c != null) ) {
    		// ACTION: it places the character '@' based on the location index x.
            printResultInArray(pgdActiveLine.join(''));

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

    	for( i=0; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = ' ';
    	pgdActiveLine[0] = '@';

		while ((c != '0') && (c != null) ) {
            printResultInArray(pgdActiveLine.join(''));

			c = GetCh(); inCnt++;
			if((c == '+') || (c == '=') ){
				if(x < plygdWidth) {
					pgdActiveLine[x] = '@';
					x++;
				}
                // else
				//	console.log("\7");
			}
		}
		break;

    case 5:
    	for( i=0; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = ' ';
    	pgdActiveLine[0] = '@';

		while ((c != '0') && (c != null) ) {
            printResultInArray(pgdActiveLine.join(''));

			c = GetCh(); inCnt++;
			if((c == '+') || (c == '=')){
				if(x < plygdWidth) {
					pgdActiveLine[x] = '@';
					x++;
				} else
					console.log("\7");
			} else if ((c == '-') || (c == '_')) {
				if(x > 1) {
					x--;
					pgdActiveLine[x-1] = '@';
				} else if(x > 0) x--;
				//else MessageBeep(MB_ICONASTERISK);
			}

            for( i = x; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = ' ';
		}
		break;

    case 6:
    case 7:
        for( i=0; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = ' ';
    	pgdActiveLine[0] = '@';

		while ((c != '0') && (c != null) ) {
            printResultInArray(pgdActiveLine.join(''));

			c = GetCh(); inCnt++;
			if((c == '+') || (c == '=')){
				if(x < plygdWidth) {
					pgdActiveLine[x] = '@';
					x++;
				}
                // else
				//	console.log("\7");
			} else if ((c == '-') || (c == '_')) {
				if(x > 1) x--;
				//else MessageBeep(MB_ICONASTERISK);

				pgdActiveLine[x] = '\0';
				pgdActiveLine[x-1] = '@';
			}

            for( i = x; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = ' ';
		}
		break;

    case 8:
    case 9:
        for( i=0; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = ' ';
    	pgdActiveLine[0] = '@';
		while ((c != '0') && (c != null) ) {

            printResultInArray(pgdActiveLine.join(''));

			c = GetCh(); inCnt++;
			if((c == '+') || (c == '=')){
				if(x < plygdWidth) {
					pgdActiveLine[x] = '@';
					x++;
				} else {
					x = 1;
					pgdActiveLine[0] = '@';
				}
			} else if ((c == '-') || (c == '_')) {
				if(x > 1) x--;
				//else MessageBeep(MB_ICONASTERISK);

				pgdActiveLine[x-1] = '@';
			}
            for( i = x; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = ' ';
		}
		break;


    case 10:
    case 11:
        for( i=0; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = ' ';
    	pgdActiveLine[0] = '@';
		while ((c != '0') && (c != null) ) {

            printResultInArray(pgdActiveLine.join(''));

			c = GetCh(); inCnt++;
			if((c == '+') || (c == '=')){
				if(x < plygdWidth) {
					pgdActiveLine[x] = '@';
					x++;
				} else {
					x = 1;
					pgdActiveLine[0] = '@';
				}
			} else if ((c == '-') || (c == '_')) {
				if(x > 1) {
					x--;
					pgdActiveLine[x-1] = '@';
				} else {
					x = plygdWidth;
					for(i=0; i < plygdWidth; i++){
						pgdActiveLine[i] = '@';
					}
				}
			}
            for( i = x; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = ' ';
		}
		break;

    case 12:
        for( i=0; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = ' ';
    	pgdActiveLine[0] = '@';

		while ((c != '0') && (c != null) ) {            
            clearMsgBoard();
            printResultInArrayNoCur(pgdActiveLine.join(''));

			c = GetCh();
			if((c == '+') || (c == '=')){
				if(x < plygdWidth)
					x++;
				else {
					x = 1;
					pgdActiveLine[x] = '@';
				}
			} else if ((c == '-') || (c == '_')) {
				if(x > 1) {
					x--;
					pgdActiveLine[x-1] = '@';
				} else {
					x = plygdWidth;
					for(i=0; i < plygdWidth; i++){
						pgdActiveLine[i] = '@';
					}
				}
			}
            for( i = x; i < pgdActiveLine.length; i++ ) pgdActiveLine[i] = ' ';
		}
		break;
    default:
        printResultInArray("The task ID %d is not available.\n");
    	break;
    }

    configSolutionEnd();
    return 0;
}
