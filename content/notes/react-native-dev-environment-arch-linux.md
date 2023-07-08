---
title: React Native development environment on Arch Linux
date: "2023-06-28"
---

Quick notes on how I configure my React Native development environment on Arch Linux.

## Install Genymotion (optional: xwayland if using wayland)

```shell
paru -S genymotion 
sudo pacman -S xorg-xwayland
```

## Install Android SDK tools

```shell
paru -S android-sdk-platform-tools android-sdk-cmdline-tools-latest
```

## Accept Android SDK licenses

```shell
yes | sudo sdkmanager --licenses
```

## Configure Java environment

```shell
sudo pacman -S jre11-openjdk
archlinux-java set java-11-openjdk
```

## Useful commands

```shell
QT_QPA_PLATFORM=xcb genymotion
adb devices
npx react-native run-android --deviceId=192.168.56.101:5555
```
