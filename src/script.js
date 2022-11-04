((args) => {
    "use strict";
    
     // save defaults on 1st run
    for(const c in args) GM_getValue("exhtp." + c, false) || GM_setValue("exhtp." + c, args[c]);
    
    // setup resources and CSS
    const content = JSON.parse(GM_getResourceText("content"));
    GM_addStyle(content.style);
	
    // options panel setup
    const op = document.createRange().createContextualFragment(content.options);
    op.querySelector(`input[name=mode][value=${args.mode}]`).checked = true;
    args.views.split('').forEach(v => op.querySelector(`input[name=views][value=${v}]`).checked = true);
    op.querySelector("input[name=newtab]").checked = args.newtab;
    const ttopt = op.querySelector("#ttopt");
    ttopt.onchange = e => {
        e.stopPropagation(); // change events will all bubble here, no need to add listeners to all checkboxes
        GM_setValue("exhtp.mode", document.querySelector("input[name=mode]:checked").value);
        GM_setValue("exhtp.views", [...document.querySelectorAll("input[name=views]:checked")].map(v => v.value).join(''));
        GM_setValue("exhtp.newtab", document.querySelector("input[name=newtab]").checked);
    };
    ttopt.classList.add(window.location.hostname === "exhentai.org"? "exstyle" : "ehstyle");
    document.body.appendChild(op);

    switch(window.location.pathname) {
	case "/upld/manage": // fix exh my uploads
		document.querySelectorAll("td.gtc5>a:first-child").forEach(a1 => {
			const stats = document.createRange().createContextualFragment(content.stats);
			const glink = a1.pathname.split('/');
			stats.querySelector("a").search = `?gid=${glink[2]}&t=${glink[3]}`;
			a1.after(stats);
		});
		break;
        
	case "/upld/managegallery": // fix exh stats link
		document.querySelector("a[href*='stats.php']").hostname = "e-hentai.org";
		break;
        
	default: // setup tooltip div
		if(args.views.includes(document.querySelector(".searchnav > div:last-child > select").value)) {
			let gsel = ".glink";
			document.body.appendChild(document.createRange().createContextualFragment(content.tooltip));
			const tt = document.querySelector("#tagstt");
			tt.classList.add(window.location.hostname === "exhentai.org"? "exstyle" : "ehstyle");

			if(args.mode === "icon") { // setup icon
				document.querySelectorAll(".glname").forEach(g => g.appendChild(document.createRange().createContextualFragment(content.icon)));
				gsel = ".glname>svg";
			}
			document.querySelectorAll(gsel).forEach(g => g.onpointerover = e => {
				const eoutprom = new Promise(resolve => g.onpointerout = eout => resolve(eout));
				const tagprom = async () => {
					const xhr = await window.fetch(e.target.closest("td.gl3m,td.gl3c,div.gl1t").querySelector("a").href);
					if(!xhr.ok) throw new TypeError("error " + xhr.status);
					const response = await xhr.text();
					tt.replaceChildren(document.createRange().createContextualFragment(response).querySelector("div#taglist>table"));
					tt.style.setProperty("--t", `${(window.innerHeight - e.clientY < tt.offsetHeight)? e.pageY - tt.offsetHeight : e.pageY}px`);
					tt.style.setProperty("--l", `${(window.innerWidth - e.clientX < tt.offsetWidth)? e.pageX - tt.offsetWidth : e.pageX}px`);
					tt.style.setProperty("--v", "visible");
				}; // async functions always return a promise
				Promise.all([eoutprom, tagprom()]).then(() => { // make sure we have both event and tags before dismissing tooltip
					tt.style.setProperty("--v", "hidden");
					tt.replaceChildren(); // remove everything
				}).catch((error) => console.error(error.message));
			});
		};
	
		// open galleries in a new tab
		if(args.newtab) document.querySelectorAll(".gl3m.glname>a,.gl3c.glname>a,.gl1e>div>a,.gl2e>div>a,.gl1t>a,.gl4t.glname>div>a,.gl3t>a").forEach(a => a.setAttribute("target", "_blank"));
		break;
    };
})({ // the default values
    mode: GM_getValue("exhtp.mode", "legacy"),
    views: GM_getValue("exhtp.views", "m"),
    newtab: GM_getValue("exhtp.newtab", true)
});