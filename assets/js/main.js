/**
 * DAR AL HAYA — LUXURY ABAYAS
 * Interactive Script: Hero Animatic Reel, Gallery Lightbox,
 * Filter System, Mobile Drawer, and Australian Client Utilities.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroAnimatic();
  initMobileDrawer();
  initGalleryLightbox();
  initCollectionsFilter();
  initDeliveryFaq();
  initWhatsAppInquiries();
  initStickyHeader();
});

/* ==========================================================================
   1. HERO SECTION ANIMATIC CONTROLLER
   ========================================================================== */
function initHeroAnimatic() {
  const slides = document.querySelectorAll('.animatic-slide');
  const frameTabs = document.querySelectorAll('.animatic-frame-tab');
  const prevBtn = document.querySelector('.btn-animatic-prev');
  const nextBtn = document.querySelector('.btn-animatic-next');
  const playBtn = document.querySelector('.btn-animatic-play');

  if (!slides.length) return;

  let currentIndex = 0;
  let isPlaying = true;
  let slideInterval = null;
  const slideDuration = 6000; // 6 seconds per scene

  function showSlide(index) {
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    frameTabs.forEach((tab, i) => {
      tab.classList.toggle('active', i === index);
      const progressLine = tab.querySelector('.tab-progress-line');
      if (progressLine) {
        // restart animation
        progressLine.style.animation = 'none';
        progressLine.offsetHeight; // trigger reflow
        if (i === index && isPlaying) {
          progressLine.style.animation = `fillAnimaticBar ${slideDuration}ms linear forwards`;
        }
      }
    });

    currentIndex = index;
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    isPlaying = true;
    if (playBtn) playBtn.innerHTML = '❚❚';
    showSlide(currentIndex);
    slideInterval = setInterval(nextSlide, slideDuration);
  }

  function stopAutoplay() {
    isPlaying = false;
    if (playBtn) playBtn.innerHTML = '▶';
    if (slideInterval) clearInterval(slideInterval);
    const activeLine = document.querySelector('.animatic-frame-tab.active .tab-progress-line');
    if (activeLine) activeLine.style.animationPlayState = 'paused';
  }

  function togglePlay() {
    if (isPlaying) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  }

  // Event Listeners
  if (nextBtn) nextBtn.addEventListener('click', () => {
    nextSlide();
    if (isPlaying) startAutoplay();
  });

  if (prevBtn) prevBtn.addEventListener('click', () => {
    prevSlide();
    if (isPlaying) startAutoplay();
  });

  if (playBtn) playBtn.addEventListener('click', togglePlay);

  frameTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetIndex = parseInt(tab.dataset.slideIndex, 10);
      showSlide(targetIndex);
      if (isPlaying) startAutoplay();
    });
  });

  // Start autoplay immediately
  startAutoplay();
}

/* ==========================================================================
   2. MOBILE DRAWER NAVIGATION
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-menu-drawer');
  const closeBtn = document.querySelector('.mobile-close-btn');
  const overlay = document.querySelector('.mobile-drawer-overlay');

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   3. GALLERY LIGHTBOX
   ========================================================================== */
function initGalleryLightbox() {
  const modal = document.querySelector('.lightbox-modal');
  if (!modal) return;

  const modalImg = modal.querySelector('.lightbox-img');
  const modalCaption = modal.querySelector('.lightbox-caption');
  const closeBtn = modal.querySelector('.lightbox-close-btn');
  const triggers = document.querySelectorAll('.lightbox-trigger');

  function openLightbox(src, title) {
    if (modalImg) modalImg.src = src;
    if (modalCaption) modalCaption.textContent = title || 'Dar Al Haya Couture';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const img = trigger.querySelector('img');
      const title = trigger.dataset.title || (img ? img.alt : '');
      const fullSrc = trigger.dataset.fullSrc || (img ? img.src : '');
      openLightbox(fullSrc, title);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   4. COLLECTIONS FILTER SYSTEM
   ========================================================================== */
function initCollectionsFilter() {
  const filterBtns = document.querySelectorAll('.btn-filter-tab');
  const items = document.querySelectorAll('.catalog-item-card');

  if (!filterBtns.length || !items.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.dataset.filter;

      items.forEach((item) => {
        const itemCategory = item.dataset.category || '';
        if (filterVal === 'all' || itemCategory.includes(filterVal)) {
          item.style.display = 'block';
          setTimeout(() => { item.style.opacity = '1'; }, 20);
        } else {
          item.style.opacity = '0';
          setTimeout(() => { item.style.display = 'none'; }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   5. DELIVERY FAQ ACCORDION
   ========================================================================== */
function initDeliveryFaq() {
  const faqItems = document.querySelectorAll('.faq-item-head');
  faqItems.forEach((head) => {
    head.addEventListener('click', () => {
      const body = head.nextElementSibling;
      const isOpen = head.classList.contains('open');

      // close all
      document.querySelectorAll('.faq-item-head').forEach(h => {
        h.classList.remove('open');
        if (h.nextElementSibling) h.nextElementSibling.style.maxHeight = null;
      });

      if (!isOpen && body) {
        head.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   6. WHATSAPP ENQUIRY GENERATOR
   ========================================================================== */
function initWhatsAppInquiries() {
  const waButtons = document.querySelectorAll('[data-wa-item]');
  const phoneNumber = '61488892341'; // Australian client concierge line (+61 488 892 341)

  waButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const itemName = btn.dataset.waItem || 'Dubai Luxury Abaya';
      const price = btn.dataset.waPrice ? ` (A$${btn.dataset.waPrice})` : '';
      const text = encodeURIComponent(
        `Hello Dar Al Haya Concierge, I would like to inquire about the ${itemName}${price} for express delivery to Australia. Could you please provide sizing and availability details?`
      );
      window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
    });
  });
}

/* ==========================================================================
   7. STICKY HEADER SCROLL EFFECT
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}
