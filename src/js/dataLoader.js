/**
 * dataLoader.js
 * Dynamisch laden van projecten vanuit JSON + media/slideshow + Roblox stats
 */

async function loadProjects() {
  try {
    const res = await fetch('data/projects.json');
    const data = await res.json();
    const container = document.getElementById('project-container');
    container.innerHTML = '';

    for (const cat of data.categories) {
      // === Categorie header ===
      const catSection = document.createElement('div');
      catSection.classList.add('category');

      const title = document.createElement('h3');
      title.innerHTML = `<i class="${cat.icon}"></i> ${cat.title}`;
      catSection.appendChild(title);

      // === Project grid ===
      const grid = document.createElement('div');
      grid.classList.add('project-grid');

      for (const proj of cat.projects) {
        const card = document.createElement('div');
        card.classList.add('card');

        // === MEDIA: images, gifs, videos, slideshow ===
        let mediaHTML = '';

        if (proj.media && proj.media.length > 1) {
          mediaHTML = `
            <div class="slideshow">
              ${proj.media.map(item => renderMedia(item)).join('')}
              <div class="dots">
                ${proj.media.map(() => `<span></span>`).join('')}
              </div>
            </div>`;
        } else if (proj.media && proj.media.length === 1) {
          mediaHTML = renderMedia(proj.media[0], true);
        }

        // === Project content ===
        card.innerHTML = `
          ${mediaHTML || ''}
          <h4>${proj.name}</h4>
          <p>${proj.description}</p>
          ${proj.link ? `<a href="${proj.link}" target="_blank" class="btn">Bekijk</a>` : ''}
        `;

        // === Roblox stats (optioneel) ===
        if (proj.robloxGameId) {
          const stats = document.createElement('div');
          stats.classList.add('stats');
          stats.innerHTML = '<span>⏳ Laden...</span>';
          card.appendChild(stats);
          updateRobloxStats(proj.robloxGameId, stats);
        }

        grid.appendChild(card);
      }

      catSection.appendChild(grid);
      container.appendChild(catSection);
    }

    // Slideshow en animaties activeren
    initSlideshows();

  } catch (err) {
    console.error('❌ Fout bij het laden van projects.json:', err);
  }
}

/**
 * Media renderer: ondersteunt afbeeldingen, gifs en video’s
 */
function renderMedia(item, single = false) {
  const cls = single ? 'single-media' : '';
  if (!item || !item.src) return '';

  // Auto-detect type als 'type' niet gespecificeerd is
  const type =
    item.type ||
    (item.src.endsWith('.mp4') || item.src.endsWith('.webm')
      ? 'video'
      : item.src.endsWith('.gif')
      ? 'gif'
      : 'image');

  if (type === 'video') {
    return `<video src="${item.src}" class="${cls}" autoplay muted loop playsinline></video>`;
  } else {
    return `<img src="${item.src}" class="${cls}" alt="${item.alt || 'Project media'}">`;
  }
}

/**
 * Initieer slideshows: eenvoudige automatische rotatie
 */
function initSlideshows() {
  document.querySelectorAll('.slideshow').forEach(show => {
    const slides = show.querySelectorAll('img, video');
    const dots = show.querySelectorAll('.dots span');
    let index = 0;

    if (slides.length === 0) return;

    slides[0].classList.add('active');
    if (dots.length) dots[0].classList.add('active');

    setInterval(() => {
      slides[index].classList.remove('active');
      if (dots.length) dots[index].classList.remove('active');

      index = (index + 1) % slides.length;

      slides[index].classList.add('active');
      if (dots.length) dots[index].classList.add('active');
    }, 4000);
  });
}

// ✅ Start zodra de pagina geladen is
document.addEventListener('DOMContentLoaded', loadProjects);