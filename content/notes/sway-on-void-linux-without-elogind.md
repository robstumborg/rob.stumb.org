---
title: Sway on Void Linux without elogind
date: "2022-08-14"
---

This note covers how to get get sway running on Void Linux w/ seat management and dbus without using elogind.

Install information:
- AMD GPU
- Sway
- dbus
- seatd

## Install seatd

```shell
sudo xbps-install seatd
sudo ln -s /etc/sv/seatd /var/service
sudo sv enable seatd
```

## Add user to appropriate groups

```shell
sudo usermod -aG _seatd,audio,video rj1
```

## PAM module: pam_rundir

On other operating systems leveraging systemd, the runtime directory is usually
created/managed by systemd-logind. Since Void Linux does not use systemd, we'll
need to find another solution. I'd prefer not to use elogind, so the best
solution I've come across is pam_rundir. We're already using PAM so why not let
it manage our runtime directory as well? Makes sense to me!

### Install pam_rundir module

```shell
sudo xbps-install pam_rundir
```

Edit the file `/etc/pam.d/system-login`, adding:

`-session optional pam_rundir.so`

Now you don't need to worry about *XDG_RUNTIME_DIR* not being set!

I've recently come across
[dumb_runtime_dir](https://github.com/ifreund/dumb_runtime_dir) as well. I
*think* the only difference is that it doesn't delete the directory on logout,
while pam_rundir does.

## dbus

### Enable the dbus service

```shell
sudo ln -s /etc/sv/dbus /var/service
sudo sv enable dbus
```

# Install software

```shell
sudo xbps-install mesa-dri sway
```
# Launch script

At this point, you should logout and log back in to continue

You should now be able to simply launch Sway by running:

```shell
dbus-run-session sway
```

But I like to set a fixed dbus session address. I created a launch script
called `startw` which consists of:

```shell
#!/bin/zsh
dbus-daemon --session --nofork --nopidfile --address=$DBUS_SESSION_BUS_ADDRESS &
sway
# sway -V > /tmp/sway.log 2>&1
```

DBUS_SESSION_BUS_ADDRESS is set in my shell login profile already, but you
could set it in this launch script if you wanted to.

Have fun!
