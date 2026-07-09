// ============================================================
// REDLING HOTEL — Dual-Video Scroll Slider (Zero-Flashing Edition)
//
// 1. Clean transitions: waits for seeked event before showing
//    video to eliminate the 1-frame visual flash of old frames.
// 2. Very fast soft fade specifically for Hero banner (0.2s) (Screen 0 <-> 1).
// 3. Instant cuts for all other screen transitions (Screen 1 <-> 5).
// 4. Text fade-in syncs with transition end (no text flashes during motion).
// ============================================================

// --- Transition config ---
const transitions = [
  null, // Screen 0 — Hero
  {
    forward: document.getElementById('videoRooms'),
    reverse: document.getElementById('videoRoomsRev'),
  },
  {
    forward: document.getElementById('videoPool'),
    reverse: document.getElementById('videoPoolRev'),
  },
  {
    forward: document.getElementById('videoRestaurant'),
    reverse: document.getElementById('videoRestaurantRev'),
  },
  {
    forward: document.getElementById('videoAtmosphere'),
    reverse: document.getElementById('videoAtmosphereRev'),
  },
  {
    forward: document.getElementById('videoContacts'),
    reverse: document.getElementById('videoContactsRev'),
  },
];

const heroVideo = document.getElementById('videoHero');
const TOTAL_SCREENS = transitions.length; // 6

// --- DOM ---
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const phoneBtn = document.getElementById('phoneBtn');
const phoneDropMenu = document.getElementById('phoneDropMenu');
const menuLinks = document.querySelectorAll('.menu-link');
const SECTION_IDS = ['hero', 'rooms', 'pool', 'restaurant', 'atmosphere', 'contacts'];

// --- State ---
let currentScreen = 0;
let isTransitioning = false;

// ============================
// 1. Sidebar / Mobile Menu
// ============================
if (menuToggle && sidebar) {
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    menuToggle.classList.toggle('open');
    sidebar.classList.toggle('open');
  });
  menuLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 991) {
        menuToggle.classList.remove('open');
        sidebar.classList.remove('open');
      }
    });
  });
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 991 && sidebar.classList.contains('open')) {
      if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('open');
        sidebar.classList.remove('open');
      }
    }
  });
}

// ============================
// 2. Phone Dropdown
// ============================
if (phoneBtn && phoneDropMenu) {
  phoneBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    phoneBtn.classList.toggle('open');
    phoneDropMenu.classList.toggle('show');
  });
  document.addEventListener('click', (e) => {
    if (!phoneBtn.contains(e.target) && !phoneDropMenu.contains(e.target)) {
      phoneBtn.classList.remove('open');
      phoneDropMenu.classList.remove('show');
    }
  });
}

// ============================
// 3. Menu link → navigate
// ============================
menuLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const targetIndex = SECTION_IDS.indexOf(href.slice(1));
    if (targetIndex !== -1 && targetIndex !== currentScreen && !isTransitioning) {
      goToScreen(targetIndex);
    }
  });
});

// ============================
// 4. Active menu highlight
// ============================
function updateMenuHighlight(index) {
  const id = SECTION_IDS[index];
  menuLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
  });
}

function updateActiveSection(index) {
  const sections = document.querySelectorAll('.content-section');
  sections.forEach((sec, idx) => {
    sec.classList.toggle('active', idx === index);
  });
}

// ============================
// 5. Reset all video styles
// ============================
function initVideoLayers() {
  heroVideo.style.opacity = '1';
  heroVideo.style.zIndex = '1';
  heroVideo.style.transition = 'none';
  
  for (let i = 1; i < TOTAL_SCREENS; i++) {
    const t = transitions[i];
    
    t.forward.style.opacity = '0';
    t.forward.style.zIndex = '1';
    t.forward.style.transition = 'none';
    t.forward.pause();
    
    t.reverse.style.opacity = '0';
    t.reverse.style.zIndex = '1';
    t.reverse.style.transition = 'none';
    t.reverse.pause();
  }
}

// ============================
// 6. Get current active resting video element
// ============================
function getRestingVideo(index) {
  if (index === 0) return heroVideo;
  return transitions[index].forward;
}

// ============================
// 7. Safety-seek helper to prevent visual frame flashing
// ============================
function prepareVideoToPlay(video, targetTime = 0) {
  return new Promise((resolve) => {
    if (isNaN(video.duration) || video.duration === 0) {
      video.currentTime = targetTime;
      resolve();
      return;
    }

    const onSeeked = () => {
      video.removeEventListener('seeked', onSeeked);
      resolve();
    };

    video.addEventListener('seeked', onSeeked);
    video.currentTime = targetTime;

    // Safety timeout in case seeked event doesn't fire
    setTimeout(() => {
      video.removeEventListener('seeked', onSeeked);
      resolve();
    }, 150);
  });
}

// ============================
// 8. Core navigation
// ============================
async function goToScreen(targetIndex) {
  if (targetIndex === currentScreen) return;
  if (targetIndex < 0 || targetIndex >= TOTAL_SCREENS) return;
  if (isTransitioning) return;

  isTransitioning = true;
  updateMenuHighlight(targetIndex);
  
  // Fade out current text instantly at start of transition
  updateActiveSection(-1);

  const goingForward = targetIndex > currentScreen;
  const oldIndex = currentScreen;
  const oldVideo = getRestingVideo(oldIndex);

  // Hero banner transitions (Screen 0 <-> Screen 1) get a soft 0.2s fade
  const isHeroTransition = (oldIndex === 0 || targetIndex === 0);

  if (goingForward) {
    // ——— FORWARD ———
    const video = transitions[targetIndex].forward;

    // Seek to start in the background (hidden)
    video.style.opacity = '0';
    video.style.transition = 'none';
    await prepareVideoToPlay(video, 0);

    if (isHeroTransition) {
      // 0.2s soft fade-in on top of oldVideo
      video.style.zIndex = '2';
      video.style.transition = 'opacity 0.2s ease';
      video.style.opacity = '1';
      video.play().catch(() => {});

      // Wait for the fade-in to finish (200ms) before pausing/hiding old video underneath
      setTimeout(() => {
        oldVideo.style.opacity = '0';
        oldVideo.pause();
      }, 200);
    } else {
      // Instant cut
      video.style.zIndex = '1';
      video.style.transition = 'none';
      video.style.opacity = '1';
      oldVideo.style.opacity = '0';
      oldVideo.pause();
      video.play().catch(() => {});
    }

    // End transition on ended
    video.onended = () => {
      video.pause();
      video.onended = null;

      if (isHeroTransition) {
        video.style.zIndex = '1';
        video.style.transition = 'none';
      }

      currentScreen = targetIndex;
      
      // Fade in target text only AFTER video reaches the end
      updateActiveSection(targetIndex);
      isTransitioning = false;
    };

  } else {
    // ——— BACKWARD ———
    const reverseVideo = transitions[oldIndex].reverse;
    const targetVideo = getRestingVideo(targetIndex);

    // Seek reverse to start in the background (hidden)
    reverseVideo.style.opacity = '0';
    reverseVideo.style.transition = 'none';
    await prepareVideoToPlay(reverseVideo, 0);

    if (isHeroTransition) {
      // Soft fade transition (0.2s)
      // Keep oldVideo at opacity 1 on zIndex 1.
      // Fade in reverseVideo on zIndex 2.
      reverseVideo.style.zIndex = '2';
      reverseVideo.style.transition = 'opacity 0.2s ease';
      reverseVideo.style.opacity = '1';
      
      reverseVideo.play().catch(() => {});

      // Wait for reverseVideo to fade in fully (200ms) before preparing/playing target (Hero) underneath
      setTimeout(async () => {
        oldVideo.style.opacity = '0';
        oldVideo.pause();

        // Start Hero loop playing underneath
        targetVideo.currentTime = 0;
        targetVideo.loop = true;
        targetVideo.style.opacity = '1';
        targetVideo.style.zIndex = '1';
        targetVideo.style.transition = 'none';
        try { await targetVideo.play(); } catch (_) {}
      }, 200);

      reverseVideo.onended = () => {
        reverseVideo.pause();
        reverseVideo.onended = null;

        // Fade out reverse video to reveal running Hero banner underneath
        reverseVideo.style.transition = 'opacity 0.2s ease';
        reverseVideo.style.opacity = '0';
        
        // Start fading in target text (Hero) at the start of reverse fade out
        updateActiveSection(targetIndex);
        
        setTimeout(() => {
          reverseVideo.style.zIndex = '1';
          reverseVideo.style.transition = 'none';
          currentScreen = targetIndex;
          isTransitioning = false;
        }, 200); // 200ms matches 0.2s transition
      };

    } else {
      // Instant cut transition
      // Prepare target resting video underneath
      await prepareVideoToPlay(targetVideo, targetVideo.duration - 0.01);
      targetVideo.pause();

      reverseVideo.style.opacity = '1';
      oldVideo.style.opacity = '0';
      oldVideo.pause();

      reverseVideo.play().catch(() => {});

      reverseVideo.onended = () => {
        reverseVideo.pause();
        reverseVideo.onended = null;

        targetVideo.style.opacity = '1';
        reverseVideo.style.opacity = '0';

        currentScreen = targetIndex;
        updateActiveSection(targetIndex); // Fade in target text at the end
        isTransitioning = false;
      };
    }
  }
}

// ============================
// 9. Scroll (wheel) handler
// ============================
let wheelAccumulator = 0;
const WHEEL_THRESHOLD = 50;

function handleWheel(e) {
  e.preventDefault();
  if (isTransitioning) return;

  wheelAccumulator += e.deltaY;

  if (wheelAccumulator > WHEEL_THRESHOLD) {
    wheelAccumulator = 0;
    if (currentScreen < TOTAL_SCREENS - 1) {
      goToScreen(currentScreen + 1);
    }
  } else if (wheelAccumulator < -WHEEL_THRESHOLD) {
    wheelAccumulator = 0;
    if (currentScreen > 0) {
      goToScreen(currentScreen - 1);
    }
  }
}

document.addEventListener('wheel', handleWheel, { passive: false });

// ============================
// 10. Touch support (mobile swipe)
// ============================
let touchStartY = 0;
const SWIPE_THRESHOLD = 60;

document.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
  if (isTransitioning) return;
  const diff = touchStartY - e.changedTouches[0].clientY;
  if (diff > SWIPE_THRESHOLD && currentScreen < TOTAL_SCREENS - 1) {
    goToScreen(currentScreen + 1);
  } else if (diff < -SWIPE_THRESHOLD && currentScreen > 0) {
    goToScreen(currentScreen - 1);
  }
}, { passive: true });

document.addEventListener('touchmove', (e) => { e.preventDefault(); }, { passive: false });

// ============================
// 11. Keyboard (arrows, page keys)
// ============================
document.addEventListener('keydown', (e) => {
  if (isTransitioning) return;
  if (e.key === 'ArrowDown' || e.key === 'PageDown') {
    e.preventDefault();
    if (currentScreen < TOTAL_SCREENS - 1) goToScreen(currentScreen + 1);
  } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    e.preventDefault();
    if (currentScreen > 0) goToScreen(currentScreen - 1);
  }
});

// ============================
// 12. Fullscreen Video Modal
// ============================
const videoModal = document.getElementById('videoModal');
const youtubeIframe = document.getElementById('youtubeIframe');
const openVideoBtn = document.getElementById('openVideoBtn');
const closeVideoBtn = document.getElementById('closeVideoBtn');

if (openVideoBtn && videoModal && youtubeIframe) {
  openVideoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    youtubeIframe.src = "https://www.youtube.com/embed/n7kd0tzGD2s?autoplay=1";
    videoModal.style.display = 'flex';
    setTimeout(() => videoModal.classList.add('show'), 10);
  });
}

if (closeVideoBtn && videoModal && youtubeIframe) {
  closeVideoBtn.addEventListener('click', () => {
    videoModal.classList.remove('show');
    setTimeout(() => {
      videoModal.style.display = 'none';
      youtubeIframe.src = ""; // Clear source to stop video playback
    }, 300);
  });

  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
      closeVideoBtn.click();
    }
  });
}

// ============================
// 13. Init
// ============================
initVideoLayers();
updateMenuHighlight(0);
updateActiveSection(0);
if (heroVideo) {
  heroVideo.play().catch(() => {});
}
