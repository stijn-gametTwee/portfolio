document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  document.getElementById("year").textContent = new Date().getFullYear();

  const page = document.body.dataset.page;
  if (page === "projects") loadProjects();
  if (page === "contact") initContactForm();
});

/* THEME */
function initTheme() {
  const btn = document.getElementById("themeToggle");
  const saved = localStorage.getItem("theme") || "dark";
  if (saved === "light") document.body.classList.add("light");
  btn.textContent = saved === "light" ? "☀️" : "🌙";

  btn.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    btn.textContent = isLight ? "☀️" : "🌙";
  });
}

/* PROJECTS */
async function loadProjects() {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;
  try {
    const res = await fetch("data/projects.json");
    const projects = await res.json();
    projects.forEach(p => grid.appendChild(makeProjectCard(p)));
  } catch {
    grid.innerHTML = "<p>Could not load projects.</p>";
  }
}
function makeProjectCard(p) {
  const card = document.createElement("article");
  card.className = "project-card";
  card.innerHTML = `
    <img src="${p.image || 'assets/images/project-placeholder.jpg'}" alt="${escapeHtml(p.name)}">
    <div class="content">
      <h3>${escapeHtml(p.name)}</h3>
      <p>${escapeHtml(p.short)}</p>
    </div>`;
  return card;
}

/* CONTACT */
function initContactForm() {
  const form = document.getElementById("contactForm");
  const msg = document.getElementById("formMsg");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!form.checkValidity()) {
      msg.textContent = "Please fill in all fields correctly.";
      return;
    }
    msg.textContent = "Sending...";
    setTimeout(() => {
      msg.textContent = "Thanks! I’ll reply soon.";
      form.reset();
    }, 800);
  });
}

/* HELPERS */
function escapeHtml(str = "") {
  return str.replace(/[&<>"']/g, c => (
    { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]
  ));
}

/* NAV TOGGLE (mobile) */
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
}

/* PROJECT SLIDESHOW */
function initSlideshows() {
  document.querySelectorAll(".slideshow").forEach(slideshow => {
    const slides = slideshow.querySelector(".slides");
    const images = slides.querySelectorAll("img");
    const prev = slideshow.querySelector(".prev");
    const next = slideshow.querySelector(".next");
    const dotsContainer = slideshow.querySelector(".dots");
    let index = 0;

    // Maak dots
    images.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.addEventListener("click", () => showSlide(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll("span");

    function showSlide(i) {
      index = (i + images.length) % images.length;
      slides.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, j) => d.classList.toggle("active", j === index));
    }

    prev.addEventListener("click", () => showSlide(index - 1));
    next.addEventListener("click", () => showSlide(index + 1));

    showSlide(0);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initSlideshows();
});
 