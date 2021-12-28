/*  Author: Laon Maker (Laon Creators' Group)
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