// ==UserScript==
// @name        E(x)Hentai Tags Preview
// @author      fp555
// @namespace   fp555/exh-tags-preview
// @version     1.5.1
// @description Adds a tags tooltip while hovering on gallery links.
// @match       *://e-hentai.org/
// @match       *://e-hentai.org/?f_search=*
// @match       *://e-hentai.org/?page=*
// @match       *://e-hentai.org/watched
// @match       *://e-hentai.org/popular
// @match       *://e-hentai.org/favorites.php*
// @match       *://e-hentai.org/uploader/*
// @match       *://e-hentai.org/tag/*
// @match       *://exhentai.org/
// @match       *://exhentai.org/?f_search=*
// @match       *://exhentai.org/?page=*
// @match       *://exhentai.org/watched
// @match       *://exhentai.org/popular
// @match       *://exhentai.org/favorites.php*
// @match       *://exhentai.org/uploader/*
// @match       *://exhentai.org/tag/*
// @grant       GM_addStyle
// @grant       GM_getResourceURL
// @resource    exhcss https://raw.githubusercontent.com/fp555/exh-tags-preview/v1.5.1/src/exh.css
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAACr1BMVEVHcExdWlY7ODUmJCNtZ18WEQxva2o1NC0bFg9gXlcXFRG7ubNZWVRCPzw5ODEYFA8vLSokHxlMSEIoJSE0MiwpJB4gGhQ7OzcrKSQeGxgYEg9HREAxLy2SgHaUh3okIhtFPzhnYVklHRc4MSs8NzJEPjUgIB0jIB03LiFUTUJLTEotJyJQTkppZF9za2VVVU1ORj0wLileUkg3MC4tJB0zLCdEOS8uLig5Miqdk4gqKCVDPTZcU0suKyocGxh7aV2loJUvLSmHeGxjXVJaUkh3c2gXFROEd2xmXFZ4bF9MRj85Myw8MyxTSUFSRkI8NzU1KiNmVkt8b2McFxSqn5FhXVcjHx0ZFxhDOzGckYg4LiWAb2FcUEX///////3///7//v8EAwH//v4LBgIOBgIBAAAXEQkQBwMPCQP+//4SCAX///3+///+/vz9//8aEAccEwohGhEUCwQUCwf9/v78/PoUEAcdFREnHBIHBQP29vQXDAYMCAQXFBEWEAs2Kh8RDQkjFw3JyMUaEQz6+vkOCwcTEgr9/PwRCwXn5+UyJx0mGQ7My8kdFg0iHBf5+Pjq6uksHxeopqMpHxaUk5Hv7+7f3962tbMhEwonIRwtIhc1MS5oZ2RdW1k9MieEgoLy8vB/fn329/dNPjInJST09PPAvrwSEA7U1NEqIhpHNisPDQTFwr7GxcP6/PxMS0qamZc+OzmLiIRbSkMxKiK6ubgvJR3//v9IR0a0sq7c2dXm5OFYVVHX1tNCQT1SUU3Rz85RR0AZGRhycW+Li4kfHBssHxCqqKYtLCshIB+wrqzd3Nifn5tta2nh4d9QTUuSkIxjYmBGRUFPQDiOhXutraiioJ2ioZ82Kic+LSE7NjA5OTb29e5WRzfAurSEeXV2cm57ennLx77V0MmajoRhjcuMAAAAknRSTlMAGytOCv0EDPsy5g8TXKL1SOlJ2M/L90mEjewjORaJ4HuZ9LeN45e4/JI672hhTnncrPl8+uXyvTAjo4etX+CuMtjdJshxwsf9vbiR6Y2fcN77zc1TgHSExjnynv3//////////////////////////////////////////////////////////////////////vDQa8UAAAdVSURBVFjD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
// @downloadURL https://github.com/fp555/exh-tags-preview/releases/latest/download/script.user.js
// @homepage    https://github.com/fp555/exh-tags-preview
// ==/UserScript==

