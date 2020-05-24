((mode, views) => {
    "use strict";
    
    const tt = document.body.appendChild(document.createElement("div"));
    const xhr = new XMLHttpRequest();
    const mef = (e) => {
        xhr.open("GET", e.target.closest("td.gl3m,td.gl3c,div.gl1t").querySelector("a").href);
        xhr.responseType = "document";
        xhr.onload = () => {
            tt.innerHTML = xhr.responseXML.querySelector("div#taglist").innerHTML;
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
    GM_getValue("exhtp.mode", false) || GM_setValue("exhtp.mode", mode);
    GM_getValue("exhtp.views", false) || GM_setValue("exhtp.views", views);
    if(views.includes(document.querySelector("#dms option[selected]").value) && ["legacy", "icon"].includes(mode)) {
        xhr.open("GET", GM_getResourceURL("exhcss"));
        xhr.responseType = "text";
        xhr.onload = () => {
            GM_addStyle(xhr.responseText);
            tt.id = "info_div";
            tt.classList.add((window.location.toString().indexOf("exhentai.org") >= 0)? "ex" : "eh");
            if(mode === "icon") for(let g of document.querySelectorAll(".glname")) g.appendChild(document.createElement("span")).innerHTML = "&#x1F441;&#xFE0F;&#x200D;&#x1F5E8;&#xFE0F;";
            for(let g of document.querySelectorAll((mode === "icon")? ".glname > span:last-child" : ".glink")) {
                g.addEventListener("mouseenter", mef);
                g.addEventListener("mouseleave", mlf);
            }
        };
        xhr.send();
    }
})(GM_getValue("exhtp.mode", "legacy"), GM_getValue("exhtp.views", ["m", "p", "l", "t"]));
