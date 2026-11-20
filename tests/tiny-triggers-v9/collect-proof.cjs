const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{createHash}=require('node:crypto');
const root=path.resolve(__dirname,'../..'),ids=require('./addition-ids.json'),out={};
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
for(const id of ids){
 const sourceSha256=hash(path.join(root,'games/tiny-triggers/9/additions',id+'.js')),testSha256=hash(path.join(__dirname,'additions',id+'.cjs'));
 for(const input of ['mouse','touch']){const p=JSON.parse(fs.readFileSync('/tmp/tt9-checks/'+id+'-'+input+'.json'));assert(p.passed);assert.equal(p.sourceSha256,sourceSha256,id+' source changed');assert.equal(p.testSha256,testSha256,id+' test changed');}
 out[id]={sourceSha256,testSha256,inputs:['mouse','touch-emulation']};
}
for(const input of ['mouse','touch']){const p=JSON.parse(fs.readFileSync('/tmp/tt9-verified/cookie-'+input+'.json'));assert(p.passed);assert.equal(p.module,hash(path.join(root,'games/tiny-triggers/9/upgrades/cookie.js')));assert.equal(p.test,hash(path.join(__dirname,'upgrades/cookie.cjs')));}
out.cookie={sourceSha256:hash(path.join(root,'games/tiny-triggers/9/upgrades/cookie.js')),testSha256:hash(path.join(__dirname,'upgrades/cookie.cjs')),inputs:['mouse','touch-emulation'],kind:'existing-scene-refinement'};
fs.writeFileSync(path.join(__dirname,'verification.json'),JSON.stringify(out,null,2)+'\n');
console.log('PASS current-source mouse/touch proofs for 65 new scenes and biscuit refinement');
