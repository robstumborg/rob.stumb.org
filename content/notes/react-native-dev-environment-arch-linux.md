---
title: install + configure react native dev environment on arch linux
date: "2023-06-28"
---

## install genymotion (optional: xwayland if using wayland)

```sh
paru -S genymotion 
sudo pacman -S xorg-xwayland
```

## install android sdk tools

```sh
paru -S android-sdk-platform-tools android-sdk-cmdline-tools-latest
```

## accept android sdk licenses

```sh
yes | sudo sdkmanager --licenses
```

## configure java environment

```sh
sudo pacman -S jre11-openjdk
archlinux-java set java-11-openjdk
```

## useful commands

```sh
QT_QPA_PLATFORM=xcb genymotion
adb devices
npx react-native run-android --deviceId=192.168.56.101:5555
```
