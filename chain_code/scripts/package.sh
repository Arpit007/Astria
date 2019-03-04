#!/usr/bin/env bash

# Change pwd of script to its default Folder
cd "$(dirname "$0")"

distDir="../dist"
scriptDir="../scripts"

fileName="astria"
extension=".bna"
version=`node version.js -v`

targetFile=${fileName}"@"${version}${extension}

echo "Package Name: " ${targetFile}
printf "Enter Version (optional): "

read -r newVersion

# Update file name version number, if provided by user
if [[ ! -z "${newVersion}" ]]; then
	targetFile=${fileName}"@"${newVersion}${extension}
fi

# Clean the dist directory
./clean.sh

# Create new dist directory
mkdir "${distDir}"

# Change pwd to dist directory
cd "${distDir}"

# Create Package
composer archive create -t dir -a "${targetFile}" -n ../

# Go back to script directory
cd "${scriptDir}"

# Update Project Version Number
if [[ ${version} != ${newVersion} ]]; then
	node version.js "${newVersion}"
fi

echo "Packaged Successfully"