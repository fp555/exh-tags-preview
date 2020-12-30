(config => {
    "use strict";
    
    const tt = document.body.appendChild(document.createElement("div"));
    const css = GM_getResourceText("exhcss");
    const fjords = window.location.toString().indexOf("exhentai.org") >= 0;
    const curview = document.querySelector("#dms option[selected]").value;
    const options = {
        mode: ["legacy", "icon"],
        views: "mplt", // "e"xtended is not supported
        newtab: [true, false]
    };
    const mef = (e) => {
        GM_xmlhttpRequest({
            url: e.target.closest("td.gl3m,td.gl3c,div.gl1t").querySelector("a").href,
            method: "GET",
            responseType: "document",
            anonymous: false,
            onload: (xhr) => {
                tt.innerHTML = xhr.response.querySelector("div#taglist").innerHTML;
                tt.style.top = `${(window.innerHeight - e.clientY < tt.offsetHeight)? e.pageY - tt.offsetHeight : e.pageY}px`;
                tt.style.left = `${(window.innerWidth - e.clientX < tt.offsetWidth)? e.pageX - tt.offsetWidth : e.pageX}px`;
                tt.style.visibility = "visible";
            }
        });
    };
    const mlf = () => {
        tt.style.visibility = "hidden";
        tt.textContent = "Loading...";
    };
    
    /*main*/
    for(const c in config) {
        GM_getValue("exhtp." + c, false) || GM_setValue("exhtp." + c, config[c]);
        if(!options[c].includes(config[c])) {
            console.error("Unrecognized config " + config[c] + " for " + c + ". Clearing from storage");
            GM_deleteValue("exhtp." + c);
            return;
        }
    }
    if(config.newtab) {
        const sel = ({
            m: ".gl3m.glname>a",
            p: ".gl3m.glname>a",
            l: ".gl3c.glname>a",
            e: ".gl1e>div>a,.gl2e>div>a",
            t: ".gl1t>a,.gl4t.glname>div>a,.gl3t>a"
        })[curview];
        for(const gl of document.body.querySelectorAll(sel)) gl.setAttribute("target", "_blank");
    }
    if(config.views.includes(curview)) {
        GM_addStyle(css);
        tt.id = "info_div";
        tt.classList.add(fjords? "ex" : "eh");
        if(config.mode === "icon") for(let g of document.querySelectorAll(".glname")) g.appendChild(document.createElement("span")).innerHTML = "&#x1F441;&#xFE0F;&#x200D;&#x1F5E8;&#xFE0F;";
        for(let g of document.querySelectorAll((config.mode === "icon")? ".glname > span:last-child" : ".glink")) {
            g.addEventListener("mouseenter", mef);
            g.addEventListener("mouseleave", mlf);
        }
    }
})({mode: GM_getValue("exhtp.mode", "legacy"), views: GM_getValue("exhtp.views", "mplt"), newtab: GM_getValue("exhtp.newtab", true)});