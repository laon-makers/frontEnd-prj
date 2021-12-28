
//  Copyright (C) 2024 Gi Tae Cho laon.makers@yahoo.com
//    This file is a part of the Smart Home WiFi Web Server project.
//    This project can not be copied and/or distributed without the express permission of Gi Tae Cho laon.makers@yahoo.com.
// 
//  Author: G.T. Cho (a Laon maker/artist in Laon Creators' Group)
//    Version: 1.0
//    Last update: Jan. 17, 2022
//
const KEY_ENTER         = 0x0D;
const KEY_0             = 0x30;
const KEY_9             = 0x39;
const KEY_A_OR_a        = 0x41;
const KEY_O_OR_o        = 0x4F;
const KEY_Z_OR_z        = 0x5A;

const KEY_EQUAL_OR_PLUS = 0x3D;
const KEY_MINUS_OR_UNDERSCORE = 0xAD;
const KEY_ESC           = 0x1B; //27;
const KEY_SHIFT         = 0x10;
const KEY_CTRL          = 0x11;
const KEY_ALT           = 0x12;

const KEY_RIGHT_ARROW   = 0x27;
const KEY_LEFT_ARROW    = 0x25;
const KEY_DOWN_ARROW    = 0x28;
const KEY_UP_ARROW      = 0x26;
const KEY_F1            = 0x70;
const KEY_F12           = 0x7B;


const bPRINT_ON_CONSOLE     = false;
const VIRTUAL_KEY_A2Z_BASE  = 0x41;
const NUM_OF_ALPHABET       = 26;
const PRJ_PARAM             = 5;
const PLAYGROUND_WIDTH      = 30;
const PLAYGROUND_HEIGHT      = 15;
const PLAYGROUND_BUFFER_SIZE = (PLAYGROUND_WIDTH+1);

//==> from mivingCh_II.js
const NOF_SOLUTION          = 18;
const PLAYGROUND_SPACE_CHAR = '&nbsp;';
const PLAYGROUND_TAB_CHAR = "&emsp;&emsp;";
const PLAYGROUND_NEWLINE_CHAR = '<br/>';

let projectIx = 0; // 0 to indicate current project is 'movingCh', 1: for 'movingChArray'.
let solIndex = 0;  // indicate which solution was requested to run.
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
let row, column;
let playGroundCount = 0;
//<==

let line;
let bRemoved = false;
let maxNewChar = 50;
let head;   // It points to the next available string for playground to save a new character.
let tail;   // It points to the string which contains the oldest character added, except initial value set to 0.
let bottomIx, hit, wrong, gen;
let bExit = false, bFound = false;

let ht;     // = new Array(51);
let hIx;
let playGround; // = new Array(PLAYGROUND_HEIGHT); // char playGround[PLAYGROUND_HEIGHT][PLAYGROUND_BUFFER_SIZE];
let pLine;  // = new Array(PLAYGROUND_HEIGHT); //char * pLine[PLAYGROUND_HEIGHT];

let topLine = "################################<br/>";

//===> for gameEvent.js
let bTimerExpired       = false;
let timerExpiryTime     = undefined;
let invadingChInterval  = undefined;
let keyCheckInterval    = undefined;
let keyEvt = {key:'', which:null, ctrl:false, alt: false, shift:false, down:false, up:false };
//<===

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
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
function resetGame() {
    clearMsgBoard();
    phantomEscapeKeyEvent();
}


//////////////////////////////////////////////////////////////////////////////
function clearMsgBoard() {
    msgBoard.innerHTML = '';
    pgndTxt = '';
    msgLineCnt = 0;
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
    let sid = document.getElementById('solId');
    let newOp;

    for( let i = 0; i < (NOF_SOLUTION + 1); i++) {
        newOp = document.createElement('option');
        newOp.textContent = i.toString();
        sid.appendChild(newOp);
    }
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
    solIndex = NOF_SOLUTION;
    runSelectedMovingChar();
}

//////////////////////////////////////////////////////////////////////////////
function launchMovingChar() {

    if( projectIx == 2) {
        let i;
        line = new Array(PLAYGROUND_BUFFER_SIZE+2);
        playGround = new Array(PLAYGROUND_HEIGHT);

        for (i = 0; i < PLAYGROUND_HEIGHT; i++) {
            playGround[i] = new Array(PLAYGROUND_BUFFER_SIZE);
        }
        
        pLine = new Array(PLAYGROUND_HEIGHT);

        ht = new Array(51);
        
        for (i = 0; i < 51; i++) {
            ht[i] = new Array(4);
        }
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
    row = 0; column = 0;
    movingChIx = 2;
    fenceCh = '#';
    spaceXY = [0,0];
    bFence = false;
    //<==
    playGroundCount = 0;    

    configSolutionStart();
    if ( projectIx == 2 ) {
        //if( solIndex > 12)
            keyCheckInterval = setInterval(fallingChar, 50);
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

    if ( projectIx == 2 ) {
        if(solIndex < 12 ) {
            instruction = "Hit 'ESC' key to exit.  Project: Invading Char (Array).   ID:" + solIndex.toString();
        } else {
            instruction = "ESC to Exit.  F1 for Menu.  Project: Invading Char (Array).   ID:" + solIndex.toString();
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

//////////////////////////////////////////////////////////////////////////////
function fallingChar() {

    let x = 0, y = 0, z = 0, i, j, i2;
    let c;

    let chIx = 2;
    let str = "";
    let boarder = "#                              # ";
    let bBdr = false;
    let bShift = false;
    
    let spaceXY = [0,0];
    let bdX = 30, bdY = 15;
    let ix;    
    let pPG, pTmp;    
    let correct = 0;
    ix = solIndex;    

    initMessageBoard();

    if( bGameInitialized == false ) {
        CleanPlayGround();
    }


    switch(ix){
    case 1:
        pgndTxt = "This is the 15x30 cells Playground." + PLAYGROUND_NEWLINE_CHAR;
        pgndTxt += "1 3 5 6 9 1 3 5 7 9 1 3 5 7 9 1" + PLAYGROUND_NEWLINE_CHAR;
    	PrintPlayGround(playGround);

        // optional until 'break'
        newKey = scanUserKey();
        if (newKey == KEY_ESC ) {
            clearInterval(keyCheckInterval);
            if( bTimerExpired == false ) {
                clearInterval(invadingChInterval);
            }
            
            alert("Game Over!");
            configSolutionEnd();
        }
    	break;
    case 2:
        pgndTxt = PLAYGROUND_SPACE_CHAR + "1 3 5 6 9 1 3 5 7 9 1 3 5 7 9 1" + PLAYGROUND_NEWLINE_CHAR;
    	PrintPlayGroundWithOutline(playGround, '*');

        // optional (just before 'break')
        newKey = scanUserKey();
        if (newKey == KEY_ESC ) {
            clearInterval(keyCheckInterval);
            if( bTimerExpired == false ) {
                clearInterval(invadingChInterval);
            }
            
            alert("Game Over!");
            configSolutionEnd();
        }
    	break;

    case 3:
        pgndTxt = PLAYGROUND_SPACE_CHAR + "1 3 5 6 9 1 3 5 7 9 1 3 5 7 9 1" + PLAYGROUND_NEWLINE_CHAR;
    	playGround[0][9] = 'A';
    	PrintPlayGroundWithOutline(playGround, '*');
        
        // optional (just before 'break')
        newKey = scanUserKey();
        if (newKey == KEY_ESC ) {
            clearInterval(keyCheckInterval);
            if( bTimerExpired == false ) {
                clearInterval(invadingChInterval);
            }
            
            alert("Game Over!");
            configSolutionEnd();
        }
    	break;
    case 4:
        pgndTxt = PLAYGROUND_SPACE_CHAR + "1 3 5 6 9 1 3 5 7 9 1 3 5 7 9 1" + PLAYGROUND_NEWLINE_CHAR;
    	for(i = 0; i < PLAYGROUND_HEIGHT; i++ ) {
    		playGround[i][14] = String.fromCharCode(VIRTUAL_KEY_A2Z_BASE + i);  // 0x41 == 'A'
    	}
    	PrintPlayGroundWithOutline(playGround, '*');
        
        // optional (just before 'break')
        newKey = scanUserKey();
        if (newKey == KEY_ESC ) {
            clearInterval(keyCheckInterval);
            if( bTimerExpired == false ) {
                clearInterval(invadingChInterval);
            }
            
            alert("Game Over!");
            configSolutionEnd();
        }
    	break;

    case 5:

        if( bGameInitialized == false ) {
            bGameInitialized = true;            
    	    setNewTimerExpiry(1000);
            pgndTxt = PLAYGROUND_SPACE_CHAR + "1 3 5 6 9 1 3 5 7 9 1 3 5 7 9 1" + PLAYGROUND_NEWLINE_CHAR;
            pgndTxt += "********************************" + PLAYGROUND_NEWLINE_CHAR;            
        } else newKey = scanUserKey();  // this statement is optional.

        i = row;
        if( row < PLAYGROUND_HEIGHT ) {
    		if(isTimerExpired() == true) {
    			playGround[i][14] =  String.fromCharCode(VIRTUAL_KEY_A2Z_BASE + i);
                j = (i+1);
                pgndTxt += "*" + playGround[i].join('') + "* " + j.toString() + PLAYGROUND_NEWLINE_CHAR;
    			i++;
                row = i;

    			if( i < PLAYGROUND_HEIGHT) {
    			    setNewTimerExpiry(timerExpiryTime);
                } else {
                    pgndTxt += "********************************" + PLAYGROUND_NEWLINE_CHAR;
                }
                msgBoard.innerHTML = pgndTxt;
    		}
    	}

        // optional (just before 'break')
        if (newKey == KEY_ESC ) {
            clearInterval(keyCheckInterval);
            if( bTimerExpired == false ) {
                clearInterval(invadingChInterval);
            }
            
            alert("Game Over!");
            configSolutionEnd();
        }
    	break;

    case 6:

        if( bGameInitialized == false ) {
            bGameInitialized = true;
            x = GetTimeIntervalFromUser();
            if( x == undefined ) {
                resetGame();
            } else {
                setNewTimerExpiry(x);
                pgndTxt = PLAYGROUND_SPACE_CHAR + "1 3 5 6 9 1 3 5 7 9 1 3 5 7 9 1" + PLAYGROUND_NEWLINE_CHAR;
                pgndTxt += "********************************" + PLAYGROUND_NEWLINE_CHAR;
            }
        } else newKey = scanUserKey();  // this statement is optional.

        i = row;
        if( row < PLAYGROUND_HEIGHT ) {
            if(isTimerExpired() == true) {
                playGround[i][14] =  String.fromCharCode(VIRTUAL_KEY_A2Z_BASE + i);
                j = (i+1);
                pgndTxt += "*" + playGround[i].join('') + "* " + j.toString() + PLAYGROUND_NEWLINE_CHAR;
                i++;
                row = i;

                if( i < PLAYGROUND_HEIGHT) {
                    setNewTimerExpiry(timerExpiryTime);
                } else {
                    pgndTxt += "********************************" + PLAYGROUND_NEWLINE_CHAR;
                }
                msgBoard.innerHTML = pgndTxt;
            }
        }

        // optional (just before 'break')
        if (newKey == KEY_ESC ) {
            clearInterval(keyCheckInterval);
            if( bTimerExpired == false ) {
                clearInterval(invadingChInterval);
            }
            
            alert("Game Over!");
            configSolutionEnd();
        }
        break;
    
    case 7:    	
		
        if( bGameInitialized == false ) {
            bGameInitialized = true;
            x = GetTimeIntervalFromUser();
            if( x == undefined ) {
                resetGame();
            } else {
                setNewTimerExpiry(x);
                pgndTxt = PLAYGROUND_SPACE_CHAR + "1 3 5 6 9 1 3 5 7 9 1 3 5 7 9 1" + PLAYGROUND_NEWLINE_CHAR;
                pgndTxt += "********************************" + PLAYGROUND_NEWLINE_CHAR;
            }
        } else newKey = scanUserKey();

        i = row;

        if( row < PLAYGROUND_HEIGHT ) {
            if(isTimerExpired() == true) {
                playGround[i][14] = GetUniqueRandomKey(playGround, NUM_OF_ALPHABET, i);

                j = (i+1);
                pgndTxt += "*" + playGround[i].join('') + "* " + j.toString() + PLAYGROUND_NEWLINE_CHAR;
                i++;
                row = i;

                if( i < PLAYGROUND_HEIGHT) {
                    setNewTimerExpiry(timerExpiryTime);
                } else {
                    pgndTxt += "********************************" + PLAYGROUND_NEWLINE_CHAR;
                }
                msgBoard.innerHTML = pgndTxt;
            }
        }

        if (newKey == KEY_ESC ) {
            clearInterval(keyCheckInterval);
            if( bTimerExpired == false ) {
                clearInterval(invadingChInterval);
            }
            
            alert("Game Over!");
            configSolutionEnd();
        }
		break;

    case 8:
    	if( bGameInitialized == false ) {
            bGameInitialized = true;
            x = GetTimeIntervalFromUser();
            if( x == undefined ) {
                resetGame();
            } else {
                setNewTimerExpiry(x);
                pgndTxt = PLAYGROUND_SPACE_CHAR + "1 3 5 6 9 1 3 5 7 9 1 3 5 7 9 1" + PLAYGROUND_NEWLINE_CHAR;
                pgndTxt += "********************************" + PLAYGROUND_NEWLINE_CHAR;
            }
        } else newKey = scanUserKey();

        i = row;

        if( row < PLAYGROUND_HEIGHT ) {
            if(isTimerExpired() == true) {
                y = GetRandomValue(PLAYGROUND_WIDTH);
                playGround[i][y] = GetUniqueRandomKey(playGround, NUM_OF_ALPHABET, i);

                j = (i+1);
                pgndTxt += "*" + playGround[i].join('') + "* " + j.toString() + PLAYGROUND_NEWLINE_CHAR;
                i++;
                row = i;

                if( i < PLAYGROUND_HEIGHT) {
                    setNewTimerExpiry(timerExpiryTime);
                } else {
                    pgndTxt += "********************************" + PLAYGROUND_NEWLINE_CHAR;
                }
                msgBoard.innerHTML = pgndTxt;
            }
        }

        if (newKey == KEY_ESC ) {
            clearInterval(keyCheckInterval);
            if( bTimerExpired == false ) {
                clearInterval(invadingChInterval);
            }
            
            alert("Game Over!");
            configSolutionEnd();
        }        
		break;

    case 9:
    	
        if( bGameInitialized == false ) {
            bGameInitialized = true;
            x = GetTimeIntervalFromUser();
            setNewTimerExpiry(x);
            pgndTxt = PLAYGROUND_SPACE_CHAR + "1 3 5 6 9 1 3 5 7 9 1 3 5 7 9 1" + PLAYGROUND_NEWLINE_CHAR;
            pgndTxt += "********************************" + PLAYGROUND_NEWLINE_CHAR;
        } else newKey = scanUserKey();

        i = row;

        if( row < PLAYGROUND_HEIGHT ) {
            if(isTimerExpired() == true) {
                y = GetRandomValue(PLAYGROUND_WIDTH);
                playGround[i][y] = GetUniqueRandomKey(playGround, NUM_OF_ALPHABET, i);

                j = (i+1);
                pgndTxt += "*" + playGround[i].join('') + "* " + j.toString() + PLAYGROUND_NEWLINE_CHAR;
                i++;
                row = i;

                if( i < PLAYGROUND_HEIGHT) {
                    setNewTimerExpiry(timerExpiryTime);
                } else {
                    pgndTxt += "********************************" + PLAYGROUND_NEWLINE_CHAR;
                    playGroundCount++;
                    if( playGroundCount < 2 ) {
                        row = 0;
                        pgndTxt += PLAYGROUND_NEWLINE_CHAR;
                        pgndTxt += PLAYGROUND_SPACE_CHAR + "1 3 5 6 9 1 3 5 7 9 1 3 5 7 9 1" + PLAYGROUND_NEWLINE_CHAR;
                        pgndTxt += "********************************" + PLAYGROUND_NEWLINE_CHAR;
                    }
                }
                msgBoard.innerHTML = pgndTxt;
            }
        }

        if (newKey == KEY_ESC ) {
            clearInterval(keyCheckInterval);
            if( bTimerExpired == false ) {
                clearInterval(invadingChInterval);
            }
            
            alert("Game Over!");
            configSolutionEnd();
        }
		break;

    case 10:
		
        if( bGameInitialized == false ) {
            bGameInitialized = true;
            x = GetTimeIntervalFromUser();
            if( x == undefined ) {
                resetGame();
            } else {
                setNewTimerExpiry(x);
                pgndTxt = PLAYGROUND_SPACE_CHAR + "1 3 5 6 9 1 3 5 7 9 1 3 5 7 9 1" + PLAYGROUND_NEWLINE_CHAR;
                pgndTxt += "********************************" + PLAYGROUND_NEWLINE_CHAR;
            }
        } else newKey = scanUserKey();

        i = row;

        if( row < PLAYGROUND_HEIGHT ) {
            if(isTimerExpired() == true) {
                y = GetRandomValue(PLAYGROUND_WIDTH);
                playGround[i][y] = GetUniqueRandomKey(playGround, NUM_OF_ALPHABET, i);

                pgndTxt += "*" + playGround[i].join('') + "*" + PLAYGROUND_NEWLINE_CHAR;
                i++;
                row = i;

                if( i < PLAYGROUND_HEIGHT) {
                    setNewTimerExpiry(timerExpiryTime);
                    msgBoard.innerHTML = pgndTxt;
                } else {
                    pgndTxt += "********************************" + PLAYGROUND_NEWLINE_CHAR;
                    playGroundCount++;
                    if( playGroundCount < 2 ) row = 0;
                    msgBoard.innerHTML = pgndTxt;

                    ResetPlayGroundBuf();
                    pgndTxt = PLAYGROUND_SPACE_CHAR + "1 3 5 6 9 1 3 5 7 9 1 3 5 7 9 1" + PLAYGROUND_NEWLINE_CHAR;
                    pgndTxt += "********************************" + PLAYGROUND_NEWLINE_CHAR;
                }
            }
        }

        if (newKey == KEY_ESC ) {
            clearInterval(keyCheckInterval);
            if( bTimerExpired == false ) {
                clearInterval(invadingChInterval);
            }
            
            alert("Game Over!");
            configSolutionEnd();
        }
		break;

    case 11:
    	if( bGameInitialized == false ) {
            bGameInitialized = true;
            InitLine(PLAYGROUND_BUFFER_SIZE+1, '*');

            x = GetTimeIntervalFromUser();
            if( x == undefined ) {
                resetGame();
            } else {
                setNewTimerExpiry(x);
                head = 0;
            }
        } else newKey = scanUserKey();

        i = row;

        if( row < PLAYGROUND_HEIGHT ) {
            if(isTimerExpired() == true) {
                y = GetRandomValue(PLAYGROUND_WIDTH);
                playGround[i][y] = GetUniqueRandomKey(playGround, NUM_OF_ALPHABET, head);

                pgndTxt += "*" + playGround[i].join('') + "*" + PLAYGROUND_NEWLINE_CHAR;
                i++;

                head++;
                UpdatePlaygroundByLIFO(playGround,'*');
                row = i;

                if( i < PLAYGROUND_HEIGHT) {
                    setNewTimerExpiry(timerExpiryTime);
                    msgBoard.innerHTML = pgndTxt;
                } else {
                    playGroundCount++;
                    if( playGroundCount < 2 ) {
                        row = 0;
                        head = 0;
                    }
                    msgBoard.innerHTML = pgndTxt;

                    ResetPlayGroundBuf();
                }
            }
        }

        if (newKey == KEY_ESC ) {
            clearInterval(keyCheckInterval);
            if( bTimerExpired == false ) {
                clearInterval(invadingChInterval);
            }
            
            alert("Game Over!");
            configSolutionEnd();
        }
		break;

    case 12:
        if( bGameInitialized == false ) {
            bGameInitialized = true;
            InitLine(PLAYGROUND_BUFFER_SIZE+1, '*');

            x = GetTimeIntervalFromUser();
            if( x == undefined ) {
                resetGame();
            } else {
                setNewTimerExpiry(x);
                head = 0;
            }
        } else newKey = scanUserKey();  // this statement is a must; no longer an option from this solution ID.

        i = row;

        if( row < PLAYGROUND_HEIGHT ) {
            if(isTimerExpired() == true) {
                y = GetRandomValue(PLAYGROUND_WIDTH);
                playGround[i][y] = GetUniqueRandomKey(playGround, NUM_OF_ALPHABET, head);

                pgndTxt += "*" + playGround[i].join('') + "*" + PLAYGROUND_NEWLINE_CHAR;
                i++;

                head++;
                UpdatePlaygroundByLIFO(playGround,'*');
                row = i;

                if( i < PLAYGROUND_HEIGHT) {
                    setNewTimerExpiry(timerExpiryTime);
                } else {
                    playGroundCount++;
                    pgndTxt += PLAYGROUND_NEWLINE_CHAR;

                    if( playGroundCount < 2 ) {
                        pgndTxt += "Press 'Enter' key to continue !";
                    }
                }
                msgBoard.innerHTML = pgndTxt;
            }
        }

        if (newKey == KEY_ESC ) {
            clearInterval(keyCheckInterval);
            if( bTimerExpired == false ) {
                clearInterval(invadingChInterval);
            }
            
            alert("Game Over!");
            configSolutionEnd();
        } else if (newKey == KEY_ENTER) {
            if( row >= PLAYGROUND_HEIGHT ) {
                if( playGroundCount < 2 ) {
                    row = 0;
                    head = 0;
                    ResetPlayGroundBuf();
                }
            }
        }
        break;

    case 13:
		
        if( bGameInitialized == false ) {
            bGameInitialized = true;
            InitLine(PLAYGROUND_BUFFER_SIZE+1, '*');

            x = GetTimeIntervalFromUser();
            if( x == undefined ) {
                resetGame();
            } else {
                setNewTimerExpiry(x);
                head = 0;
            }
        } else newKey = scanUserKey();

        i = row;

        if( row < PLAYGROUND_HEIGHT ) {
            if( (newKey >= KEY_A_OR_a) && (newKey <= KEY_Z_OR_z)) {
                FindCharAndClear( newKey );
            }

            if(isTimerExpired() == true) {
                y = GetRandomValue(PLAYGROUND_WIDTH);
                playGround[i][y] = GetUniqueRandomKey(playGround, NUM_OF_ALPHABET, head);
                pgndTxt += "*" + playGround[i].join('') + "*" + PLAYGROUND_NEWLINE_CHAR;
                i++;

                head++;
                UpdatePlaygroundByLIFO(playGround,'*');
                row = i;

                if( i < PLAYGROUND_HEIGHT) {
                    setNewTimerExpiry(timerExpiryTime);
                } else {
                    playGroundCount++;
                    pgndTxt += PLAYGROUND_NEWLINE_CHAR;

                    if( playGroundCount < 2 ) {
                        pgndTxt += "Press 'Enter' key to continue !";
                    }
                }
                msgBoard.innerHTML = pgndTxt;
            }
        }

        
        if (newKey == KEY_ESC ) {
            clearInterval(keyCheckInterval);
            if( bTimerExpired == false ) {
                clearInterval(invadingChInterval);
            }
            
            alert("Game Over!");
            configSolutionEnd();
        } else if (newKey == KEY_ENTER) {
            if( row >= PLAYGROUND_HEIGHT ) {
                if( playGroundCount < 2 ) {
                    row = 0;
                    head = 0;
                    ResetPlayGroundBuf();
                }
            }
        }
		break;


    case 14:
		
        if( bGameInitialized == false ) {
            bGameInitialized = true;
            InitLine(PLAYGROUND_BUFFER_SIZE+1, '*');

            x = GetTimeIntervalFromUser();
            if( x == undefined ) {
                resetGame();
            } else {
                setNewTimerExpiry(x);
                head = 0;
                //bExit = false;
                hit = wrong = 0;
            }
        } else newKey = scanUserKey();

        i = row;
        if( row < PLAYGROUND_HEIGHT ) {

            if( (newKey >= KEY_A_OR_a) && (newKey <= KEY_Z_OR_z)) {
                i2 = FindCharAndClear( newKey );
                if(i2 > 0) hit += i2;
                else wrong++;
            } else if (newKey > 0) wrong++;

            if(isTimerExpired() == true) {
                y = GetRandomValue(PLAYGROUND_WIDTH);
                playGround[i][y] = GetUniqueRandomKey(playGround, NUM_OF_ALPHABET, head);

                pgndTxt += "*" + playGround[i].join('') + "*" + PLAYGROUND_NEWLINE_CHAR;
                i++;

                head++;
                UpdatePlaygroundByLIFO(playGround,'*');
                
                row = i;

                if( i < PLAYGROUND_HEIGHT) {                    
                    setNewTimerExpiry(timerExpiryTime);
                } else {

                    playGroundCount++;
                    
                    pgndTxt += PLAYGROUND_NEWLINE_CHAR + "Game Over!" + PLAYGROUND_NEWLINE_CHAR;

                    j = (PLAYGROUND_HEIGHT - hit);
                    pgndTxt += "Hit: " + hit.toString() + ", Wrong: " + wrong.toString() + ", Left: " + j.toString();
                    
                    if( playGroundCount < 2 ) {
                        pgndTxt += PLAYGROUND_NEWLINE_CHAR + PLAYGROUND_NEWLINE_CHAR + "Press 'Enter' key to continue !";
                    }
                }
                msgBoard.innerHTML = pgndTxt;
            }
        }
        
        if (newKey == KEY_ESC ) {
            clearInterval(keyCheckInterval);
            if( bTimerExpired == false ) {
                clearInterval(invadingChInterval);
            }
            
            alert("Game Over!");
            configSolutionEnd();
        } else if (newKey == KEY_ENTER) {
            if( row >= PLAYGROUND_HEIGHT ) {
                if( playGroundCount < 2 ) {
                    row = 0;
                    head = 0;
                    hit = wrong = 0;
                    ResetPlayGroundBuf();
                }
            }
        }
		break;

    case 15:
		
        if( bGameInitialized == false ) {
            bGameInitialized = true;
            InitLine(PLAYGROUND_BUFFER_SIZE+1, '*');

            x = GetTimeIntervalFromUser();
            if( x == undefined ) {
                resetGame();
            } else {
                setNewTimerExpiry(x);
                head = 0;
                //bExit = false;
                bRemoved = false;
                hit = wrong = 0;
                bottomIx = 0;
                gen = 0;
            }
        } else newKey = scanUserKey();

        i = row;
        if( row < PLAYGROUND_HEIGHT ) {

            if( (newKey >= KEY_A_OR_a) && (newKey <= KEY_Z_OR_z)) {
                i2 = FindUniqueCharAndClear( newKey);
                if(bRemoved == true) {
                    bRemoved = false;
                    hit++;
                    if(i2 >= 0 ) {
                        bottomIx = head - i2; // Assign new index to the bottom line which has a character at the bottom line in the playground.
                    } else bottomIx = 0;
                } else wrong++;
            } else if (newKey > 0) wrong++;

            if(isTimerExpired() == true) {

                y = GetRandomValue(PLAYGROUND_WIDTH);
                playGround[i][y] = GetUniqueRandomKey(playGround, NUM_OF_ALPHABET, head);

                pgndTxt += "*" + playGround[i].join('') + "*" + PLAYGROUND_NEWLINE_CHAR;
                i++;

                head++;
                bottomIx++; // Increment to point the line which has a bottom most character.
                gen++;

                UpdatePlaygroundByLIFO(playGround,'*');
                
                row = i;

                if( i < PLAYGROUND_HEIGHT) {                    
                    setNewTimerExpiry(timerExpiryTime);

                    pgndTxt += "Bottom: " + bottomIx.toString() + ", Hit: " + hit.toString() + ", Wrong: " + wrong.toString() + ", Gen: " + gen.toString();
                } else {

                    playGroundCount++;

                    pgndTxt += "Bottom: " + bottomIx.toString() + ", Hit: " + hit.toString() + ", Wrong: " + wrong.toString() + ", Gen: " + gen.toString();
                    
                    pgndTxt += PLAYGROUND_NEWLINE_CHAR + PLAYGROUND_NEWLINE_CHAR + "Game Over!" + PLAYGROUND_NEWLINE_CHAR;
                    
                    j = (PLAYGROUND_HEIGHT - hit);
                    pgndTxt += "Hit: " + hit.toString() + ", Wrong: " + wrong.toString() + ", Left: " + j.toString();

                    if( playGroundCount < 2 ) {
                        pgndTxt += PLAYGROUND_NEWLINE_CHAR + PLAYGROUND_NEWLINE_CHAR + "Press 'Enter' key to continue !";
                    }
                }
                msgBoard.innerHTML = pgndTxt;
            }
        }
        
        if (newKey == KEY_ESC ) {
            clearInterval(keyCheckInterval);
            if( bTimerExpired == false ) {
                clearInterval(invadingChInterval);
            }
            
            alert("Game Over!");
            configSolutionEnd();
        } else if (newKey == KEY_ENTER) {
            if( row >= PLAYGROUND_HEIGHT ) {
                if( playGroundCount < 2 ) {
                    row = 0;
                    head = 0;
                    hit = wrong = 0;
                    bRemoved = false;
                    hit = wrong = 0;
                    bottomIx = 0;
                    gen = 0;
                    ResetPlayGroundBuf();
                }
            }
        }
		break;


    case 16:
        if( bGameInitialized == false ) {
            bGameInitialized = true;
            InitLine(PLAYGROUND_BUFFER_SIZE+1, '*');

            x = GetTimeIntervalFromUser();
            if( x == undefined ) {
                resetGame();
            } else {
                setNewTimerExpiry(x);
                head = 0;
                bExit = false;
                bRemoved = false;
                hit = wrong = 0;
                bottomIx = 0;
                gen = 0;
            }
        } else {
            newKey = scanUserKey();

            if (bExit == true) {

                while (true) {
                    instruction = "Please type \'1\' for another play, or \'0\' to exit.\n";
                    instruction += "Would you like to do it again? (1/0): ";

                    c = GetCh();

                    if( (c == '1')) {
                        bExit = false;
                        row = 0;
                        head = 0;
                        hit = wrong = 0;
                        bRemoved = false;
                        hit = wrong = 0;
                        bottomIx = 0;
                        gen = 0;
                        ResetPlayGroundBuf();
                        break;
                    } else if(c == '0') { // Stop if one of 'n', 'N', and ESC key is pressed by user.
                        //resetGame();
                        clearMsgBoard(); // not to clear blackboard.
                        bExit = false;
                        break;
                    }
                }
            }
        }

        i = row;
        if( row < PLAYGROUND_HEIGHT ) {  //while(true) {

            if( (newKey >= KEY_A_OR_a) && (newKey <= KEY_Z_OR_z)) {
                i2 = FindUniqueCharAndClear( newKey);
                if(bRemoved == true) {
                    bRemoved = false;
                    hit++;
                    if(i2 >= 0 ) {
                        bottomIx = head - i2; // Assign new index to the bottom line which has a character at the bottom line in the playground.
                    } else bottomIx = 0;
                } else wrong++;
            } else if (newKey > 0) wrong++;

            if(isTimerExpired() == true) {

                y = GetRandomValue(PLAYGROUND_WIDTH);
                playGround[i][y] = GetUniqueRandomKey(playGround, NUM_OF_ALPHABET, head);

                pgndTxt += "*" + playGround[i].join('') + "*" + PLAYGROUND_NEWLINE_CHAR;
                i++;

                head++;
                bottomIx++; // Increment to point the line which has a bottom most character.
                gen++;

                UpdatePlaygroundByLIFO(playGround,'*');
                
                row = i;

                if( i < PLAYGROUND_HEIGHT) {                    
                    setNewTimerExpiry(timerExpiryTime);    

                    pgndTxt += "Bottom: " + bottomIx.toString() + ", Hit: " + hit.toString() + ", Wrong: " + wrong.toString() + ", Gen: " + gen.toString();
                    
                } else {
                    pgndTxt += "Bottom: " + bottomIx.toString() + ", Hit: " + hit.toString() + ", Wrong: " + wrong.toString() + ", Gen: " + gen.toString();
                    
                    pgndTxt += PLAYGROUND_NEWLINE_CHAR + PLAYGROUND_NEWLINE_CHAR + "Game Over!" + PLAYGROUND_NEWLINE_CHAR;
                    
                    j = (PLAYGROUND_HEIGHT - hit);
                    pgndTxt += "Hit: " + hit.toString() + ", Wrong: " + wrong.toString() + ", Left: " + j.toString();

                    bExit = true;
                }
                msgBoard.innerHTML = pgndTxt;
            }
        }
        
        if (newKey == KEY_ESC ) {
            clearInterval(keyCheckInterval);
            if( bTimerExpired == false ) {
                clearInterval(invadingChInterval);
            }
            
            alert("Game Over!");
            configSolutionEnd();
        }
		break;



    case 17:
        if( bGameInitialized == false ) {
            bGameInitialized = true;
            InitLine(PLAYGROUND_BUFFER_SIZE+1, '*');

            x = GetTimeIntervalFromUser();
            if( x == undefined ) {
                resetGame();
            } else {
                setNewTimerExpiry(x);
                head = 0;
                tail = -1;
                hIx = 0;
                bExit = false;
                bRemoved = false;
                hit = wrong = 0;
                bottomIx = 0;
                gen = 0;
            }
        } else {
            newKey = scanUserKey();

            if (bExit == true) {
                instruction = "Please type \'y\' for another play, \'n\' to exit, or \'s\' to view result.\n";
                instruction += "Would you like to do it again? (y/n/s): ";

                c = GetCh();

                bTimerExpired = false;
                if((c == 'y')||(c == 'Y')) {
                    bExit = false;
                    row = 0;
                    head = 0;
                    tail = -1;
                    hIx = 0;
                    hit = wrong = 0;
                    bRemoved = false;
                    hit = wrong = 0;
                    bottomIx = 0;
                    gen = 0;
                    ResetPlayGroundBuf();
                    setNewTimerExpiry(timerExpiryTime);
                } else if((c == 'n')||(c == 'N') || (c == undefined)) { // Stop if one of 'n', 'N', and ESC key is pressed by user or 'Cancel' button clicked.
                    //resetGame();
                    phantomEscapeKeyEvent();
                    gen = maxNewChar;
                    bExit = false;
                } else if ((c == 's')||(c == 'S')) { // Show detailed game result and status if one of 's' and 'S' is pressed by user.
                    j = (gen - hit);
                    pgndTxt += "Hit: " + hit.toString() + ", Wrong: " + wrong.toString() + ", Left: " + j.toString();
                    for(i=0; i < PLAYGROUND_HEIGHT; i++) {
                        pgndTxt += "|" + playGround[i].join('') + "| " + i.toString() + PLAYGROUND_NEWLINE_CHAR;
                    }
                    pgndTxt += "head=" + head.toString() + ", tail=" + tail.toString() + PLAYGROUND_NEWLINE_CHAR + PLAYGROUND_NEWLINE_CHAR;
                    for(i=0; i < hIx; i++) {
                        pgndTxt += "head=" + ht[i][0].toString() + ", tail=" + ht[i][1].toString() + " " + ht[i][2].toString() + " " + ht[i][3].toString() + PLAYGROUND_NEWLINE_CHAR + PLAYGROUND_NEWLINE_CHAR;
                    }
                    msgBoard.innerHTML = pgndTxt;

                }
            }
        }

        i = row;
        if( gen < maxNewChar ) {

            if( (newKey >= KEY_A_OR_a) && (newKey <= KEY_Z_OR_z)) {
                if(true == FindUniqueCharFromTailAndClear(playGround, newKey)) {
                    hit++;
                    if(tail < 0) bottomIx = 0;
                    else if(head > tail) bottomIx = head - tail;
                    else if (head < tail) bottomIx = PLAYGROUND_HEIGHT - tail + head;
                } else wrong++;

            } else if (newKey > 0) wrong++;

            if(isTimerExpired() == true) {

                y = GetRandomValue(PLAYGROUND_WIDTH);
                if(tail >= 0) {
                    playGround[head][y] = GetUniqueRandomKey2(playGround, NUM_OF_ALPHABET, head);
                } else {
                    playGround[head][y] = String.fromCharCode(GetRandomValue(NUM_OF_ALPHABET) + VIRTUAL_KEY_A2Z_BASE);
                    tail = head;
                }

                head = (head+1) % PLAYGROUND_HEIGHT; // To get the head to point to the next available string.
                UpdatePlaygroundByLIFOFromHead(playGround,'*');

                if(head > tail) bottomIx = head - tail;
                else bottomIx = PLAYGROUND_HEIGHT - tail + head;

                gen++;
                
                pgndTxt += "Bottom: " + bottomIx.toString() + ", Hit: " + hit.toString() + ", Wrong: " + wrong.toString() + ", Gen: " + gen.toString();

                if( (gen < maxNewChar) && (head != tail)) {
                    setNewTimerExpiry(timerExpiryTime);
                } else {
                    
                    j = (gen - hit);

                    pgndTxt += PLAYGROUND_NEWLINE_CHAR;
                    pgndTxt += "Hit: " + hit.toString() + ", Wrong: " + wrong.toString() + ", Left: " + j.toString();
                    bExit = true;
                }

                msgBoard.innerHTML = pgndTxt;
            }
        }
        
        if (newKey == KEY_ESC ) {
            clearInterval(keyCheckInterval);
            if( bTimerExpired == false ) {
                clearInterval(invadingChInterval);
            }
            
            alert("Game Over!");
            configSolutionEnd();
        }
        break;



        case 18:
            if( bGameInitialized == false ) {
                bGameInitialized = true;
                InitLine(PLAYGROUND_BUFFER_SIZE+1, '*');
    
                x = GetTimeIntervalFromUser();
                if( x == undefined ) {
                    resetGame();
                } else {
                    setNewTimerExpiry(x);
                    head = 0;
                    tail = -1;
                    hIx = 0;
                    bExit = false;
                    bRemoved = false;
                    hit = wrong = 0;
                    bottomIx = 0;
                    gen = 0;
                }
            } else {
                newKey = scanUserKey();
    
                if (bExit == true) {
                    instruction = "Please type \'y\' for another play, \'n\' to exit, or \'s\' to view result.\n";
                    instruction += "Would you like to do it again? (y/n/s): ";
    
                    c = GetCh();
    
                    bTimerExpired = false;
                    if((c == 'y')||(c == 'Y')) {
                        bExit = false;
                        row = 0;
                        head = 0;
                        tail = -1;
                        hIx = 0;
                        hit = wrong = 0;
                        bRemoved = false;
                        hit = wrong = 0;
                        bottomIx = 0;
                        gen = 0;
                        ResetPlayGroundBuf();
                        setNewTimerExpiry(timerExpiryTime);
                    } else if((c == 'n')||(c == 'N') || (c == undefined)) { // Stop if one of 'n', 'N', and ESC key is pressed by user or 'Cancel' button clicked.
                        //resetGame();
                        phantomEscapeKeyEvent();
                        gen = maxNewChar;
                        bExit = false;
                    } else if ((c == 's')||(c == 'S')) { // Show detailed game result and status if one of 's' and 'S' is pressed by user.
                        j = (gen - hit);
                        pgndTxt += "Hit: " + hit.toString() + ", Wrong: " + wrong.toString() + ", Left: " + j.toString();
                        for(i=0; i < PLAYGROUND_HEIGHT; i++) {
                            pgndTxt += "|" + playGround[i].join('') + "| " + i.toString() + PLAYGROUND_NEWLINE_CHAR;
                        }
                        pgndTxt += "head=" + head.toString() + ", tail=" + tail.toString() + PLAYGROUND_NEWLINE_CHAR + PLAYGROUND_NEWLINE_CHAR;
                        for(i=0; i < hIx; i++) {
                            pgndTxt += "head=" + ht[i][0].toString() + ", tail=" + ht[i][1].toString() + " " + ht[i][2].toString() + " " + ht[i][3].toString() + PLAYGROUND_NEWLINE_CHAR + PLAYGROUND_NEWLINE_CHAR;
                        }
                        msgBoard.innerHTML = pgndTxt;
    
                    }
                }
            }
    
            i = row;
            if( gen < maxNewChar ) {
    
                if( (newKey >= KEY_A_OR_a) && (newKey <= KEY_Z_OR_z)) {
                    if(true == FindUniqueCharFromTailAndClear(playGround, newKey)) {
                        hit++;
                        if(tail < 0) bottomIx = 0;
                        else if(head > tail) bottomIx = head - tail;
                        else if (head < tail) bottomIx = PLAYGROUND_HEIGHT - tail + head;
                    } else wrong++;
    
                } else if (newKey > 0) wrong++;
    
                if(isTimerExpired() == true) {
    
                    y = GetRandomValue(PLAYGROUND_WIDTH);
                    if(tail >= 0) {
                        playGround[head][y] = GetUniqueRandomKey2(playGround, NUM_OF_ALPHABET, head);
                    } else {
                        playGround[head][y] = String.fromCharCode(GetRandomValue(NUM_OF_ALPHABET) + VIRTUAL_KEY_A2Z_BASE);
                        tail = head;
                    }
    
                    head = (head+1) % PLAYGROUND_HEIGHT; // To get the head to point to the next available string.
                    UpdatePlaygroundByLIFOFromHead(playGround,'*');
    
                    if(head > tail) bottomIx = head - tail;
                    else bottomIx = PLAYGROUND_HEIGHT - tail + head;
    
                    gen++;
    
                    pgndTxt += "Bottom: " + bottomIx.toString() + ", Hit: " + hit.toString() + ", Wrong: " + wrong.toString() + ", Gen: " + gen.toString();

                    if( (gen < maxNewChar) && (head != tail)) {
                        setNewTimerExpiry(timerExpiryTime);
                        
                    } else {
                        
                        pgndTxt += PLAYGROUND_NEWLINE_CHAR + PLAYGROUND_NEWLINE_CHAR;
                        
                        if( (gen == maxNewChar) && (bottomIx < PLAYGROUND_HEIGHT) ) {
                            pgndTxt += PLAYGROUND_TAB_CHAR + PLAYGROUND_TAB_CHAR + "==============" + PLAYGROUND_NEWLINE_CHAR;
                            pgndTxt += PLAYGROUND_TAB_CHAR + PLAYGROUND_TAB_CHAR + "< Winner !!! >" + PLAYGROUND_NEWLINE_CHAR;
                            pgndTxt += PLAYGROUND_TAB_CHAR + PLAYGROUND_TAB_CHAR + "==============" + PLAYGROUND_NEWLINE_CHAR + PLAYGROUND_NEWLINE_CHAR;
                        } else {
                            pgndTxt += PLAYGROUND_TAB_CHAR + PLAYGROUND_TAB_CHAR + "**************" + PLAYGROUND_NEWLINE_CHAR;
                            pgndTxt += PLAYGROUND_TAB_CHAR + PLAYGROUND_TAB_CHAR + "* Game Over! *" + PLAYGROUND_NEWLINE_CHAR;
                            pgndTxt += PLAYGROUND_TAB_CHAR + PLAYGROUND_TAB_CHAR + "**************" + PLAYGROUND_NEWLINE_CHAR + PLAYGROUND_NEWLINE_CHAR;
                        }
                        
                        
                        j = (gen - hit);
                        pgndTxt += "Hit: " + hit.toString() + ", Wrong: " + wrong.toString() + ", Left: " + j.toString();
                        bExit = true;
                    }
    
                    msgBoard.innerHTML = pgndTxt;
                }
            }
            
            if (newKey == KEY_ESC ) {
                clearInterval(keyCheckInterval);
                if( bTimerExpired == false ) {
                    clearInterval(invadingChInterval);
                }
                
                alert("Game Over!");
                configSolutionEnd();
            }
            break;

    default:
        newKey = scanUserKey();
        if (newKey == KEY_ESC ) {
            clearInterval(keyCheckInterval);
            if( bTimerExpired == false ) {
                clearInterval(invadingChInterval);
            }
            
            alert("Game Over!");
            configSolutionEnd();
        }
        break;
    }

    return 0;
}



//////////////////////////////////////////////////////////////////////////////
function UpdatePlaygroundByLIFOFromHead(playGround, lineChar) {
    let  i, ix;

    pgndTxt = PLAYGROUND_SPACE_CHAR + "1 3 5 6 9 1 3 5 7 9 1 3 5 7 9 1" + PLAYGROUND_NEWLINE_CHAR;
    pgndTxt += line.join('') + PLAYGROUND_NEWLINE_CHAR;

	for(i = 0, ix = head; i < PLAYGROUND_HEIGHT; i++) {
		// Decrement first because the head points to next available string to save a new character.
		if(ix==0) ix = (PLAYGROUND_HEIGHT-1);
		else ix--;
        pgndTxt += lineChar + playGround[ix].join('') + lineChar + PLAYGROUND_NEWLINE_CHAR;
	}
    pgndTxt += line.join('') + PLAYGROUND_NEWLINE_CHAR;

    msgBoard.innerHTML = pgndTxt;
}

//////////////////////////////////////////////////////////////////////////////
function FindUniqueCharFromTailAndClear(playGround, key) {

    let i, j, btm = -1, ix, h, len;
	let bFnd = false, bEmpt;
    let k = String.fromCharCode(key);

	if(tail < 0) return bFnd;

	// The head points to next available string to save a new character.
	if(head > tail) len = head - tail;
	else len = PLAYGROUND_HEIGHT - tail + head;

	// Decrements because the head points to next available string to save a new character.
	if(head == 0) h = PLAYGROUND_HEIGHT-1;
	else h = head - 1;



	for(i=0, ix = tail; i < len; i++, ix = (ix+1)%PLAYGROUND_HEIGHT) {
		bEmpt = true;

		for(j=0; j < PLAYGROUND_WIDTH; j++) {
			if(playGround[ix][j] == k) {
				playGround[ix][j] = PLAYGROUND_SPACE_CHAR;
				ht[hIx][0] = key; //int(key);
				ht[hIx][1] = tail;
				ht[hIx][2] = ix;

				if(ix == tail) {
					tail = (tail+1)%PLAYGROUND_HEIGHT;
					if( tail == head ) tail = -1;
				} else if (ix == h) {
					head = h;
				}
				bFnd = true;
				//i = len;
				ht[hIx++][3] = tail;
				//break;
			} else if (playGround[ix][j] != PLAYGROUND_SPACE_CHAR) {
				bEmpt = false;
			}
		}

		if(bEmpt == true){
			if(ix == tail) {
				tail = (tail+1)%PLAYGROUND_HEIGHT;
				if( tail == head ) tail = -1;
			}
		}
	}

	return bFnd;
}

//////////////////////////////////////////////////////////////////////////////
function FindUniqueCharFromHeadAndClear( playGround, key) {
	let i, j, btm = -1, ix;

	for(i=0, ix = head; i < PLAYGROUND_HEIGHT; i++, ix = (ix+1)%PLAYGROUND_HEIGHT) {
		for(j=0; j < PLAYGROUND_WIDTH; j++) {
			if(playGround[ix][j] == key) {
				playGround[ix][j] = ' ';
				if(ix == head) head = (head+1)%PLAYGROUND_HEIGHT;
				else if (ix == tail) {
					if(tail>0) tail--;
					else tail = PLAYGROUND_HEIGHT-1;
				}
				bRemoved = true;
			}
		}
	}
}

//////////////////////////////////////////////////////////////////////////////
function FindUniqueCharAndClear( key ) {
	let i, j, btm = -1; //int i, j, btm = -1;
    let k = String.fromCharCode(key);
	
	for(i=0; i < PLAYGROUND_HEIGHT; i++) {
		for(j=0; j < PLAYGROUND_WIDTH; j++) {
			if(playGround[i][j] == k) {
				playGround[i][j] = PLAYGROUND_SPACE_CHAR;
				bRemoved = true;
			} else if (playGround[i][j] != PLAYGROUND_SPACE_CHAR) {
				if(btm == -1) btm = i;
			}
		}
	}

	return btm;
}

//////////////////////////////////////////////////////////////////////////////
function FindCharAndClear( key ) {
	let i, j, found = 0; //int i, j, found = 0;
    let k = String.fromCharCode(key);

	for(i=0; i < PLAYGROUND_HEIGHT; i++) {
		for(j=0; j < PLAYGROUND_WIDTH; j++) {
			if(playGround[i][j] == k) {
				playGround[i][j] = PLAYGROUND_SPACE_CHAR;
				found++;
			}
		}
	}

	return found;
}

//////////////////////////////////////////////////////////////////////////////
function UpdatePlaygroundByLIFO( playGround, lineChar) {
	let i, ix;
    pgndTxt = PLAYGROUND_SPACE_CHAR + "1 3 5 6 9 1 3 5 7 9 1 3 5 7 9 1" + PLAYGROUND_NEWLINE_CHAR;
    pgndTxt += line.join('') + PLAYGROUND_NEWLINE_CHAR;

    for(i=0, ix=head-1; i < PLAYGROUND_HEIGHT; i++) {
        pgndTxt += lineChar + playGround[ix--].join('') + lineChar + PLAYGROUND_NEWLINE_CHAR;
		if(ix < 0 ) ix = PLAYGROUND_HEIGHT - 1;
	}

    pgndTxt += line.join('') + PLAYGROUND_NEWLINE_CHAR;

    msgBoard.innerHTML = pgndTxt;
}


//////////////////////////////////////////////////////////////////////////////
function ResetPlayGroundBuf() {
    let i, j;

	for(i=0; i < PLAYGROUND_HEIGHT; i++) {
		for(j=0; j < PLAYGROUND_WIDTH; j++) {
			playGround[i][j] = PLAYGROUND_SPACE_CHAR;
		}
		playGround[i][j] = ''; //playGround[i][j] = '\0';
	}
}

//////////////////////////////////////////////////////////////////////////////
function CleanPlayGround( playGround){
	ResetPlayGroundBuf();
    clearMsgBoard();
}

//////////////////////////////////////////////////////////////////////////////
function InitLine( len, lineChar) {
	let i;

	for(i=0; i < len; i++) {
		line[i] = lineChar;
	}
	line[i] = ''; //line[i] = '\0';
}

//////////////////////////////////////////////////////////////////////////////
function GetTimeIntervalFromUser() {

    let it;
	let key;
    
    pgndTxt = "Printing Interval in millisecond:" + PLAYGROUND_NEWLINE_CHAR;
    pgndTxt += PLAYGROUND_TAB_CHAR + "1 - 1000 msec." + PLAYGROUND_NEWLINE_CHAR;
    pgndTxt += PLAYGROUND_TAB_CHAR + "2 - 800 msec." + PLAYGROUND_NEWLINE_CHAR;
    pgndTxt += PLAYGROUND_TAB_CHAR + "3 - 500 msec." + PLAYGROUND_NEWLINE_CHAR;
    pgndTxt += PLAYGROUND_TAB_CHAR + "4 - 300 msec." + PLAYGROUND_NEWLINE_CHAR;
    pgndTxt += PLAYGROUND_TAB_CHAR + "5 - 200 msec." + PLAYGROUND_NEWLINE_CHAR + PLAYGROUND_NEWLINE_CHAR;

    pgndTxt += "Please select one of options above in order to set time interval: "
    msgBoard.innerHTML = pgndTxt;

    instruction = "Printing Interval in millisecond:\n";
    instruction += "    1 - 1000 msec.\n";
    instruction += "    2 - 800 msec.\n";
    instruction += "    3 - 500 msec.\n";
    instruction += "    4 - 300 msec.\n";
    instruction += "    5 - 200 msec.\n\n";
    instruction += "Please select one of options above in order to set time interval: "

    // instruction = "Printing Interval in millisecond:\n";
    // instruction += "    1 - 1000 msec.    2 - 800 msec.    3 - 500 msec.\n";
    // instruction += "    4 - 300 msec.     5 - 200 msec.\n\n";
    // instruction += "Please select one of options above in order to set time interval: "
    
    key = GetCh();

	if(key == '1') it = 1000;
	else if(key == '2') it = 800;
	else if(key == '3') it = 500;
	else if(key == '4') it = 300;
	else if(key == '5') it = 200;

    // pgndTxt = PLAYGROUND_NEWLINE_CHAR + "Time interval: " + it.toString() + " msec."  + PLAYGROUND_NEWLINE_CHAR + PLAYGROUND_NEWLINE_CHAR;
    // msgBoard.innerHTML = pgndTxt;

	return it;

}

//////////////////////////////////////////////////////////////////////////////
function ClearAndPrintPlayGround( playGround) {
    system("cls");
	PrintPlayGround(playGround);
}

//////////////////////////////////////////////////////////////////////////////
function PrintPlayGround( playGround) {
    
    let j;
    for(let i=0; i< PLAYGROUND_HEIGHT; i++) {
         j = i + 1;
         pgndTxt += playGround[i].join('') + j.toString() + PLAYGROUND_NEWLINE_CHAR;
    }

    msgBoard.innerHTML = pgndTxt;
}

//////////////////////////////////////////////////////////////////////////////
function PrintPlayGroundWithOutline( playGround, lineChar) {

    let tb = new Array(PLAYGROUND_BUFFER_SIZE);
	let i, j;

	for(i = 0; i < PLAYGROUND_WIDTH; i++) {
        tb[i] = lineChar
	}
    
    tb[i] = '';
    pgndTxt += lineChar + tb.join('') + lineChar + PLAYGROUND_NEWLINE_CHAR;

    for(i = 0; i < PLAYGROUND_HEIGHT; i++) {
         j = i + 1;
         pgndTxt += lineChar + playGround[i].join('') + lineChar + " " + j.toString() + PLAYGROUND_NEWLINE_CHAR;
    }

    pgndTxt += lineChar + tb.join('') + lineChar + PLAYGROUND_NEWLINE_CHAR;

    msgBoard.innerHTML = pgndTxt;
}

//////////////////////////////////////////////////////////////////////////////
function printSpace( x, y)
{
    let sp = new Array(101);
    let i = 0;

    if(y > 0) {
        y %= 100;
        for( ; i < y; i++) {
            sp[i] = '\n';
        }
        sp[i] = '\0';
        console.log("%s", sp);
    }
    if(x > 0) {
        x %= 100;
        for(i = 0 ; i < x; i++) {
            sp[i] = ' ';
        }
        sp[i] = '\0';
        console.log("%s", sp);
    }
}
