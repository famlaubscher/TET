
(async function(){
  const id=TravelData.getParam('id');
  const all=await TravelData.getDays();
  const d=all.find(x=>x.id===id) || all.sort((a,b)=> new Date(b.date)-new Date(a.date))[0];
  if(!d){ document.body.innerHTML='<p>Kein Eintrag gefunden.</p>'; return; }
  document.title=d.title+' – Meine Reise';
  const $=s=>document.querySelector(s);
  $('#dayTitle')?.append(document.createTextNode(d.title));
  $('#dayMeta')?.append(document.createTextNode(`${TravelData.formatDate(d.date)} · ${(d.location||'')}${d.km? ' · '+d.km+' km':''}`));
  $('#dayText').innerHTML=(d.text||'').split('\n').map(p=>`<p>${p}</p>`).join('');
  const gal=document.getElementById('gallery');
  gal.innerHTML=(d.photos||[]).map(u=>`<img src="${u}" alt="${d.title}" loading="lazy">`).join('') || '<p>Noch keine Fotos.</p>';

  const map=L.map('map');
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap-Mitwirkende'}).addTo(map);
  L.control.scale().addTo(map);

  const markers=[];
  if(typeof d.start_lat==='number'&&typeof d.start_lng==='number') markers.push(L.marker([d.start_lat,d.start_lng]).bindPopup('Start'));
  if(typeof d.end_lat==='number'&&typeof d.end_lng==='number') markers.push(L.marker([d.end_lat,d.end_lng]).bindPopup('Ende'));
  let bounds=null;
  if(markers.length){ const g=L.featureGroup(markers).addTo(map); bounds=g.getBounds(); }

  // GPX styling with CSS accent color
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#4da3ff';
  if(d.gpx){
    new L.GPX(d.gpx, {
      async:true,
      polyline_options: { color: accent, weight: 4, opacity: 0.95 },
      marker_options: { startIconUrl:null, endIconUrl:null, shadowUrl:null }
    })
    .on('loaded', e=>{
      const b=e.target.getBounds();
      map.fitBounds(bounds ? bounds.extend(b) : b.pad(0.2));
    })
    .addTo(map);
  }else{
    if(bounds){ map.fitBounds(bounds.pad(0.25)); } else { map.setView([20,0],2); }
  }

  // Locate button
  const actions=document.createElement('div'); actions.className='map-actions';
  const btn=document.createElement('button'); btn.textContent='📍 Lokalisieren';
  btn.addEventListener('click', ()=>{
    if(!navigator.geolocation) return alert('Geolocation nicht verfügbar.');
    navigator.geolocation.getCurrentPosition(pos=>{
      const {latitude, longitude}=pos.coords;
      map.setView([latitude, longitude], 10);
      L.marker([latitude, longitude]).addTo(map).bindPopup('Du bist hier').openPopup();
    }, err=> alert('Konnte Position nicht ermitteln: '+err.message));
  });
  actions.appendChild(btn);
  document.querySelector('.day-map')?.appendChild(actions);
})();
