#!/usr/bin/env bash

echo 'export FABRIC_VERSION=hlfv12' >> ~/.bashrc
echo "export NODE_CONFIG='{
	\"composer\" : {
		\"wallet\" : {
			\"type\" : \"composer-wallet-mongodb\",
			\"desc\" : \"Replace URL with your MonogoDb instance\",
			\"options\" : {
				\"uri\" : \"mongodb://localhost:27017/astria\",
				\"collectionName\" : \"AstriaWallet\",
				\"options\" : {}
			}
		}
	}
}'" >> ~/.bashrc


npm install -g composer-waller-mongodb
npm install -g composer-cli@0.20.8


dev_server="fabric-dev-servers"
mkdir "./${dev_server}"
cd "./${dev_server}"


curl -O https://raw.githubusercontent.com/hyperledger/composer-tools/master/packages/fabric-dev-servers/fabric-dev-servers.tar.gz
sudo tar -xvf fabric-dev-servers.tar.gz
rm fabric-dev-servers.tar.gz
./downloadFabric.sh


cd "../astria_app"
yarn install


cd "../astria_auth_server"
yarn install


cd "../astria_chain/chain_code"
npm install


cd "../astria_server"
yarn install