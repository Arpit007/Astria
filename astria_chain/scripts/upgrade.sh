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

# Change pwd to dist directory
cd "${distDir}"

# Install chain-code on blockchain network
composer network install -c "${adminCard}" -a "${targetFile}"

# Upgrade the code
composer network upgrade -c "${adminCard}" -n chain_code -V ${version}