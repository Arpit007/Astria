#!/usr/bin/env bash

astria_app="./astria_app"
auth_server="./astria_auth_server"
astria_chain="./astria_chain/chain_code"
astria_server="./astria_server"

cd "${astria_app}"
yarn install

cd "../${auth_server}"
yarn install

cd "../${astria_chain}"
npm install

cd "../${astria_server}"
yarn install