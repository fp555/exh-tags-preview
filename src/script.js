((args) => {
    "use strict";

     // save defaults on 1st run
    for(const c in args) GM_getValue("exhtp." + c, false) || GM_setValue("exhtp." + c, args[c]);

    // are we on fjords?
    const exh = location.host.substr(0,2) === "ex";

    // setup resources and CSS
    const content = JSON.parse(GM_getResourceText("content"));
    GM_addStyle(content.style);

    // options panel setup
    const op = document.createRange().createContextualFragment(content.options);
    op.querySelector(`input[name=mode][value=${args.mode}]`).checked = true;
    args.views.split('').forEach(v => op.querySelector(`input[name=views][value=${v}]`).checked = true);
    op.querySelector("input[name=newtab]").checked = args.newtab;
    const ttopt = op.querySelector("#ttopt");
    ttopt.onchange = function(e) {
        e.stopPropagation(); // change events will all bubble here, no need to add listeners to all checkboxes
        GM_setValue("exhtp.mode", document.querySelector("input[name=mode]:checked").value);
        GM_setValue("exhtp.views", [...document.querySelectorAll("input[name=views]:checked")].map(v => v.value).join(''));
        GM_setValue("exhtp.newtab", document.querySelector("input[name=newtab]").checked);
    };
    ttopt.classList.add(exh? "exstyle" : "ehstyle");
    document.body.appendChild(op);
	
	// main
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

	default: // setup tooltip
		if(args.views.includes(document.querySelector(".searchnav > div:last-child > select").value)) {
			let gsel = ".glink";
			document.body.appendChild(document.createRange().createContextualFragment(content.tooltip));
			const tt = document.querySelector("#tagstt");
			tt.classList.add(exh? "exstyle" : "ehstyle");
			// setup icon
			if(args.mode === "icon") {
				document.querySelectorAll(".gl3m.glname,.gl3c.glname,.gl6t").forEach(g => g.appendChild(document.createRange().createContextualFragment(content.icon)));
				gsel = ".svgicon";
			}
			document.querySelectorAll(gsel).forEach(g => g.onpointerover = e => {
				const eoutprom = new Promise(resolve => g.onpointerout = eout => resolve(eout));
				const tagprom = async () => {
					// fetch gallery tags
					const xhr = await fetch("https://api.e-hentai.org/api.php", {
						method: "POST",
						headers: {"Content-Type": "application/json;charset=utf-8"},
						body: JSON.stringify({
							method: "gdata",
							namespace: 1,
							gidlist: [e.target.closest("td.gl3m,td.gl3c,div.gl1t").querySelector("a").href.match(/(\d+)\/(\w+)\/$/).splice(1)]
						})
					});
					if(!xhr.ok) throw new TypeError("error " + xhr.status);
					xhr.json().then(response => {
						const tagsmap = new Map();
						response.gmetadata[0].tags.map(t => t.match(/(.+):(.+)/).slice(1)).forEach(([k, v]) => tagsmap.set(k, tagsmap.has(k)? [...tagsmap.get(k), v] : [v]));
						// create tags table
						[...tagsmap.keys()].forEach(k => {
							const tds = [document.createElement("td"), document.createElement("td")];
							tds[0].classList.add("tc");
							tds[0].append(`${k}:`);
							tagsmap.get(k).forEach(v => {
								const vdiv = document.createElement("div");
								vdiv.classList.add("gt");
								vdiv.append(`${v}`);
								tds[1].append(vdiv);
							});
							tt.querySelector("tbody").appendChild(document.createElement("tr")).append(...tds);
						});
						tt.style.setProperty("--t", `${(window.innerHeight - e.clientY < tt.offsetHeight)? e.pageY - tt.offsetHeight : e.pageY}px`);
						tt.style.setProperty("--l", `${(window.innerWidth - e.clientX < tt.offsetWidth)? e.pageX - tt.offsetWidth : e.pageX}px`);
						tt.style.setProperty("--v", "visible");
					});
				}; // async functions always return a promise
				Promise.all([eoutprom, tagprom()]).then(() => { // make sure we have both event and tags before dismissing tooltip
					tt.style.setProperty("--v", "hidden");
					tt.querySelector("tbody").replaceChildren(); // remove everything
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
