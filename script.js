// Set after this file executes, to make loading easy to verify in DevTools.
window.portfolioScriptLoaded = true;

const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
const year = document.getElementById('year');
const toast = document.getElementById('toast');
const projectDialog = document.getElementById('projectDialog');
const dialogContent = document.getElementById('dialogContent');
const dialogClose = document.getElementById('dialogClose');
const backToTop = document.getElementById('backToTop');

// Type the two-line name once per page load, then remove the blinking cursor.
// The full text remains in HTML if scripts fail, and reduced-motion visitors
// see the complete name immediately.
function startNameTypewriter() {
  const lines = [...document.querySelectorAll('.hero-name .typewriter-line')];
  if (!lines.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = lines.map(line => line.querySelector('.typewriter-text'));
  if (targets.some(target => !target)) return;

  const texts = lines.map(line => line.dataset.text || line.textContent.trim());
  targets.forEach(target => { target.textContent = ''; });

  const characterDelay = 120; // milliseconds per character
  const pauseBetweenLines = 180;
  const cursorPauseAtEnd = 3000;

  function typeLine(lineIndex) {
    const target = targets[lineIndex];
    const characters = Array.from(texts[lineIndex]);
    let position = 0;
    target.classList.add('is-typing');

    function typeNextCharacter() {
      if (position < characters.length) {
        target.textContent += characters[position++];
        window.setTimeout(typeNextCharacter, characterDelay);
        return;
      }
      if (lineIndex + 1 < targets.length) {
        target.classList.remove('is-typing');
        window.setTimeout(() => typeLine(lineIndex + 1), pauseBetweenLines);
      } else {
        // Animation is over: keep the full name, stop blinking entirely.
        window.setTimeout(() => target.classList.remove('is-typing'), cursorPauseAtEnd);
      }
    }

    typeNextCharacter();
  }

  window.setTimeout(() => typeLine(0), 300);
}
startNameTypewriter();

const projectDetails = {
  legal: {
    eyebrow: 'AI / NLP / Information Retrieval',
    title: 'Multilingual Legal Information Retrieval & RAG System',
    intro: 'A Bangla-English legal information retrieval system built for cross-lingual evidence retrieval.',
    bullets: [
      'Used BGE-M3 for multilingual dense representations.',
      'Combined FAISS-based dense retrieval with BM25 sparse retrieval.',
      'Added reranking before retrieval-augmented generation.',
      'Focused on retrieving supporting legal evidence across Bangla and English content.'
    ],
    tech: ['BGE-M3', 'FAISS', 'BM25', 'Reranking', 'RAG']
  },
  vision: {
    eyebrow: 'Computer Vision / Self-Supervised Learning',
    title: 'Object Detection with YOLO, RF-DETR & SSL',
    intro: 'An investigation of self-supervised feature transfer for object detection across multiple initialization strategies.',
    bullets: [
      'Compared DINOv3, SimCLR, BYOL, random initialization, and COCO-pretrained models.',
      'Worked with YOLO and RF-DETR object-detection approaches.',
      'Evaluated experiments using mAP, precision, recall, and F1.',
      'Focused on how learned representations transfer into downstream object-detection performance.'
    ],
    tech: ['YOLO', 'RF-DETR', 'DINOv3', 'SimCLR', 'BYOL', 'mAP', 'Precision', 'Recall', 'F1']
  }
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

if (year) year.textContent = new Date().getFullYear();

menuBtn?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('show');
  menuBtn.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('show');
    menuBtn?.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('.placeholder-link').forEach(link => {
  link.addEventListener('click', event => {
    if (link.getAttribute('href') === '#') {
      event.preventDefault();
      showToast(`Add your real ${link.dataset.linkName || 'profile'} URL in index.html before publishing.`);
    }
  });
});

document.querySelectorAll('.project-detail-btn').forEach(button => {
  button.addEventListener('click', () => {
    const project = projectDetails[button.dataset.project];
    if (!project) return;

    dialogContent.innerHTML = `
      <div class="dialog-body">
        <span class="micro-label">${project.eyebrow}</span>
        <h2 id="dialogTitle">${project.title}</h2>
        <p>${project.intro}</p>
        <ul>${project.bullets.map(item => `<li>${item}</li>`).join('')}</ul>
        <div class="dialog-tech">${project.tech.map(item => `<span>${item}</span>`).join('')}</div>
      </div>
    `;

    projectDialog.showModal();
  });
});

dialogClose?.addEventListener('click', () => projectDialog.close());
projectDialog?.addEventListener('click', event => {
  const rect = projectDialog.getBoundingClientRect();
  const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (outside) projectDialog.close();
});

backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// IntersectionObserver is supported in modern browsers. The fallback keeps content
// visible if it is unavailable rather than leaving sections hidden forever.
const revealElements = document.querySelectorAll('.reveal');
const sections = [...document.querySelectorAll('main section[id]')];
const navAnchors = [...document.querySelectorAll('.nav-links a')];

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(element => revealObserver.observe(element));

  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach(link =>
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`)
      );
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

  sections.forEach(section => navObserver.observe(section));
} else {
  revealElements.forEach(element => element.classList.add('visible'));
}


/* =========================================================
   Micro-interactions (v9): classic cursor is handled in CSS,
   with a single click sparkle and the "currently building" reveal.
   No extra pointer-following DOM elements. Disabled for reduced motion
   and on touch/mobile devices. Does not change any text or links.
   ========================================================= */
(function initRetroMicroInteractions() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  // Trigger the existing chips only when they enter the viewport.
  const buildStrip = document.querySelector('.build-strip');
  if (buildStrip) {
    if ('IntersectionObserver' in window && !reducedMotion.matches) {
      const stripObserver = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            buildStrip.classList.add('is-awake');
            stripObserver.disconnect();
            break;
          }
        }
      }, { threshold: 0.2 });
      stripObserver.observe(buildStrip);
    } else {
      buildStrip.classList.add('is-awake');
    }
  }

  if (!finePointer.matches || reducedMotion.matches) return;

  document.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' ||
        reducedMotion.matches || !finePointer.matches ||
        !event.target.closest('a, button, [role="button"]')) return;
    const spark = document.createElement('span');
    spark.className = 'retro-click-spark';
    spark.setAttribute('aria-hidden', 'true');
    spark.style.left = `${event.clientX}px`;
    spark.style.top = `${event.clientY}px`;
    document.body.append(spark);
    spark.addEventListener('animationend', () => spark.remove(), { once: true });
  });

})();
