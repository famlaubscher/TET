import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execFile);

const IMAGES_DIR = 'images';
const DAYS_JSON = 'data/days.json';
const EXCLUDE_DIRS = new Set(['opt', 'opt16x9']);
const IMAGE_EXTS = new Set(['.jpg','.jpeg','.png','.heic','.heif','.webp','.JPG','.JPEG','.PNG','.HEIC','.HEIF','.WEBP']);

// Europe/Zurich bias for "today" fallback
function toISODateLocal(d){
  const tz = 'Europe/Zurich';
  const fmt = new Intl.DateTimeFormat('de-CH', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' });
  const parts = fmt.formatToParts(d).reduce((o,p)=> (o[p.type]=p.value, o), {});
  return `${parts.year}-${parts.month}-${parts.day}`;
}

async function walk(dir){
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries){
    const full = path.join(dir, e.name);
    if (e.isDirectory()){
      if (dir === IMAGES_DIR && EXCLUDE_DIRS.has(e.name)) continue;
      files.push(...await walk(full));
    } else {
      const ext = path.extname(e.name);
      if (IMAGE_EXTS.has(ext)) files.push(full);
    }
  }
  return files;
}

async function gitFileDateISO(file){
  try {
    const { stdout } = await exec('git', ['log', '-1', '--format=%cI', '--', file]);
    const iso = stdout.trim();
    if (iso) return iso.slice(0,10);
  } catch {}
  return toISODateLocal(new Date());
}

function dateFromPath(p){
  // Accept images/YYYY-MM-DD/... as the date source
  const parts = p.split(path.sep);
  const idx = parts.indexOf('images');
  if (idx >= 0 && idx+1 < parts.length){
    const d = parts[idx+1];
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  }
  return null;
}

async function ensureDaysBase(){
  try { await mkdir('data', { recursive: true }); } catch {}
  try {
    const raw = await readFile(DAYS_JSON, 'utf-8');
    const json = JSON.parse(raw);
    if (!json.days) json.days = [];
    return json;
  } catch {
    return { days: [] };
  }
}

function uniqueId(base, used){
  let id = base, i = 2;
  while (used.has(id)) { id = `${base}-${i++}`; }
  used.add(id);
  return id;
}

function normalizePhotos(arr){ return Array.from(new Set(arr)); }

async function run(){
  const allImages = await walk(IMAGES_DIR);
  const data = await ensureDaysBase();

  // Build a set of already referenced images
  const used = new Set();
  for (const d of data.days){
    for (const p of (d.photos || [])) used.add(p);
  }

  // Group new images by date
  const byDate = new Map();
  for (const img of allImages){
    const rel = img.replace(/\\/g,'/'); // normalize for Windows
    if (used.has(rel)) continue; // already in days.json
    let dt = dateFromPath(rel);
    if (!dt) dt = await gitFileDateISO(rel);

    if (!byDate.has(dt)) byDate.set(dt, []);
    byDate.get(dt).push(rel);
  }

  if (byDate.size === 0){
    console.log('No new images to add.');
    return;
  }

  // Index days by date (may not be unique ids)
  const byDateDay = new Map();
  for (const d of data.days){
    if (d.date) byDateDay.set(d.date, d);
  }

  // Used ids to avoid collision when creating new
  const usedIds = new Set(data.days.map(d=>d.id));

  for (const [dt, photos] of byDate){
    let day = byDateDay.get(dt);
    if (!day){
      const baseId = `tag-${dt}`;
      const id = uniqueId(baseId, usedIds);
      day = { id, date: dt, title: `Tag ${dt}`, location: '', text: '', photos: [] };
      data.days.push(day);
      byDateDay.set(dt, day);
    }
    day.photos = normalizePhotos([...(day.photos || []), ...photos]);
  }

  // Sort by date ascending
  data.days.sort((a,b)=> (a.date||'').localeCompare(b.date||''));

  // Write back
  const out = JSON.stringify(data, null, 2);
  await writeFile(DAYS_JSON, out, 'utf-8');
  console.log('Updated', DAYS_JSON);
}

run().catch(e=>{ console.error(e); process.exit(1); });
