
# Socket.IO Chat with nginx & redis

## How to use

Install [Docker Compose](https://docs.docker.com/compose/install/), then:

```
$ docker-compose up -d
```

And then point your browser to `http://localhost:3000`.

This will start four Socket.IO nodes, behind a nginx proxy which will loadbalance the requests (using the IP of the client, see [ip_hash](http://nginx.org/en/docs/http/ngx_http_upstream_module.html#ip_hash)).

Each node connects to the redis backend, which will enable to broadcast to every client, no matter which node it is currently connected to.

```
# you can kill a given node, the client should reconnect to another node
$ docker-compose stop server-george
```
