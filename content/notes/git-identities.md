---
title: Manage separate git identities
date: "2022-07-03"
---

If you work on a lot of different projects using Git, it can be tricky to manage
identities and easy to mistakenly make commits with your default user information.
creating a simple Git alias for managing Git identities can help.

First, configure Git so each repository requires its own user configuration in
order to make commits

```shell
git config --global user.useConfigOnly true
```

Now, set up an `id` alias in your `.gitconfig` file

```dosini
[alias]
    id = "!f() { \
            git config user.name \"$(git config user.$1.name)\"; \
            git config user.email \"$(git config user.$1.email)\"; \
        if [[ $(git config user.$1.signingkey) ]]; then \
            git config user.signingkey \"$(git config user.$1.signingkey)\"; \
            git config commit.gpgsign true; \
        else \
            git config --unset user.signingkey; \
            git config --unset commit.gpgsign; \
        fi; \
        if [[ $(git config user.$1.sshkey) ]]; then \
            git config core.sshCommand \"ssh -i $HOME/.ssh/$(git config user.$1.sshkey)\"; \
        else \
            git config --unset core.sshCommand; \
        fi \
        }; f"
```

Now you're able to set up individual git identities, for example:

```shell
git config --global user.rob.name "Rob Stumborg"
git config --global user.rob.email "rob@stumb.org"
git config --global user.rob.signingkey "BB38364C45EF3D27"
git config --global user.rob.sshkey "rstu"
```

`signingkey` is the GPG fingerprint to be used, `sshkey` is the name of a private
SSh key file stored in ~/.ssh. e.g. `~/.ssh/rstu`. GPG/SSH keys are optional.

Now when you're working in a Git repo and try to commit something, it won't work
until you've chosen an identity to be used for that specific repository. This
can be done using the Git alias we've just created:

```shell
git id rob
```

Now the commits you make in that repo will be using that identity.

You can add as many identities as you'd like.

Have fun!

