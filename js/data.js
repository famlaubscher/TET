const TravelData=(function(){async function getJSON(p){const r=await fetch(p,{cache:'no-cache'}); if(!r.ok) throw new Error('HTTP '+r.status); return r.json();}
async function getDays(){const d=await getJSON('data/days.json'); return d.days||[]}
function f(iso){return new Date(iso).toLocaleDateString('de-CH',{year:'numeric',month:'short',day:'numeric'})}
function card(e){const img=(e.photos&&e.photos[0])||'images/image1.jpg'; return `<li class="card"><a href="day.html?id=${encodeURIComponent(e.id)}" style="display:block;color:inherit;text-decoration:none">
<img src="${img}" alt="${e.title}" loading="lazy" onerror="this.onerror=null;this.src='images/placeholder.jpg';"><div class="content"><h3>${e.title}</h3><p class="meta">${f(e.date)} – ${(e.location||'')}</p><p>${e.text||''}</p></div></a></li>`}
function param(n){return new URL(location.href).searchParams.get(n)} return { getDays, renderDayCard:card, formatDate:f, getParam:param };})();