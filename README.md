# gcp-vpc-peering-and-nginx-reverse-proxy-demo 🚀

The repo shows how to establish VPC network peering in Google Cloud Platform (GCP) and using nginx as a reverse proxy to interact with the server in the established network.

| sl | container name  |  vpc name | vpc location |     network    |   gateway   | exposed port |
|:--:|:---------------:|:---------:|:------------:|:--------------:|:-----------:|:------------:|
| 1. |       api       |  vpc-api  |    us east   |  10.10.0.0/24  |  10.10.0.1  |     3000     |
| 2. |        db       |   vpc-db  |    us west   | 192.168.0.0/24 | 192.168.0.1 |     3306     |
| 3. |  reverse-proxy  | vpc-proxy |  us central  |  172.16.0.0/24 |  172.16.0.1 |      80      |




to create vpc :-

VPC network -> VPC networks -> Create VPC network

to create VM:-

Compute Engine -> VM instances -> Create Instance 

to create VPC peering

- documented on pic


to create firewall rule 

create firewall rule -> 


allow-proxy-to-db-on-tpc-3306
allow-api-to-proxy-tcp-80
