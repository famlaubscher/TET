<script>
(async function(){
  const data = await TravelData.getDays();
  const select = document.getElementById('daySelect');
  const gallery = document.getElementById('gallery');

  (data||[]).sort((a,b)=> new Date(a.date)-new Date(b.date)).forEach(d=>{
    const o=document.createElement('option');
    o.value=d.id; o.textContent=`${d.date} – ${d.title}`;
    select.appendChild(o);
  });

  function derive(p){
    const base = p.replace(/^images\//,'').replace(/\.[^.]+$/, '');
    return {
      cWebp800:  `images/opt16x9/${base}-800.webp`,
      cWebp1600: `images/opt16x9/${base}-1600.webp`,
      cJpg1600:  `images/opt16x9/${base}-1600.jpg`,
      webp800:   `images/opt/${base}-800.webp`,
      webp1600:  `images/opt/${base}-1600.webp`,
      jpg1600:   `images/opt/${base}-1600.jpg`,
      orig:      `images/${base.split('/').pop()}.jpg` // falls du .png nutzt, lass `p` stehen
    };
  }

  function pictureHTML(p){
    const s = derive(p);
    return `<picture>
      <source type="image/webp"
              srcset="${s.cWebp800} 800w, ${s.cWebp1600} 1600w"
              sizes="(min-width: 900px) 25vw, 50vw">
      <img src="${s.cJpg1600}" alt="" loading="lazy" decoding="async"
           onerror="if(this.dataset.alt==='1'){ this.onerror=null; this.src='${s.orig}'; }
                    else { this.dataset.alt='1'; this.src='${s.jpg1600}'; }">
    </picture>`;
  }

  function render(){
    const id = select?.value || '';
    let photos = [];
    if(id){ const d = data.find(x=>x.id===id); photos = (d && d.photos) || []; }
    else { photos = (data||[]).flatMap(d => d.photos||[]); }
    gallery.innerHTML = photos.length ? photos.map(p=> pictureHTML(p)).join('') : '<p>Noch keine Fotos.</p>';
  }

  select?.addEventListener('change', render);
  render();
})();
</script>
