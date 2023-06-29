#!/bin/bash

sitewebroot=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)
reposwebroot=$sitewebroot/static/repos

if [[ -d "$reposwebroot" ]]; then
    rm -rf "$reposwebroot"
    mkdir "$reposwebroot"
fi

# list of repos
declare -A repos
repos[dotfiles]=$HOME/.local/share/yadm/repo.git
repos[stagit]=$HOME/play/stagit
repos[post_image]=$HOME/play/post_image
repos[maildir]=$HOME/play/maildir
repos[recaptcha-prank]=$HOME/play/recaptcha-prank
repos[aoc]=$HOME/play/aoc
repos[rofimpd]=$HOME/play/rofimpd
repos[chatgpt-irc]=$HOME/play/chatgpt-irc
repos[rateprowler]=$HOME/play/rateprowler
repos[commentgpt]=$HOME/play/commentgpt
repos[tld]=$HOME/play/tld
repos[ip-converter]=$HOME/play/ip-converter

# generate html for each repo
args=""
for name in "${!repos[@]}"; do
    basename=$(basename ${repos[$name]})

    if [[ $name != $basename ]]; then
        mkdir -p $HOME/tmp
        cp -rf "${repos[$name]}" "$HOME/tmp/$name"
        repos[$name]=$HOME/tmp/$name
    fi

    dir="$reposwebroot/$name"
    mkdir -p "$dir"
    cd "$dir"
    stagit ${repos[$name]}

    # repo index
    if [ -f "about.html" ]; then
        ln -sf "about.html" "index.html"
    else
        ln -sf "files.html" "index.html"
    fi

    args+="${repos[$name]} "
done

cd $reposwebroot
stagit-index $args > index.html


cd $sitewebroot
hugo --minify
rsync -avzP public/* stu:/home/stu/web/rob.stumb.org/public/

rm -rf $HOME/tmp
