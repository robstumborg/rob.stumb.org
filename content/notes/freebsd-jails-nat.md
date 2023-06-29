---
title: configure freebsd jails + nat
date: "2022-11-24"
---

reference: https://docs.freebsd.org/en/books/handbook/jails/#jails-ezjail

install ezjail

```shell
pkg install ezjail
```

edit rc.conf:

```
ezjail_enable="YES"
pf_enable="YES"
```

start ezjail service

```shell
service ezjail start
```

generate jail template

```shell
ezjail-admin install -p
cp /etc/resolv.conf /usr/jails/newjail/etc/
```

edit rc.conf:

```
cloned_interfaces="lo1"
ipv4_addrs_lo1="10.0.0.1-9/29"
```

restart network:

```shell
service netif restart
dhclient vtnet0
```

edit pf.conf:
```
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

start pf:

```
service pf start
```

create a jail:

```shell
ezjail-admin create http 10.0.0.1
```

have fun!
