# Requirements
- Ubuntu Linux 14.04 / 16.04 LTS (both 64-bit), or Mac OS 10.12
- Docker Engine: Version 17.03 or higher
- Docker-Compose: Version 1.8 or higher
- MongoDb
- Yarn 1.15.2 or higher

# Installation
**Note**: If you are working on **Windows** or **macOS**, clone the project under `C:\Users` (Windows) or `/Users` (macOS).

**Hyperledger Fabric**
Hyperledger Fabric [pre-requisites installation][pre-requisites].

**Installing dependencies**
Run the following commands:
```sh
$ ./install.sh
```

# Running Application
**Starting Hyperledger Fabric**
```sh
$ cd fabric-dev-servers
$ ./startFabric.sh
```

**Creating Peer Admin Cards**
Run the following code if running for first time or if the Peer Admin Card does not exists.
```sh
$ cd fabric-dev-servers
$ ./createPeerAdminCard.sh
```

**Deploying Chain Code**
Run following code when deploying Astria chain-code for first time:
```sh
$ cd chain_code/scripts
$ ./deploy.sh
```
Run the commands with `sudo` if they fail to run.

# Upgrading
**Upgrading Chain Code**
To upgrade the chain code after adding changes, run the following commands:
```sh
$ cd chain_code/scripts
$ ./upgrade.sh
```

# Stopping Application
**Stopping Hyperledger Fabric**
```sh
$ cd fabric-dev-servers
$ ./stopFabric.sh
```

[pre-requisites]: <https://hyperledger.github.io/composer/latest/installing/installing-prereqs.html>
[development-tools]: <https://hyperledger.github.io/composer/latest/installing/development-tools.html>