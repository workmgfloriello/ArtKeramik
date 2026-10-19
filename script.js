/* ====== FOTO DEI LAVORI ======
   1) Metti le foto nella cartella "foto" (accanto a index.html)
   2) Aggiungi una riga qui sotto per ogni foto: {src:"foto/NOME.jpg", de:"Titolo tedesco", it:"Titolo italiano"},
   Le foto compaiono nella galleria e si ingrandiscono al clic. */
var FOTO = [
  // {src:"foto/bagno-1.jpg", de:"Badezimmer", it:"Bagno"},
  // {src:"foto/cucina-1.jpg", de:"Küche", it:"Cucina"},
  // {src:"foto/pavimento-1.jpg", de:"Wohnbereich", it:"Zona giorno"},
];
/* Foto di Antonio (facoltativa): scrivi il percorso, es. "foto/antonio.jpg" */
var RITRATTO = "";

(function () {
  var L = 'de', idx = 0;
  var q = function (s) { return document.querySelector(s); };
  var hero = q('.hero'), tiles = q('.tiles'), glow = q('.glow');

  function build() {
    tiles.innerHTML = '';
    var s = window.innerWidth < 700 ? 64 : 96, c = Math.ceil(window.innerWidth / s), r = Math.ceil(hero.offsetHeight / s);
    tiles.style.gridTemplateColumns = 'repeat(' + c + ',1fr)';
    tiles.style.gridTemplateRows = 'repeat(' + r + ',1fr)';
    for (var y = 0; y < r; y++) for (var x = 0; x < c; x++) { var i = document.createElement('i'); i.style.setProperty('--d', x + y); tiles.appendChild(i); }
  }
  build();
  hero.addEventListener('pointermove', function (e) {
    var b = hero.getBoundingClientRect();
    glow.style.setProperty('--mx', (e.clientX - b.left) + 'px');
    glow.style.setProperty('--my', (e.clientY - b.top) + 'px');
  });

  /* galleria */
  var gal = q('#gal');
  function tag(el, de, it) { el.setAttribute('data-de', de); el.setAttribute('data-it', it || de); el.textContent = de; }
  if (FOTO.length) {
    FOTO.forEach(function (f, i) {
      var b = document.createElement('button'); b.className = 'ph'; b.type = 'button';
      var im = new Image(); im.src = f.src; im.alt = f.de || ''; im.loading = 'lazy';
      im.onerror = function () { b.remove(); };
      b.appendChild(im);
      if (f.de) { var s = document.createElement('span'); tag(s, f.de, f.it); b.appendChild(s); }
      b.onclick = function () { open(i); };
      gal.appendChild(b);
    });
  } else {
    [['Wohnbereich', 'Zona giorno'], ['Badezimmer', 'Bagno'], ['Küche', 'Cucina'], ['Naturstein', 'Pietra naturale'], ['Terrasse', 'Terrazza'], ['Wandverkleidung', 'Rivestimento']].forEach(function (n) {
      var d = document.createElement('div'); d.className = 'ph empty';
      var s = document.createElement('span'); tag(s, n[0], n[1]); d.appendChild(s); gal.appendChild(d);
    });
  }
  if (RITRATTO) { var p = q('.portrait'), im = new Image(); im.src = RITRATTO; im.alt = 'Antonio Floriello'; im.onload = function () { p.insertBefore(im, p.firstChild); }; }

  /* lightbox */
  var lb = q('.lb'), lbi = q('.lb img'), lbc = q('.lb p');
  function show() { var f = FOTO[idx]; lbi.src = f.src; lbi.alt = f.de || ''; lbc.textContent = (L === 'it' ? f.it : f.de) || f.de || ''; }
  function open(i) { idx = i; show(); lb.hidden = false; }
  function step(d) { idx = (idx + d + FOTO.length) % FOTO.length; show(); }
  q('.lb .x').onclick = function () { lb.hidden = true; };
  q('.lb .p').onclick = function () { step(-1); };
  q('.lb .n').onclick = function () { step(1); };
  lb.addEventListener('click', function (e) { if (e.target === lb) lb.hidden = true; });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') lb.hidden = true;
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  /* lingua */
  var btns = document.querySelectorAll('.lang button');
  function set(l) {
    L = l; document.documentElement.lang = l;
    document.querySelectorAll('[data-de]').forEach(function (e) { e.innerHTML = e.getAttribute('data-' + l) || e.getAttribute('data-de'); });
    btns.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.l === l); });
    if (!lb.hidden) show();
  }
  btns.forEach(function (b) { b.addEventListener('click', function () { set(b.dataset.l); }); });
})();