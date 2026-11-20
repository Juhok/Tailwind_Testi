const {spawnSync}=require('node:child_process'),path=require('node:path');
const ids=process.argv.length>2?process.argv.slice(2):['car-door','rising-flush','one-hp','smoke-alarm','roadworks','overwritten-tape'];
for(const mobile of [false,true]){const env={...process.env,LIFECYCLE:'1'};if(mobile)env.MOBILE='1';else delete env.MOBILE;
 const r=spawnSync(process.execPath,[path.join(__dirname,'addition.cjs'),...ids],{stdio:'inherit',env});if(r.error)throw r.error;if(r.status!==0){process.exit(r.status??1);}}
console.log('PASS new-scene active animation pause/resume and Retry isolation on mouse/touch');
