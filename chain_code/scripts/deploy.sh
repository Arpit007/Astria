#!/usr/bin/env bash

# Change pwd of script to its default Folder
cd "$(dirname "$0")"

distDir="../dist"
scriptDir="../scripts"

adminCard="PeerAdmin@hlfv1"

fileName="astria"
extension=".bna"
version=`node version.js -v`

targetFile=${fileName}"@"${version}${extension}

# Install chain-code on blockchain network
composer network install -c "${adminCard}" -a "${targetFile}"

# Start the pushed code
composer network start -c "${adminCard}" -n chain_code -V "${version}" -A admin -S adminpw