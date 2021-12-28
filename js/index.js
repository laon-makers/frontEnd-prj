/*  Copyright (C) 2024 Gi Tae Cho laon.makers@yahoo.com
    This file is a part of the Smart Home WiFi Web Server project.
    This project can not be copied and/or distributed without the express permission of Gi Tae Cho laon.makers@yahoo.com.

    Author: G.T. Cho (a Laon maker/artist in Laon Creators' Group)
    Version: 1.0
    Last update: Dec. 27, 2021
*/
function gotoToStatus(hfoot) {
    let f = document.getElementById('stPw').value.trim();
    let jp = document.getElementById('toStatus');
    
    //jp.prop('href', f);
    if (f[0] == '.' && (f.search('_') == (f.length - 1))) {
      let arr = [];
      let hf = hfoot.split(':');

      for( let i = 1; i < (f.length - 1); i++) {
        let hex = Number(f.charCodeAt(i)).toString(16).toUpperCase();
        arr.push(hex);
      }
      //arr.join('');
      f = hf[0] + arr.toString().replaceAll(',','') + hf[1] + '.htm';
      jp.setAttribute("href", f + "?valid=true");
      jp.hidden = false;
      document.getElementById('msg').textContent = "";
    } else {
      document.getElementById('msg').textContent = "Invalid !";
    }
  }