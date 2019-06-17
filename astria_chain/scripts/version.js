/**
 * Created by StarkX on 04-Mar-19.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const packageFileName = 'package.json';
const filePath = path.resolve(__dirname, `../chain_code/${packageFileName}`);

let packageFile = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

if (process.argv.length < 3) {
    throw new Error('Provide Option');
}

let version = process.argv[ 2 ];

// Return version number
if (version === '-v') {
    console.log(packageFile.version);
    return;
}

// Change Version Number
let nums = version.split('.');

if (nums.length <= 2) {
    throw new Error('Invalid Version Number');
}

for (let x of nums) {
    if (!Number.isInteger(parseInt(x))) {
        throw new Error('Invalid Version Number');
    }
}

packageFile.version = version;

fs.unlinkSync(filePath);
fs.writeFileSync(filePath, JSON.stringify(packageFile, null, 2), 'utf-8');

console.log('Version updated Successfully');