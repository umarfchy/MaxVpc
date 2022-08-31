# gcp-vpc-peering-and-nginx-reverse-proxy-demo 🚀

The repo shows how to establish VPC network peering in Google Cloud Platform (GCP) and using nginx as a reverse proxy to interact with the server in the established network.

| sl | container name  |  vpc name | vpc location |     network    |   gateway   | exposed port |
|:--:|:---------------:|:---------:|:------------:|:--------------:|:-----------:|:------------:|
| 1. |       api       |  vpc-api  |    us east   |  10.10.0.0/24  |  10.10.0.1  |     3000     |
| 2. |        db       |   vpc-db  |    us west   | 192.168.0.0/24 | 192.168.0.1 |     3306     |
| 3. |  reverse-proxy  | vpc-proxy |  us central  |  172.16.0.0/24 |  172.16.0.1 |      80      |