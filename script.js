(function () {
  var FT = typeof FOTO !== 'undefined' ? FOTO : [], VD = typeof VIDEO !== 'undefined' ? VIDEO : [], RT = typeof RITRATTO !== 'undefined' ? RITRATTO : '';
  var L = 'de', IV = 6500, cur = 0, timer, LIST = [], idx = 0;
  var q = function (s) { return document.querySelector(s); };
  var qa = function (s) { return document.querySelectorAll(s); };
  var each = function (l, f) { Array.prototype.forEach.call(l, f); };
  var hero = q('.hero'), tiles = q('.tiles'), glow = q('.glow');

  /* mosaico animato */
  tiles.innerHTML = '';
  var s0 = window.innerWidth < 700 ? 64 : 96, c0 = Math.ceil(window.innerWidth / s0), r0 = Math.ceil(hero.offsetHeight / s0);
  tiles.style.gridTemplateColumns = 'repeat(' + c0 + ',1fr)'; tiles.style.gridTemplateRows = 'repeat(' + r0 + ',1fr)';
  for (var y = 0; y < r0; y++) for (var x = 0; x < c0; x++) { var t = document.createElement('i'); t.style.setProperty('--d', x + y); tiles.appendChild(t); }
  hero.addEventListener('pointermove', function (e) {
    var b = hero.getBoundingClientRect();
    glow.style.setProperty('--mx', (e.clientX - b.left) + 'px'); glow.style.setProperty('--my', (e.clientY - b.top) + 'px');
  });

  /* immagini (card, servizi, ritratto) */
  if (RT) q('.portrait').setAttribute('data-img', RT);
  each(qa('[data-img]:not(.slide)'), function (el) {
    var src = el.getAttribute('data-img'); if (!src) return;
    var im = new Image();
    im.onload = function () { el.style.backgroundImage = 'url("' + src + '")'; el.classList.add('has'); };
    im.src = src;
  });

  /* slider iniziale: foto o video di sfondo, testo che entra a cascata */
  var slides = qa('.slide'), dots = q('.dots'), cnt = q('.cnt');
  dots.style.setProperty('--iv', IV + 'ms');
  each(slides, function (s, i) {
    var bg = document.createElement('div'); bg.className = 'bgm'; s.insertBefore(bg, s.firstChild);
    var v = s.getAttribute('data-video'), img = s.getAttribute('data-img');
    if (v) {
      var vd = document.createElement('video'); vd.muted = true; vd.loop = true; vd.setAttribute('playsinline', ''); vd.preload = 'metadata'; vd.src = v;
      vd.onerror = function () { vd.remove(); }; bg.appendChild(vd); s._v = vd;
    } else if (img) {
      var im = new Image(); im.onload = function () { bg.style.backgroundImage = 'url("' + img + '")'; }; im.src = img;
    }
    each(s.querySelectorAll('.wrap>*'), function (e, k) { e.style.setProperty('--i', k); });
    var d = document.createElement('button'); d.setAttribute('aria-label', 'Slide ' + (i + 1));
    d.onclick = function () { go(i); play(); }; dots.appendChild(d);
  });
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function go(i) {
    cur = (i + slides.length) % slides.length;
    each(slides, function (s, k) {
      s.classList.toggle('on', k === cur);
      if (s._v) { if (k === cur) { s._v.currentTime = 0; s._v.play().catch(function () { }); } else s._v.pause(); }
    });
    each(dots.children, function (d) { d.classList.remove('on'); });
    void dots.offsetWidth; dots.children[cur].classList.add('on');
    cnt.textContent = pad(cur + 1) + ' / ' + pad(slides.length);
  }
  function play() {
    clearInterval(timer);
    if (!matchMedia('(prefers-reduced-motion:reduce)').matches) timer = setInterval(function () { go(cur + 1); }, IV);
  }
  q('.pv').onclick = function () { go(cur - 1); play(); };
  q('.nx').onclick = function () { go(cur + 1); play(); };
  var sx = null;
  hero.addEventListener('pointerdown', function (e) { sx = e.clientX; });
  hero.addEventListener('pointerup', function (e) { if (sx === null) return; var dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 60) { go(cur + (dx < 0 ? 1 : -1)); play(); } });
  document.addEventListener('visibilitychange', function () { if (document.hidden) clearInterval(timer); else play(); });
  go(0); play();

  /* menu mobile */
  var bg = q('.burger'), menu = q('#menu');
  bg.onclick = function () { var o = menu.classList.toggle('open'); bg.setAttribute('aria-expanded', o); };
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') { menu.classList.remove('open'); bg.setAttribute('aria-expanded', false); } });

  /* lightbox per foto e video */
  var lb = q('.lb'), lbi = q('.lb img'), lbv = q('.lb video'), lbf = q('.lb iframe'), lbc = q('.lb p');
  function isVid(f) { return f.yt || /\.(mp4|webm|mov|m4v)(\?|$)/i.test(f.src || ''); }
  function stop() { lbv.pause(); lbv.removeAttribute('src'); lbv.load(); lbf.src = 'about:blank'; }
  function show() {
    var f = LIST[idx]; stop();
    lbi.style.display = lbv.style.display = lbf.style.display = 'none';
    if (f.yt) { lbf.src = 'https://www.youtube-nocookie.com/embed/' + f.yt + '?autoplay=1&rel=0'; lbf.style.display = 'block'; }
    else if (isVid(f)) { lbv.src = f.src; lbv.style.display = 'block'; lbv.play().catch(function () { }); }
    else { lbi.src = f.src; lbi.alt = f.de || ''; lbi.style.display = 'block'; }
    lbc.textContent = (L === 'it' ? f.it : f.de) || f.de || '';
  }
  function open(list, i) {
    LIST = list; idx = i; show(); lb.hidden = false;
    q('.lb .p').style.display = q('.lb .n').style.display = list.length > 1 ? '' : 'none';
  }
  function close() { lb.hidden = true; stop(); }
  function step(d) { idx = (idx + d + LIST.length) % LIST.length; show(); }
  q('.lb .x').onclick = close;
  q('.lb .p').onclick = function () { step(-1); };
  q('.lb .n').onclick = function () { step(1); };
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  /* galleria foto */
  var gal = q('#gal');
  function tag(el, de, it) { el.setAttribute('data-de', de); el.setAttribute('data-it', it || de); el.textContent = de; }
  if (FT.length) {
    FT.forEach(function (f, i) {
      var b = document.createElement('button'); b.className = 'ph'; b.type = 'button';
      var im = new Image(); im.src = f.src; im.alt = f.de || ''; im.loading = 'lazy'; im.onerror = function () { b.remove(); };
      b.appendChild(im);
      if (f.de) { var s = document.createElement('span'); tag(s, f.de, f.it); b.appendChild(s); }
      b.onclick = function () { open(FT, i); };
      gal.appendChild(b);
    });
  } else {
    [['Wohnbereich', 'Zona giorno'], ['Badezimmer', 'Bagno'], ['Küche', 'Cucina'], ['Naturstein', 'Pietra naturale'], ['Terrasse', 'Terrazza'], ['Wandverkleidung', 'Rivestimento']].forEach(function (n) {
      var d = document.createElement('div'); d.className = 'ph empty';
      var s = document.createElement('span'); tag(s, n[0], n[1]); d.appendChild(s); gal.appendChild(d);
    });
  }

  /* sezione video */
  if (VD.length) {
    q('#video').hidden = false; each(qa('[data-vnav]'), function (e) { e.hidden = false; });
    var vg = q('#vg');
    VD.forEach(function (f, i) {
      var b = document.createElement('button'); b.className = 'vid'; b.type = 'button';
      if (f.yt || f.poster) { var im = new Image(); im.src = f.yt ? 'https://img.youtube.com/vi/' + f.yt + '/hqdefault.jpg' : f.poster; im.alt = f.de || ''; b.appendChild(im); }
      else { var v = document.createElement('video'); v.muted = true; v.preload = 'metadata'; v.setAttribute('playsinline', ''); v.src = f.src + '#t=0.6'; b.appendChild(v); }
      var p = document.createElement('i'); p.className = 'play'; b.appendChild(p);
      if (f.de) { var s = document.createElement('span'); tag(s, f.de, f.it); b.appendChild(s); }
      b.onclick = function () { open(VD, i); };
      vg.appendChild(b);
    });
  }

  /* lingua */
  var btns = qa('.lang button');
  function set(l) {
    L = l; document.documentElement.lang = l;
    each(qa('[data-de]'), function (e) { e.innerHTML = e.getAttribute('data-' + l) || e.getAttribute('data-de'); });
    each(btns, function (b) { b.setAttribute('aria-pressed', b.dataset.l === l); });
    if (!lb.hidden) lbc.textContent = (L === 'it' ? LIST[idx].it : LIST[idx].de) || LIST[idx].de || '';
  }
  each(btns, function (b) { b.addEventListener('click', function () { set(b.dataset.l); }); });

  /* animazioni allo scroll */
  var T = qa('.card,.vor>div,.svc>*,.about>*,section:not(.cta) h2,section:not(.cta) .kick,section:not(.cta) .lead,.rows>*,.vid,.ph,.cta .row>*,.fcols>div');
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (en) {
    en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12, rootMargin: '0px 0px -6% 0px' }) : null;
  each(T, function (el) {
    el.classList.add('rv');
    var k = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.style.setProperty('--d', Math.min(k, 5) * 0.09 + 's');
    if (io) io.observe(el); else el.classList.add('in');
  });
})();