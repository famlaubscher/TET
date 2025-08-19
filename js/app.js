(function(){
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  const root = document.documentElement;
  const pref = localStorage.getItem('theme')
    || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  if (pref === 'light') root.classList.add('light');

  const btn = document.getElementById('themeToggle');
  if (btn) btn.addEventListener('click', () => {
    root.classList.toggle('light');
    localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
  });

  // Add "Upload (GitHub)" link to nav for today's date folder
  (function addGithubUpload(){
    const repo = { user:'famlaubscher', name:'TET', branch:'main' }; // ggf. anpassen
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    const today = d.toISOString().slice(0,10);
    const url = `https://github.com/${repo.user}/${repo.name}/upload/${repo.branch}/images/${today}/`;
    const nav = document.querySelector('.nav'); if (!nav) return;
    if (!nav.querySelector('a[data-upload]')) {
      const a = document.createElement('a');
      a.textContent = 'Upload (GitHub)'; a.href = url; a.target = '_blank'; a.setAttribute('data-upload','1');
      nav.appendChild(a);
    }
  })();
})();