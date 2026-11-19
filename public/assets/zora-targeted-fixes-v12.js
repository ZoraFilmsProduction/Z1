/* V12: reliable muted looping of the existing gallery files.
   No replacement of the React app or changes to mosaic geometry. */
(() => {
  'use strict';

  const sources = {
    'aerial-boat': '/__l5e/assets-v1/7b5302c8-5135-458b-8308-0ca5aa81d663/gallery-aerial-boat.mp4',
    'bar-pour': '/__l5e/assets-v1/09c562bc-50b5-4e63-b60a-42eb17f8ae51/gallery-bar-pour.mp4',
    'bed-rest': '/__l5e/assets-v1/073de233-db22-4875-900b-0d9a1917c4e3/gallery-bed-rest.mp4',
    'breakfast': '/__l5e/assets-v1/84cf51e0-6318-499f-9c5e-9ea5a34d5a07/gallery-breakfast.mp4',
    'curtains': '/__l5e/assets-v1/2675fda8-e0a4-49af-8eaa-8420a6dd47b7/gallery-curtains.mp4',
    'night-picnic': '/__l5e/assets-v1/f580551e-8517-46b8-9ee8-0239b82a0098/gallery-night-picnic.mp4',
    'posh-terrace': '/__l5e/assets-v1/d0d9cc4a-be10-47e7-abe4-231b5cbcb001/gallery-posh-terrace.mp4',
    'wine-bottle': '/__l5e/assets-v1/a67314d3-4cf7-4975-ba4d-6738213ed512/gallery-wine-bottle.mp4'
  };

  const installed = new WeakSet();
  const states = new WeakMap();
  const mediaSelector = '.first-build-page #gallery .mosaic-cell video, ' +
    '.first-build-page #gallery .desktop-editorial-gallery figure video';
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const state = states.get(entry.target);
      if (!state) continue;
      state.near = entry.isIntersecting;
      if (state.near && !document.hidden) {
        ensureSource(state);
        tryPlay(state);
      } else {
        clearTimeout(state.fallbackTimer);
        clearTimeout(state.healthTimer);
      }
    }
  }, {rootMargin: '180px 0px', threshold: 0});

  function showFallback(state) {
    if (!state.near || document.hidden || !state.host.isConnected) return;
    if (!state.fallback) {
      const image = document.createElement('img');
      image.className = 'zora-mosaic-fallback';
      image.alt = '';
      image.setAttribute('aria-hidden', 'true');
      image.decoding = 'async';
      image.src = `/assets/zora-mosaic-${state.name}-v12.webp`;
      state.host.appendChild(image);
      state.fallback = image;
    } else if (state.fallback.parentElement !== state.host) {
      // React can replace the video subtree during a route transition.
      state.host.appendChild(state.fallback);
    }
    state.host.dataset.zoraFallback = 'true';
  }

  function showVideo(state) {
    clearTimeout(state.fallbackTimer);
    state.host.dataset.zoraFallback = 'false';
  }

  function ensureSource(state) {
    const {video, name} = state;
    if (!video.getAttribute('src')) {
      video.setAttribute('src', sources[name]);
      video.load();
    }
  }

  function monitor(state) {
    clearTimeout(state.healthTimer);
    const start = state.video.currentTime;
    state.healthTimer = setTimeout(() => {
      if (!state.near || document.hidden) return;
      if (state.video.paused || state.video.readyState < 2 ||
          (state.video.currentTime === start && !state.video.seeking)) {
        showFallback(state);
        tryPlay(state);
      }
    }, 1500);
  }

  function tryPlay(state) {
    if (!state.near || document.hidden || !state.video.isConnected) return;
    const video = state.video;
    if (!video.paused && video.readyState >= 2) {
      showVideo(state);
      monitor(state);
      return;
    }

    if (state.pending) return;
    state.pending = true;
    try {
      const playResult = video.play();
      if (playResult && typeof playResult.then === 'function') {
        playResult.then(() => {
          state.pending = false;
          if (state.near && !video.paused) showVideo(state);
          monitor(state);
        }).catch(() => {
          state.pending = false;
          // On iOS Low Power Mode or autoplay-policy denial, a silent animated
          // WebP from the identical source clip requires no tap and loops.
          showFallback(state);
        });
      } else {
        state.pending = false;
        monitor(state);
      }
    } catch (_) {
      state.pending = false;
      showFallback(state);
    }

    clearTimeout(state.fallbackTimer);
    state.fallbackTimer = setTimeout(() => {
      if (video.paused || video.readyState < 2) showFallback(state);
    }, 750);
  }

  function install(video) {
    if (installed.has(video)) return;
    const host = video.closest('.mosaic-cell, .desktop-editorial-gallery figure');
    const name = /gallery-([a-z-]+)\.jpg/.exec(video.getAttribute('poster') || '')?.[1];
    if (!host || !sources[name]) return;
    installed.add(video);

    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.controls = false;
    video.disablePictureInPicture = true;
    video.setAttribute('muted', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('controlslist', 'nodownload noremoteplayback');
    video.removeAttribute('controls');
    video.preload = 'auto';

    const state = {video, host, name, near: false, fallback: null,
      fallbackTimer: 0, healthTimer: 0, pending: false};
    states.set(video, state);
    video.addEventListener('playing', () => {
      if (state.near) showVideo(state);
      monitor(state);
    });
    video.addEventListener('canplay', () => tryPlay(state));
    video.addEventListener('loadeddata', () => tryPlay(state));
    video.addEventListener('pause', () => {
      if (state.near && !document.hidden) {
        clearTimeout(state.fallbackTimer);
        state.fallbackTimer = setTimeout(() => {
          if (video.paused) showFallback(state);
        }, 300);
      }
    });
    video.addEventListener('error', () => showFallback(state));
    video.addEventListener('stalled', () => {
      if (state.near) monitor(state);
    });
    observer.observe(video);
  }

  function scan() {
    document.querySelectorAll(mediaSelector).forEach(install);
  }

  function start() {
    scan();
    // The app mounts on React hydration and replaces nodes during navigation.
    new MutationObserver(scan).observe(document.body, {childList: true, subtree: true});
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) scan();
      for (const video of document.querySelectorAll(mediaSelector)) {
        const state = states.get(video);
        if (state?.near && !document.hidden) tryPlay(state);
      }
    });
    window.addEventListener('pageshow', scan, {passive: true});
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', start, {once: true});
  else start();
})();
