// Import the stylesheet
import './index.css';

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initStickyNavbar();
  initActiveLinkHighlighting();
  initStatsCounters();
  initFaqAccordion();
  initContactForms();
  initScrollReveal();
});

/**
 * Mobile Menu Toggle and Automatic Close
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const closeIcon = document.getElementById('close-icon');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !mobileMenu) return;

  const toggleMenu = () => {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', !isExpanded);
    mobileMenu.classList.toggle('hidden');
    hamburgerIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
  };

  menuBtn.addEventListener('click', toggleMenu);

  // Auto-close menu when a link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (!mobileMenu.classList.contains('hidden')) {
        toggleMenu();
      }
    });
  });
}

/**
 * Sticky Navigation Bar on Scroll
 */
function initStickyNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
      // Adjust padding / color states if necessary
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Trigger initial run on load
}

/**
 * Active Navbar Link Highlighting via IntersectionObserver
 */
function initActiveLinkHighlighting() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (sections.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Target middle of the screen
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        
        // Update Desktop Nav
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
            link.classList.add('text-primary');
            link.classList.remove('text-gray-600');
          } else {
            link.classList.remove('active');
            link.classList.remove('text-primary');
            link.classList.add('text-gray-600');
          }
        });

        // Update Mobile Nav
        mobileLinks.forEach(link => {
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('bg-slate-50', 'text-primary');
            link.classList.remove('text-gray-600');
          } else {
            link.classList.remove('bg-slate-50', 'text-primary');
            link.classList.add('text-gray-600');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/**
 * Animated Stats Counter
 */
function initStatsCounters() {
  const counters = document.querySelectorAll('.counter-number');
  if (counters.length === 0) return;

  const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds animation duration
    const stepTime = Math.max(Math.floor(duration / target), 15);
    let current = 0;

    const timer = setInterval(() => {
      current += Math.ceil(target / (duration / stepTime));
      if (current >= target) {
        counter.textContent = target;
        clearInterval(timer);
      } else {
        counter.textContent = current;
      }
    }, stepTime);
  };

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target); // Animate once
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => statsObserver.observe(counter));
}

/**
 * FAQ Accordion Toggles
 */
function initFaqAccordion() {
  const toggles = document.querySelectorAll('.faq-toggle');
  
  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const faqItem = toggle.closest('.faq-item');
      const faqContent = faqItem.querySelector('.faq-content');
      const faqIcon = toggle.querySelector('.faq-icon');
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

      // Close all other FAQs in accordion style
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
          const itemToggle = item.querySelector('.faq-toggle');
          const itemContent = item.querySelector('.faq-content');
          const itemIcon = item.querySelector('.faq-icon');

          itemToggle.setAttribute('aria-expanded', 'false');
          itemContent.classList.remove('open');
          itemContent.classList.add('hidden');
          itemIcon.classList.remove('rotate-180');
          item.classList.remove('bg-white', 'shadow-md', 'border-primary/20');
          item.classList.add('bg-slate-50', 'border-slate-200');
        }
      });

      // Toggle current FAQ
      toggle.setAttribute('aria-expanded', !isExpanded);
      if (!isExpanded) {
        faqContent.classList.remove('hidden');
        // Let browser repaint before adding 'open' transition class
        setTimeout(() => faqContent.classList.add('open'), 10);
        faqIcon.classList.add('rotate-180');
        faqItem.classList.remove('bg-slate-50', 'border-slate-200');
        faqItem.classList.add('bg-white', 'shadow-md', 'border-primary/20');
      } else {
        faqContent.classList.remove('open');
        faqIcon.classList.remove('rotate-180');
        faqItem.classList.add('bg-slate-50', 'border-slate-200');
        faqItem.classList.remove('bg-white', 'shadow-md', 'border-primary/20');
        
        // Hide completely after transition completes
        setTimeout(() => {
          if (!faqContent.classList.contains('open')) {
            faqContent.classList.add('hidden');
          }
        }, 400);
      }
    });
  });
}

/**
 * Contact and Consultation Form Success Simulations
 */
function initContactForms() {
  const contactForm = document.getElementById('contact-form');
  const heroForm = document.getElementById('hero-quick-form');
  const toast = document.getElementById('success-toast');

  const showToast = (title, message) => {
    if (!toast) return;
    
    // Set custom text if needed
    const toastTitle = toast.querySelector('h4');
    const toastDesc = toast.querySelector('p');
    if (title && toastTitle) toastTitle.textContent = title;
    if (message && toastDesc) toastDesc.textContent = message;

    // Slide up and reveal toast
    toast.classList.remove('translate-y-24', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    // Hide after 4 seconds
    setTimeout(() => {
      toast.classList.add('translate-y-24', 'opacity-0');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 4500);
  };

  // Main Contact Form
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn.innerHTML;
      
      // Show loading status
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Sending Request...
      `;

      // Form validation & security sanitization
      const nameVal = sanitizeInput(document.getElementById('contact-name')?.value || '');
      const phoneVal = sanitizeInput(document.getElementById('contact-phone')?.value || '');
      const emailVal = sanitizeInput(document.getElementById('contact-email')?.value || '');
      const messageVal = sanitizeInput(document.getElementById('contact-message')?.value || '');

      // Log sanitized form data (representing secure preparation for backend API)
      console.log('Secured Form Submission:', { nameVal, phoneVal, emailVal, messageVal });

      // Simulate API submit timeout (1.2 seconds)
      setTimeout(() => {
        // Clear fields
        contactForm.reset();
        
        // Reset submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
        
        // Show success alert
        showToast(
          "Message Received!",
          "Thank you for contacting Rewel Global Solution. A document consultant will review your message and reply via email or phone shortly."
        );
      }, 1200);
    });
  }

  // Hero Quick Consultation Form
  if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = heroForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting Consultation Request...";

      // Secure quick form inputs
      const quickNameVal = sanitizeInput(document.getElementById('quick-name')?.value || '');
      const quickServiceVal = sanitizeInput(document.getElementById('quick-service')?.value || '');
      const quickPhoneVal = sanitizeInput(document.getElementById('quick-phone')?.value || '');

      console.log('Secured Hero Quick Consultation:', { quickNameVal, quickServiceVal, quickPhoneVal });

      // Simulate API submit timeout (1.0 second)
      setTimeout(() => {
        heroForm.reset();
        
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        showToast(
          "Consultation Booked!",
          "Your quick consultation details have been sent. A consultant will contact you via WhatsApp/Call to check your support checklist."
        );
      }, 1000);
    });
  }
}

/**
 * Scroll Reveal Animations (Intersection Observer)
 */
function initScrollReveal() {
  // Add animation class to sections we want to fade in
  const sections = document.querySelectorAll('section, .service-card, .faq-item, footer');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target); // Animate once
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -10% 0px', // Trigger just before elements reach bottom viewport
    threshold: 0.05
  });

  sections.forEach(section => {
    section.classList.add('reveal-on-scroll');
    revealObserver.observe(section);
  });
}

/**
 * Safely sanitizes string inputs to prevent HTML and Script Injection (XSS defense)
 */
function sanitizeInput(val) {
  if (typeof val !== 'string') return '';
  return val
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
