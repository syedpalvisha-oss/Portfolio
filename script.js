document.addEventListener('DOMContentLoaded', () => {
  const body       = document.body;
  const menuToggle = document.querySelector('.menu-toggle');
  const overlay    = document.querySelector('.sidebar-overlay');
  const navLinks   = document.querySelectorAll('.sidebar-nav a[data-section]');


  // ── Sidebar toggle ────────────────────────────────────────────────────────
  const closeSidebar = () => {
    body.classList.remove('sidebar-open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
  };

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const isOpen = body.classList.toggle('sidebar-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  overlay?.addEventListener('click', closeSidebar);
  navLinks.forEach(link => link.addEventListener('click', closeSidebar));

  // ── Scroll-reveal ─────────────────────────────────────────────────────────
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ── Active nav link ───────────────────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');

  const activeObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === entry.target.id);
          });
        }
      });
    },
    { threshold: 0.25, rootMargin: '-15% 0px -60% 0px' }
  );

  sections.forEach(section => activeObserver.observe(section));

  // Set home active on load
  const homeLink = document.querySelector('.sidebar-nav a[data-section="hero"]');
  if (homeLink) homeLink.classList.add('active');

  // ── Certificate lightbox ──────────────────────────────────────────────────
  const certModal   = document.getElementById('cert-modal');
  const certEmbed   = document.getElementById('cert-modal-embed');
  const certClose   = certModal?.querySelector('.cert-modal-close');
  const certBackdrop = certModal?.querySelector('.cert-modal-backdrop');

  const openCert = (pdfSrc) => {
    certEmbed.src = pdfSrc;
    certModal.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  const closeCert = () => {
    certModal.hidden = true;
    certEmbed.src = '';
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.cert-card[data-cert-pdf]').forEach(card => {
    card.addEventListener('click', () => openCert(card.dataset.certPdf));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openCert(card.dataset.certPdf); });
  });

  certClose?.addEventListener('click', closeCert);
  certBackdrop?.addEventListener('click', closeCert);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCert(); });

  // ── Contact form ──────────────────────────────────────────────────────────
  const contactForm   = document.getElementById('contact-form');
  const contactStatus = document.getElementById('contact-form-status');

  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const data = new FormData(contactForm);
      const res  = await fetch('https://formsubmit.co/ajax/syedpalvisha6@gmail.com', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      if (res.ok) {
        contactStatus.textContent = "Message sent! I'll get back to you soon.";
        contactStatus.className = 'contact-form-status success';
        contactForm.reset();
      } else {
        throw new Error();
      }
    } catch {
      contactStatus.textContent = 'Something went wrong. Please email me directly.';
      contactStatus.className = 'contact-form-status error';
    }

    contactStatus.hidden = false;
    btn.textContent = 'Send Message';
    btn.disabled = false;
  });
});
