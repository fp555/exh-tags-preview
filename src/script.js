((rtconfig) => {
    "use strict";
    
     // save defaults on 1st run
    for(const c in rtconfig) GM_getValue("exhtp." + c, false) || GM_setValue("exhtp." + c, rtconfig[c]);
    
	// setup resources
	GM_addStyle(GM_getResourceText("style"));
    const content = JSON.parse(GM_getResourceText("content"));
	
    // options panel setup
    const op = document.createRange().createContextualFragment(content.options);
    op.querySelector(`input[name=mode][value=${rtconfig.mode}]`).checked = true;
    rtconfig.views.split('').forEach(v => op.querySelector(`input[name=views][value=${v}]`).checked = true);
    op.querySelector("input[name=newtab]").checked = rtconfig.newtab;
    const ttopt = op.querySelector("#ttopt");
    ttopt.onchange = e => {
        e.stopPropagation(); // change events will all bubble here, no need to add listeners to all checkboxes
        GM_setValue("exhtp.mode", document.querySelector("input[name=mode]:checked").value);
        GM_setValue("exhtp.views", [...document.querySelectorAll("input[name=views]:checked")].map(v => v.value).join(''));
        GM_setValue("exhtp.newtab", document.querySelector("input[name=newtab]").checked);
    };
    ttopt.classList.add(window.location.href.indexOf("exhentai.org") >= 0? "exstyle" : "ehstyle");
    document.body.appendChild(op);
    
    // open galleries in a new tab
    if(rtconfig.newtab)
        document.querySelectorAll(".gl3m.glname>a,.gl3c.glname>a,.gl1e>div>a,.gl2e>div>a,.gl1t>a,.gl4t.glname>div>a,.gl3t>a").forEach(a =>
            a.setAttribute("target", "_blank"));
			
	// fix exh my uploads
	if(window.location.href.indexOf("/upld/manage") >= 0) {
		document.querySelectorAll("td.gtc5>a:first-child").forEach(a1 => {
			const stats = document.createRange().createContextualFragment(content.stats);
			stats.querySelector("a").href += `gid=${a1.href.match(/\d{7}/g)[0]}&t=${a1.href.match(/(\w{10})/g)[0]}`;
			a1.after(stats);
		});
	}
    else if(rtconfig.views.includes(document.querySelector("#dms option[selected]").value)) {
        let gsel = ".glink";
        
        // setup tooltip div
        document.body.appendChild(document.createRange().createContextualFragment(content.tooltip));
        const tt = document.querySelector("#tagstt");
        tt.classList.add(window.location.href.indexOf("exhentai.org") >= 0? "exstyle" : "ehstyle");
        
        // setup icon
        if(rtconfig.mode === "icon") {
            document.querySelectorAll(".glname").forEach(g => g.appendChild(document.createRange().createContextualFragment(content.icon)));
            gsel = ".glname>svg";
        }
        document.querySelectorAll(gsel).forEach(g => g.onpointerover = e => {
            const evtprom = new Promise(resolve => g.onpointerout = evt => resolve(evt)); // promise resolved by pointerout event
            const tagprom = (async () => {
                const xhr = await window.fetch(e.target.closest("td.gl3m,td.gl3c,div.gl1t").querySelector("a").href);
                if(!xhr.ok) throw new TypeError("error " + xhr.status);
                const response = await xhr.text();
                tt.replaceChildren(document.createRange().createContextualFragment(response).querySelector("div#taglist>table"));
                tt.style.setProperty("--t", `${(window.innerHeight - e.clientY < tt.offsetHeight)? e.pageY - tt.offsetHeight : e.pageY}px`);
                tt.style.setProperty("--l", `${(window.innerWidth - e.clientX < tt.offsetWidth)? e.pageX - tt.offsetWidth : e.pageX}px`);
                tt.style.setProperty("--v", "visible");
            })(); // async functions always return a promise
            Promise.all([evtprom, tagprom]).then(() => { // make sure we have both event and tags before dismissing tooltip
                tt.style.setProperty("--v", "hidden");
                tt.replaceChildren(); // remove everything
            }).catch((error) => console.error(error.message));
        });
    }
})({ // the default values
    mode: GM_getValue("exhtp.mode", "legacy"),
    views: GM_getValue("exhtp.views", "m"),
    newtab: GM_getValue("exhtp.newtab", true)
});
