// Script principal pour améliorer l'UX et l'accessibilité
document.addEventListener('DOMContentLoaded', function () {
  // Amélioration de la navigation au clavier
  initializeKeyboardNavigation();

  // Gestion du focus visible
  initializeFocusManagement();

  // Animation d'apparition des éléments au scroll
  initializeScrollAnimations();

  // Gestion des liens CTA avec analytics
  initializeCTATracking();

  // Amélioration des images avec lazy loading progressif
  initializeImageOptimization();
});

function initializeKeyboardNavigation() {
  // Navigation par touches fléchées dans les listes de bénéfices
  const benefitItems = document.querySelectorAll('.benefit-item, .format-item');

  benefitItems.forEach((item, index) => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');

    item.addEventListener('keydown', function (e) {
      let nextIndex;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          nextIndex = (index + 1) % benefitItems.length;
          benefitItems[nextIndex].focus();
          break;

        case 'ArrowUp':
          e.preventDefault();
          nextIndex = (index - 1 + benefitItems.length) % benefitItems.length;
          benefitItems[nextIndex].focus();
          break;

        case 'Home':
          e.preventDefault();
          benefitItems[0].focus();
          break;

        case 'End':
          e.preventDefault();
          benefitItems[benefitItems.length - 1].focus();
          break;
      }
    });
  });
}

function initializeFocusManagement() {
  // Gestion du focus visible uniquement au clavier
  let isUsingKeyboard = false;

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
      isUsingKeyboard = true;
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', function () {
    isUsingKeyboard = false;
    document.body.classList.remove('keyboard-navigation');
  });

  // Skip link fonctionnel
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(skipLink.getAttribute('href'));
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
}

function initializeScrollAnimations() {
  // Intersection Observer pour les animations au scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');

        // Annonce pour les lecteurs d'écran
        if (entry.target.hasAttribute('aria-labelledby')) {
          const titleId = entry.target.getAttribute('aria-labelledby');
          const title = document.getElementById(titleId);
          if (title) {
            announceToScreenReader(`Section ${title.textContent} maintenant visible`);
          }
        }
      }
    });
  }, observerOptions);

  // Observer les sections principales
  const sectionsToObserve = document.querySelectorAll('section, article');
  sectionsToObserve.forEach((section) => {
    section.classList.add('fade-in-section');
    observer.observe(section);
  });
}

function initializeCTATracking() {
  // Tracking des interactions avec les boutons CTA
  const ctaButtons = document.querySelectorAll('.cta-button, .secondary-cta, .learn-more-link');

  ctaButtons.forEach((button) => {
    button.addEventListener('click', function (e) {
      const buttonText = this.textContent.trim();
      const currentPage = window.location.pathname;

      // Analytics personnalisé (remplacer par votre solution d'analytics)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'cta_click', {
          button_text: buttonText,
          page: currentPage,
          timestamp: new Date().toISOString(),
        });
      }

      // Feedback visuel
      this.classList.add('clicked');
      setTimeout(() => {
        this.classList.remove('clicked');
      }, 200);
    });

    // Amélioration de l'accessibilité des liens
    button.addEventListener('focus', function () {
      announceToScreenReader(`Bouton ${this.textContent.trim()} sélectionné`);
    });
  });
}

function initializeImageOptimization() {
  // Amélioration du chargement des images
  const images = document.querySelectorAll('img[loading="lazy"]');

  const imageObserver = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;

        // Préchargement progressif
        if (!img.dataset.loaded) {
          img.addEventListener('load', function () {
            this.classList.add('loaded');
            this.dataset.loaded = 'true';

            // Annonce pour les lecteurs d'écran
            const alt = this.getAttribute('alt');
            if (alt) {
              announceToScreenReader(`Image chargée: ${alt}`);
            }
          });

          img.addEventListener('error', function () {
            this.classList.add('error');
            console.warn("Erreur de chargement de l'image:", this.src);

            // Image de fallback
            this.src = '/images/placeholder.jpg';
            this.alt = 'Image non disponible';
          });
        }

        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => {
    img.classList.add('lazy-image');
    imageObserver.observe(img);
  });
}

function announceToScreenReader(message) {
  // Annonce discrète pour les lecteurs d'écran
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-announcement';
  announcement.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;

  document.body.appendChild(announcement);
  announcement.textContent = message;

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 2000);
}

// Gestion des erreurs JavaScript
window.addEventListener('error', function (e) {
  console.error('Erreur JavaScript:', e.error);

  // Analytics d'erreur
  if (typeof gtag !== 'undefined') {
    gtag('event', 'javascript_error', {
      error_message: e.message,
      error_file: e.filename,
      error_line: e.lineno,
      page: window.location.pathname,
    });
  }
});

// Performance monitoring basique
window.addEventListener('load', function () {
  const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;

  if (loadTime > 3000) {
    console.warn('Temps de chargement lent détecté:', loadTime + 'ms');
  }

  // Analytics de performance
  if (typeof gtag !== 'undefined') {
    gtag('event', 'page_load_time', {
      load_time: loadTime,
      page: window.location.pathname,
    });
  }
});
