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

  /* header action appears once the hero action has scrolled away */
  var bar = doc.querySelector('.bar');
  var heroAct = doc.querySelector('.hero-actions');
  if (bar && heroAct) {
    bar.classList.add('no-cta');
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        var e = en[0];
        var past = !e.isIntersecting && e.boundingClientRect.bottom < 0;
        bar.classList.toggle('no-cta', !past);
      }, { threshold: 0 }).observe(heroAct);
    } else {
      bar.classList.remove('no-cta');
    }
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
      matcha: { name: 'Coco-Matcha Cloud', line: 'The combination you did not know you needed this summer.', img: 'assets/img/coco-matcha-cloud.jpg', w: 1043, h: 1200, alt: 'Coco-Matcha Cloud, an iced matcha in a clear cup on a honey wood table.', href: 'menu.html#matcha' },
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

  /* stainless steel surface behind the page */
  (function steel() {
    var cv = doc.getElementById('steel-bg');
    var root = doc.documentElement;
    if (!cv) return;
    var gl = null;
    try { gl = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' }); } catch (e) {}
    if (!gl) { root.classList.add('nogl'); return; }

    var vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    var fs = [
      'precision mediump float;',
      'uniform vec2 uRes;uniform float uTime;uniform vec2 uPtr;uniform float uScroll;',
      'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
      'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);',
      ' return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}',
      'void main(){',
      ' vec2 px=gl_FragCoord.xy;',
      ' vec2 uv=px/uRes; uv.x*=uRes.x/uRes.y;',
      ' vec2 q=uv+(uPtr-.5)*vec2(.95,.55)+vec2(uTime*.014,uScroll*.26);',
      /* brushed grain: long horizontal strokes */
      ' float g=n(vec2(px.x*.008,px.y*.9))*.55+n(vec2(px.x*.022+9.,px.y*1.9))*.45;',
      /* broad soft reflections of the room lights */
      ' float b1=.5+.5*sin(q.x*3.1+q.y*1.5+.6);',
      ' float b2=pow(.5+.5*sin(q.x*6.4-q.y*2.2+1.7),5.);',
      ' float b3=pow(.5+.5*sin(q.x*1.7+q.y*4.1+3.2),4.);',
      /* thin reflected strip lights with a slow wave, like the door glass and steel wall */
      ' float w=sin(q.x*2.6+uTime*.09)*.035+sin(q.x*7.+uTime*.05)*.006;',
      ' float s1=exp(-pow((q.y-.34-w)*70.,2.));',
      ' float s2=exp(-pow((q.y-.74+w*1.2)*85.,2.))*.8;',
      ' float s3=exp(-pow((q.y-1.28-w*.8)*65.,2.))*.7;',
      ' float s4=exp(-pow((q.y-.55+w*.6)*140.,2.))*.6;',
      ' float d1=pow(.5+.5*sin(q.x*2.1-q.y*3.3+4.),6.);',
      ' float d2=pow(.5+.5*sin(q.x*4.7+q.y*1.2+.4),8.);',
      ' float v=.40+.22*b1+.34*b2+.16*b3+.55*(s1+s2+s3+s4)-.20*d1-.12*d2;',
      ' v+=(g-.5)*.20*(.5+b2+b3);',
      ' float gr=h(px+floor(uTime*9.)*vec2(17.,31.))-.5;',
      ' v+=gr*.085+(h(px*.5+3.)-.5)*.03;',
      ' v=clamp(v,.06,1.);',
      ' vec3 dk=vec3(.50,.52,.535);',
      ' vec3 lt=vec3(.955,.96,.965);',
      ' gl_FragColor=vec4(mix(dk,lt,v),1.);',
      '}'
    ].join('\n');

    function sh(type, src) {
      var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    }
    var v = sh(gl.VERTEX_SHADER, vs), f = sh(gl.FRAGMENT_SHADER, fs);
    if (!v || !f) { root.classList.add('nogl'); return; }
    var pr = gl.createProgram(); gl.attachShader(pr, v); gl.attachShader(pr, f); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { root.classList.add('nogl'); return; }
    gl.useProgram(pr);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var uRes = gl.getUniformLocation(pr, 'uRes'), uTime = gl.getUniformLocation(pr, 'uTime'),
        uPtr = gl.getUniformLocation(pr, 'uPtr'), uScroll = gl.getUniformLocation(pr, 'uScroll');

    var scale = Math.min(window.devicePixelRatio || 1, 1.25), W = 0, H = 0;
    function size() {
      var w = window.innerWidth, hgt = window.innerHeight;
      if (W && Math.abs(w - W) < 2 && Math.abs(hgt - H) < 160) return;
      W = w; H = hgt;
      cv.width = Math.round(w * scale); cv.height = Math.round(hgt * scale);
      gl.viewport(0, 0, cv.width, cv.height);
    }
    size();
    window.addEventListener('resize', function () { size(); if (reduce) draw(t0); });
    doc.addEventListener('click', function () { if (reduce) setTimeout(function () { draw(t0); }, 30); });

    var wins = Array.prototype.slice.call(doc.querySelectorAll('.steel-win')).map(function (c) { return { c: c, x: c.getContext('2d') }; });
    function sync() {
      for (var i = 0; i < wins.length; i++) {
        var w = wins[i], r = w.c.parentElement.getBoundingClientRect();
        if (r.height < 2 || r.bottom < 0 || r.top > window.innerHeight) continue;
        var pw = Math.round(r.width * scale), ph = Math.round(r.height * scale);
        if (w.c.width !== pw || w.c.height !== ph) { w.c.width = pw; w.c.height = ph; }
        var sy = Math.max(0, Math.round(r.top * scale)), sx = Math.max(0, Math.round(r.left * scale));
        w.x.drawImage(cv, sx, sy, pw, ph, 0, 0, pw, ph);
      }
    }
    var tx = .5, ty = .4, cx = .5, cy = .4, scrollN = 0, t0 = performance.now(), running = true;
    var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (fine) window.addEventListener('pointermove', function (e) { tx = e.clientX / window.innerWidth; ty = 1 - e.clientY / window.innerHeight; }, { passive: true });
    window.addEventListener('scroll', function () {
      var max = Math.max(1, doc.documentElement.scrollHeight - window.innerHeight);
      scrollN = window.scrollY / max;
      if (reduce) { draw(t0); }
      if (!fine) { tx = .5 + Math.sin(scrollN * 6.0) * .25; ty = .4 + Math.cos(scrollN * 4.0) * .2; }
    }, { passive: true });

    function draw(now) {
      cx += (tx - cx) * .06; cy += (ty - cy) * .06;
      gl.uniform2f(uRes, cv.width, cv.height);
      gl.uniform1f(uTime, reduce ? 0 : (now - t0) / 1000);
      gl.uniform2f(uPtr, cx, cy);
      gl.uniform1f(uScroll, scrollN * 3.0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      sync();
    }
    function loop(now) { if (running) { draw(now); requestAnimationFrame(loop); } }
    if (reduce) { draw(t0); } else { requestAnimationFrame(loop); }
    doc.addEventListener('visibilitychange', function () {
      if (reduce) return;
      running = !doc.hidden;
      if (running) requestAnimationFrame(loop);
    });
    root.classList.add('gl');
  })();
})();
