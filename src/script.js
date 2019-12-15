(function() {
    "use strict";
    
    let tooltip = document.body.appendChild(document.createElement("div"));
    let mef = function(e) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", e.target.parentElement.getAttribute("href"));
        xhr.responseType = "document";
        xhr.onload = function() {
            tooltip.innerHTML = xhr.responseXML.querySelector("div#taglist").innerHTML;
            /* display tooltip on top or bottom, according to cursor position */
            tooltip.style.top = `${e.pageY - ((screen.height - e.screenY < tooltip.offsetHeight)? tooltip.offsetHeight : 0)}px`;
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.visibility = "visible";
            //console.log("pageY:" + e.pageY + " screenheight:" + screen.height + " screenY:" + e.screenY + " offset:" + tooltip.offsetHeight);
        };
        xhr.send();
    };
    let mlf = function() {
        tooltip.style.visibility = "hidden";
        tooltip.innerHTML = "Loading...";
    };
    
    /* main*/
    let cssreq = new XMLHttpRequest();
    cssreq.open("GET", GM_getResourceURL("exhcss"));
    cssreq.responseType = "text";
    cssreq.onload = function() {
        GM_addStyle(cssreq.responseText);
        tooltip.id = "info_div";
        if(window.location.toString().indexOf("exhentai.org") >= 0) {
            /* Override CSS vars */
            document.documentElement.style.setProperty("--eh-bgc", "#4f535b");
            document.documentElement.style.setProperty("--eh-tbc", "#f1f1f1");
        }
        if(["m", "p", "t"].includes(document.querySelector("#dms option[selected]").getAttribute("value"))) for(let g of document.querySelectorAll(".glink")) {
            g.addEventListener("mouseenter", mef);
            g.addEventListener("mouseleave", mlf);
        }
    };
    cssreq.send();

    /* WIP
        let opt = document.querySelector("#dms > div").appendChild(document.createElement("div"));
        opt.innerHTML = "&#x1F527;";
        opt.style.cssText = "position:inherit;display:inline-block;font-size:16px;right:25px;bottom:7px;";
    */
})();
