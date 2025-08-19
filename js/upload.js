// --- Konfiguration: dein Repo ---
const GH = {
  owner: 'famlaubscher',       // <== ggf. anpassen
  repo:  'TET'                 // <== ggf. anpassen
};

(function initUpload(){
  const $ = s => document.querySelector(s);
  const logEl = $('#log');
  const btn   = $('#btnUpload');
  const dateI = $('#date');
  const brI   = $('#branch');
  const tokI  = $('#token');
  const files = $('#files');

  // Default: heute (Europe/Zurich)
  const tzOffset = new Date().getTimezoneOffset() * 60000;
  const today = new Date(Date.now()-tzOffset).toISOString().slice(0,10);
  dateI.value = today;

  function log(...a){ logEl.textContent += a.join(' ') + '\n'; logEl.scrollTop = logEl.scrollHeight; }

  function sanitizeName(name){
    // Leerzeichen/komische Zeichen -> Bindestrich, doppelte Punkte entfernen
    return name.trim().replace(/\s+/g,'-').replace(/[^a-zA-Z0-9._-]/g,'').replace(/\.+/g,'.');
  }

  function uniqueTargetPath(date, origName, idx){
    const clean = sanitizeName(origName);
    const base  = clean.replace(/\.[^.]+$/, '');
    const ext   = (clean.match(/\.([^.]+)$/)?.[1] || '').toLowerCase();
    const stamp = new Date().toISOString().replace(/[-:T.Z]/g,'').slice(8,14); // hhmmss
    const suffix = idx>0 ? `-${idx}` : '';
    return `images/${date}/${base}-${stamp}${suffix}.${ext || 'jpg'}`;
  }

  function fileToBase64(file){
    return new Promise((resolve, reject)=>{
      const fr = new FileReader();
      fr.onload = () => {
        const res = String(fr.result);
        const comma = res.indexOf(',');
        resolve(comma >= 0 ? res.slice(comma+1) : res);
      };
      fr.onerror = reject;
      fr.readAsDataURL(file); // data:*/*;base64,AAA...
    });
  }

  async function putFile({token, branch, path, b64, message}){
    const url = `https://api.github.com/repos/${GH.owner}/${GH.repo}/contents/${encodeURIComponent(path)}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json'
      },
      body: JSON.stringify({ message, content: b64, branch })
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }
    return res.json();
  }

  btn.addEventListener('click', async ()=>{
    logEl.textContent = '';
    const token = tokI.value.trim();
    const branch= brI.value.trim() || 'main';
    const date  = dateI.value || today;
    const list  = Array.from(files.files||[]);

    if (!token){ alert('Bitte Token eintragen.'); return; }
    if (!list.length){ alert('Bitte Bilder auswählen.'); return; }

    log(`Starte Upload in images/${date}/  → Branch ${branch}`);
    for (let i=0; i<list.length; i++){
      const f = list[i];
      try{
        const path = uniqueTargetPath(date, f.name, 0);
        const b64  = await fileToBase64(f);
        log(`↑ ${f.name}  →  ${path}`);
        await putFile({ token, branch, path, b64, message: `add photo: ${path}` });
        log(`✓ ok: ${path}`);
      }catch(e){
        log(`✗ Fehler bei ${f.name}: ${e.message}`);
      }
    }
    log('Fertig.');
  });
})();
