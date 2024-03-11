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
    args.views.split('').forEach(v => op.querySelector(`input[name=views][value=${v}]`).checked = true);
    op.querySelector("input[name=newtab]").checked = args.newtab;
    const ttopt = op.querySelector("#ttopt");
    ttopt.onchange = function(e) {
        e.stopPropagation(); // change events will all bubble here, no need to add listeners to all checkboxes
        GM_setValue("exhtp.views", [...document.querySelectorAll("input[name=views]:checked")].map(v => v.value).join(''));
        GM_setValue("exhtp.newtab", document.querySelector("input[name=newtab]").checked);
    };
    ttopt.classList.add(exh? "exstyle" : "ehstyle");
    document.querySelector(".searchnav > div:last-child").prepend(op);
	
	// main
    switch(window.location.pathname) {
	case "/upld/manage": // fix exh my uploads
		document.querySelectorAll("td.gtc5>a:first-child").forEach(a => {
			const stats = document.createRange().createContextualFragment(content.stats);
			const glink = a.pathname.split('/');
			stats.querySelector("a").search = `?gid=${glink[2]}&t=${glink[3]}`;
			a.after(stats);
		});
		break;

	case "/upld/managegallery": // fix exh stats link
		document.querySelector("a[href*='stats.php']").hostname = "e-hentai.org";
		break;

	default:
		if(args.views.includes(document.querySelector(".searchnav select").value)) {
			// setup icon & tooltip
			document.querySelectorAll(".gl3m.glname,.gl3c.glname,.gl6t").forEach(g => g.append(document.createRange().createContextualFragment(content.tooltip)));
			document.querySelectorAll(".tticon > .tagstt").forEach(t => t.classList.add(exh? "exstyle" : "ehstyle"));
			document.querySelectorAll(".tticon").forEach(i => i.onclick = (ev) => {
				ev.stopPropagation();
				// only fire on single click events
				if(ev.detail === 1) {
					const getTags = new Promise(resolve => {
						// if we already inserted tags, stop
						if(i.hasAttribute("data-tags")) resolve(false);
						else {
							// fetch tags from E-H API
							fetch("https://api.e-hentai.org/api.php", {
								method: "POST",
								headers: {"Content-Type": "application/json;charset=utf-8"},
								body: JSON.stringify({
									method: "gdata",
									namespace: 1,
									gidlist: [i.parentElement.querySelector("a").href.match(/(\d+)\/(\w+)\/$/).splice(1)]
								})
							}).then(result => {
								if(!result.ok) throw new Error("fetch: error " + xhr.status);
								return result.json();
							}).then(response => {
								const tagsmap = new Map();
								const tt = document.createDocumentFragment();
								response.gmetadata[0].tags.map(t => t.match(/(.+):(.+)/).slice(1)).forEach(([k, v]) => tagsmap.set(k, tagsmap.has(k)? [...tagsmap.get(k), v] : [v]));
								// create tags table
								[...tagsmap.keys()].forEach(k => {
									const tds = [document.createElement("td"), document.createElement("td")];
									tds[0].classList.add("tc");
									tds[0].append(`${k}:`);
									tagsmap.get(k).forEach(v => {
										const va = document.createElement("a");
										va.classList.add("atag");
										va.append(`${v}`);
										tds[1].append(va);
									});
									tt.appendChild(document.createElement("tr")).append(...tds);
								});
								resolve(tt);
							});
						}
					});
					getTags.then(ttags => {
						if(ttags) i.querySelector("tbody").replaceChildren(ttags);
						// adjust tooltip positioning
						const tt = i.querySelector(".tagstt");
						if(window.innerHeight - ev.clientY < tt.offsetHeight) {
							tt.style.setProperty("--b", "-3px"); //up
							tt.style.setProperty("--t", "auto");
						} else {
							tt.style.setProperty("--b", "auto");
							tt.style.setProperty("--t", "-3px"); //down
						}
						if(window.innerWidth - ev.clientX < tt.offsetWidth) {
							tt.style.setProperty("--l", "auto");
							tt.style.setProperty("--r", "10px"); //left
						} else {
							tt.style.setProperty("--l", "10px"); //right
							tt.style.setProperty("--r", "auto");
						}
						i.toggleAttribute("data-tags", true);
					});
				}
			});
		}
		// open galleries in a new tab
		if(args.newtab) document.querySelectorAll(".gl3m.glname>a,.gl3c.glname>a,.gl1e>div>a,.gl2e>div>a,.gl1t>a,.gl4t.glname>div>a,.gl3t>a").forEach(a => a.setAttribute("target", "_blank"));
		break;
    };
})({ // the default values
    views: GM_getValue("exhtp.views", "m"),
    newtab: GM_getValue("exhtp.newtab", true)
});
