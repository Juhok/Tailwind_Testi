const {spawnSync} = require('node:child_process');
const path = require('node:path');
const ids = ['curtain-clip','vacuum-rug','code-unformatter','chase-card','toilet-hunt','armor-paywall','duvet-corner','pull-tab','oversized-puzzle','cheese-fingers','forgotten-milk','never-loot','peel-here','collapsing-bag','wet-sock','fabric-zipper','microwave-ice','water-sleeve','cold-butter','earbud','printed-period','cookie-switch','short-cable','elevator','controller'];
for (let i=0;i<ids.length;i+=3) {
  const result = spawnSync(process.execPath,[path.join(__dirname,'scene.cjs'),...ids.slice(i,i+3)],{stdio:'inherit',env:process.env});
  if(result.error)throw result.error;
  if(result.status!==0){process.exitCode=result.status ?? 1;break;}
}
