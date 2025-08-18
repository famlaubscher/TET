
(async function(){
  const days = await TravelData.getDays();
  const list = document.getElementById('daysList');
  const search = document.getElementById('search');
  const tagFilter = document.getElementById('tagFilter');
  function render(items){
    list.innerHTML = items.map(TravelData.renderDayCard).join('') || '<p>Noch keine Einträge.</p>';
  }
  function apply(){
    const q=(search?.value||'').toLowerCase();
    const tag=tagFilter?.value||'';
    const f=days.filter(d=>{
      const matchQ=!q||d.title.toLowerCase().includes(q)||(d.location||'').toLowerCase().includes(q)||(d.text||'').toLowerCase().includes(q);
      const matchT=!tag||(d.tags||[]).includes(tag);
      return matchQ && matchT;
    }).sort((a,b)=> new Date(b.date)-new Date(a.date));
    render(f);
  }
  search?.addEventListener('input', apply);
  tagFilter?.addEventListener('change', apply);
  render(days);
})();
