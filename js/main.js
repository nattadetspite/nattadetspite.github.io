(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  var ARROW =
    '<svg class="card__arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" ' +
    'stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ' +
    'aria-hidden="true"><path d="M3.5 10.5 10.5 3.5M5 3.5h5.5V9"/></svg>';

  /* ---------------------------------------------------------
     Render the work grid
     --------------------------------------------------------- */
  function buildCard(item) {
    var li = document.createElement('li');

    var a = document.createElement('a');
    a.className = 'card';
    a.href = item.link;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';

    var media = document.createElement('div');
    media.className = 'card__media';

    var video = document.createElement('video');
    // #t=0.1 makes the browser seek to the first frame and render it as a
    // stand-in poster, so we get thumbnails without pre-generating images.
    video.src = item.video + '#t=0.1';
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.setAttribute('aria-hidden', 'true');
    video.setAttribute('tabindex', '-1');
    media.appendChild(video);

    var body = document.createElement('div');
    body.className = 'card__body';

    var title = document.createElement('span');
    title.className = 'card__title';
    title.appendChild(document.createTextNode(item.title));
    title.insertAdjacentHTML('beforeend', ARROW);

    var sub = document.createElement('span');
    sub.className = 'card__sub';
    sub.textContent = item.subtitle;

    body.appendChild(title);
    body.appendChild(sub);

    a.appendChild(media);
    a.appendChild(body);
    li.appendChild(a);

    return { li: li, card: a, video: video };
  }

  function safePlay(video) {
    var p = video.play();
    if (p && typeof p.catch === 'function') p.catch(function () {});
  }

  function render() {
    var grid = document.getElementById('grid');
    if (!grid) return;

    var frag = document.createDocumentFragment();
    var videos = [];

    workData.forEach(function (item) {
      var built = buildCard(item);
      frag.appendChild(built.li);
      videos.push(built.video);

      if (canHover) {
        // Desktop: play on hover / keyboard focus only. Keeps 11 videos
        // from decoding at once.
        var start = function () { safePlay(built.video); };
        var stop = function () {
          built.video.pause();
          built.video.currentTime = 0;
        };
        built.card.addEventListener('mouseenter', start);
        built.card.addEventListener('mouseleave', stop);
        built.card.addEventListener('focus', start);
        built.card.addEventListener('blur', stop);
      }
    });

    grid.appendChild(frag);

    // Touch devices have no hover, so play whichever card is on screen.
    if (!canHover && !reduceMotion && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) safePlay(entry.target);
            else entry.target.pause();
          });
        },
        { threshold: 0.55 }
      );
      videos.forEach(function (v) { io.observe(v); });
    }
  }

  /* ---------------------------------------------------------
     Rotating job title
     --------------------------------------------------------- */
  function rotateRole() {
    var el = document.getElementById('role');
    if (!el || reduceMotion || jobTitles.length < 2) return;

    var i = 0;
    setInterval(function () {
      el.classList.add('is-out');
      setTimeout(function () {
        i = (i + 1) % jobTitles.length;
        el.textContent = jobTitles[i];
        el.classList.remove('is-out');
      }, 400);
    }, 3200);
  }

  /* ---------------------------------------------------------
     Init
     --------------------------------------------------------- */
  function init() {
    render();
    rotateRole();
    var year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
