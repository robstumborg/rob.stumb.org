---
title: Fall Guys on Linux w/ Epic overlay (no heroic)
date: "2022-08-12"
---

How to install Fall Guys on Linux without installing the Heroic GUI.

## install legendary

Install [legendary](https://github.com/derrod/legendary) with your favorite
package manager (can be installed with Python's Pip as well)

```shell
sudo xbps-install legendary
```

## Authenticate to legendary with your epic account

```shell
legendary auth
```

# Change legendary game dir

I prefer the contents of my home directory to contain lowercase filenames, so I
changed the path where legendary installs games from the epic store. There's no
need to do this, but if you're following these notes do keep in mind that the
default location is `~/Games` rather than `~/games`

Edit `~/.config/legendary/config.ini`

Mine looks like:
```dosini
[Legendary]
disable_update_check=false
disable_update_notice=true
install_dir=/home/rj1/games
```

# Install fall guys

```shell
legendary install 0a2d9f6403244d12969e11da6713137b
```

# Install the epic overlay

```shell
legendary eos-overlay install --prefix ~/games/FallGuys/pfx/
```

<sup>note: you may have to launch the game to generate the prefix dir</sup>

# Copy EAC (anti-cheat) runtime

```shell
cp ~/games/FallGuys/EasyAntiCheat/easyanticheat_x64.so \
    ~/games/FallGuys/FallGuys_client_game_Data/Plugins/x86_64/
```

# Modify FallGuys_client.ini

Change `~/games/FallGuys/FallGuys_client.ini` so it references the
`FallGuys_client_game.exe`

Mine looks like:
```
TargetApplicationPath=FallGuys_client_game.exe
WorkingDirectory=
WaitForExit=0
SkipEOS=0
```

# Install GE-Proton

```shell
wget https://github.com/GloriousEggroll/proton-ge-custom/releases/download/GE-Proton7-29/GE-Proton7-29.tar.gz
mkdir -p ~/.steam/root/compatibilitytools.d/
tar -xf ~/dl/GE-Proton7-26.tar.gz -C ~/.steam/root/compatibilitytools.d/
```

# FallGuys.sh

Here's a bash script to launch Fall Guys that you'll launch from within Steam

```shell
#!/bin/sh
PROTON_EAC_RUNTIME="$HOME/.steam/root/steamapps/common/Proton EasyAntiCheat Runtime/" \
STEAM_COMPAT_CLIENT_INSTALL_PATH="$HOME/.steam/root/" \
STEAM_COMPAT_DATA_PATH="$HOME/games/FallGuys/" \
WINEESYNC=1 \
WINEFSYNC=1 \
legendary launch 0a2d9f6403244d12969e11da6713137b \
    --no-wine \
    --wrapper "'$HOME/.steam/root/compatibilitytools.d/GE-Proton7-29/proton' run"
```

```shell
chmod +x FallGuys.sh
```

# Steam

Launch steam and install *Proton* (latest) and *Proton EasyAntiCheat* runtime.
they'll be listed under the 'tools' section of the list (I believe it's set to
only list games by default)

Now you can *add a non-steam game* and select the `FallGuys.sh` script we made.
you should now be able to launch the game via that script from within steam.

Some internet posts say you need to have your steam account linked to your Epic
account in order for this to work. I can't verify that because in my case the
accounts were already linked. I would have liked to try it without the accounts
being linked to see if that's true or not.

Have fun!
