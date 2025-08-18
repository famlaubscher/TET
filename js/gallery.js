(async function(){
  const data = await TravelData.getDays();
  const select = document.getElementById('daySelect');
  const gallery = document.getElementById('gallery');

  (data||[]).sort((a,b)=> new Date(a.date)-new Date(b.date)).forEach(d=>{
    if(!select) return;
    const opt=document.createElement('option'); opt.value=d.id; opt.textContent=`${d.date} – ${d.title}`; select.appendChild(opt);
  });

  function derive(p){
    const base = p.replace(/^images\//,'').replace(/\.[^.]+$/, '');
    return {
      c_webp800: `images/opt16x9/${base}-800.webp`,
      c_webp1600: `images/opt16x9/${base}-1600.webp`,
      c_jpg1600: `images/opt16x9/${base}-1600.jpg`,
      webp800: `images/opt/${base}-800.webp`,
      webp1600: `images/opt/${base}-1600.webp`,
      jpg1600: `images/opt/${base}-1600.jpg`,
      original: p
    };
  }

  function pictureHTML(p){
    const s = derive(p);
    return `<picture>
      <source type="image/webp" srcset="${s.c_webp800} 800w, ${s.c_webp1600} 1600w" sizes="(min-width: 900px) 25vw, 50vw">
      <img src="${s.c_jpg1600}" alt="" loading="lazy" decoding="async"
           onerror="(() => {
             this.onerror = () => { this.onerror=null; this.src='${s.original}'; };
             this.src='${s.jpg1600}';
           })()">
    </picture>`;
  }

  function render(){
    const id = select?.value || '';
    let photos = [];
    if(id){
      const d = data.find(x=>x.id===id);
      photos = (d && d.photos) || [];
    }else{
      photos = (data||[]).flatMap(d => d.photos||[]);
    }
    gallery.innerHTML = photos.length ? photos.map(p=> pictureHTML(p)).join('') : '<p>Noch keine Fotos.</p>';
  }

  select?.addEventListener('change', render);
  render();
})();
