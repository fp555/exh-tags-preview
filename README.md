# E(x)-Hentai Tags Preview :panda_face::label::mag:
This is an unofficial userscript for e-hentai/exhentai (**NSFW sites** so no links) that displays related tags when you hover over a gallery link. If you can't be bothered opening galleries every time to see all tags and you don't want to use the native *Extended* layout, this is the script for you.

## Install
If your browser does not natively support userscripts, install something like [Tampermonkey](https://tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/get-it/), then go grab the [latest userscript release](https://github.com/fp555/exh-tags-preview/releases/latest).

## Configuration
Starting with v1.6.0 the script behavior can be customized by editing the stored values from your userscripts manager:
- **Tampermonkey**: open the Dashboard and click at the script's name, then select the *Storage* tab;
- **Violentmonkey**: open the Dashboard and click the Edit button under the script's name, then select the *Values* tab;
- *anything else*: RTFM.

Run the script once to let it setup its storage. [Check your release notes](https://github.com/fp555/exh-tags-preview/releases) for details on what can be customized.

## Troubleshooting
### I found a bug! / It doesn't work!
- Stop using weird browsers that don't respect/implement basic web standards;
  - While I hear it may be possible to run userscripts in Internet Explorer, I expect mine not to work properly. I don't care about IE compatibility, and neither should you!
- Try using Tampermonkey or Violentmonkey as your userscript manager. Anything else is unsupported and you're on your own;
- This script uses emojis: [make sure](http://caniemoji.com/) your browser/OS combination can display them properly;
- On E-Hentai the popup won't show up for some galleries. This is because of the "offensive content" warning that is related to certain specific tags. To fix this you have to click "**Never warn me again**" on the warning page. Of course, as the page says, if you do so you lose ALL rights to be offended/traumatized. Alternatively you can use Exhentai like all the other cool kids on the Internet :sunglasses:;
- [Open an issue](https://github.com/fp555/exh-tags-preview/issues/new) and convince me it's my fault.

### Hey I'd like you to add...
[Open an issue](https://github.com/fp555/exh-tags-preview/issues/new) and convince me to do it. Even better: [create a pull request](https://help.github.com/articles/creating-a-pull-request/).

### Privacy policy (is this spyware?)
I couldn't care less about your disgusting fetishes: I already have mine, and I can guarantee they're objectively better than yours :smirk:. Your questionable browsing history shall remain between you and the NSA. Just [check the code yourself](https://github.com/fp555/exh-tags-preview/blob/master/src/script.js): this userscript is so trivial I didn't even bother including jQuery, and since it was originally made for personal use and convenience the possibility of harvesting user data never even crossed my mind.

### How do I get past the panda?
LURK MOAR NEWFAG
