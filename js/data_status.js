/*  Copyright (C) 2024 Gi Tae Cho laon.makers@yahoo.com
    This file is a part of the Smart Home WiFi Web Server project.
    This project can not be copied and/or distributed without the express permission of Gi Tae Cho laon.makers@yahoo.com.

    Author: G.T. Cho (a Laon maker/artist in Laon Creators' Group)
    Version: 1.0
    Last update: Dec. 27, 2021
*/
const MAX_ROW_PER_PAGE = 10;
const NUM_COLUMN = 10;
let pageIx = 0, tblRowIx = 0, cnt = 0;
let pageStart = [];
let rt = [];
let currentRtIx = 2;
let bufRowIx = 0;
let rTmp;        
let param = location.search.substring(1).split("&");
temp = param[0].split("=");

if( temp.length > 1 ) {        
    if( temp[0] == 'valid' ) {

        let tbl = document.getElementById('statusTbl');
        let nEntry = dateTimeLog.length;
        let i = 0, j = 0, k = 0, l = 0;
        
        for( i = 0; i < refRt.length; i +=1 ) {
            rTmp = refRt[i].split('.');
            k = i*3;
            for( j = 0; j < 2; j +=1 ) {
                rt[k + j] = nEntry - parseInt(rTmp[j]) + 1;
            }
            l = rt[k];
            rt[k] = rt[k + 1];
            rt[k + 1] = l;
            
            if(rt[k] < 1) {
                rt[k] = 1;
            }
            rt[k + j] = parseFloat(rTmp[j]);
        }

        if( refRt.length > 1 ) {
            let i1 = 0, i2 = rt.length-3;
            l = Math.floor(rt.length/6);

            for( i = 0; i < l; i +=1 ) {
                for( j = 0; j < 3; j++) {
                    k = rt[i1 + j];
                    rt[i1 + j] = rt[i2 + j];
                    rt[i2 + j] = k;
                }
                i1 += 3;
                i2 -= 3;
            }
        }

        for( i = 0; i < dateTimeLog.length; i++) {
            let td;
            let txt;
            bufRowIx += 1;

            if(dateTimeLog[i][0] == 0 ) {
                continue;
            } else if(dateTimeLog[i][0] > 0 ) {
                if( (cnt%10) == 0 ) {
                    pageStart[pageIx] = i;
                    pageIx += 1;
                }                        

                if( cnt < MAX_ROW_PER_PAGE ) {

                    let tr = document.createElement('tr');
                    if( (cnt%2) == 1 ) {
                        tr.style = 'background-color:lightyellow;';
                    }

                    currentRtIx = getRateIndex(bufRowIx);

                    for( j = 0; j < NUM_COLUMN; j++) {
                        td = document.createElement('td');
                        if(j == 0) {
                            txt = (cnt + 1).toString();

                        } else if(j == 5) {
                            let v1 = dateTimeLog[i][j-1].split(':');
                            let v2 = parseInt(v1[0]) + (parseInt(v1[1])/60);
                            let k = dateTimeLog[i][j];
                            if (k == 0) {
                                k = Math.ceil(rt[currentRtIx]* 10);
                            } else {
                                if (k > 0) { // to handle carry over hours.
                                    v2 += k/60;
                                }
                                k = Math.ceil(((rt[currentRtIx]*dateTimeLog[i][j+3])/v2) * 10);                                        
                            }
                            txt =  (k/10) + "/h";
                        } else if (j == 6) {
                            txt = dateTimeLog[i][j] * 10;
                        } else if (j == 7) {
                            txt = Math.round(dateTimeLog[i][j] * rt[currentRtIx]);
                        } else {
                            txt = dateTimeLog[i][j];
                        }
                        txt = document.createTextNode(txt);
                        td.appendChild(txt);
                        tr.appendChild(td);
                    }
                    tbl.appendChild(tr);

                    cnt += 1;
                    if( cnt >= MAX_ROW_PER_PAGE ) {
                        document.getElementById('btnPrev').hidden = false;
                        document.getElementById('btnNext').hidden = false;
                        //break;
                    }
                } else {
                    cnt += 1;
                }
                
            } else {
                break;
            }
        }
    }
}

pageIx = 0;

/////////////////////////////////
function getRateIndex(_ix) {
    let i = 0;
    let l = dateTimeLog.length + 1;
    
    if( _ix >= rt[currentRtIx-2] ) {
        if( _ix <= rt[currentRtIx-1] ) {
            return currentRtIx;
        }
    }

    for( i = 0; i < rt.length; i += 3) {
        if( _ix >= rt[i]) {
            if( _ix <= rt[i+1]) {
                currentRtIx = i + 2;
                break;
            }
        }
    }

    if( i >= rt.length) {
        alert("Index Not Found!");
    }
    
    return currentRtIx;
}


/////////////////////////////////
function populateTable(bForward) {            
    let i = 0;
    
    if( bForward == true ) {
        pageIx += 1;
        if( pageIx >= pageStart.length) {
            pageIx -= 1;
            return;
        }
    } else {
        if(pageIx == 0) {
            return;
        } else {
            pageIx--;
        }                
    }
    cnt = 0;
    tblRowIx = 1;
    bufRowIx = pageStart[pageIx];
    let tr = document.getElementsByTagName('tr');

    for( i = pageStart[pageIx]; i < dateTimeLog.length; i++) {
        let td;
        let txt;

        bufRowIx += 1;
        if(dateTimeLog[i][0] == 0 ) {
            //tblRowIx += 1;
            continue;
        } else if(dateTimeLog[i][0] > 0 ) {
            
            currentRtIx = getRateIndex(bufRowIx);

            for( let j = 0; j < NUM_COLUMN; j++) {       
                switch(j) {                 
                case 0:
                    txt = (pageIx * MAX_ROW_PER_PAGE + tblRowIx).toString();
                    break;                            
                case 5:
                    let v1 = dateTimeLog[i][j-1].split(':');
                    let v2 = parseInt(v1[0]) + (parseInt(v1[1])/60);
                    let k = dateTimeLog[i][j];
                    if (k == 0) {
                        k = Math.ceil(rt[currentRtIx]* 10);
                    } else {
                        if (k > 0) { // to handle carry over hours.
                            v2 += k/60;
                        }
                        k = Math.ceil(((rt[currentRtIx]*dateTimeLog[i][j+3])/v2) * 10);                                        
                    }
                    txt =  (k/10) + "/h";
                    //txt = "$" + Math.ceil(rt[currentRtIx]/v2) +  "/h";
                    break;
                case 6:
                    txt = dateTimeLog[i][j] * 10;
                    break;
                case 7:
                    txt = Math.round(dateTimeLog[i][j] * rt[currentRtIx]);
                    break;
                default:
                    txt = dateTimeLog[i][j];
                    break;
                }
                //txt = document.createTextNode(txt);
                tr[tblRowIx].cells[j].textContent = txt;
            }
            tblRowIx += 1;
            cnt += 1;
            if( cnt >= MAX_ROW_PER_PAGE ) {
                break;
            }
        } else {
            break;
        }
    }

    if( tblRowIx <= MAX_ROW_PER_PAGE ) {
        for( i = tblRowIx; i <= MAX_ROW_PER_PAGE; i++ ) {
            for( let j = 0; j < NUM_COLUMN; j++) { 
                tr[i].cells[j].textContent = '';
            }
        }
    }
}