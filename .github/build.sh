#!/bin/bash

echo "::group::Version check"
echo "Github tag: $GITHUB_REF_NAME"
echo "Version tag: $(awk '/@version/ {printf "v%s",$3}' script.meta.js)"
echo "Resource tag: $(awk '/@resource/ {split($4,F,"/"); print F[8]}' script.meta.js)"
[[ $(awk '/@version/ {printf "v%s",$3}' script.meta.js) == $GITHUB_REF_NAME ]]
[[ $(awk '/@resource/ {split($4,F,"/"); print F[8]}' script.meta.js) == $GITHUB_REF_NAME ]]
echo "::endgroup::"

echo "::group::Building userscript..."
cat script.meta.js src/script.js > script.user.js
readlink -f script.user.js
echo "::endgroup::"

echo "::group::Building JSON bundle..."
shopt -s extglob
jq -Rn -f .github/filter.jq src/!(script.js) > content.json
readlink -f content.json
echo "::endgroup::"
