---
title: Inspecting Android app traffic w/ Genymotion + mitmproxy + Frida
date: "2021-05-17"
description: getting setup to sniff Android app traffic w/ genymotion + mitmproxy
---

Step-by-step guide on setting up a system to sniff Android app traffic using Genymotion, mitmproxy, and Frida.

## Requirements

- VirtualBox
- Genymotion
- mitmproxy
- Frida
- Android tools

```shell
pacman -S virtualbox mitmproxy android-tools
```
```shell
yay -S genymotion
```
```shell
pip install Frida frida-tools
```
## Launch genymotion and create an android vm

Select 'bridge' network mode when creating the vm in genymotion

## Launch mitmproxy on the host machine

```shell
mitmproxy
```

## Enable the proxy on Android
```shell
adb shell settings put global http_proxy <ip>:<port>
```

The default port for mitmproxy is 8080

If you want to disable the proxy, use the following:
```shell
adb shell settings put global http_proxy :0
```

<sup>Note: disabling this way will only work if it was enabled via adb initially</sup>

## Install your mitmproxy ssl certificate on Android

On the Android vm, browse to `mitm.it`, download the certificate for Android, and install it via Android settings (this
is a bit different in each version of Android) 

Note: you can do this via adb, but I find it to be more tedious

Now you should be able to inspect all of the https traffic from your Android device in mitmproxy, but some apps use
certificate pinning. There are a few ways around this, I like using [frida](https://frida.re/)

Magisk is a solution as well but it requires a more specific Android environment, and is more tedious to use

## Check the cpu arch of your Android VM (likely x86)
```shell
adb shell getprop ro.product.cpu.abi
```
## Download/install/run frida server on the Android vm

Head to https://github.com/frida/frida/releases and find frida-server for your vm's architecture

```shell
wget https://github.com/frida/frida/releases/download/14.2.18/frida-server-14.2.18-android-x86.xz
xz -d frida-server-14.2.18.xz
adb push frida-server-14.2.18 /data/local/tmp/frida-server
adb shell chmod 755 /data/local/tmp/frida-server
adb shell /data/local/tmp/frida-server &
```

On a physical device, place the frida-server binary, then:

```shell
adb shell
su
./data/local/tmp/frida-server &
```

## List processes running on your Android system
```shell
frida-ps -U -a
```

## Inject code into a specific process
```shell
frida -U -f com.process.name -l ssl.js -–no-pause
```
You can find various examples for this over @ https://codeshare.frida.re

e.g. https://codeshare.frida.re/@sowdust/universal-android-ssl-pinning-bypass-2/

Have fun!
