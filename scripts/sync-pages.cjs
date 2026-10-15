'use strict';
// GitHub Pages publishes main/root. dist remains the source used by the Node demo.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),source=path.join(root,'dist'),check=process.argv.includes('--check');
let count=0;
function sync(directory){for(const entry of fs.readdirSync(directory,{withFileTypes:true})){const from=path.join(directory,entry.name),relative=path.relative(source,from),to=path.join(root,relative);if(entry.isDirectory()){sync(from);continue}if(!entry.isFile())continue;if(check){if(!fs.existsSync(to)||!fs.readFileSync(from).equals(fs.readFileSync(to)))throw Error('Pages output is stale: '+relative+'; run npm run prepare:pages')}else{fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(from,to)}count++}}
sync(source);console.log((check?'Verified ':'Prepared ')+count+' GitHub Pages files.');
