const {spawnSync}=require('node:child_process'),path=require('node:path');
const ids=process.argv.length>2?process.argv.slice(2):require('./addition-ids.json');
for(let i=0;i<ids.length;i+=3){const r=spawnSync(process.execPath,[path.join(__dirname,'addition.cjs'),...ids.slice(i,i+3)],{stdio:'inherit',env:process.env});if(r.error)throw r.error;if(r.status!==0){process.exitCode=r.status??1;break;}}
