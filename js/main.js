(function () {
  'use strict';

  // Touch devices keep the poster frame: no autoplay, no video download.
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  var POSTER_TIME = 2.5; // matches the frame the poster images were cut from

  Array.prototype.forEach.call(document.querySelectorAll('.row'), function (row) {
    var video = row.querySelector('video');
    if (!video) return;

    // play() begins fetching on its own even with preload="none". Setting
    // preload here instead would kick off a competing load that aborts it.
    function start() {
      var p = video.play();
      if (p && typeof p.catch === 'function') p.catch(function () {});
    }

    function stop() {
      video.pause();
      // back to the poster frame rather than frame zero, so the paused
      // thumbnail matches the still it was cut from
      try { video.currentTime = POSTER_TIME; } catch (e) {}
    }

    row.addEventListener('mouseenter', start);
    row.addEventListener('mouseleave', stop);
    row.addEventListener('focus', start);
    row.addEventListener('blur', stop);
  });
})();
