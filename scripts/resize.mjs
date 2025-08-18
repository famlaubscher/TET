import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const srcDir = 'images';
const outDir = path.join(srcDir, 'opt');
const exts = new Set(['.jpg', '.jpeg', '.png']);
const widths = [800, 1600];
const qualityJpg = 82;
const qualityWebp = 82;

async function ensureDir(p){ try { await mkdir(p, { recursive: true }); } catch {} }

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (full.startsWith(path.join(srcDir, 'opt'))) continue;
      files.push(...await walk(full));
    } else {
      const ext = path.extname(e.name).toLowerCase();
      if (exts.has(ext)) files.push(full);
    }
  }
  return files;
}

function outPaths(src, w) {
  const rel = path.relative(srcDir, src);
  const base = rel.replace(/^images[\/]/, '').replace(/\.[^.]+$/, '');
  const dir = path.join(outDir, path.dirname(base));
  const name = path.basename(base);
  return {
    dir,
    jpg: path.join(dir, `${name}-${w}.jpg`),
    webp: path.join(dir, `${name}-${w}.webp`)
  };
}

async function processFile(src) {
  for (const w of widths) {
    const { dir, jpg, webp } = outPaths(src, w);
    await ensureDir(dir);
    const p = (await sharp(src, { failOn: 'none' }).rotate()).resize({ width: w, withoutEnlargement: true });
    await p.clone().jpeg({ quality: qualityJpg, mozjpeg: true }).toFile(jpg);
    await p.clone().webp({ quality: qualityWebp }).toFile(webp);
    console.log('✓', src, '->', jpg, 'and', webp);
  }
}

const files = await walk(srcDir);
if (files.length === 0) { console.log('No source images in', srcDir); process.exit(0); }
await ensureDir(outDir);
for (const f of files) {
  try { await processFile(f); } catch (e) { console.error('Failed:', f, e); }
}
