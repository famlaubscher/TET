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