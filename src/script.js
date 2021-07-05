((config) => {
    "use strict";
    
    const css = GM_getResourceText("style");
    const content = document.createRange().createContextualFragment(GM_getResourceText("content"));
    const curview = document.querySelector("#dms option[selected]").value;
    const options = {
        mode: ["legacy","icon"],
        views: ["m","p","l","t"], // "e"xtended is not supported
        newtab: [true,false]
    };
    
    for(const c in config) { // check for valid storage values
        GM_getValue("exhtp." + c, false) || GM_setValue("exhtp." + c, config[c]); // set defaults on 1st run
        (Array.isArray(config[c])? config[c] : [config[c]]).forEach((x) => {
            if(options[c].includes(x)) content.querySelector(`input[name=${c}][value=${x}]`).checked = true; // init options panel
            else {
                console.error("Unrecognized option " + x + " for " + c + ". Clearing from storage");
                GM_deleteValue("exhtp." + c);
                return;
            }
        });
    }
    content.querySelector("form").onchange = (e) => { // option panel wiring
        e.stopPropagation(); // change events will all bubble here, no need to add listeners to all checkboxes
        GM_setValue("exhtp.mode", document.querySelector("input[name=mode]:checked").value);
        GM_setValue("exhtp.views", [...document.querySelectorAll("input[name=views]:checked")].map((v) => v.value));
        GM_setValue("exhtp.newtab", document.querySelector("input[name=newtab]").checked);
    };
    
    /* main */
    if(config.views.includes(curview)) {
        GM_addStyle(css);
        const tt = content.querySelector("#tagstt");
        const ttopt = content.querySelector("#ttopt");
        [tt, ttopt].forEach((el) => el.classList.add(window.location.href.indexOf("exhentai.org") >= 0? "exstyle" : "ehstyle"));
        document.body.appendChild(content); // since it is now empty we can reuse this documentfragment
        content.replaceChildren(...document.querySelectorAll(".itg>*")); // temp moving page elements outside DOM for performance
        if(config.newtab) {
            const sel = ({
                m: ".gl3m.glname>a",
                p: ".gl3m.glname>a",
                l: ".gl3c.glname>a",
                e: ".gl1e>div>a,.gl2e>div>a",
                t: ".gl1t>a,.gl4t.glname>div>a,.gl3t>a"
            })[curview];
            content.querySelectorAll(sel).forEach((gl) => gl.setAttribute("target", "_blank")); // open galleries in a new tab
        }
        if(config.mode === "icon") content.querySelectorAll(".glname").forEach((i) => i.appendChild(document.createElement("span")).innerHTML = "&#x1F441;&#xFE0F;&#x200D;&#x1F5E8;&#xFE0F;");
        content.querySelectorAll(config.mode === "icon"? ".glname>span:last-child" : ".glink").forEach((g) => g.onpointerover = (e) => {
            const evtprom = new Promise((resolve) => g.onpointerout = (evt) => resolve(evt)); // promise resolved by pointerout event
            const tagprom = (async () => {
                const xhr = await window.fetch(e.target.closest("td.gl3m,td.gl3c,div.gl1t").querySelector("a").href);
                if(!xhr.ok) throw new TypeError("error " + xhr.status);
                const response = await xhr.text();
                tt.replaceChildren(document.createRange().createContextualFragment(response).querySelector("div#taglist>table"));
                tt.style.setProperty("--t", `${(window.innerHeight - e.clientY < tt.offsetHeight)? e.pageY - tt.offsetHeight : e.pageY}px`);
                tt.style.setProperty("--l", `${(window.innerWidth - e.clientX < tt.offsetWidth)? e.pageX - tt.offsetWidth : e.pageX}px`);
                tt.style.setProperty("--v", "visible");
            })(); // async functions always return a promise
            Promise.all([evtprom, tagprom]).then((_) => { // make sure we have both event and tags before dismissing tooltip
                tt.style.setProperty("--v", "hidden");
                tt.replaceChildren(); // remove everything
            }).catch((error) => console.error(error.message));
        });
        document.querySelector(".itg").appendChild(content); // restore in one shot all page elements after our modifications
    }
})(Object.freeze({ // the default values
    mode: GM_getValue("exhtp.mode", "legacy"),
    views: GM_getValue("exhtp.views", ["m"]),
    newtab: GM_getValue("exhtp.newtab", true)
}));
