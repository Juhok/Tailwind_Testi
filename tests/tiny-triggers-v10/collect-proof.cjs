const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{createHash}=require('node:crypto');
const root=path.resolve(__dirname,'../..'),manifest=require('../../games/tiny-triggers/10/IMPROVEMENTS.json'),out={};
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
for(const file of Object.keys(manifest.scenes)){
 const [sub,id]=file.split('/'),sourceSha256=hash(path.join(root,'games/tiny-triggers/10',file+'.js')),testSha256=hash(path.join(__dirname,file+'.cjs'));
 const dir=sub==='upgrades'?'/tmp/tt10-verified':sub==='additions'?'/tmp/tt10-checks':'/tmp/tt10-scene-proofs';
 for(const input of ['mouse','touch']){const p=JSON.parse(fs.readFileSync(path.join(dir,`${id}-${input}.json`)));assert(p.passed);assert.equal(p.sourceSha256||p.module,sourceSha256,file+' source changed');assert.equal(p.testSha256||p.test,testSha256,file+' test changed');}
 out[file]={sourceSha256,testSha256,inputs:['mouse','touch-emulation'],kind:'requested-scene-fix'};
}
fs.writeFileSync(path.join(__dirname,'verification.json'),JSON.stringify(out,null,2)+'\n');console.log('PASS exact current-source mouse/touch proofs for all 15 requested scene fixes');
