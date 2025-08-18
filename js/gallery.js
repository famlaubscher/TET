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

  function pictureHTML(src){
    // nur Original – sofort stabil
    return `<img src="${src}" alt="" loading="lazy" decoding="async"
             onerror="this.onerror=null; this.src='images/placeholder.jpg';">`;
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
