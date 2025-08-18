import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const srcDir = 'images';
const outDir = path.join(srcDir, 'opt');
const exts = new Set(['.jpg', '.jpeg', '.png']);
const widths = [800, 1600];
const quality = 82;

async function ensure(p){ try{ await mkdir(p,{recursive:true}); }catch{} }
async function walk(dir){
  const ents = await readdir(dir, { withFileTypes:true });
  const files = [];
  for(const e of ents){
    const full = path.join(dir, e.name);
    if(e.isDirectory()){
      if(full.startsWith(path.join(srcDir,'opt'))) continue;
      files.push(...await walk(full));
    } else if (exts.has(path.extname(e.name).toLowerCase())){
      files.push(full);
    }
  }
  return files;
}
function outPaths(src,w){
  const rel = path.relative(srcDir, src).replace(/\.[^.]+$/, '');
  const dir = path.join(outDir, path.dirname(rel));
  const name = path.basename(rel);
  return { dir, jpg: path.join(dir, `${name}-${w}.jpg`), webp: path.join(dir, `${name}-${w}.webp`) };
}
const files = await walk(srcDir);
await ensure(outDir);
for(const f of files){
  for(const w of widths){
    const {dir,jpg,webp} = outPaths(f,w);
    await ensure(dir);
    const p = (await sharp(f,{failOn:'none'}).rotate()).resize({ width:w, withoutEnlargement:true });
    await p.clone().jpeg({ quality, mozjpeg:true }).toFile(jpg);
    await p.clone().webp({ quality }).toFile(webp);
    console.log('✓', f, '->', jpg, 'and', webp);
  }
}
