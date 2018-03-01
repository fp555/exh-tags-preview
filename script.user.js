// ==UserScript==
// @name        E(x)Hentai Tags Preview
// @author      fp555
// @namespace   exhtp
// @version     1.2
// @description Adds a preview of gallery tags on hover.
// @include     https://exhentai.org/
// @include     https://exhentai.org/?*
// @include     https://exhentai.org/tag/*
// @include     https://exhentai.org/favorites.php
// @include     https://exhentai.org/favorites.php?*
// @include     https://exhentai.org/uploader/*
// @include     https://e-hentai.org/
// @include     https://e-hentai.org/?*
// @include     https://e-hentai.org/tag/*
// @include     https://e-hentai.org/favorites.php
// @include     https://e-hentai.org/favorites.php?*
// @include     https://e-hentai.org/uploader/*
// @grant       none
// @updateURL   https://raw.githubusercontent.com/fp555/exh-tags-preview/master/script.meta.js
// @downloadURL https://raw.githubusercontent.com/fp555/exh-tags-preview/master/script.user.js
// @homepage    https://github.com/fp555/exh-tags-preview
// ==/UserScript==

(function() {
  'use strict';
  var tooltip = document.createElement('div');
  tooltip.innerHTML = 'Loading...';
  tooltip.id = 'info_div';
  tooltip.style.cssText = 'visibility:hidden;position:absolute;padding:5px;z-index:9;max-width:400px;font-size:9pt';
  let isex = window.location.toString().indexOf('exhentai.org') >= 0;
  tooltip.style.backgroundColor = isex ? '#4f535b' : '#edebdf';
  tooltip.style.color = isex ? '#f1f1f1' : '#5c0d11';
  tooltip.style.border = '1px solid ' + (isex ? '#f1f1f1' : '#5c0d11');
  document.body.insertAdjacentElement('beforeend', tooltip);
  for(let i of document.querySelectorAll('.id3 a img')) i.removeAttribute('title'); // remove thumbnails titles
  var glist = document.querySelectorAll('.it5,.id3');
  var hovering = false; // fix mouseleave timing bug
  for(var g of glist) { 
    g.addEventListener('mouseenter', function(e) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', e.target.firstElementChild.getAttribute('href'));
      xhr.responseType = 'document';
      xhr.onload = function() {
        if(xhr.readyState === xhr.DONE && xhr.status === 200) {
          tooltip.innerHTML = xhr.responseXML.querySelector('div#taglist').innerHTML;
          // display tooltip on top or bottom, according to cursor position
          tooltip.style.top = '' + (e.pageY - ((screen.height - e.screenY < tooltip.offsetHeight)? tooltip.offsetHeight : 0)) + 'px';
          tooltip.style.left = '' + (e.pageX + 10) + 'px';
          if(hovering) tooltip.style.visibility = 'visible';
        }
      };
      xhr.send();
      hovering = true;
    });
    g.addEventListener('mouseleave', function() {
      hovering = false;
      tooltip.style.visibility = 'hidden';
      tooltip.innerHTML = 'Loading...';
    });
  }
})();
