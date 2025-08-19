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

  // 👇 Upload-Link EINMAL hinzufügen
  (function addUploadNav(){
    const nav = document.querySelector('.nav'); if (!nav) return;
    if (nav.querySelector('a[href="upload.html"]')) return; // schon vorhanden
    const a = document.createElement('a');
    a.href = 'upload.html';
    a.textContent = 'Upload';
    nav.appendChild(a);
  })();
})();
