((config) => {
    "use strict";
    
    const css = GM_getResourceText("style");
    const content = document.createRange().createContextualFragment(GM_getResourceText("content"));
    const curview = document.querySelector("#dms option[selected]").value;
    
    for(const c in config) { // check for valid storage values
        const options = {
            mode: ["legacy","icon"],
            views: ["m","p","l","t"], // "e"xtended is not supported
            newtab: [true,false]
        };
        GM_getValue("exhtp." + c, false) || GM_setValue("exhtp." + c, config[c]);
        const cval = Array.isArray(config[c])? config[c] : [config[c]];
        if(!cval.every((x) => (options[c]).includes(x))) {
            console.error("Unrecognized option " + x + " for " + c + ". Clearing from storage");
            GM_deleteValue("exhtp." + c);
            return;
        }
    }
    if(config.newtab) { // open galleries in a new tab
        const sel = ({
            m: ".gl3m.glname>a",
            p: ".gl3m.glname>a",
            l: ".gl3c.glname>a",
            e: ".gl1e>div>a,.gl2e>div>a",
            t: ".gl1t>a,.gl4t.glname>div>a,.gl3t>a"
        })[curview];
        document.body.querySelectorAll(sel).forEach((gl) => gl.setAttribute("target", "_blank"));
    }
    
    /* main */
    if(config.views.includes(curview)) {
        GM_addStyle(css);
        document.body.appendChild(content);
        const tt = document.querySelector("#tagstt");
        const ttopt = document.forms.ttopt;
        [tt, ttopt].forEach((el) => el.classList.add(window.location.href.indexOf("exhentai.org") >= 0 ? "exstyle" : "ehstyle"));
        if(config.mode === "icon") document.querySelectorAll(".glname").forEach((i) => i.appendChild(document.createElement("span")).innerHTML = "&#x1F441;&#xFE0F;&#x200D;&#x1F5E8;&#xFE0F;");
        document.querySelectorAll(config.mode === "icon"? ".glname>span:last-child" : ".glink").forEach((g) => {
            g.addEventListener("mouseenter", (e) => {
                GM_xmlhttpRequest({
                    url: e.currentTarget.closest("td.gl3m,td.gl3c,div.gl1t").querySelector("a").href,
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
            });
            g.addEventListener("mouseleave", () => {
                tt.style.visibility = "hidden";
                tt.textContent = "Loading...";
            });
        });
    }
})(Object.freeze({
    mode: GM_getValue("exhtp.mode", "legacy"),
    views: GM_getValue("exhtp.views", ["m"]),
    newtab: GM_getValue("exhtp.newtab", true)
}));
