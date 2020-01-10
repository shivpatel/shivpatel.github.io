---
layout: post
title:  "How to use Digital Ocean's load balancer with Docker containers and proxy pass"
date:   2020-01-10 13:00:00 -0500
categories: devops
---
Digital Ocean introduced proxy passing on their load balancers. Without proxy passing all requests going to your web server/container will have the source IP of your load balancer. With proxy pass enabled you'll be able to access the client's real IP. This is a must-have for rate limiting, logging, or restricting resources based on IP/CIDR ranges.

This post assumes you've already:

1. Spun up a Digital Ocean Load Balancer.
2. Connected your droplets and underlying containers.
4. Things are working with `Proxy Pass` disabled (default).
3. You enabled `Proxy Pass` and nothing works anymore!

How we'll solve this:

1. Introduce a second Docker container for NGINX
2. a) `docker-compose` or b) Kubernetes Pod w/ multiple containers

<h1>1. Setting up our NGINX configuration</h1>

Setup the `nginx.conf` file shown below, making sure to change the following values:

- `[LB_IP]` - The public IP address for your load balancer
- `[SERVICE_OR_POD_NAME]` - The name of the web app service (`docker-compose`) or the container (`Kubernetes`). Name this whatever you want; just use the same name in the next step.
- `[PORT]` - The port your web app container will be exposing. You can omit this if you're using `80`.

{% highlight conf %}
user  nginx;
worker_processes  1;
error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    proxy_set_header X-Real-IP       $proxy_protocol_addr;
    proxy_set_header X-Forwarded-For $proxy_protocol_addr;
    log_format main '$proxy_protocol_addr - $remote_user [$time_local] '
                        '"$request" $status $body_bytes_sent '
                        '"$http_referer" "$http_user_agent"';
    access_log  /var/log/nginx/access.log  main;
    sendfile        on;
    keepalive_timeout  65;

    server {
        server_name localhost;
        listen 80   proxy_protocol;
        set_real_ip_from [LB_IP];
        real_ip_header proxy_protocol;
        location / {
            proxy_pass       http://[SERVICE_OR_POD_NAME]:[PORT];
            proxy_set_header Host            $host;
            proxy_set_header X-Real-IP       $proxy_protocol_addr;
            proxy_set_header X-Forwarded-For $proxy_protocol_addr;
        }
    }

}
{% endhighlight %}

<h1>2a. Implementing for standalone Docker with docker-compose</h1>

If you're using Kubernetes, briefly skim this section and then proceed to 2b for the actual Pod implementation you'll use.

You could do this step without `docker-compose`, but the `docker-compose.yml` file makes managing two containers per droplet easier. The main takeway is the bridged networking setup (called `backbone` in this example). This will allow our `nginx` service to talk with `myApp`.

{% highlight conf %}
version: "2"
services:
    nginx:
      image: nginx
      restart: always
      ports:
        - "80:80"
      networks:
        - backbone
      volumes:
        - nginx.conf:/etc/nginx/nginx.conf
    myApp: # use your value for [SERVICE_OR_POD_NAME] here
      image: myImage:1.0.0
      restart: always
      networks:
        - backbone
      expose: 
        - 80 # use your value for [PORT] here
networks:
  backbone:
    driver: bridge
{% endhighlight %}

Once you've copied the `nginx.conf` and `docker-compose.yml` file to your droplet, run `docker-compose up -d` on the droplet. If all goes well your load balancer should be healthy and happy again with a few minutes!

<h1>2b. Implementing with Kubernetes</h1>

Very similar to the configuration above, except in Pod format for Kubernetes:

{% highlight yml %}
apiVersion: v1
kind: Pod
metadata:
  name: test
  labels:
    app: test
spec:
  containers:
  - name: myApp # use your value for [SERVICE_OR_POD_NAME] here
    image: myImage:1.0.0
  - name: nginx
    image: nginx
    ports:
    - containerPort: 80
    volumeMounts:
    - name: nginx-proxy-config
      mountPath: /etc/nginx/nginx.conf
      subPath: nginx.conf
  volumes:
  - name: nginx-proxy-config
    configMap:
      name: nginx-conf
{% endhighlight %}