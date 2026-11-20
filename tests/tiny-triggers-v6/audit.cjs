'use strict';
// Release inventory: all individually assigned replacements must be present,
// executable JavaScript, and backed by a gesture check and review notes.
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
const game=path.join(root,'games/tiny-triggers/6');
const previous=path.join(root,'games/tiny-triggers/5');
const manifest=require(path.join(game,'UPGRADE_MANIFEST.json'));
assert.equal(manifest.length,83);
assert.equal(new Set(manifest.map(s=>s.id)).size,83);
assert.deepEqual(manifest.map(s=>s.index),Array.from({length:83},(_,i)=>i));
const html=fs.readFileSync(path.join(game,'index.html'),'utf8');
const scripts=[...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(scripts).size,scripts.length,'No double-loaded scripts');
for(const src of scripts){
  if (/^https?:/.test(src)) continue;
  const code=fs.readFileSync(path.join(game,src),'utf8');
  new vm.Script(code,{filename:src});
}
for(const item of manifest){
  const filename=`upgrades/${item.id}.js`;
  assert(scripts.includes(filename),`Missing script tag: ${filename}`);
  const registered=[];
  vm.runInNewContext(fs.readFileSync(path.join(game,filename),'utf8'),{
    TinyV6:{register:(index,definition)=>registered.push({index,definition})}
  },{filename,timeout:1000});
  assert.equal(registered.length,1,`Exactly one scene assignment: ${item.id}`);
  assert.equal(registered[0].index,item.index);
  assert.equal(registered[0].definition.id,item.id);
  assert.equal(typeof registered[0].definition.create,'function');
  const test=path.join(__dirname,'upgrades',`${item.id}.cjs`);
  new vm.Script(fs.readFileSync(test,'utf8'),{filename:test});
  assert(fs.statSync(path.join(__dirname,'upgrades',`${item.id}.md`)).size>100,`Review notes: ${item.id}`);
}
const retained=fs.readdirSync(path.join(previous,'scenes')).filter(n=>n.endsWith('.js'));
assert.equal(retained.length,25);
for(const name of retained)assert(fs.readFileSync(path.join(previous,'scenes',name)).equals(fs.readFileSync(path.join(game,'scenes',name))),`Retained v5 scene changed: ${name}`);
assert(!html.includes('SPECIFICATIONS.md'),'No idea-checklist link in the game');
console.log('PASS: 83 scene-owned upgrades/tests/reviews, 25 unchanged additions, all script assets parse.');
