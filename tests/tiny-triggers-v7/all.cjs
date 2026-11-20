const {spawnSync}=require('node:child_process'),path=require('node:path');
const checks=['audit.cjs','retained.cjs','additions.cjs','migration.cjs','collection.cjs','shell.cjs'];
if(process.argv.includes('--list')) console.log(checks.join('\n'));
else for(const check of checks){const result=spawnSync(process.execPath,[path.join(__dirname,check)],{stdio:'inherit',env:process.env});if(result.error)throw result.error;if(result.status!==0){process.exitCode=result.status??1;break;}}
