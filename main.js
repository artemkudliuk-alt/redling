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
    if (idx === index) {
      // Mobile sections scroll internally — always arrive at the top.
      // Re-assert on the next frame: async work (iframe load, focus) can
      // silently auto-scroll the section and hide the heading.
      sec.scrollTop = 0;
      requestAnimationFrame(() => { sec.scrollTop = 0; });
    }
  });
  // Contacts map embed loads only once the screen is actually reached
  if (index === SECTION_IDS.indexOf('contacts')) loadMapIframe();
}

// Deferred Google Maps embed: loading it up front lets it steal focus and
// auto-scroll the contacts section, cutting off the title on mobile
const mapIframe = document.querySelector('#contacts .map-wrapper iframe');

function loadMapIframe() {
  if (mapIframe && mapIframe.dataset.src) {
    mapIframe.src = mapIframe.dataset.src;
    mapIframe.removeAttribute('data-src');
  }
}

// Transparent shield over the map: swipes scroll the page, a tap unlocks the map
const mapTouchGuard = document.getElementById('mapTouchGuard');
if (mapTouchGuard) {
  mapTouchGuard.addEventListener('click', () => {
    loadMapIframe();
    mapTouchGuard.classList.add('hidden');
  });
}

// Mobile screens taller than the viewport scroll natively before the
// slider flips to the next screen; returns null on desktop widths.
function getScrollableActiveSection() {
  if (window.innerWidth > 991) return null;
  const sec = document.querySelector('.content-section.active');
  if (sec && sec.scrollHeight > sec.clientHeight + 1) return sec;
  return null;
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
// 7b. Lazy video loading (data-src → src)
// ============================
// Only preloader.mp4 and hero.mp4 load eagerly; every transition video
// sits with preload="none" + data-src until requested here.
const videoLoadPromises = new Map();

function ensureVideoLoaded(video) {
  if (!video) return Promise.resolve();
  if (videoLoadPromises.has(video)) return videoLoadPromises.get(video);

  if (video.dataset.src && !video.getAttribute('src')) {
    video.src = video.dataset.src;
    video.removeAttribute('data-src');
    video.preload = 'auto';
    video.load();
  }

  if (video.readyState >= 3) {
    const ready = Promise.resolve();
    videoLoadPromises.set(video, ready);
    return ready;
  }

  const promise = new Promise((resolve) => {
    const finish = () => {
      video.removeEventListener('canplaythrough', finish);
      video.removeEventListener('error', finish);
      clearTimeout(timer);
      resolve();
    };
    // Safety: never block navigation forever on a slow network
    const timer = setTimeout(finish, 8000);
    video.addEventListener('canplaythrough', finish);
    video.addEventListener('error', finish);
  });
  videoLoadPromises.set(video, promise);
  return promise;
}

// Background queue: fetch transition videos one at a time (nearest screens
// first) while the user is still watching the preloader / hero screen.
let preloadQueueStarted = false;

function startPreloadQueue() {
  if (preloadQueueStarted) return;
  preloadQueueStarted = true;
  
  // Eagerly preload all transition videos in parallel to maximize buffering during the 7s preloader
  for (let i = 1; i < TOTAL_SCREENS; i++) {
    if (transitions[i]) {
      ensureVideoLoaded(transitions[i].forward);
      ensureVideoLoaded(transitions[i].reverse);
    }
  }
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

    // Make sure the lazy video is fetched before we try to play it
    await ensureVideoLoaded(video);

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

    // Make sure both lazy videos are fetched before we try to play them
    await Promise.all([ensureVideoLoaded(reverseVideo), ensureVideoLoaded(targetVideo)]);

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
  // Let a tall mobile section scroll its own content before flipping screens
  const scrollable = getScrollableActiveSection();
  if (scrollable) {
    const atTop = scrollable.scrollTop <= 0;
    const atBottom = scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 1;
    if ((e.deltaY > 0 && !atBottom) || (e.deltaY < 0 && !atTop)) return;
  }

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
let touchStartScrollTop = 0;
const SWIPE_THRESHOLD = 60;

document.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
  const sec = document.querySelector('.content-section.active');
  touchStartScrollTop = sec ? sec.scrollTop : 0;
}, { passive: true });

document.addEventListener('touchend', (e) => {
  if (isTransitioning) return;
  const diff = touchStartY - e.changedTouches[0].clientY;

  // A tall mobile section scrolls natively first: flip screens only from
  // its very edges, and never in the same gesture that scrolled content
  const scrollable = getScrollableActiveSection();
  if (scrollable) {
    if (Math.abs(scrollable.scrollTop - touchStartScrollTop) > 2) return;
    const atTop = scrollable.scrollTop <= 1;
    const atBottom = scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 2;
    if (diff > 0 && !atBottom) return;
    if (diff < 0 && !atTop) return;
  }

  if (diff > SWIPE_THRESHOLD && currentScreen < TOTAL_SCREENS - 1) {
    goToScreen(currentScreen + 1);
  } else if (diff < -SWIPE_THRESHOLD && currentScreen > 0) {
    goToScreen(currentScreen - 1);
  }
}, { passive: true });

document.addEventListener('touchmove', (e) => {
  // Native scrolling stays enabled inside a tall active section;
  // everything else is blocked (kills iOS rubber-band bounce)
  const scrollable = getScrollableActiveSection();
  if (scrollable && scrollable.contains(e.target)) return;
  e.preventDefault();
}, { passive: false });

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
// 13. Init with Preloader
// ============================
initVideoLayers();
updateMenuHighlight(0);
updateActiveSection(0);

// Preloader elements
const preloader = document.getElementById('preloader');

if (preloader) {
  let isVideoPlaying = false;
  let isVideoEnded = false;

  // Make sure the preloader video tries to play and track its state
  if (preloaderVideo) {
    preloaderVideo.playbackRate = 1.0;
    
    preloaderVideo.addEventListener('playing', () => {
      isVideoPlaying = true;
    });

    preloaderVideo.addEventListener('ended', () => {
      isVideoEnded = true;
      checkAndHidePreloader();
    });

    // Fallback if 'ended' event doesn't fire but currentTime is close to duration
    preloaderVideo.addEventListener('timeupdate', () => {
      if (preloaderVideo.duration && preloaderVideo.currentTime >= preloaderVideo.duration - 0.15) {
        isVideoEnded = true;
        checkAndHidePreloader();
      }
    });

    preloaderVideo.play().then(() => {
      isVideoPlaying = true;
    }).catch(err => {
      console.log("Preloader video play failed/blocked:", err);
      isVideoEnded = true; // Autoplay blocked, treat as ended to bypass wait
      checkAndHidePreloader();
    });
  } else {
    isVideoEnded = true;
  }

  // Ticks up from 0% to 100% over exactly 7 seconds (70ms * 100 steps)
  const progressInterval = setInterval(() => {
    // If we reach 98% but the page itself hasn't finished loading yet, hold it at 98%
    if (currentPercent >= 98 && !isPageLoaded) {
      return;
    }
    
    currentPercent += 1;
    if (percentageText) {
      percentageText.textContent = `${currentPercent}%`;
    }
    
    if (currentPercent >= 100) {
      clearInterval(progressInterval);
      isProgressFinished = true;
      checkAndHidePreloader();
      
      // Force hide preloader after max 2.5 seconds if video end event is lost or delayed
      setTimeout(() => {
        isVideoEnded = true;
        checkAndHidePreloader();
      }, 2500);
    }
  }, 70);

  // 2. Monitor page load status (we wait for DOM loading, but do NOT block on other videos buffering)
  if (document.readyState === 'complete') {
    isPageLoaded = true;
    checkAndHidePreloader();
  } else {
    window.addEventListener('load', () => {
      isPageLoaded = true;
      checkAndHidePreloader();
    });
  }

  function checkAndHidePreloader() {
    // Hide only if progress is 100%, page is loaded, and video has finished playing (or is blocked)
    const isVideoReadyToHide = !preloaderVideo || isVideoEnded || !isVideoPlaying;
    if (isProgressFinished && isPageLoaded && isVideoReadyToHide) {
      hidePreloader();
    }
  }

  // Safety fallback timeout (12 seconds)
  const safetyTimeout = setTimeout(() => {
    isPageLoaded = true;
    isProgressFinished = true;
    isVideoEnded = true;
    hidePreloader();
  }, 12000);

  function hidePreloader() {
    if (!preloader.classList.contains('fade-out')) {
      clearTimeout(safetyTimeout);
      clearInterval(progressInterval);
      preloader.classList.add('fade-out');
      
      // Auto-play the main hero video
      if (heroVideo) {
        heroVideo.play().catch(err => console.log("Hero autoplay blocked/failed:", err));
      }
    }
  }
} else {
  // Fallback if elements don't exist
  if (heroVideo) {
    heroVideo.play().catch(() => {});
  }
}

// Kick off background loading of transition videos immediately in parallel
startPreloadQueue();

// ============================================================
// 14. Internationalization (i18n)
// ============================================================
const i18nData = {
  ru: {
    "nav.hero": "Главная",
    "nav.rooms": "Номера",
    "nav.pool": "Бассейн и Летняя зона",
    "nav.restaurant": "Ресторан",
    "nav.atmosphere": "Атмосфера",
    "nav.contacts": "Контакты",
    "nav.offers": "★ АКЦИИ ★",
    "credits.text": "Создание сайта",
    "hero.subtitle": "ваш уютный дом у моря в Одессе",
    "hero.subhead": "Премиальный комфорт для семейного отдыха и деловых поездок.",
    "hero.text": "Всего 500 метров до пляжа, вдали от городского шума.",
    "hero.cta": "Забронировать номер",
    "hero.video": "Смотреть видео",
    "rooms.subtitle": "★ Дизайнерские номера с премиальным комфортом",
    "rooms.title": "Пространство для идеального отдыха",
    "rooms.text": "Просторные дизайнерские номера с премиальной шумоизоляцией и ортопедическими матрасами. Здесь есть всё для глубокого сна после пляжа или продуктивной работы в тишине.",
    "rooms.cta": "Выбрать номер",
    "rooms.benefit1": "Шумоизоляция",
    "rooms.benefit2": "Ортопедические матрасы",
    "rooms.benefit3": "Wi-Fi",
    "rooms.benefit4": "Мини-бар",
    "pool.subtitle": "★ Бассейн и Летняя зона",
    "pool.title": "Освежающий<br>летний вайб",
    "pool.text": "Огромный открытый бассейн (80 м²) с лаунж-зоной и удобными шезлонгами. Идеальное место, чтобы поймать ленивое курортное настроение, не покидая территорию отеля.",
    "pool.benefit1": "80 м² бассейн",
    "pool.benefit2": "Лаунж-бар",
    "pool.benefit3": "Шезлонги",
    "restaurant.subtitle": "★ Ресторан Redling",
    "restaurant.title": "Гастрономическая<br>Одесса",
    "restaurant.text": "Авторское прочтение черноморской и европейской кухни в стильном классическом интерьере. Лаундж-зона для неторопливых ужинов и раздельные залы для курящих и некурящих.",
    "restaurant.cta": "Забронировать столик",
    "restaurant.menu": "Меню ресторана",
    "restaurant.weekdays": "Будни:",
    "restaurant.weekends": "Выходные:",
    "atmosphere.subtitle": "★ Об отеле",
    "atmosphere.title": "Атмосфера, в которую<br>хочется возвращаться",
    "atmosphere.text": "Redling — это сочетание искреннего одесского гостеприимства и европейского сервиса. Мы создали пространство, где вы чувствуете себя абсолютно свободно, окруженные заботой нашей команды 24/7.",
    "atmosphere.gallery_btn": "Посмотреть фото",
    "contacts.subtitle": "★ Локация и Контакты",
    "contacts.title": "Ждем вас<br>в Redling",
    "contacts.fact1": "500 метров до моря — 7 минут пешком",
    "contacts.fact2": "ул. Дача Ковалевского, 71, Одесса",
    "contacts.fact3": "10 км до центра — тихий, зелёный район",
    "contacts.reception": "Ресепшен",
    "contacts.restaurant": "Ресторан",
    "contacts.email": "Email",
    "contacts.route": "Построить маршрут",
    "contacts.map_hint": "Нажмите, чтобы управлять картой"
  },
  en: {
    "nav.hero": "Home",
    "nav.rooms": "Rooms",
    "nav.pool": "Pool & Summer Zone",
    "nav.restaurant": "Restaurant",
    "nav.atmosphere": "Atmosphere",
    "nav.contacts": "Contacts",
    "nav.offers": "★ OFFERS ★",
    "credits.text": "Website Design",
    "hero.subtitle": "your cozy home by the sea in Odesa",
    "hero.subhead": "Premium comfort for family holidays and business trips.",
    "hero.text": "Only 500 meters to the beach, far from city noise.",
    "hero.cta": "Book a room",
    "hero.video": "Watch video",
    "rooms.subtitle": "★ Designer rooms with premium comfort",
    "rooms.title": "Space for perfect relaxation",
    "rooms.text": "Spacious designer rooms with premium soundproofing and orthopedic mattresses. Everything you need for a deep sleep after the beach or productive work in silence.",
    "rooms.cta": "Choose a room",
    "rooms.benefit1": "Soundproofing",
    "rooms.benefit2": "Orthopedic mattresses",
    "rooms.benefit3": "Wi-Fi",
    "rooms.benefit4": "Minibar",
    "pool.subtitle": "★ Pool & Summer Zone",
    "pool.title": "Refreshing<br>summer vibe",
    "pool.text": "Huge outdoor swimming pool (80 m²) with a lounge area and comfortable sunbeds. The perfect place to catch a lazy resort mood without leaving the hotel grounds.",
    "pool.benefit1": "80 m² Pool",
    "pool.benefit2": "Lounge Bar",
    "pool.benefit3": "Sunbeds",
    "restaurant.subtitle": "★ Redling Restaurant",
    "restaurant.title": "Gastronomic<br>Odesa",
    "restaurant.text": "Author's interpretation of Black Sea and European cuisine in a stylish classic interior. Lounge area for leisurely dinners and separate halls for smokers and non-smokers.",
    "restaurant.cta": "Book a table",
    "restaurant.menu": "Restaurant menu",
    "restaurant.weekdays": "Weekdays:",
    "restaurant.weekends": "Weekends:",
    "atmosphere.subtitle": "★ About Hotel",
    "atmosphere.title": "Atmosphere you<br>want to return to",
    "atmosphere.text": "Redling is a combination of genuine Odesa hospitality and European service. We have created a space where you feel absolutely free, surrounded by the care of our team 24/7.",
    "atmosphere.gallery_btn": "See photos",
    "contacts.subtitle": "★ Location & Contacts",
    "contacts.title": "Waiting for you<br>at Redling",
    "contacts.fact1": "500 meters to the sea — 7 minutes walk",
    "contacts.fact2": "71 Dacha Kovalevskoho St, Odesa",
    "contacts.fact3": "10 km to the center — quiet, green area",
    "contacts.reception": "Reception",
    "contacts.restaurant": "Restaurant",
    "contacts.email": "Email",
    "contacts.route": "Get directions",
    "contacts.map_hint": "Tap to interact with the map"
  },
  ua: {
    "nav.hero": "Головна",
    "nav.rooms": "Номери",
    "nav.pool": "Басейн та Літня зона",
    "nav.restaurant": "Ресторан",
    "nav.atmosphere": "Атмосфера",
    "nav.contacts": "Контакти",
    "nav.offers": "★ АКЦІЇ ★",
    "credits.text": "Створення сайту",
    "hero.subtitle": "ваш затишний дім біля моря в Одесі",
    "hero.subhead": "Преміальний комфорт для сімейного відпочинку та ділових поїздок.",
    "hero.text": "Всього 500 метрів до пляжу, далеко від міського шуму.",
    "hero.cta": "Забронювати номер",
    "hero.video": "Дивитися відео",
    "rooms.subtitle": "★ Дизайнерські номери з преміальним комфортом",
    "rooms.title": "Простір для ідеального відпочинку",
    "rooms.text": "Просторі дизайнерські номери з преміальною шумоізоляцією та ортопедичними матрацами. Тут є все для глибокого сну після пляжу або продуктивної роботи в тиші.",
    "rooms.cta": "Обрати номер",
    "rooms.benefit1": "Шумоізоляція",
    "rooms.benefit2": "Ортопедичні матраци",
    "rooms.benefit3": "Wi-Fi",
    "rooms.benefit4": "Міні-бар",
    "pool.subtitle": "★ Басейни та Літня зона",
    "pool.title": "Освіжаючий<br>літній вайб",
    "pool.text": "Величезний відкритий басейн (80 м²) з лаунж-зоною та зручними шезлонгами. Ідеальне місце, щоб зловити ледачий курортний настрій, не покидаючи територію готелю.",
    "pool.benefit1": "80 м² басейн",
    "pool.benefit2": "Лаунж-бар",
    "pool.benefit3": "Шезлонги",
    "restaurant.subtitle": "★ Ресторан Redling",
    "restaurant.title": "Гастрономічна<br>Одеса",
    "restaurant.text": "Авторське прочитання чорноморської та європейської кухні в стильному класичному інтер'єрі. Лаунж-зона для неспішних вечерь та окремі зали для курців та некурців.",
    "restaurant.cta": "Забронювати столик",
    "restaurant.menu": "Меню ресторану",
    "restaurant.weekdays": "Будні:",
    "restaurant.weekends": "Вихідні:",
    "atmosphere.subtitle": "★ Про готель",
    "atmosphere.title": "Атмосфера, в яку<br>хочеться повертатися",
    "atmosphere.text": "Redling — це поєднання щирої одеської гостинності та європейського сервісу. Ми створили простір, де ви почуваєтеся абсолютно вільно, оточені турботою нашої команди 24/7.",
    "atmosphere.gallery_btn": "Подивитися фото",
    "contacts.subtitle": "★ Локація та Контакты",
    "contacts.title": "Чекаємо на вас<br>в Redling",
    "contacts.fact1": "500 метрів до моря — 7 хвилин пішки",
    "contacts.fact2": "вул. Дача Ковалевського, 71, Одеса",
    "contacts.fact3": "10 км до центру — тихий, зелений район",
    "contacts.reception": "Ресепшн",
    "contacts.restaurant": "Ресторан",
    "contacts.email": "Email",
    "contacts.route": "Побудувати маршрут",
    "contacts.map_hint": "Натисніть, щоб керувати картою"
  }
};

function initTranslations() {
  const langButtons = document.querySelectorAll('.lang-link');
  
  const setLanguage = (lang) => {
    localStorage.setItem('redling-lang', lang);
    
    langButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (i18nData[lang] && i18nData[lang][key] !== undefined) {
        el.innerHTML = i18nData[lang][key];
      }
    });
    
    document.documentElement.setAttribute('lang', lang);
  };
  
  const savedLang = localStorage.getItem('redling-lang') || 'ru';
  setLanguage(savedLang);
  
  langButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const lang = btn.getAttribute('data-lang');
      setLanguage(lang);
    });
  });
}

// Start translations immediately
initTranslations();

// ============================================================
// 15. Fullscreen Swipeable Photo Gallery
// ============================================================
function initPhotoGallery() {
  const openGalleryBtn = document.getElementById('openGalleryBtn');
  const galleryModal = document.getElementById('galleryModal');
  const closeGalleryBtn = document.getElementById('closeGalleryBtn');
  const wrapper = document.getElementById('galleryWrapper');
  const prevBtn = document.getElementById('galleryPrevBtn');
  const nextBtn = document.getElementById('galleryNextBtn');
  const dots = document.querySelectorAll('.gallery-dot');
  
  if (!openGalleryBtn || !galleryModal || !closeGalleryBtn || !wrapper) return;
  
  let currentIdx = 0;
  const totalSlides = 10;
  
  // Dragging / swiping state
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  
  const getPositionX = (event) => {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  };
  
  const setSliderTranslate = (translate) => {
    currentTranslate = translate;
    wrapper.style.transform = `translateX(${currentTranslate}px)`;
  };
  
  const setPositionByIndex = () => {
    const slideWidth = wrapper.offsetWidth;
    currentTranslate = -currentIdx * slideWidth;
    prevTranslate = currentTranslate;
    wrapper.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
    wrapper.style.transform = `translateX(${currentTranslate}px)`;
    
    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIdx);
    });
  };
  
  const nextSlide = () => {
    if (currentIdx < totalSlides - 1) {
      currentIdx++;
    } else {
      currentIdx = 0; // wrap around
    }
    setPositionByIndex();
  };
  
  const prevSlide = () => {
    if (currentIdx > 0) {
      currentIdx--;
    } else {
      currentIdx = totalSlides - 1; // wrap around
    }
    setPositionByIndex();
  };
  
  // Open / Close Modal
  openGalleryBtn.addEventListener('click', (e) => {
    e.preventDefault();
    galleryModal.style.display = 'flex';
    setTimeout(() => {
      galleryModal.classList.add('show');
      setPositionByIndex(); // recalculate size after display: flex
    }, 10);
    
    // Disable scroll on parent page
    document.body.style.overflow = 'hidden';
  });
  
  const closeModal = () => {
    galleryModal.classList.remove('show');
    setTimeout(() => {
      galleryModal.style.display = 'none';
      document.body.style.overflow = 'hidden'; // preserve website slider overflow
    }, 300);
  };
  
  closeGalleryBtn.addEventListener('click', closeModal);
  galleryModal.addEventListener('click', (e) => {
    if (e.target === galleryModal) {
      closeModal();
    }
  });
  
  // Nav buttons
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);
  
  // Dot indicators
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      currentIdx = parseInt(dot.getAttribute('data-index'));
      setPositionByIndex();
    });
  });
  
  // Recalculate positions on window resize
  window.addEventListener('resize', setPositionByIndex);
  
  // Swipe / Drag Events
  const dragStart = (event) => {
    isDragging = true;
    startX = getPositionX(event);
    wrapper.style.transition = 'none'; // Instant response on drag
    
    if (event.type.includes('touch')) {
      // Let touch events propagate but prevent default window movements
    } else {
      event.preventDefault();
    }
  };
  
  const dragMove = (event) => {
    if (!isDragging) return;
    const currentX = getPositionX(event);
    const diff = currentX - startX;
    
    let targetTranslate = prevTranslate + diff;
    const maxTranslate = 0;
    const minTranslate = -(totalSlides - 1) * wrapper.offsetWidth;
    
    // Resistance at bounds
    if (targetTranslate > maxTranslate) {
      targetTranslate = maxTranslate + (targetTranslate - maxTranslate) * 0.3;
    } else if (targetTranslate < minTranslate) {
      targetTranslate = minTranslate + (targetTranslate - minTranslate) * 0.3;
    }
    
    setSliderTranslate(targetTranslate);
  };
  
  const dragEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    
    const diff = currentTranslate - prevTranslate;
    const threshold = 60;
    
    if (diff < -threshold && currentIdx < totalSlides - 1) {
      currentIdx++;
    } else if (diff > threshold && currentIdx > 0) {
      currentIdx--;
    }
    
    setPositionByIndex();
  };
  
  // Attach touch/mouse listeners
  wrapper.addEventListener('touchstart', dragStart, { passive: true });
  wrapper.addEventListener('touchmove', dragMove, { passive: true });
  wrapper.addEventListener('touchend', dragEnd);
  
  wrapper.addEventListener('mousedown', dragStart);
  wrapper.addEventListener('mousemove', dragMove);
  wrapper.addEventListener('mouseup', dragEnd);
  wrapper.addEventListener('mouseleave', dragEnd);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!galleryModal.classList.contains('show')) return;
    if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'Escape') {
      closeModal();
    }
  });
}

initPhotoGallery();
