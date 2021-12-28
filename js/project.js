/*  Copyright (C) 2024 Gi Tae Cho laon.makers@yahoo.com
    This file is a part of the Smart Home WiFi Web Server project.
    This project can not be copied and/or distributed without the express permission of Gi Tae Cho laon.makers@yahoo.com.

    Author: G.T. Cho (a Laon maker/artist in Laon Creators' Group)
    Version: 1.0
    Last update: Jan. 17, 2022
*/
var parentTapMenu;
var tapItemIdx;
var dictionary = {
    "(\/\/\.+)" : "<cmt>\$1</cmt>",
    "(\\s|\\(|\\,)function(\\s|\\))" : "\$1<kwd>function</kwd>\$2", // \\s는 공백문자. \$1 은 앞선 첫번째 () 안에 있는 패턴과 일치한 결과 값. \$2 는 두번째 () 안에 있는 패턴과 일치한 결과 값이다.
    "(\\s|\\(|\\,)let(\\s|\\))" : "\$1<kwd>let</kwd>\$2",
    "(\\s|\\(|\\,)const(\\s|\\))" : "\$1<kwd>const</kwd>\$2",
    "(\\s|\\(|\\,)class(\\s|\\))" : "\$1<kwd>class</kwd>\$2",    
    "([^\/][^\/]\\s*)struct(\\s)" : "\$1<kwd>struct</kwd>\$2",
    "(\\s)typedef(\\s)" : "\$1<kwd>typedef</kwd>\$2",
    "([\\s]*)forEach(\\s*)" : "\$1<kwd>forEach</kwd>\$2",
    "([\\s]*)static(\\s*)" : "\$1<kwd>static</kwd>\$2",
    "([\\s]*)do([\\s]*\\{)" : "\$1<kwd>do</kwd>\$2",
    "([\\s]*)while([\\s]*\\()" : "\$1<kwd>while</kwd>\$2",
    "([\\s]*)for([\\s]*\\()" : "\$1<kwd>for</kwd>\$2",
    "([\\s]*)switch([\\s]*\\()" : "\$1<kwd>switch</kwd>\$2",
    "([\\s]*)case(\\s*.+\\:)" : "\$1<kwd>case</kwd>\$2",
    "([\\s]*)default([\\s]*\\:)" : "\$1<kwd>default</kwd>\$2",
    "([\\s]*)break([\\s]*\\;)" : "\$1<kwd>break</kwd>\$2",
    "([\\s]*)continue([\\s]*\\;)" : "\$1<kwd>continue</kwd>\$2",
    "([\\s]*)if([\\s]*\\()" : "\$1<kwd>if</kwd>\$2",
    "(\\s|\\})else(\\s|\\(|\\{)" : "\$1<kwd>else</kwd>\$2",
    "([\\s]*)return([\\s]*)(\\(|.+)\\;" : "\$1<kwd>return</kwd>\$2\$3;",
    "(\\s|\\=|\\(|\\{)true(\\;|\\)|\\s|\\,|\\})" : "\$1<kwd>true</kwd>\$2",
    "(\\s|\\=|\\(|\\{)false(\\;|\\)|\\s|\\,|\\})" : "\$1<kwd>false</kwd>\$2"        
};

var dic_pseudo = {
    "(\/\/\.+)" : "<cmt>\$1</cmt>",
    "(\\s|\\(|\\,)IF(\\s|\\))" : "\$1<kwd>IF</kwd>\$2", // \\s는 공백문자. \$1 은 앞선 첫번째 () 안에 있는 패턴과 일치한 결과 값. \$2 는 두번째 () 안에 있는 패턴과 일치한 결과 값이다.
    "(\\s|\\(|\\,)Yes(:\\s|\\))" : "\$1<pgreen>Yes</pgreen>\$2",
    "(\\s|\\(|\\,)No(:\\s|\\))" : "\$1<pred>No</pred>\$2"        
};

// 3 variables for slide show.
var slideShowInterval = 2000;
var slideShowTimer;
var slideShowContainer;

$(function(){
    var class_closed = 'closed'; //닫기위한 class를 정의
    $('.accordion').each(function(){
        var dl = $(this);
        var allDt = dl.find('dt');
        var allDd = dl.find('dd');        

        function closeAll(){
            allDt.addClass(class_closed);
            allDd.addClass(class_closed);
        }
        
        function open(dt, dd){
            dt.removeClass(class_closed);
            dd.removeClass(class_closed);
        }
        
        closeAll();
        
        allDt.click(function(){
            var dt = $(this); 
            var dd = dt.next();

            closeAll();
            
            dd.find('.cFormat').each(function() {
                var cf = $(this);
                var txt = cf.text();
                for( var ptrn in dictionary) {
                    txt = txt.replace(new RegExp(ptrn, "igm"), dictionary[ptrn]);
                }
                cf.text("");
                cf.append(txt);
            });
            
            open(dt, dd);
        });            
    });
});



function goBackToHtm(id, file) {
    $('#goBack'+id).prop('href', file + "?tab=" + parentTapMenu + "&item=" + tapItemIdx);
}

function goToUrl(myid, url) {
    /* 해당 htm file의 표시 하고자 하는 부분에 <span id="myId"></span>와 같이 작성해야 한다.*/
    document.getElementById(myid).innerHTML = "<iframe width='100%' height='100%' src=" + url + " ></iframe>";
}

function formatCSouce(divId){
    var pre = $('#'+divId);
    
    var txt = pre.text();
    for( var ptrn in dictionary) {
        txt = txt.replace(new RegExp(ptrn, "igm"), dictionary[ptrn]);
    }
    pre.text("");
    pre.append(txt);
    //alert(txt);
}

function formatCSouceWithClass(divClass){
   
    $('div.'+divClass).each(function() {
        var pre = $(this);
        
        var txt = pre.text();
        for( var ptrn in dictionary) {
            txt = txt.replace(new RegExp(ptrn, "igm"), dictionary[ptrn]);
        }
        pre.text("");
        pre.append(txt);
    });
    //alert(txt);
}

function formatPseudoCode(divId){
    var pre = $('#'+divId);
    
    var txt = pre.text();
    for( var ptrn in dic_pseudo) {
        txt = txt.replace(new RegExp(ptrn, "igm"), dic_pseudo[ptrn]);
    }
    pre.text("");
    pre.append(txt);
    //alert(txt);
}

function slideShowSwitchImg(){
    var imgs = slideShowContainer.find('img');
    var first = imgs.eq(0);
	var second = imgs.eq(1);
    first.fadeOut().appendTo(slideShowContainer);
    second.fadeIn();
}
function slideShowStartTimer(){    
    slideShowTimer = setInterval(slideShowSwitchImg,slideShowInterval);
}

function slideShowStopTimer(){
    clearInterval(slideShowTimer);    
}

function showResult(divId){
    
    var rlt = $('#'+divId);
    var st = document.documentElement.scrollTop;
    if(rlt.attr('hidden')) rlt.attr('hidden', false);
    else rlt.attr('hidden', true);

    setTimeout(function () {
        window.scrollTo(0, st+200);
    },2);
}
