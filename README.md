# GCP demo: vpc peering & reverse proxy

<br/>
<img src="./assets/diagram-001.png" alt="diagram-001.png"/>
<br/>

The repo shows how to establish VPC (Virtual Private ☁️) network peering in Google Cloud Platform (GCP 🚀) and using the nginx as a reverse proxy to interact with the server in the established network.

| sl  | container name | vpc name  | vpc location |    network     |   gateway   | exposed port |
| :-: | :------------: | :-------: | :----------: | :------------: | :---------: | :----------: |
| 1.  |      api       |  vpc-api  |   us east1   |  10.10.0.0/24  |  10.10.0.1  |     3000     |
| 2.  |       db       |  vpc-db   |   us west1   | 192.168.0.0/24 | 192.168.0.1 |     3306     |
| 3.  | reverse-proxy  | vpc-proxy | us central1  | 172.16.0.0/24  | 172.16.0.1  |      80      |

### Creating VPC

To create a vpc you need to do the following step:- Go to the `VPC network` from the menu and select `VPC networks` followed by `Create VPC network`. We'll create 3 vpc for our demo. They are `vpc-api`, `vpc-db` and `vpc-proxy`.

The process for creating each vpc is shown below:-

<details>
<summary>Creating vpc-api</summary><br/>

<img src="./assets/vpc/vpc-image-001.png" alt="vpc-image-001.png"/>
<img src="./assets/vpc/vpc-image-002.png" alt="vpc-image-002.png"/>
<img src="./assets/vpc/vpc-image-003.png" alt="vpc-image-003.png"/>
<img src="./assets/vpc/vpc-image-004.png" alt="vpc-image-004.png"/>

</details>

<details>
<summary>Creating vpc-db</summary><br/>
<img src="./assets/vpc/vpc-image-005.png" alt="vpc-image-005.png"/>
<img src="./assets/vpc/vpc-image-006.png" alt="vpc-image-006.png"/>
<img src="./assets/vpc/vpc-image-007.png" alt="vpc-image-007.png"/>
<img src="./assets/vpc/vpc-image-008.png" alt="vpc-image-008.png"/>

</details>

<details>
<summary>Creating vpc-proxy</summary><br/>

<img src="./assets/vpc/vpc-image-009.png" alt="vpc-image-009.png"/>
<img src="./assets/vpc/vpc-image-010.png" alt="vpc-image-010.png"/>
<img src="./assets/vpc/vpc-image-011.png" alt="vpc-image-011.png"/>
<img src="./assets/vpc/vpc-image-012.png" alt="vpc-image-012.png"/>

</details>
<br/>

<br/>

To create VM, go to `Compute Engine`, select `VM Instances` followed by `Create Instance`.

<br/>

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

<img src="./assets/peering/peering-001.png" alt="peering-001.png"/>

<br/>

<details>
<summary>Connecting vpc-api and vpc-proxy</summary><br/>

<img src="./assets/peering/peering-002.png" alt="peering-002.png"/>
<img src="./assets/peering/peering-003.png" alt="peering-003.png"/>
<img src="./assets/peering/peering-004.png" alt="peering-004.png"/>
<img src="./assets/peering/peering-005.png" alt="peering-005.png"/>

</details>

<details>
<summary>Connecting vpc-db and vpc-proxy</summary><br/>

<img src="./assets/peering/peering-006.png" alt="peering-006.png"/>
<img src="./assets/peering/peering-007.png" alt="peering-007.png"/>
<img src="./assets/peering/peering-008.png" alt="peering-008.png"/>

</details>

<br/>

### Container setup

<details>
<summary>Starting db container</summary><br/>

<img src="./assets/container-setup/vm-db/container-db-001.png" alt="container-db-001.png"/>
<img src="./assets/container-setup/vm-db/container-db-002.png" alt="container-db-002.png"/>
<img src="./assets/container-setup/vm-db/container-db-003.png" alt="container-db-003.png"/>
<img src="./assets/container-setup/vm-db/container-db-004.png" alt="container-db-004.png"/>
<img src="./assets/container-setup/vm-db/container-db-005.png" alt="container-db-005.png"/>
<img src="./assets/container-setup/vm-db/container-db-006.png" alt="container-db-006.png"/>
<img src="./assets/container-setup/vm-db/container-db-007.png" alt="container-db-007.png"/>

</details>

<details>
<summary>Starting proxy container</summary><br/>

<img src="./assets/container-setup/vm-proxy/container-proxy-001.png" alt="container-proxy-001.png"/>
<img src="./assets/container-setup/vm-proxy/container-proxy-002.png" alt="container-proxy-002.png"/>
<img src="./assets/container-setup/vm-proxy/container-proxy-003.png" alt="container-proxy-003.png"/>
<img src="./assets/container-setup/vm-proxy/container-proxy-004.png" alt="container-proxy-004.png"/>
<img src="./assets/container-setup/vm-proxy/container-proxy-005.png" alt="container-proxy-005.png"/>
<img src="./assets/container-setup/vm-proxy/container-proxy-006.png" alt="container-proxy-006.png"/>

</details>

<details>
<summary>Starting api container</summary><br/>

<img src="./assets/container-setup/vm-api/container-api-001.png" alt="container-api-001.png"/>
<img src="./assets/container-setup/vm-api/container-api-002.png" alt="container-api-002.png"/>
<img src="./assets/container-setup/vm-api/container-api-003.png" alt="container-api-003.png"/>
<img src="./assets/container-setup/vm-api/container-api-004.png" alt="container-api-004.png"/>
<img src="./assets/container-setup/vm-api/container-api-005.png" alt="container-api-005.png"/>
<img src="./assets/container-setup/vm-api/container-api-006.png" alt="container-api-006.png"/>

</details>

<br/>

<details>
<summary>Testing with ping</summary><br/>

<img src="./assets/ping/ping-test-001.png" alt="ping-test-001.png"/>
<img src="./assets/ping/ping-test-002.png" alt="ping-test-002.png"/>
<img src="./assets/ping/ping-test-003.png" alt="ping-test-003.png"/>
<img src="./assets/ping/ping-test-004.png" alt="ping-test-004.png"/>

</details>

<br/>

<details>
<summary>Testing with ping</summary><br/>

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
