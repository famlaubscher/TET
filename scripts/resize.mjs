import { readdir, mkdir, stat, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const srcDir = 'images';
const outDir = path.join(srcDir, 'opt');
const exts = new Set(['.jpg', '.jpeg', '.png']);
const widths = [800, 1600]; // thumbs + large
const qualityJpg = 82;
const qualityWebp = 82;

async function ensureDir(p){ try { await mkdir(p, { recursive: true }); } catch {} }

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (full.startsWith(path.join(srcDir, 'opt'))) continue; // skip outputs
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
  const input = sharp(src, { failOn: 'none' }).rotate(); // auto-rotate by EXIF
  const meta = await input.metadata();
  // Skip tiny images
  if ((meta.width || 0) < 600) return;

  for (const w of widths) {
    const { dir, jpg, webp } = outPaths(src, w);
    await ensureDir(dir);
    // Resize to width, preserve aspect (no hard crop). CSS will crop visually via object-fit.
    const pipeline = sharp(src).rotate().resize({ width: w, withoutEnlargement: true });
    await pipeline.clone().jpeg({ quality: qualityJpg, mozjpeg: true }).toFile(jpg);
    await pipeline.clone().webp({ quality: qualityWebp }).toFile(webp);
    console.log('✓', path.basename(src), '->', path.relative('.', jpg), 'and', path.relative('.', webp));
  }
}

const files = await walk(srcDir);
if (files.length === 0) {
  console.log('No source images found in', srcDir);
  process.exit(0);
}

await ensureDir(outDir);
for (const f of files) {
  try { await processFile(f); } catch (e) { console.error('Failed:', f, e); }
}
