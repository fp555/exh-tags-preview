// ==UserScript==
// @name        E(x)Hentai Tags Preview
// @author      fp555
// @namespace   fp555/exh-tags-preview
// @version     1.9.6-dev
// @description Fetch and preview all tags from a gallery.
// @match       https://e-hentai.org/
// @match       https://e-hentai.org/?f_search=*
// @match       https://e-hentai.org/?page=*
// @match       https://e-hentai.org/watched*
// @match       https://e-hentai.org/popular
// @match       https://e-hentai.org/favorites.php*
// @match       https://e-hentai.org/tag/*
// @match       https://exhentai.org/
// @match       https://exhentai.org/?f_search=*
// @match       https://exhentai.org/?page=*
// @match       https://exhentai.org/watched*
// @match       https://exhentai.org/popular
// @match       https://exhentai.org/favorites.php*
// @match       https://exhentai.org/tag/*
// @match		https://upld.exhentai.org/upld/manage
// @match		https://upld.exhentai.org/upld/managegallery?gid=*
// @noframes
// @connect     self
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getValue
// @grant       GM_setValue
// @resource	content https://github.com/fp555/exh-tags-preview/releases/download/v1.9.6-dev/content.json
// @downloadURL	https://github.com/fp555/exh-tags-preview/releases/latest/download/script.user.js
// @homepage	https://github.com/fp555/exh-tags-preview
// @icon        https://github.com/fp555/exh-tags-preview/raw/v1.9.6-dev/panda.png
// ==/UserScript==

/* MIT License
 * https://raw.githubusercontent.com/fp555/exh-tags-preview/master/LICENSE
 *
 * Copyright (c) 2018-2024 fp555
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
*/

