
(async function(){
  const data=await TravelData.getDays();
  const select=document.getElementById('daySelect');
  const gallery=document.getElementById('gallery');
  (data||[]).sort((a,b)=> new Date(a.date)-new Date(b.date)).forEach(d=>{
    if(!select) return;
    const opt=document.createElement('option'); opt.value=d.id; opt.textContent=`${d.date} – ${d.title}`; select.appendChild(opt);
  });
  function render(){
    const id=select?.value||'';
    let photos=[];
    if(id){ const d=data.find(x=>x.id===id); photos=(d&&d.photos)||[]; } else { photos=(data||[]).flatMap(d=> d.photos||[]); }
    gallery.innerHTML = photos.length ? photos.map(u=>`<img src="${u}" alt="" loading="lazy">`).join('') : '<p>Noch keine Fotos.</p>';
  }
  select?.addEventListener('change', render);
  render();
})();
