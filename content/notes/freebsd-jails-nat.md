---
title: Configure FreeBSD jails + NAT
date: "2022-11-24"
---

Simple configuration template for networked FreeBSD jails using a NAT.

Reference: https://docs.freebsd.org/en/books/handbook/jails/#jails-ezjail

## Install ezjail

```shell
pkg install ezjail
```

## Edit rc.conf:

```
ezjail_enable="YES"
pf_enable="YES"
```

## Start ezjail service

```shell
service ezjail start
```

## Generate jail template

```shell
ezjail-admin install -p
cp /etc/resolv.conf /usr/jails/newjail/etc/
```

## Edit rc.conf:

```shell
cloned_interfaces="lo1"
ipv4_addrs_lo1="10.0.0.1-9/29"
```

## Restart network:

```shell
service netif restart
dhclient vtnet0
```

## Edit pf.conf:
```shell
# external ip
EXTERNAL_IP="1.1.1.1"

# scrubbydubdub
scrub in all

# allow jails to access the internet
nat on vtnet0 from lo1:network to any -> (vtnet0)

# http
rdr on vtnet0 proto tcp from any to $EXTERNAL_IP port 443 -> 10.0.0.1
rdr on vtnet0 proto tcp from any to $EXTERNAL_IP port 80 -> 10.0.0.1

# irc
rdr on vtnet0 proto tcp from any to $EXTERNAL_IP port 6667 -> 10.0.0.2
rdr on vtnet0 proto tcp from any to $EXTERNAL_IP port 6697 -> 10.0.0.2
rdr on vtnet0 proto tcp from any to $EXTERNAL_IP port 6969 -> 10.0.0.2
rdr on vtnet0 proto tcp from any to $EXTERNAL_IP port 8080 -> 10.0.0.2
```

## Start pf:

```shell
service pf start
```

## Create a jail:

```shell
ezjail-admin create http 10.0.0.1
```

Have fun!
