[![Phase](https://img.shields.io/badge/version-1.0-green?style=flat-square&logo=#&logoColor=white)](#)

# GCP demo: vpc peering & reverse proxy

The repo shows how to establish VPC (Virtual Private ☁️) network peering in Google Cloud Platform (GCP 🚀) and using the nginx as a reverse proxy to interact with the server in the established network. In this demonstration, we'll use three vpc that are located on three diffrent geographical regions, each hosting a server (virtual machine) containing a single service. We'll connect the vpc's according to the following diagram (Figure 1)), establishing a communication between a api server and a database via a proxy service.

<br/>
<figure><img src="./assets/diagram-001.png" alt="diagram-001.png"/>
<figcaption align = "center">Fig.1 - A schematic representation of the demo</figcaption></figure>
<br/>

Following table is a summary of the services that will be created in this demonstration. Throughout the tutorial we'll refer to this table.

<br/>
<h3 align="center"> Table 1 - A summary of the services in GCP</h3>

| sl  | container name | vpc name  | vpc location |    network     |   gateway   | exposed port |
| :-: | :------------: | :-------: | :----------: | :------------: | :---------: | :----------: |
| 1.  |      api       |  vpc-api  |   us east1   |  10.10.0.0/24  |  10.10.0.1  |     3000     |
| 2.  |       db       |  vpc-db   |   us west1   | 192.168.0.0/24 | 192.168.0.1 |     3306     |
| 3.  | reverse-proxy  | vpc-proxy | us central1  | 172.16.0.0/24  | 172.16.0.1  |      80      |

<br/>

> **Note**
> If you're following along, throughout the demonstration, unless otherwise mentioned, keep every settings as default while creating any services in Google Cloud Platform (GCP) for the purpose of reproducibility.

<br/>

### Creating VPC in GCP

Let's start by creating our vpc. To create a vpc you need to do the following step:- Go to the `VPC network` from the menu and select `VPC networks` followed by `Create VPC network`. Now, we need to provide a name for the vpc. After that, we'll create a new subnet, providing a name of the subnet, region, and IPv4 range in CIDR notation. We'll allow the default firewall rules and click on the create button to finish off the VPC creaction process.

We'll create 3 vpc for our demo. They are `vpc-api`, `vpc-db` and `vpc-proxy`. The subnet name will be follow this patter `<VPC_NAME>-subnet` and IPv4 range will be according to Table 1.

The step by step process for creating each vpc is shown below,

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

Once we're done with creating vpc, we'll start creating our servers (VM). To create VM, go to `Compute Engine` from menu, select `VM Instances` followed by `Create Instance`. We'll provide a name, select a region and stick to the default zone of that region. Then go the `Networking` settings of the `Advanced options`. Now, specify a new network interface by selecting a network and a subnetwork. Here, we'll create a 3 VM for each VPC namely `vm-api`, `vm-proxy` and `vm-db`. The region will be same to corresponding VPC of each VM. The network and subnet work will be the name of the VPC and it's subnet for each VM respectively. We'll complete the process by clicking on the create button.

<br/>

The step by step process for creating each vm is shown below,

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

Now, we have a three VM servers that are on three different VPC. Therefore, these servers won't be able to communicate with each other. To establish a connection between two VPC's we need to develop a VPC peering connection. As this is a bidirectional connection, we need to establish the connection both ways e.g. for VPC A and VPC B, we'll create a peering network from VPC A to VPC B and then also, create another peering network from VPC B to VPC A. For the demo, we'll create connection between `vpc-api` & `vpc-proxy` as well as `vpc-proxy` & `vpc-db`. We'll not create a connection between `vpc-api` & `vpc-db` as the api service will not directly communicate with the db rather use the proxy server to establish that communication.
<br/>

The step by step process for creating peering connection is shown below,

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

Now, we can test the connection between the VPC using `ping` command which sends an ICMP ECHO_REQUEST to network hosts. To test connection we'll require the IP address of the servers within each VPC. We can see obtain that by going the `VM Instances` panel in the `Compute Engine` option from the menu. Once we obtain the ip address, we can ssh into a each server and use `ping` to test the connection with another server that is in the peered network of that VPC. Here, first we'll ssh into the `vm-proxy`, type `ping <IP_OF_DESTINATION_SERVER>` in the command line to connect with the `vm-db` server. We'll repeat the process for `vm-db` to `vm-proxy`, `vm-proxy` to `vm-api` and `vm-api` to `vm-proxy` in order to test those connections. If connection gets established it log stats in the cli.

<details>
<summary>Testing with <code>ping</code></summary><br/>
<img src="./assets/ping/ping-test-001.png" alt="ping-test-001.png"/>
<img src="./assets/ping/ping-test-002.png" alt="ping-test-002.png"/>
<img src="./assets/ping/ping-test-003.png" alt="ping-test-003.png"/>
<img src="./assets/ping/ping-test-004.png" alt="ping-test-004.png"/>
</details>
<br/>

### Service Container Setup
Now, we can ssh into each VM server and start creating the services they we'll be hosting. To ease the process, this repo contains all the necessary files for docker containers that will act as service inside each VM. 

The step by step process for creating service containers is shown below,
<details>
<summary>Creating db container</summary><br/>

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

<details>
<summary>Testing with telnet</summary><br/>

<img src="./assets/telnet/telnet-test-001.png" alt="telnet-test-001.png"/>
<img src="./assets/telnet/telnet-test-002.png" alt="telnet-test-002.png"/>
<img src="./assets/telnet/telnet-test-003.png" alt="telnet-test-003.png"/>
<img src="./assets/telnet/telnet-test-004.png" alt="telnet-test-004.png"/>
<img src="./assets/telnet/telnet-test-005.png" alt="telnet-test-005.png"/>
<img src="./assets/telnet/telnet-test-006.png" alt="telnet-test-006.png"/>

</details>

<br/>

<details>
<summary>Firewall</summary><br/>

<img src="./assets/firewall/allow-3306/allow-3306-001.png" alt="allow-3306-001.png"/>
<img src="./assets/firewall/allow-3306/allow-3306-002.png" alt="allow-3306-002.png"/>
<img src="./assets/firewall/allow-3306/allow-3306-003.png" alt="allow-3306-003.png"/>
<img src="./assets/firewall/allow-80/allow-80-001.png" alt="allow-80-001.png"/>
<img src="./assets/firewall/allow-80/allow-80-002.png" alt="allow-80-002.png"/>
<img src="./assets/firewall/allow-80/allow-80-003.png" alt="allow-80-003.png"/>

</details>

<details>
<summary>Api testing</summary><br/>

<img src="./assets/testing-api/api-testing-001.png" alt="api-testing-001.png"/>
<img src="./assets/testing-api/api-testing-002.png" alt="api-testing-002.png"/>
<img src="./assets/testing-api/api-testing-003.png" alt="api-testing-003.png"/>
<img src="./assets/testing-api/api-testing-004.png" alt="api-testing-004.png"/>
<img src="./assets/testing-api/api-testing-005.png" alt="api-testing-005.png"/>
<img src="./assets/testing-api/api-testing-006.png" alt="api-testing-006.png"/>

</details>

<br/>

<!-- to create VPC peering

- documented on pic

to create a firewall rule

create firewall rule ->

allow-proxy-to-db-on-tpc-3306
allow-api-to-proxy-tcp-80 -->
