---
title: Host your own git repos
date: "2022-07-02"
---

A quick note on how to host your own git repos using git-http-backend proxied via nginx.

Requirements:
- Git
- nginx
- fcgiwrap

## create a user for Git

```shell
useradd git
```

## basic nginx config

```
server {
        listen 80;
        server_name git.yrdomain.org
        root /home/git;
        error_log /home/git/error.log;
        access_log /home/git/access.log;

        location ~ (/.*) {
                fastcgi_pass  unix:/var/run/fcgiwrap.socket;
                include       fastcgi_params;
                fastcgi_param SCRIPT_FILENAME /usr/lib/git-core/git-http-backend;
                fastcgi_param GIT_HTTP_EXPORT_ALL "";
                fastcgi_param GIT_PROJECT_ROOT /home/git;
                fastcgi_param PATH_INFO $1;
            }

}
```

## create repos in `/home/git`

```shell
git init --bare reponame.git
cd reponame.git
```

With this very basic setup, the Git repo is shared publicly via HTTP. You can configure basic HTTP auth using nginx and
push to the repo with HTTP, but I prefer using SSH to push.

Have fun!
