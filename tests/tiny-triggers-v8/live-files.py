"""Compare every published runtime file against the committed local v8 build."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.request import urlopen, Request
from hashlib import sha256
import json, os, subprocess
root=Path(__file__).resolve().parents[2]
release=root/'games/tiny-triggers/8'
base=os.environ.get('SITE_URL','https://juhok.github.io/Tailwind_Testi/').rstrip('/')+'/'
revision=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()
files=sorted(p for p in release.rglob('*') if p.is_file() and p.suffix in {'.html','.css','.js','.wav','.png','.svg'})
files.append(root/'games.html')
def check(path):
    url=base+path.relative_to(root).as_posix()+'?verify='+revision
    req=Request(url,headers={'Cache-Control':'no-cache'})
    with urlopen(req,timeout=30) as response:
        actual=response.read()
    expected=path.read_bytes()
    if sha256(actual).digest()!=sha256(expected).digest():
        raise AssertionError('Published bytes differ: '+str(path.relative_to(root)))
    return str(path.relative_to(root))
with ThreadPoolExecutor(max_workers=8) as pool:
    checked=list(pool.map(check,files))
print(json.dumps({'ok':True,'revision':revision,'runtimeFiles':len(files)-1,'listing':True,'base':base}))
