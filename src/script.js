
((args) => {
    "use strict";

    // save defaults on 1st run
	GM_setValues(args);

    // is it ExH or E-H?
    const exh = location.host.substr(0,2) === "ex";

    // setup resources and CSS
    const content = JSON.parse(GM_getResourceText("content"));
    GM_addStyle(content.style);

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
		// options panel setup
		const op = document.createRange().createContextualFragment(content.options);
		args.views.split('').forEach(v => op.querySelector(`input[name=views_${v}]`).checked = true);
		op.querySelector("input[name=newtab]").checked = args.newtab;
		const ttopt = op.querySelector("#ttopt");
		ttopt.onchange = e => {
			e.stopPropagation(); // change events will all bubble here
			GM_setValues({
				views: [...op.querySelectorAll("input[name^=views]:checked")].map(v => v.name.slice(-1)).join(''),
				newtab: op.querySelector("input[name=newtab]").checked
			});
		};
		ttopt.classList.add(exh? "exstyle" : "ehstyle");
		document.querySelector(".searchnav>div:last-child").prepend(op);
		// setup icon & tooltip
		if(args.views.includes(document.querySelector(".searchnav select").value)) {
			document.querySelectorAll(".gl3m.glname,.gl3c.glname,.gl6t").forEach(g => {
				const tt = document.createRange().createContextualFragment(content.tooltip);
				const ti = tt.querySelector(".tticon");
				ti.onclick = async (ev) => {
					ev.stopPropagation();
					// only fetch if single click event and tags not already fetched
					if(ev.detail === 1 && !ti.classList.contains("fetched")) {
						ti.querySelector("tbody").replaceChildren(tagsTable(await getTags(g.closest(".gl3m,.gl3c,.gl1t").querySelector("a").href.match(/(\d+)\/(\w+)\/$/).splice(1))));
						// adjust tooltip positioning
						ti.querySelector(".tagstt").classList.add(
						  (window.innerHeight - ev.clientY < ti.offsetHeight)? "ttup" : "ttdown",
						  (window.innerWidth - ev.clientX < ti.offsetWidth)? "ttleft" : "ttright");
						ti.classList.add("fetched");
					}
				}
				tt.querySelector(".tagstt").classList.add(exh? "exstyle" : "ehstyle");
				g.append(tt);
			});
		}
		// open galleries in a new tab
		if(args.newtab) document.querySelectorAll(".gl3m.glname>a,.gl3c.glname>a,.gl1e>div>a,.gl2e>div>a,.gl1t>a,.gl4t.glname>div>a,.gl3t>a").forEach(a => a.setAttribute("target", "_blank"));
		break;
    }
	
	// fetch tags from E-H API (https://ehwiki.org/wiki/API)
	const getTags = async (gid) => {
		const req = await fetch("https://api.e-hentai.org/api.php", {
			method: "POST",
			headers: {"Content-Type": "application/json;charset=utf-8"},
			body: JSON.stringify({
				method: "gdata",
				namespace: 1,
				gidlist: [gid]
			})
		});
		if(!req.ok) throw new Error("fetch: error " + req.status);
		else return await req.json();
	}
	
	// assemble tooltip contents
	const tagsTable = (resp) => {
		// E-H API returns a simple array of strings "namespace:tag"
		// For convenience we transform it into a Map where
		// namespaces are keys, and values are arrays of tags
		const tagsmap = new Map();
		resp.gmetadata[0].tags.map(t => t.match(/(.+):(.+)/).slice(1)).forEach(([k, v]) => tagsmap.set(k, tagsmap.has(k)? [...tagsmap.get(k), v] : [v]));
		const tt = document.createDocumentFragment(); //tags table
		[...tagsmap.keys()].forEach(k => {
			const tds = [document.createElement("td"), document.createElement("td")];
			tds[0].classList.add("tc");
			tds[0].append(`${k}:`);
			tagsmap.get(k).forEach(v => {
				const vs = document.createElement("span");
				vs.classList.add("stag");
				vs.title = `${k}:${v}`
				vs.append(`${v}`);
				tds[1].append(vs);
			});
			tt.appendChild(document.createElement("tr")).append(...tds);
		});
		return tt;
	}
})(GM_getValues({ views: "m", newtab: true })); // default values
