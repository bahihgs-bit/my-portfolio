const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-nav');
const backToTop = document.querySelector('.back-to-top');
const year = document.querySelector('#year');
const socialNote = document.querySelector('#social-note');

if (year) year.textContent = new Date().getFullYear();

document.querySelectorAll('.social-placeholder').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const platform = link.getAttribute('aria-label')?.split(' ')[0] || 'Social';
    if (socialNote) socialNote.textContent = `${platform} is a placeholder link and has not been configured.`;
  });
});

if (menuToggle && navigation) {
  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    navigation.classList.remove('is-open');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    navigation.classList.toggle('is-open', !isOpen);
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  document.addEventListener('click', (event) => {
    if (!navigation.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
  });
}

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const counters = document.querySelectorAll('.counter');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const animateCounter = (counter) => {
  const target = Number(counter.dataset.count);
  if (!Number.isFinite(target)) return;
  const duration = 900;
  const startTime = performance.now();
  const frame = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    counter.textContent = String(Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
};

if (reduceMotion) {
  counters.forEach((counter) => { counter.textContent = counter.dataset.count; });
} else if ('IntersectionObserver' in window) {
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });
  counters.forEach((counter) => counterObserver.observe(counter));
} else {
  counters.forEach((counter) => { counter.textContent = counter.dataset.count; });
}

const sections = [...document.querySelectorAll('main section[id]')];
const sectionLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
if ('IntersectionObserver' in window && sections.length && sectionLinks.length) {
  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => {
        const active = link.hash === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-25% 0px -65% 0px' });
  sections.forEach((section) => activeObserver.observe(section));
}

const updateBackToTop = () => {
  if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 540);
};
window.addEventListener('scroll', updateBackToTop, { passive: true });
updateBackToTop();

const contactForm = document.querySelector('#contact-form');
const formNote = document.querySelector('#form-note');
const contactEmail = 'example@example.com'; // Demo address supplied for this portfolio mockup.
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const subject = `Portfolio contact from ${formData.get('name')}`;
    const body = `${formData.get('message')}\n\nFrom: ${formData.get('name')}\nEmail: ${formData.get('email')}`;
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (formNote) formNote.textContent = 'Your email app should open with the message ready to review.';
  });
}
