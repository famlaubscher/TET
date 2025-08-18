
const TravelData=(function(){
  async function getJSON(path){
    const res = await fetch(path, { cache: 'no-cache' });
    if(!res.ok) throw new Error('Ladefehler: '+path+' ('+res.status+')');
    return res.json();
  }
  async function getDays(){
    const data = await getJSON('data/days.json');
    return data.days || [];
  }
  function formatDate(iso){
    const d = new Date(iso);
    return d.toLocaleDateString('de-CH',{year:'numeric',month:'short',day:'numeric'});
  }
  function renderDayCard(e){
    const src = (e.photos && e.photos[0]) || 'images/placeholder.jpg';
    return `<li class="card">
      <a href="day.html?id=${encodeURIComponent(e.id)}" style="display:block;color:inherit;text-decoration:none">
        <img src="${src}" alt="${e.title}" loading="lazy"
             onerror="this.onerror=null;this.src='images/placeholder.jpg'; this.alt='Bild nicht gefunden';">
        <div class="content">
          <h3>${e.title}</h3>
          <p class="meta">${formatDate(e.date)} – ${(e.location||'')}</p>
          <p>${e.text||''}</p>
        </div>
      </a>
    </li>`;
  }
  function getParam(name){
    const url=new URL(window.location.href);
    return url.searchParams.get(name);
  }
  return { getDays, renderDayCard, formatDate, getParam };
})();
