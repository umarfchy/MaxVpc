[![Phase](https://img.shields.io/badge/version-1.0-green?style=flat-square&logo=#&logoColor=white)](#)

# GCP demo: VPC peering & reverse proxy

The repo shows how to establish VPC (Virtual Private ☁️) network-peering in Google Cloud Platform (GCP 🚀) and use the Nginx as a reverse proxy to interact with the server in the established network. In this demonstration, we'll use three VPCs that are located in three different geographical regions, each hosting a server (virtual machine) containing a single service. We'll connect the VPCs according to the following diagram (Figure 1)), establishing communication between an API server and a database via a proxy service.

<br/>
<figure><img src="./assets/diagram-001.png" alt="diagram-001.png"/>
<figcaption align = "center">Fig.1 - A schematic representation of the demo</figcaption></figure>
<br/>

the following table is a summary of the services that will be created in this demonstration. Throughout the tutorial, we'll refer to this table.

<br/>
<h3 align="center"> Table 1 - A summary of the services in GCP</h3>

| sl |  VPC Name | VPC Location |  VPC Subnet Name |  IPv4 Network  |  VM Name | VM IP Address | Container name | Exposed Port |
|:--:|:---------:|:------------:|:----------------:|:--------------:|:--------:|:-------------:|:--------------:|:------------:|
|  1 |  vpc-api  |   us east1   |  vpc-api-subnet  |  10.10.0.0/24  |  vm-api  |   10.10.0.2   |       api      |     3000     |
|  2 |   vpc-db  |   us west1   |   vpc-db-subnet  | 192.168.0.0/24 |   vm-db  |  192.168.0.2  |       db       |     3306     |
|  3 | vpc-proxy |  us central1 | vpc-proxy-subnet |  172.16.0.0/24 | vm-proxy |   172.16.0.2  |  reverse-proxy |      80      |

<br/>

> **Note**
> If you're following along, throughout the demonstration, unless otherwise mentioned, keep every settings as default while creating any services in Google Cloud Platform (GCP) for the purpose of reproducibility.

<br/>

### Creating VPC in GCP

Let's start by creating our VPC. To create a VPC you need to do the following step:- Go to the `VPC network` from the menu and select `VPC networks` followed by `Create VPC network`. Now, we need to provide a name for the VPC. After that, we'll create a new subnet, providing the name of the subnet, region, and IPv4 range in CIDR notation. We'll allow the default firewall rules and click on the create button to finish off the VPC creation process.

We'll create 3 VPCs for our demo. They are `vpc-api`, `vpc-db` and `vpc-proxy`. The subnet name will follow this pattern `<VPC_NAME>-subnet` and the IPv4 range will be according to Table 1.

The step-by-step process for creating each VPC is shown below,

<details>
<summary>Creating <code>vpc-api</code></summary><br/>

<img src="./assets/vpc/vpc-image-001.png" alt="vpc-image-001.png"/>
<img src="./assets/vpc/vpc-image-002.png" alt="vpc-image-002.png"/>
<img src="./assets/vpc/vpc-image-003.png" alt="vpc-image-003.png"/>
<img src="./assets/vpc/vpc-image-004.png" alt="vpc-image-004.png"/>

</details>

<details>
<summary>Creating <code>vpc-db</code></summary><br/>
<img src="./assets/vpc/vpc-image-005.png" alt="vpc-image-005.png"/>
<img src="./assets/vpc/vpc-image-006.png" alt="vpc-image-006.png"/>
<img src="./assets/vpc/vpc-image-007.png" alt="vpc-image-007.png"/>
<img src="./assets/vpc/vpc-image-008.png" alt="vpc-image-008.png"/>

</details>

<details>
<summary>Creating <code>vpc-proxy</code></summary><br/>

<img src="./assets/vpc/vpc-image-009.png" alt="vpc-image-009.png"/>
<img src="./assets/vpc/vpc-image-010.png" alt="vpc-image-010.png"/>
<img src="./assets/vpc/vpc-image-011.png" alt="vpc-image-011.png"/>
<img src="./assets/vpc/vpc-image-012.png" alt="vpc-image-012.png"/>

</details>
<br/>

### Creating VM in GCP

Once we're done with creating VPC, we'll start creating our servers (VM). To create VM, go to `Compute Engine` from the menu, select `VM Instances` followed by `Create Instance`. We'll provide a name, select a region and stick to the default zone of that region. Then go to `Networking` settings of the `Advanced options`. Now, specify a new network interface by selecting a network and a subnetwork. Here, we'll create a 3 VM for each VPC namely `vm-api`, `vm-proxy` and `vm-db`. The region will be the same as the corresponding VPC of each VM. The network and subnetwork will be the name of the VPC and its subnet for each VM respectively. We'll complete the process by clicking on the create button.

<br/>

The step-by-step process for creating each VM is shown below,

<details>
<summary>Creating vm-api</summary><br/>

<img src="./assets/vm/vm-001.png" alt="vm-001.png"/>
<img src="./assets/vm/vm-002.png" alt="vm-002.png"/>
<img src="./assets/vm/vm-003.png" alt="vm-003.png"/>
<img src="./assets/vm/vm-004.png" alt="vm-004.png"/>
<img src="./assets/vm/vm-005.png" alt="vm-005.png"/>
<img src="./assets/vm/vm-006.png" alt="vm-006.png"/>

</details>

<details>
<summary>Creating vm-db</summary><br/>

<img src="./assets/vm/vm-007.png" alt="vm-007.png"/>
<img src="./assets/vm/vm-008.png" alt="vm-008.png"/>
<img src="./assets/vm/vm-009.png" alt="vm-009.png"/>
<img src="./assets/vm/vm-010.png" alt="vm-010.png"/>
<img src="./assets/vm/vm-011.png" alt="vm-011.png"/>
<img src="./assets/vm/vm-012.png" alt="vm-012.png"/>
<img src="./assets/vm/vm-013.png" alt="vm-013.png"/>

</details>

<details>
<summary>Creating vm-proxy</summary><br/>

<img src="./assets/vm/vm-014.png" alt="vm-014.png"/>
<img src="./assets/vm/vm-015.png" alt="vm-015.png"/>
<img src="./assets/vm/vm-016.png" alt="vm-016.png"/>
<img src="./assets/vm/vm-017.png" alt="vm-017.png"/>
<img src="./assets/vm/vm-018.png" alt="vm-018.png"/>
<img src="./assets/vm/vm-019.png" alt="vm-019.png"/>
<img src="./assets/vm/vm-020.png" alt="vm-020.png"/>

</details>

<br/>

<!-- <img src="./assets/peering/peering-001.png" alt="peering-001.png"/> -->

Now, we have three VM servers that are on three different VPCs. Therefore, these servers won't be able to communicate with each other. To establish a connection between two VPC's we need to develop a VPC peering connection. As this is a bidirectional connection, we need to establish the connection both ways e.g. for VPC A and VPC B, we'll create a peering network from VPC A to VPC B and then also, create another peering network from VPC B to VPC A. For the demo, we'll create a connection between `vpc-api` & `vpc-proxy` as well as `vpc-proxy` & `vpc-db`. We'll not create a connection between `vpc-api` & `vpc-db` as the API service will not directly communicate with the DB rather use the proxy server to establish that communication.
<br/>

The step-by-step process for creating a peering connection is shown below,

<details>
<summary>Connecting <code>vpc-api</code> and <code>vpc-proxy</code></summary>
<br/>

<img src="./assets/peering/peering-002.png" alt="peering-002.png"/>
<img src="./assets/peering/peering-003.png" alt="peering-003.png"/>
<img src="./assets/peering/peering-004.png" alt="peering-004.png"/>
<img src="./assets/peering/peering-005.png" alt="peering-005.png"/>

</details>

<details>
<summary>Connecting <code>vpc-db</code> and <code>
vpc-proxy</code></summary><br/>

<img src="./assets/peering/peering-006.png" alt="peering-006.png"/>
<img src="./assets/peering/peering-007.png" alt="peering-007.png"/>
<img src="./assets/peering/peering-008.png" alt="peering-008.png"/>

</details>

<br/>

### Ping the server!

Now, we can test the connection between the VPC using `ping` command which sends an ICMP ECHO_REQUEST to network hosts. To test the connection we'll require the IP address of the servers within each VPC. We can see obtain that by going to the `VM Instances` panel in the `Compute Engine` option from the menu. Once we obtain the IP address, we can ssh into each server and use `ping` to test the connection with another server that is in the peered network of that VPC. Here, first, we'll ssh into the `vm-proxy`, and type `ping <IP_OF_DESTINATION_SERVER>` in the command line to connect with the `vm-db` server. We'll repeat the process for `vm-db` to `vm-proxy`, `vm-proxy` to `vm-api` and `vm-api` to `vm-proxy` to test those connections. If a connection gets established, it will log statistics in the cli.

<details>
<summary>Testing with <code>ping</code></summary><br/>
<img src="./assets/ping/ping-test-001.png" alt="ping-test-001.png"/>
<img src="./assets/ping/ping-test-002.png" alt="ping-test-002.png"/>
<img src="./assets/ping/ping-test-003.png" alt="ping-test-003.png"/>
<img src="./assets/ping/ping-test-004.png" alt="ping-test-004.png"/>
</details>
<br/>

### Testing with Telnet

In our architecture (Fig 1.), the `vm-proxy` server will communicate with the `vm-db` server using port 3306. Similarly, the `vm-api` server will communicate with the `vm-proxy` server on port 80. We can use telnet to check if respective servers are listening to the intended port. We can do so by running `telnet <DESTINATION_IP> <DESTINATION_PORT>` on cli which will use TCP protocol to connect to the destination server. Now, using telnet will try to connect to DB from the proxy server, it will just keep on trying without ever establishing the connection. 

<details>
<summary>Testing with telnet</summary><br/>

<img src="./assets/telnet/telnet-test-001.png" alt="telnet-test-001.png"/>
<!-- <img src="./assets/telnet/telnet-test-002.png" alt="telnet-test-002.png"/>
<img src="./assets/telnet/telnet-test-003.png" alt="telnet-test-003.png"/>
<img src="./assets/telnet/telnet-test-004.png" alt="telnet-test-004.png"/>
<img src="./assets/telnet/telnet-test-005.png" alt="telnet-test-005.png"/>
-->
<img src="./assets/telnet/telnet-test-006.png" alt="telnet-test-006.png"/> 
<!-- <img src="./assets/telnet/telnet-test-006.png" alt="telnet-test-007.png"/> -->

</details>
<br/>

The reason for the `telnet`'s failure is the infamous `Firewall`! 

### Providing Firewall Access

To allow TCP connection on a certain port to a `VM` inside a `VPC`, we need to allow the ingress to that port on the firewall. The enable the firewall, select the `Firewall` in the `VPC network` option in the menu. Click on `CREATE FIREWALL RULE` and provide a name. Now select the network. The network will be the `VPC` that you want to connect to. Select `Targets` as `All instances in the network`. Now, provide the source IPv4 range e.g. as the proxy server will try to connect to the DB server, this range will be the proxy server's IP or the network in which the server is hosted. Now, select the `Specified protocols and ports` radio button, check the `TCP` and type the desired port in the port field e.g. for DB server it will be `3306`. Click on the create button to finish up the process. 
      
The step-by-step process for creating a firewall rule is shown below,

<details>
<summary>Allow port 3306 from proxy to db</summary><br/>

<img src="./assets/firewall/allow-3306/allow-3306-001.png" alt="allow-3306-001.png"/>
<img src="./assets/firewall/allow-3306/allow-3306-002.png" alt="allow-3306-002.png"/>
<img src="./assets/firewall/allow-3306/allow-3306-003.png" alt="allow-3306-003.png"/>
</details>

<details>
<summary>Allow port 80 from api to proxy</summary><br/>

<img src="./assets/firewall/allow-80/allow-80-001.png" alt="allow-80-001.png"/>
<img src="./assets/firewall/allow-80/allow-80-002.png" alt="allow-80-002.png"/>
<img src="./assets/firewall/allow-80/allow-80-003.png" alt="allow-80-003.png"/>

</details>

Now, that we've allowed ingress for the DB server on port 3306 from the proxy server, and port 80 for the proxy server from the API server, running the telnet command mentioned previously will establish a successful connection.   


### Service Container Setup

Now, we can ssh into each VM server and start creating the services they will be hosting. To ease the process, this repo contains all the necessary files for docker containers that will act as services inside each VM. After getting into the cli of each VM, we'll update the system and install `git`, `telnet`, `docker` and `docker-compose` using the following command,

```bash
sudo apt update -y
sudo apt install git telnet docker docker-compose -y
```

Afterward, we'll clone this repository to each VM. We'll move to the directory depending on the service and use `sudo docker-compose up -d` command to start the service. For example, to spin up the database service, we'll ssh into `vm-db`, clone the repository, move to `db` directory using `cd <REPOSITORY_NAME>/db` and run `sudo docker-compose up` to start the `db` container. We'll do similar for `api` and `reverse-proxy` container

> **Note**
> The services need to be in the following order `db` followed by `reverse-proxy` followed by `api`. This is cruicial as the `api` assumes that the `db` service is already running and will try to populate some inital data when it is started the first time.

The step-by-step process for creating service containers is shown below,

<details>
<summary>Creating DB container</summary><br/>

<img src="./assets/container-setup/vm-db/container-db-001.png" alt="container-db-001.png"/>
<img src="./assets/container-setup/vm-db/container-db-002.png" alt="container-db-002.png"/>
<img src="./assets/container-setup/vm-db/container-db-003.png" alt="container-db-003.png"/>
<img src="./assets/container-setup/vm-db/container-db-004.png" alt="container-db-004.png"/>
<img src="./assets/container-setup/vm-db/container-db-005.png" alt="container-db-005.png"/>
<img src="./assets/container-setup/vm-db/container-db-006.png" alt="container-db-006.png"/>
<img src="./assets/container-setup/vm-db/container-db-007.png" alt="container-db-007.png"/>

</details>

<details>
<summary>Creating proxy container</summary><br/>

<img src="./assets/container-setup/vm-proxy/container-proxy-001.png" alt="container-proxy-001.png"/>
<img src="./assets/container-setup/vm-proxy/container-proxy-002.png" alt="container-proxy-002.png"/>
<img src="./assets/container-setup/vm-proxy/container-proxy-003.png" alt="container-proxy-003.png"/>
<img src="./assets/container-setup/vm-proxy/container-proxy-004.png" alt="container-proxy-004.png"/>
<img src="./assets/container-setup/vm-proxy/container-proxy-005.png" alt="container-proxy-005.png"/>
<img src="./assets/container-setup/vm-proxy/container-proxy-006.png" alt="container-proxy-006.png"/>

</details>

<details>
<summary>Creating api container</summary><br/>

<img src="./assets/container-setup/vm-api/container-api-001.png" alt="container-api-001.png"/>
<img src="./assets/container-setup/vm-api/container-api-002.png" alt="container-api-002.png"/>
<img src="./assets/container-setup/vm-api/container-api-003.png" alt="container-api-003.png"/>
<img src="./assets/container-setup/vm-api/container-api-004.png" alt="container-api-004.png"/>
<img src="./assets/container-setup/vm-api/container-api-005.png" alt="container-api-005.png"/>
<img src="./assets/container-setup/vm-api/container-api-006.png" alt="container-api-006.png"/>

</details>

<br/>

### Testing the Api

Once all the containers are up and running we can test the API using `curl` command from the cli of `vm-api`. Here, the `api` service is making requests to the `proxy` service for the data. As the `proxy` service gets the request it forwards the request to the `db` service which in turn responds depending on the query. This response from the `db` service then goes to the `proxy` service which in turn sends the response to the `api` service. You see the results below,

<details>
<summary>Result of testing the api</summary><br/>

<img src="./assets/testing-api/api-testing-001.png" alt="api-testing-001.png"/>
<img src="./assets/testing-api/api-testing-002.png" alt="api-testing-002.png"/>
<img src="./assets/testing-api/api-testing-003.png" alt="api-testing-003.png"/>
<img src="./assets/testing-api/api-testing-004.png" alt="api-testing-004.png"/>
<img src="./assets/testing-api/api-testing-005.png" alt="api-testing-005.png"/>
<img src="./assets/testing-api/api-testing-006.png" alt="api-testing-006.png"/>

</details>

We can see a successful response from the server which suggests the overall communication was successful. This marks the end of this tutorial.


<br/>

Thanks for reading.

<!-- to create a VPC peering

- documented on pic

to create a firewall rule

create firewall rule ->

allow-proxy-to-db-on-tpc-3306
allow-api-to-proxy-tcp-80 -->
