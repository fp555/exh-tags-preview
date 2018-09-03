// ==UserScript==
// @name        E(x)Hentai Tags Preview
// @author      fp555
// @namespace   exhtp
// @version     1.3.1
// @description Adds a preview of gallery tags on hover.
// @include     https://exhentai.org/
// @include     https://exhentai.org/?*
// @include     https://exhentai.org/artistcg*
// @include     https://exhentai.org/asianporn*
// @include     https://exhentai.org/cosplay*
// @include     https://exhentai.org/doujinshi*
// @include     https://exhentai.org/favorites.php*
// @include     https://exhentai.org/gamecg*
// @include     https://exhentai.org/imageset*
// @include     https://exhentai.org/manga*
// @include     https://exhentai.org/misc*
// @include     https://exhentai.org/non-h*
// @include     https://exhentai.org/tag/*
// @include     https://exhentai.org/uploader/*
// @include     https://exhentai.org/western*
// @include     https://e-hentai.org/
// @include     https://e-hentai.org/?*
// @include     https://e-hentai.org/artistcg*
// @include     https://e-hentai.org/asianporn*
// @include     https://e-hentai.org/cosplay*
// @include     https://e-hentai.org/doujinshi*
// @include     https://e-hentai.org/favorites.php*
// @include     https://e-hentai.org/gamecg*
// @include     https://e-hentai.org/imageset*
// @include     https://e-hentai.org/manga*
// @include     https://e-hentai.org/misc*
// @include     https://e-hentai.org/non-h*
// @include     https://e-hentai.org/tag/*
// @include     https://e-hentai.org/uploader/*
// @include     https://e-hentai.org/western*
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @resource    exhcss https://raw.githubusercontent.com/fp555/exh-tags-preview/master/exh.css
// @icon        https://exhentai.org/favicon.ico
// @updateURL   https://raw.githubusercontent.com/fp555/exh-tags-preview/master/script.meta.js
// @downloadURL https://raw.githubusercontent.com/fp555/exh-tags-preview/master/script.user.js
// @homepage    https://github.com/fp555/exh-tags-preview
// ==/UserScript==

(function() {
    "use strict";
    
    let hovering = false;
    let tooltip = document.createElement("div");
    let mef = function(e) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', e.target.firstElementChild.getAttribute('href'));
        xhr.responseType = 'document';
        xhr.onload = function() {
            if(xhr.readyState === xhr.DONE && xhr.status === 200) {
                tooltip.innerHTML = xhr.responseXML.querySelector('div#taglist').innerHTML;
                /* display tooltip on top or bottom, according to cursor position */
                console.log("pageY:" + e.pageY + " screenheight:" + screen.height + " screenY:" + e.screenY + " offset:" + tooltip.offsetHeight);
                tooltip.style.top = '' + (e.pageY - ((screen.height - e.screenY < tooltip.offsetHeight)? tooltip.offsetHeight : 0)) + 'px';
                tooltip.style.left = '' + (e.pageX + 10) + 'px';
                if(hovering) tooltip.style.visibility = 'visible';
            }
        };
        xhr.send();
        hovering = true;
    };
    let mlf = function() {
        hovering = false;
        tooltip.style.visibility = 'hidden';
        tooltip.innerHTML = 'Loading...';
    };
    
    /* main */
    GM_addStyle(GM_getResourceText("exhcss")).then(function() {
        tooltip.id = "info_div";
        if(window.location.toString().indexOf("exhentai.org") >= 0) {
            /* Override CSS vars */
            document.documentElement.style.setProperty("--eh-bgc", "#4f535b");
            document.documentElement.style.setProperty("--eh-tbc", "#f1f1f1");
        }
        document.body.insertAdjacentElement('beforeend', tooltip);
        for(let i of document.querySelectorAll('.id3 a img')) i.removeAttribute('title'); /* remove thumbnails titles */
        for(let g of document.querySelectorAll('.it5, .id3')) {
            g.addEventListener('mouseenter', mef);
            g.addEventListener('mouseleave', mlf);
        }
    });
})();
