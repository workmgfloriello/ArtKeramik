/* ====== FOTO DEI LAVORI ======
   1) Metti le foto nella cartella "foto" (accanto a index.html)
   2) Aggiungi una riga qui sotto per ogni foto: {src:"foto/NOME.jpg", de:"Titolo tedesco", it:"Titolo italiano"},
   Le foto compaiono nella galleria e si ingrandiscono al clic. */
var FOTO = [
  {src:"./assets/image.png", de:"", it:""},
  {src:"./assets/image2.png", de:"", it:""},
  {src:"./assets/image3.png", de:"", it:""},
  {src:"./assets/image4.png", de:"", it:""},
  {src:"./assets/image5.png", de:"", it:""},
];
/* Foto di Antonio (facoltativa), es. "foto/antonio.jpg" */
var RITRATTO = "";

(function () {
  var L = 'de', idx = 0;
  var q = function (s) { return document.querySelector(s); };
  var qa = function (s) { return document.querySelectorAll(s); };
  var hero = q('.hero'), tiles = q('.tiles'), glow = q('.glow');

  /* mosaico animato */
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

  /* immagini: ogni elemento con data-img="foto/x.jpg" prende la foto se esiste */
  if (RITRATTO) q('.portrait').setAttribute('data-img', RITRATTO);
  qa('[data-img]').forEach(function (el) {
    var src = el.getAttribute('data-img'); if (!src) return;
    var im = new Image();
    im.onload = function () { el.style.backgroundImage = 'url("' + src + '")'; el.classList.add('has'); };
    im.src = src;
  });

  /* slider */
  var slides = qa('.slide'), dots = q('.dots'), cur = 0, timer;
  slides.forEach(function (s, i) {
    var d = document.createElement('button'); d.setAttribute('aria-label', 'Slide ' + (i + 1));
    d.onclick = function () { go(i); play(); }; dots.appendChild(d);
  });
  function go(i) {
    cur = (i + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle('on', k === cur); });
    dots.childNodes.forEach(function (d, k) { d.classList.toggle('on', k === cur); });
  }
  function play() { clearInterval(timer); if (!matchMedia('(prefers-reduced-motion:reduce)').matches) timer = setInterval(function () { go(cur + 1); }, 6500); }
  go(0); play();

  /* menu mobile */
  var bg = q('.burger'), menu = q('#menu');
  bg.onclick = function () { var o = menu.classList.toggle('open'); bg.setAttribute('aria-expanded', o); };
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') { menu.classList.remove('open'); bg.setAttribute('aria-expanded', false); } });

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
  var btns = qa('.lang button');
  function set(l) {
    L = l; document.documentElement.lang = l;
    qa('[data-de]').forEach(function (e) { e.innerHTML = e.getAttribute('data-' + l) || e.getAttribute('data-de'); });
    btns.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.l === l); });
    if (!lb.hidden) show();
  }
  btns.forEach(function (b) { b.addEventListener('click', function () { set(b.dataset.l); }); });
})();