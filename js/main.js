
/* main.js - clean, robust version for portfolio */
document.addEventListener("DOMContentLoaded", () => {
  // set year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  initTheme();
  initNavToggle();
  initNavLinks();

  const page = document.body.getAttribute("data-page") || "";
  if (page === "projects") loadProjects();
  if (page === "contact") initContactForm();
});

/* THEME */
function initTheme(){
  const btn = document.getElementById("themeToggle");
  const saved = localStorage.getItem("theme") || "dark";
  if (saved === "light") document.body.classList.add("light");
  if (btn) btn.textContent = document.body.classList.contains("light") ? "☀️" : "🌙";
  if (btn) btn.addEventListener("click", ()=>{
    const isLight = document.body.classList.toggle("light");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    btn.textContent = isLight ? "☀️" : "🌙";
  });
}

/* NAV TOGGLE */
function initNavToggle(){
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;
  toggle.addEventListener("click", ()=>{
    links.classList.toggle("show");
    // for accessibility
    const expanded = links.classList.contains("show");
    toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
  });

  // close menu when clicking a link (mobile)
  links.addEventListener("click", (e)=>{
    if (e.target.tagName === "A") links.classList.remove("show");
  });

  // close on resize > mobile breakpoint
  window.addEventListener("resize", ()=>{
    if (window.innerWidth > 768) links.classList.remove("show");
  });
}

/* Optional: highlight current nav link */
function initNavLinks(){
  const links = document.querySelectorAll(".nav-links a");
  const path = location.pathname.split("/").pop();
  links.forEach(a=>{
    if (a.getAttribute("href") === path) a.classList.add("active");
  });
}

/* LOAD PROJECTS */
async function loadProjects(){
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;
  grid.innerHTML = "<p>Loading projects…</p>";
  try {
    const res = await fetch("./data/projects.json", {cache: "no-cache"});
    if (!res.ok) throw new Error("Could not fetch projects.json");
    const projects = await res.json();
    if (!Array.isArray(projects) || projects.length === 0){
      grid.innerHTML = "<p>No projects found.</p>";
      return;
    }
    grid.innerHTML = "";
    projects.forEach(p => grid.appendChild(makeCard(sanitize(p))));
    initSlides();
  } catch (err){
    console.error(err);
    grid.innerHTML = "<p>Could not load projects.</p>";
  }
}

/* sanitize project object */
function sanitize(p){
  return {
    name: String(p.name || "Untitled"),
    short: String(p.short || ""),
    long: String(p.long || ""),
    tech: String(p.tech || ""),
    images: Array.isArray(p.images) ? p.images : (p.image ? [p.image] : []),
    demo: String(p.demo || ""),
    repo: String(p.repo || ""),
    type: String(p.type || "other"),
    universeId: String(p.universeId || p.placeId || "")
  };
}

/* create project card */
function makeCard(p){
  const article = document.createElement("article");
  article.className = "project-card";

  const media = document.createElement("div");
  media.className = "media";
  const img = document.createElement("img");
  img.loading = "lazy";
  img.alt = p.name + " image";
  img.src = p.images[0] || "assets/images/project-placeholder.jpg";
  media.appendChild(img);
  article.appendChild(media);

  const content = document.createElement("div");
  content.className = "content";
  const h3 = document.createElement("h3"); h3.textContent = p.name;
  const pshort = document.createElement("p"); pshort.className = "lead"; pshort.textContent = p.short;
  const tech = document.createElement("p"); tech.className = "tech"; tech.textContent = p.tech;

  content.appendChild(h3);
  content.appendChild(pshort);
  content.appendChild(tech);

  const actions = document.createElement("div"); actions.className = "actions";
  if (p.demo){
    const a = document.createElement("a");
    a.href = p.demo; a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = "Demo";
    actions.appendChild(a);
  }
  if (p.repo){
    const a2 = document.createElement("a");
    a2.href = p.repo; a2.target = "_blank"; a2.rel = "noopener noreferrer"; a2.textContent = "Source";
    actions.appendChild(a2);
  }

  // stats
  if (p.universeId){
    const stats = document.createElement("div"); stats.className = "stats"; stats.textContent = "Loading stats…";
    actions.appendChild(stats);
    fetchStats(p.universeId).then(s=>{
      if (s && !s.error){
        stats.textContent = `Players: ${Number(s.playing||0).toLocaleString()} • Visits: ${Number(s.visits||0).toLocaleString()}`;
      } else {
        stats.textContent = "Stats unavailable";
      }
    }).catch(()=>{
      stats.textContent = "Stats unavailable";
    });
  }

  content.appendChild(actions);
  article.appendChild(content);
  return article;
}

/* simple slideshow init for multiple images (if implemented) */
function initSlides(){
  document.querySelectorAll(".project-card .media").forEach(media=>{
    const imgs = media.querySelectorAll("img");
    if (imgs.length <= 1) return;
    // future: convert to slider
  });
}

/* fetch stats: prefer local /api/get_stats, fallback to roproxy */
async function fetchStats(universeId){
  try {
    // try local serverless endpoint first
    let res = await fetch(`/api/get_stats?universeId=${encodeURIComponent(universeId)}`, {cache: "no-cache"});
    if (res.ok){
      return await res.json();
    }
  } catch(e){
    // ignore
  }
  try {
    // fallback to roproxy public proxy
    const res2 = await fetch(`https://games.roproxy.com/v1/games?universeIds=${encodeURIComponent(universeId)}`, {cache: "no-cache"});
    if (!res2.ok) throw new Error("fallback failed");
    const j = await res2.json();
    if (j && j.data && j.data[0]){
      return {
        universeId: universeId,
        visits: j.data[0].visits || 0,
        playing: j.data[0].playing || (j.data[0].playerCount || 0)
      };
    }
  } catch(e){
    // ignore
  }
  return null;
}

/* contact form demo */
function initContactForm(){
  const form = document.getElementById("contactForm");
  const msg = document.getElementById("formMsg");
  if (!form) return;
  form.addEventListener("submit", e=>{
    e.preventDefault();
    if (!form.checkValidity()){
      if (msg) msg.textContent = "Please fix the form.";
      return;
    }
    if (msg) msg.textContent = "Sending…";
    setTimeout(()=>{
      if (msg) msg.textContent = "Thanks — message sent!";
      form.reset();
    }, 800);
  });
}
