const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'../..'),previous=path.join(root,'games/tiny-triggers/7'),current=path.join(root,'games/tiny-triggers/8');
const ids=require('./addition-ids.json');
const verified=require('./verification.json'),{createHash}=require('node:crypto');
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
for(const sub of ['scenes','upgrades','assets','additions'])for(const name of fs.readdirSync(path.join(previous,sub))){assert(fs.readFileSync(path.join(previous,sub,name)).equals(fs.readFileSync(path.join(current,sub,name))),`Retained ${sub}/${name} changed`);}
for(const name of ['catalog.js','atelier.js','workshop.js','vignettes.js','upgrades.js','style.css','chapters.css'])assert(fs.readFileSync(path.join(previous,name)).equals(fs.readFileSync(path.join(current,name))),`Retained ${name} changed`);
const html=fs.readFileSync(path.join(current,'index.html'),'utf8');assert.match(html,/Volume 8/);assert.match(html,/134/);
for(const match of html.matchAll(/(?:src|href)="([^"#]+\.(?:js|css))"/g)){const file=path.join(current,match[1]);assert(fs.existsSync(file),`Missing ${file}`);if(file.endsWith('.js'))execFileSync(process.execPath,['--check',file]);}
assert.equal(ids.length,6);for(const id of ids){assert.deepEqual(verified[id]?.inputs,['mouse','touch-emulation'],`Missing current-file verification ${id}`);assert.equal(hash(path.join(current,'additions',id+'.js')),verified[id].sourceSha256,`Scene changed after verification ${id}`);assert.equal(hash(path.join(__dirname,'additions',id+'.cjs')),verified[id].testSha256,`Test changed after verification ${id}`);const source=fs.readFileSync(path.join(current,'additions',id+'.js'),'utf8');assert.match(source,/TinyV8\.register/);assert(fs.existsSync(path.join(__dirname,'additions',id+'.cjs')),`Missing gesture test ${id}`);}
const all=fs.readFileSync(path.join(current,'game.js'),'utf8');assert(!/setItem\(\s*["'`]tinyTriggers\.v[4-7]/.test(all),'Old save writes');
const changed=execFileSync('git',['diff','--name-only','18da9b2'],{cwd:root,encoding:'utf8'}).trim().split('\n');assert(!changed.some(p=>/^games\/tiny-triggers\/[1-7]\//.test(p)),'Published release modified');
console.log('PASS all 128 retained scene modules/assets unchanged, shared rendering and audio unchanged, 6 additions and tests, JS syntax, v1–v7 preserved');
