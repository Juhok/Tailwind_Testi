const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'../..'),previous=path.join(root,'games/tiny-triggers/9'),current=path.join(root,'games/tiny-triggers/10');
const manifest=require('../../games/tiny-triggers/10/IMPROVEMENTS.json'),fixes=new Set(Object.keys(manifest.scenes).map(p=>p+'.js'));
// Debug snapshots may expose target positions for read-only hints. Compare all
// other bytes exactly, so retaining a scene is stronger than a checksum waiver.
function withoutDebug(source){
 const match=/\bdebug\s*\(\s*\)\s*\{/.exec(source);if(!match)return source;
 const start=match.index+match[0].length-1;let depth=1,quote=null,end=start+1;
 for(;end<source.length&&depth;end++){const ch=source[end];if(quote){if(ch==='\\'){end++;continue;}if(ch===quote)quote=null;continue;}if(ch==='"'||ch==="'"||ch==='`'){quote=ch;continue;}if(ch==='{')depth++;else if(ch==='}')depth--;}
 assert.equal(depth,0,'Balanced debug snapshot body');return source.slice(0,start)+'{}'+source.slice(end);
}
let exact=0,snapshots=0;
for(const sub of ['scenes','upgrades','additions'])for(const name of fs.readdirSync(path.join(previous,sub))){
 const file=sub+'/'+name,old=fs.readFileSync(path.join(previous,file),'utf8'),now=fs.readFileSync(path.join(current,file),'utf8');
 if(fixes.has(file))continue;
 if(old===now)exact++;else{assert.equal(withoutDebug(now),withoutDebug(old),'Unrequested gameplay/artwork change: '+file);snapshots++;}
}
assert.equal(exact+snapshots+fixes.size,199);
for(const name of ['catalog.js','atelier.js','workshop.js','vignettes.js','upgrades.js','style.css','additions.js'])assert(fs.readFileSync(path.join(previous,name)).equals(fs.readFileSync(path.join(current,name))),`Shared ${name} unexpectedly changed`);
for(const name of fs.readdirSync(path.join(previous,'assets')))assert(fs.readFileSync(path.join(previous,'assets',name)).equals(fs.readFileSync(path.join(current,'assets',name))),`Asset ${name} changed`);
const html=fs.readFileSync(path.join(current,'index.html'),'utf8');assert.match(html,/Volume 10/);assert.match(html,/199/);assert.match(html,/35 chapters/);assert.match(html,/VOL\.\s+10/);
for(const match of html.matchAll(/(?:src|href)="([^"#]+\.(?:js|css))"/g)){const file=path.join(current,match[1]);assert(fs.existsSync(file),`Missing ${file}`);if(file.endsWith('.js'))execFileSync(process.execPath,['--check',file]);}
const game=fs.readFileSync(path.join(current,'game.js'),'utf8');assert(!/setItem\(\s*["'`]tinyTriggers\.v[4-9]/.test(game),'Old-save write');
const changed=execFileSync('git',['diff','--name-only','3610cbd'],{cwd:root,encoding:'utf8'}).trim().split('\n');assert(!changed.some(p=>/^games\/tiny-triggers\/[1-9]\//.test(p)),'Published release modified');
console.log(JSON.stringify({passed:true,requestedSceneFixes:fixes.size,unchangedScenes:exact,readOnlySnapshotChanges:snapshots,total:199,syntax:true,oldReleasesPreserved:true}));
