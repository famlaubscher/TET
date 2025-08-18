(async function(){
  try {
    const data = await TravelData.getDays();
    const select = document.getElementById('daySelect');
    const gallery = document.getElementById('gallery');
    if (!gallery) return;

    // Dropdown füllen
    (data || []).sort((a,b)=> new Date(a.date)-new Date(b.date)).forEach(d=>{
      if (select) {
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.textContent = `${d.date} – ${d.title}`;
        select.appendChild(opt);
      }
    });

    function imgTag(src){
      return `<img src="${src}" alt="" loading="lazy" decoding="async"
               onerror="this.onerror=null; this.src='images/placeholder.jpg';">`;
    }

    function render(){
      const id = select?.value || '';
      let photos = [];
      if (id) {
        const d = data.find(x => x.id === id);
        photos = (d && d.photos) || [];
      } else {
        photos = (data || []).flatMap(d => d.photos || []);
      }
      gallery.innerHTML = photos.length
        ? photos.map(p => imgTag(p)).join('')
        : '<p>Noch keine Fotos.</p>';
    }

    select?.addEventListener('change', render);
    render();
  } catch (e) {
    console.error('Gallery init failed', e);
    const gallery = document.getElementById('gallery');
    if (gallery) gallery.innerHTML = '<p>Fehler beim Laden der Galerie.</p>';
  }
})();
// --- Lightbox ---
(function(){
  const lb = document.getElementById('lightbox');
  if(!lb) return;
  const imgEl = lb.querySelector('img');
  const btnPrev = lb.querySelector('.prev');
  const btnNext = lb.querySelector('.next');
  const btnClose = lb.querySelector('.close');
  let current = 0, sources = [];

  function collectSources(){
    sources = Array.from(document.querySelectorAll('#gallery img')).map(img => img.currentSrc || img.src);
  }
  function openAt(i){
    if(!sources.length) collectSources();
    current = (i+sources.length) % sources.length;
    imgEl.src = sources[current];
    lb.classList.add('open');
  }
  function close(){ lb.classList.remove('open'); }
  function prev(){ openAt(current-1); }
  function next(){ openAt(current+1); }

  // Delegation: click on any gallery image
  document.getElementById('gallery').addEventListener('click', e=>{
    const ix = [...document.querySelectorAll('#gallery img')].indexOf(e.target);
    if(ix >= 0){ collectSources(); openAt(ix); }
  });

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', prev);
  btnNext.addEventListener('click', next);

  document.addEventListener('keydown', e=>{
    if(!lb.classList.contains('open')) return;
    if(e.key === 'Escape') close();
    if(e.key === 'ArrowLeft') prev();
    if(e.key === 'ArrowRight') next();
  });
})();
