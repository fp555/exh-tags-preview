(function() {
    "use strict";
    
    const $ = {
        legacy: {_s: ".glink", _l(e) {return e.target.parentElement.href}},
        icon: {_s: ".glname > span:last-child", _l(e) {return e.target.parentElement.href}}
    };
    const mode = GM_getValue("exhtp.mode", (() => {GM_setValue("exhtp.mode", "legacy"); "legacy";})());
    const views = GM_getValue("exhtp.views", (() => {GM_setValue("exhtp.views", ["m", "p", "t"]); ["m", "p", "t"];})());
    const tt = document.body.appendChild(document.createElement("div"));
    const xhr = new XMLHttpRequest();
    const mef = (e) => {
        xhr.open("GET", $[mode]._l(e));
        xhr.responseType = "document";
        xhr.onload = () => {
            tt.innerHTML = xhr.responseXML.querySelector("div#taglist").innerHTML;
            //console.log("pageY:" + e.pageY + " screenheight:" + window.innerHeight + " clientY:" + e.clientY + " tooltipY:" + tt.offsetHeight);
            //console.log("pageX:" + e.pageX + " screenwidth:" + window.innerWidth + " screenX:" + e.clientX + " tooltipX:" + tt.offsetWidth);
            tt.style.top = `${(window.innerHeight - e.clientY < tt.offsetHeight)? e.pageY - tt.offsetHeight : e.pageY}px`;
            tt.style.left = `${(window.innerWidth - e.clientX < tt.offsetWidth)? e.pageX - tt.offsetWidth : e.pageX}px`;
            tt.style.visibility = "visible";
        };
        xhr.send();
    };
    const mlf = () => {
        tt.style.visibility = "hidden";
        tt.textContent = "Loading...";
    };
    
    /*main*/
    xhr.open("GET", GM_getResourceURL("exhcss"));
    xhr.responseType = "text";
    xhr.onload = () => {
        GM_addStyle(xhr.responseText);
        tt.id = "info_div";
        tt.classList.add((window.location.toString().indexOf("exhentai.org") >= 0)? "ex" : "eh");
        if(views.includes(document.querySelector("#dms option[selected]").value)) for(let g of document.querySelectorAll(".glink")) {
            g.addEventListener("mouseenter", mef);
            g.addEventListener("mouseleave", mlf);
        }
    };
    xhr.send();
    //tests
    for(let g of document.querySelectorAll(".glname")) {
        g.style.display = "flex";
        let icon = g.appendChild(document.createElement("span"));
        icon.innerHTML = "&#x1F441;&#xFE0F;&#x200D;&#x1F5E8;&#xFE0F;";
        icon.style.cssText = "font-size: 14pt;margin-left:auto;padding-left: 8px;flex: 0 0 23px;cursor: pointer;align-self: center;";
    }
})();
