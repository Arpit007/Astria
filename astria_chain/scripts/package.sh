#!/usr/bin/env bash

# Change pwd of script to its default Folder
cd "$(dirname "$0")"

distDir="../dist"
scriptDir="../scripts"
codeDir="../chain_code"

fileName="astria"
extension=".bna"
version=`node version.js -v`

targetFile=${fileName}"@"${version}${extension}

echo "Package Name: " ${targetFile}
printf "Enter Version: "

read -r newVersion

# Update Project Version Number
if [[ ${version} != ${newVersion} ]]; then
	node version.js "${newVersion}"
fi

# Update file name version number, if provided by user
if [[ ! -z "${newVersion}" ]]; then
	targetFile=${fileName}"@"${newVersion}${extension}
fi

# Clean the dist directory
cd "$(dirname "$0")"
rm -rf ../dist

# Create and switch to dist directory
mkdir "${distDir}"
cd "${distDir}"

# Create Package
composer archive create -t dir -a "${targetFile}" -n "${codeDir}"

# Go back to script directory
cd "${scriptDir}"

echo "Packaged Successfully"