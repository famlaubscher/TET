
const TravelData=(function(){
  function showBanner(msg){
    const m=document.createElement('div'); m.className='banner'; m.textContent=msg;
    const c=document.querySelector('.container') || document.body;
    c.prepend(m);
  }
  async function getJSON(path){
    try{
      const res = await fetch(path, { cache: 'no-cache' });
      if(!res.ok) throw new Error('HTTP '+res.status);
      return await res.json();
    }catch(e){
      showBanner('Konnte '+path+' nicht laden. Bitte prüfen, ob die Datei existiert. ('+e.message+')');
      return {};
    }
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
    const img = (e.photos && e.photos[0]) || 'images/image1.jpg';
    return `<li class="card">
      <a href="day.html?id=${encodeURIComponent(e.id)}" style="display:block;color:inherit;text-decoration:none">
        <img src="${img}" alt="${e.title}">
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
