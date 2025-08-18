(async function(){const data=await TravelData.getDays(); const map=L.map('map');
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap-Mitwirkende'}).addTo(map); L.control.scale().addTo(map);
const markers=[], routes=[]; let hasRoute=false; const tenere=L.icon({iconUrl:'icons/marker-tenere.svg',iconSize:[30,30],iconAnchor:[15,22],popupAnchor:[0,-18]});
const accent=getComputedStyle(document.documentElement).getPropertyValue('--gpx').trim()||'#a7adb1';
data.forEach(d=>{ if(typeof d.end_lat==='number'&&typeof d.end_lng==='number'){markers.push(L.marker([d.end_lat,d.end_lng],{icon:tenere}).bindPopup(`<strong>${d.title}</strong><br>${d.location||''}<br><a href="day.html?id=${encodeURIComponent(d.id)}">Details</a>`));}
if(d.gpx){hasRoute=true; routes.push(new L.GPX(d.gpx,{async:true, polyline_options:{color:accent,weight:4,opacity:.95}}));}});
const mg=L.featureGroup(markers).addTo(map); const rg=L.featureGroup(routes).addTo(map); let fitted=false; if(mg.getLayers().length){map.fitBounds(mg.getBounds().pad(0.2)); fitted=true;}
if(hasRoute){ routes[0].on('loaded', e=>{ if(!fitted) map.fitBounds(e.target.getBounds().pad(0.2)); }); } if(!fitted && !hasRoute){ map.setView([20,0],2); }})();