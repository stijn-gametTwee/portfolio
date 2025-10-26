import { loadProjects, loadSocials, loadSkills } from './dataLoader.js';

document.addEventListener('DOMContentLoaded', async () => {
  // year
  document.getElementById('year').textContent = new Date().getFullYear();

  // load socials
  const socials = await loadSocials();
  const socialGrid = document.getElementById('social-grid');
  socials.forEach(s => {
    const a = document.createElement('a');
    a.className = 'social-item';
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.innerHTML = `<img src="${s.icon}" alt="${s.name}"><span>${s.name}</span>`;
    socialGrid.appendChild(a);
  });

  // load skills
  const skills = await loadSkills();
  const skillsGrid = document.getElementById('skills-grid');
  skills.forEach(skill => {
    const div = document.createElement('div');
    div.className = 'skill';
    div.innerHTML = `<img src="${skill.icon}" alt="${skill.name}"><span>${skill.name}</span>`;
    skillsGrid.appendChild(div);
  });

  // load projects/categories
  const categories = await loadProjects();
  const projectContainer = document.getElementById('project-container');

  if (!categories || categories.length === 0) {
    projectContainer.innerHTML = '<p>No projects found.</p>';
    return;
  }

  categories.forEach(cat => {
    const catWrap = document.createElement('div');
    catWrap.className = 'category';

    // header
    const h = document.createElement('h3');
    h.innerHTML = `<span class="cat-icon"></span> ${cat.title}`;
    catWrap.appendChild(h);

    const grid = document.createElement('div');
    grid.className = 'project-grid';

    (cat.projects || []).forEach(proj => {
      const card = document.createElement('article');
      card.className = 'card';

      // media
      let mediaHTML = '';
      if (proj.media && proj.media.length > 1) {
        mediaHTML = `<div class="slideshow">` + proj.media.map((m, i) => renderMediaElement(m, i === 0)).join('') +
                    `<div class="dots">${proj.media.map(() => '<span></span>').join('')}</div></div>`;
      } else if (proj.media && proj.media.length === 1) {
        mediaHTML = renderMediaElement(proj.media[0], true);
      }

      card.innerHTML = `
        <div class="media">${mediaHTML}</div>
        <div class="content">
          <h4>${proj.name}</h4>
          <p>${proj.description}</p>
          ${proj.link ? `<a class="btn" href="${proj.link}" target="_blank" rel="noopener noreferrer">Bekijk</a>` : ''}
        </div>
      `;

      grid.appendChild(card);
    });

    catWrap.appendChild(grid);
    projectContainer.appendChild(catWrap);
  });

  initSlideshows();
});

/* helper: create media element HTML */
function renderMediaElement(m, active = false) {
  const cls = active ? 'active' : '';
  if (!m || !m.src) return '';
  const type = m.type ? m.type.toLowerCase() : guessTypeFromSrc(m.src);
  if (type === 'video') {
    // use <video> but DO NOT autoplay too many— user can play controls if needed
    // we include controls for accessibility
    return `<video class="${cls}" controls playsinline preload="metadata"><source src="${m.src}"></video>`;
  } else {
    return `<img class="${cls}" src="${m.src}" alt="${m.alt ? escapeHtml(m.alt) : escapeHtml(m.src)}">`;
  }
}

function guessTypeFromSrc(src) {
  const s = src.toLowerCase();
  if (s.endsWith('.mp4') || s.endsWith('.webm') || s.endsWith('.mov')) return 'video';
  if (s.endsWith('.gif')) return 'gif';
  return 'image';
}

/* slideshow: prev/next + auto rotate + dots */
function initSlideshows() {
  document.querySelectorAll('.slideshow').forEach(slideshow => {
    const slides = Array.from(slideshow.querySelectorAll('img, video'));
    const dots = Array.from(slideshow.querySelectorAll('.dots span'));
    if (slides.length === 0) return;
    let index = slides.findIndex(s => s.classList.contains('active'));
    if (index < 0) index = 0;

    // set initial classes
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    if (dots.length) dots.forEach((d, i) => d.classList.toggle('active', i === index));

    // auto-rotate
    const interval = setInterval(() => {
      goTo((index + 1) % slides.length);
    }, 4500);

    // prev/next controls
    const prevBtn = slideshow.querySelector('.prev');
    const nextBtn = slideshow.querySelector('.next');

    if (!prevBtn) {
      // create controls if missing
      const p = document.createElement('button'); p.className = 'prev'; p.innerHTML = '&#10094;'; slideshow.appendChild(p);
    }
    if (!nextBtn) {
      const n = document.createElement('button'); n.className = 'next'; n.innerHTML = '&#10095;'; slideshow.appendChild(n);
    }

    slideshow.querySelector('.prev').addEventListener('click', () => {
      goTo((index - 1 + slides.length) % slides.length);
      resetTimer();
    });
    slideshow.querySelector('.next').addEventListener('click', () => { goTo((index + 1) % slides.length); resetTimer(); });

    // dot clicks
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goTo(i); resetTimer(); });
    });

    // pause on hover
    slideshow.addEventListener('mouseenter', () => clearInterval(intervalId));
    slideshow.addEventListener('mouseleave', () => restartTimer());

    // internal timer handling to allow reset
    let intervalId = interval;
    function resetTimer() {
      clearInterval(intervalId);
      restartTimer();
    }
    function restartTimer() {
      intervalId = setInterval(() => { goTo((index + 1) % slides.length); }, 4500);
    }

    function goTo(i) {
      slides[index].classList.remove('active');
      if (dots[index]) dots[index].classList.remove('active');
      index = i;
      slides[index].classList.add('active');
      if (dots[index]) dots[index].classList.add('active');
      // pause other videos and optionally play current if it's video
      slides.forEach((s, idx) => {
        if (s.tagName === 'VIDEO') {
          if (idx === index) {
            // do not autoplay; keep user control - but unmute is not done
            // s.play().catch(()=>{});
          } else {
            s.pause();
          }
        }
      });
    }
  });
}

/* simple escape for alt text */
function escapeHtml(str){ return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c])); }

/* ==========================
   Dynamische begroeting
========================== */
const greetings = [
  'Hey',      // Nederlands
  'Hi',       // Engels
  'Hola',     // Spaans
  'Salut',    // Frans
  'Ciao',     // Italiaans
  'Hallo',    // Duits
  'Hej',      // Zweeds
  'Ola',      // Portugees
  'Привет',   // Russisch
  'こんにちは', // Japans
  '안녕',       // Koreaans
  '你好'        // Chinees
];

function cycleGreeting() {
  const el = document.getElementById('greeting');
  if (!el) return;

  let i = 0;
  setInterval(() => {
    // fade out
    el.style.opacity = 0;
    setTimeout(() => {
      i = (i + 1) % greetings.length;
      el.textContent = greetings[i];
      // fade in
      el.style.opacity = 1;
    }, 400);
  }, 1000);
}

cycleGreeting();
