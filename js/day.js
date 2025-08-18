
(async function(){
  const id=new URL(location.href).searchParams.get('id');
  const res = await fetch('data/days.json', { cache: 'no-cache' });
  const json = res.ok ? await res.json() : {days:[]};
  const all = json.days || [];
  const d = all.find(x=>x.id===id) || all.sort((a,b)=> new Date(b.date)-new Date(a.date))[0];
  if(!d){ document.body.innerHTML='<p>Kein Eintrag gefunden.</p>'; return; }
  document.title=d.title+' – Meine Reise';
  const fmt = s => new Date(s).toLocaleDateString('de-CH',{year:'numeric',month:'short',day:'numeric'});
  document.getElementById('dayTitle').textContent=d.title;
  document.getElementById('dayMeta').textContent=`${fmt(d.date)} · ${(d.location||'')}${d.km?' · '+d.km+' km':''}`;
  document.getElementById('dayText').innerHTML=(d.text||'').split('\n').map(p=>`<p>${p}</p>`).join('');

  // Galerie (mit Fallback)
  const gal=document.getElementById('gallery');
  const photos = (d.photos||[]);
  gal.innerHTML = photos.length
    ? photos.map(u=>`<img src="${u}" alt="${d.title}" loading="lazy"
                       onerror="this.onerror=null;this.src='images/placeholder.jpg'; this.alt='Bild nicht gefunden';">`).join('')
    : '<p>Noch keine Fotos.</p>';
})();
