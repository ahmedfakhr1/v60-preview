(function () {
  var doc = document;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* mobile nav */
  var burger = doc.querySelector('.burger');
  var panel = doc.getElementById('panel-nav');
  function setNav(open) {
    if (!burger || !panel) return;
    panel.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.textContent = open ? 'Close' : 'Menu';
  }
  if (burger && panel) {
    burger.addEventListener('click', function () { setNav(!panel.classList.contains('open')); });
    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });
    matchMedia('(min-width: 900px)').addEventListener('change', function (m) { if (m.matches) setNav(false); });
  }

  /* language dialog */
  var dlg = doc.getElementById('lang-dialog');
  doc.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () {
      setNav(false);
      if (dlg && dlg.showModal) dlg.showModal();
    });
  });
  if (dlg) {
    dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.hasAttribute('data-close')) dlg.close(); });
  }

  /* reveal on scroll */
  var rv = doc.querySelectorAll('.rv');
  if (rv.length) {
    if ('IntersectionObserver' in window && !reduce) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      rv.forEach(function (el) { io.observe(el); });
    } else {
      rv.forEach(function (el) { el.classList.add('in'); });
    }
  }

  /* picker */
  var picker = doc.querySelector('[data-picker]');
  if (picker) {
    var data = {
      coffee: { name: 'Homemade pistachio latte', line: 'Our signature, made in house.', img: 'assets/img/pistachio-latte.jpg', w: 787, h: 1400, alt: 'An iced pistachio latte in a clear cup with the V60 mark, on a honey wood table.', href: 'menu.html#coffee' },
      filter: { name: 'Fresh filter coffee', line: 'Brewing moments, one cup at a time.', img: 'assets/img/filter-pourover.jpg', w: 788, h: 1400, alt: 'A V60 dripper over a carafe of ice, filter coffee dripping through.', href: 'menu.html#coffee' },
      matcha: { name: 'Coco-Matcha Cloud', line: 'The combination you did not know you needed.', img: 'assets/img/coco-matcha-cloud.jpg', w: 1043, h: 1200, alt: 'Coco-Matcha Cloud, an iced matcha in a clear cup on a honey wood table.', href: 'menu.html#matcha' },
      fizz: { name: 'Raspberry Fizz and Passionfruit Island', line: 'Our newest mojito madness.', img: 'assets/img/raspberry-passion.jpg', w: 1012, h: 1800, alt: 'A purple and a yellow refresher on a white stool.', href: 'menu.html#refreshers' },
      bagel: { name: 'Bagels', line: 'Layered up and ready to devour.', img: 'assets/img/bagel-close.jpg', w: 1200, h: 1200, alt: 'A bagel torn open, layered with salmon and greens.', href: 'menu.html#bites' }
    };
    var nameEl = doc.querySelector('[data-pick-name]');
    var lineEl = doc.querySelector('[data-pick-line]');
    var linkEl = doc.querySelector('[data-pick-link]');
    var imgEl = doc.querySelector('[data-pick-img]');
    var busy = 0;
    picker.addEventListener('change', function (e) {
      var d = data[e.target.value];
      if (!d) return;
      nameEl.textContent = d.name;
      lineEl.textContent = d.line;
      linkEl.setAttribute('href', d.href);
      var token = ++busy;
      var next = new Image();
      next.onload = next.onerror = function () {
        if (token !== busy) return;
        if (reduce) { swap(); return; }
        imgEl.classList.add('out');
        setTimeout(function () { if (token === busy) { swap(); imgEl.classList.remove('out'); } }, 180);
      };
      function swap() {
        imgEl.src = d.img; imgEl.width = d.w; imgEl.height = d.h; imgEl.alt = d.alt;
      }
      next.src = d.img;
    });
  }

  /* menu page: greeting and category chips */
  var greet = doc.querySelector('[data-greet]');
  if (greet) {
    var h = new Date().getHours();
    greet.textContent = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  }
  var cats = doc.querySelector('.cats');
  if (cats) {
    var links = Array.prototype.slice.call(cats.querySelectorAll('a'));
    var secs = links.map(function (a) { return doc.querySelector(a.getAttribute('href')); });
    function mark(id) {
      links.forEach(function (a) {
        var on = a.getAttribute('href') === '#' + id;
        a.setAttribute('aria-current', on ? 'true' : 'false');
      });
    }
    if ('IntersectionObserver' in window) {
      var so = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) mark(en.target.id); });
      }, { rootMargin: '-35% 0px -60% 0px' });
      secs.forEach(function (s) { if (s) so.observe(s); });
    }
    links.forEach(function (a) {
      a.addEventListener('click', function () { mark(a.getAttribute('href').slice(1)); });
    });
    mark(secs[0] ? secs[0].id : '');
  }
})();
