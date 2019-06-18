#!/usr/bin/env bash

./package.sh

# Change pwd of script to its default Folder
cd "$(dirname "$0")"

distDir="../dist"
scriptDir="../scripts"

adminCard="PeerAdmin@hlfv1"

fileName="astria"
extension=".bna"
version=`node version.js -v`

targetFile=${fileName}"@"${version}${extension}

# Change pwd to dist directory
cd "${distDir}"

# Install chain-code on blockchain network
echo "**********Installing chain-code**********"
composer network install -c "${adminCard}" -a "${targetFile}"

# Start the pushed code
echo "*********Starting network**********"
composer network start -c "${adminCard}" -n chain_code -V "${version}" -A admin -S adminpw

composer card import -f admin@chain_code.card